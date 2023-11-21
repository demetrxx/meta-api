import { type HistoryQuestion } from '@prisma/client';
import { type FastifyInstance } from 'fastify';
import errors from 'http-errors';

import { getThemeProgress } from '@/lib';
import { errMsg } from '@/shared/consts/errMsg';
import { getIdsArr, selectId } from '@/shared/lib';

import { HISTORY_THEMES_COUNT } from '../../consts/common';
import { evalHistoryAnswer } from '../../lib';
import { type HistoryQuestionAnswer } from '../../types/question';

declare module 'fastify' {
  interface FastifyInstance {
    historyTopicPractice: HistoryTopicPractice;
  }
}

export const HISTORY_QUESTIONS_COUNT = 1;

export class HistoryTopicPractice {
  private readonly db: FastifyInstance['prisma'];

  constructor(app: FastifyInstance) {
    this.db = app.prisma;
  }

  async recordAnswer({
    given,
    questionId,
    userId,
  }: {
    given: HistoryQuestionAnswer;
    questionId: number;
    userId: number;
  }): Promise<void> {
    const question = await this.db.historyQuestion.findUnique({
      where: { id: questionId },
      include: { topics: { select: { id: true } } },
    });

    if (!question) {
      throw new errors.BadRequest(errMsg.invalidQuestionId);
    }

    if (given.length === 0) {
      // skip question
      await this.db.historyProfile.update({
        where: { userId },
        data: { seen: { connect: { id: questionId } } },
      });
      return;
    }

    const { type, correct, topics } = question;

    const { isValid } = evalHistoryAnswer({ given, type, correct });
    const answeredOrFailed = isValid ? 'answered' : 'failed';
    const disconnectFrom = !isValid ? 'answered' : 'failed';

    const { _count, id: profileId } = await this.db.historyProfile.update({
      where: { userId },
      data: {
        seen: { connect: { id: questionId } },
        [answeredOrFailed]: { connect: { id: questionId } },
        [disconnectFrom]: { disconnect: { id: questionId } },
      },
      select: {
        _count: { select: { answered: true, failed: true } },
        id: true,
      },
    });

    await Promise.all(
      topics.map(async ({ id }) => {
        await this.updateTopicProgress({
          topicId: id,
          profileId,
          failedCount: _count.failed,
          answeredCount: _count.answered,
        });
      }),
    );
    await this.updateTotalProgress({ profileId });
  }

  async getQuestions({
    topicId,
    userId,
  }: {
    topicId: number;
    userId: number;
  }): Promise<HistoryQuestion[]> {
    const profile = await this.db.historyProfile.findUnique({
      where: { userId },
      select: { seen: selectId, failed: selectId },
    });

    if (!profile) {
      throw errors.InternalServerError(errMsg.invalidUserId);
    }

    const questions: HistoryQuestion[] = [];

    // Get unseen
    const unseenQs = await this.db.historyQuestion.findMany({
      where: {
        topics: { some: { id: topicId } },
        id: { notIn: getIdsArr(profile.seen) },
      },
      // include: { topics: { select: { id: true } } },
      take: HISTORY_QUESTIONS_COUNT,
    });

    questions.push(...unseenQs);

    // Seen all, get failed ones
    if (questions.length < HISTORY_QUESTIONS_COUNT) {
      const failedQs = await this.db.historyQuestion.findMany({
        where: {
          topics: { some: { id: topicId } },
          id: { in: getIdsArr(profile.failed) },
        },
        take: HISTORY_QUESTIONS_COUNT - questions.length,
      });
      questions.push(...failedQs);
    }

    // We've got a champ out here, reset seen qs
    if (questions.length < HISTORY_QUESTIONS_COUNT) {
      const extraQs = await this.db.historyQuestion.findMany({
        where: {
          topics: { some: { id: topicId } },
        },
        take: HISTORY_QUESTIONS_COUNT - questions.length,
      });
      questions.push(...extraQs);

      await this.db.historyProfile.update({
        where: { userId },
        data: { seen: { set: [] } },
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

  private async updateTotalProgress({ profileId }: { profileId: number }): Promise<void> {
    const profile = await this.db.historyProfile.findUnique({
      where: { id: profileId },
      select: { progresses: { select: { value: true } }, progressSession: true },
    });

    if (!profile) {
      throw new errors.InternalServerError(errMsg.invalidProfileId);
    }

    const { progresses, progressSession } = profile;

    if (progresses.length !== HISTORY_THEMES_COUNT) {
      throw new errors.InternalServerError(errMsg.invalidThemeProgressesCount);
    }

    const sum = progresses.reduce((acc, i) => {
      acc += i.value;
      return acc;
    }, 0);

    const progressTopics = Math.round(sum / HISTORY_THEMES_COUNT);
    const progressTotal = (progressTopics + progressSession) / 2;

    await this.db.historyProfile.update({
      where: { id: profileId },
      data: { progressTopics, progressTotal },
    });
  }
}
