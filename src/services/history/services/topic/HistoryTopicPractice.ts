import { type HistoryQuestion } from '@prisma/client';
import { type FastifyInstance } from 'fastify';
import errors from 'http-errors';

function getIdsMap(items?: Array<{ id: number }>): number[] {
  return items?.map((i) => i.id) ?? [];
}

export class HistoryTopicPractice {
  db: FastifyInstance['prisma'];
  constructor(app: FastifyInstance) {
    this.db = app.prisma;
  }

  async recordAnswer({
    answer,
    questionId,
  }: {
    answer: string;
    questionId: number;
  }): Promise<void> {}

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
      throw errors.InternalServerError('Invalid profile.');
    }

    const questions: HistoryQuestion[] = [];

    // Get unseen
    const unseenQs = await this.db.historyQuestion.findMany({
      where: {
        topic: { id: topicId },
        id: { notIn: getIdsMap(profile.seen) },
      },
      take: QS_NUM,
    });
    questions.push(...unseenQs);

    // Seen all, get failed ones
    if (questions.length < QS_NUM) {
      const failedQs = await this.db.historyQuestion.findMany({
        where: {
          topic: { id: topicId },
          id: { in: getIdsMap(profile.failed) },
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
          id: { notIn: getIdsMap(profile.failed) },
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
}
