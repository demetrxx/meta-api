import { type FastifyInstance } from 'fastify';

export class HistoryProfile {
  db: FastifyInstance['prisma'];

  constructor(app: FastifyInstance) {
    this.db = app.prisma;
  }

  async createProfile({ userId }: { userId: number }): Promise<number> {
    const topicIds = await this.db.historyTopic.findMany({ select: { id: true } });
    const progresses = topicIds.map(({ id }) => ({ topicId: id }));

    const profile = await this.db.historyProfile.create({
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

    return profile.id;
  }
}
