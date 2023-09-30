import { type HistoryQuestion } from '@prisma/client';
import { type FastifyInstance } from 'fastify';
import errors from 'http-errors';

import { getThemeProgress } from '@/lib';
import { errMsg } from '@/shared/consts/errMsg';
import { getIdsArr } from '@/shared/lib';

import { evalHistoryAnswer } from '../../lib/evalHistoryAnswer/evalHistoryAnswer';

export class HistoryTopicPractice {
  db: FastifyInstance['prisma'];
  constructor(app: FastifyInstance) {
    this.db = app.prisma;
  }

  async recordAnswer({
    given,
    questionId,
    profileId,
  }: {
    given: string;
    questionId: number;
    profileId: number;
  }): Promise<void> {
    const question = await this.db.historyQuestion.findUnique({ where: { id: questionId } });

    if (!question) {
      throw new errors.BadRequest(errMsg.invalidQuestionId);
    }

    const { type, correct, topicId } = question;

    const { isValid } = evalHistoryAnswer({ given, type, correct });
    const answeredOrFailed = isValid ? 'answered' : 'failed';

    const { _count } = await this.db.historyProfile.update({
      where: { id: profileId },
      data: {
        seen: { connect: { id: questionId } },
        [answeredOrFailed]: { connect: { id: questionId } },
      },
      select: {
        _count: { select: { answered: true, failed: true } },
        // progresses: { where: { topicId }, select: { id: true } },
      },
    });

    await this.updateTopicProgress({
      topicId,
      profileId,
      failedCount: _count.failed,
      answeredCount: _count.answered,
    });
  }

  async getQuestions({
    topicId,
    profileId,
  }: {
    topicId: number;
    profileId: number;
  }): Promise<HistoryQuestion[]> {
    const QS_NUM = 10;

    const profile = await this.db.historyProfile.findUnique({
      where: { id: profileId },
      select: { seen: { select: { id: true } }, failed: { select: { id: true } } },
    });

    if (!profile) {
      throw errors.InternalServerError('History profile not found.');
    }

    const questions: HistoryQuestion[] = [];

    // Get unseen
    const unseenQs = await this.db.historyQuestion.findMany({
      where: {
        topic: { id: topicId },
        id: { notIn: getIdsArr(profile.seen) },
      },
      take: QS_NUM,
    });
    questions.push(...unseenQs);

    // Seen all, get failed ones
    if (questions.length < QS_NUM) {
      const failedQs = await this.db.historyQuestion.findMany({
        where: {
          topic: { id: topicId },
          id: { in: getIdsArr(profile.failed) },
        },
        take: QS_NUM - questions.length,
      });
      questions.push(...failedQs);
    }

    // We've got a champ out here, reset seen qs
    if (questions.length < QS_NUM) {
      const extraQs = await this.db.historyQuestion.findMany({
        where: {
          topic: { id: topicId },
          id: { notIn: getIdsArr(profile.failed) },
        },
        take: QS_NUM - questions.length,
      });
      extraQs.push(...extraQs);

      await this.db.historyProfile.update({
        where: { id: profileId },
        data: { seen: { set: extraQs.map(({ id }) => ({ id })) } },
      });
    }

    return questions;
  }

  private async updateTopicProgress({
    topicId,
    profileId,
    answeredCount,
    failedCount,
  }: {
    topicId: number;
    profileId: number;
    answeredCount: number;
    failedCount: number;
  }): Promise<void> {
    const progress = getThemeProgress({ answered: answeredCount, failed: failedCount });
    await this.db.historyProgress.update({
      where: {
        topicId_profileId: {
          topicId,
          profileId,
        },
      },
      data: { value: progress },
    });
  }
}
