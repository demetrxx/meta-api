import { type HistoryProfile, type HistoryProgress } from '@prisma/client';
import { type FastifyInstance } from 'fastify';
import errors from 'http-errors';

import { errMsg } from '@/shared/consts/errMsg';
import { selectId } from '@/shared/lib';

declare module 'fastify' {
  interface FastifyInstance {
    historyProfile: HistoryProfileService;
  }
}

export class HistoryProfileService {
  db: FastifyInstance['prisma'];

  constructor(app: FastifyInstance) {
    this.db = app.prisma;
  }

  async createProfile({ userId }: { userId: number }): Promise<HistoryProfile> {
    const topicIds = await this.db.historyTopic.findMany({ select: { id: true } });
    const progresses = topicIds.map(({ id }) => ({ topicId: id }));

    return await this.db.historyProfile.create({
      data: {
        userId,
        progressTotal: 0,
        progressTopics: 0,
        progressSession: 0,
        progresses: {
          createMany: { data: progresses },
        },
      },
    });
  }

  async getProfile({ userId }: { userId: number }): Promise<HistoryProfile> {
    const profile = await this.db.historyProfile.findUnique({
      where: { userId },
      include: {
        answered: selectId,
        failed: selectId,
        seen: selectId,
        progresses: true,
        ticketsSeen: selectId,
      },
    });

    if (!profile) {
      return await this.createProfile({ userId });
      // TODO: grant access to profile on purchase
      // throw errors.InternalServerError(errMsg.invalidUserId);
    }

    return profile;
  }

  async getProgress({
    userId,
    topicId,
  }: {
    userId: number;
    topicId: number;
  }): Promise<HistoryProgress> {
    const profile = await this.getProfile({ userId });
    const progress = await this.db.historyProgress.findUnique({
      where: { topicId_profileId: { topicId, profileId: profile.id } },
    });

    if (!progress) {
      throw errors.InternalServerError(errMsg.invalidUserId);
    }

    return progress;
  }
}
