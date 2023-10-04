import { type Prisma } from '@prisma/client';
import { type FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    historyContent: HistoryContent;
  }
}
export class HistoryContent {
  db: FastifyInstance['prisma'];

  constructor(app: FastifyInstance) {
    this.db = app.prisma;
  }

  async createTopic(data: Prisma.HistoryTopicCreateInput): Promise<void> {
    await this.db.historyTopic.create({ data });
  }

  async updateTopic(
    topicId: number,
    { name, order }: Prisma.HistoryTopicUpdateInput,
  ): Promise<void> {
    await this.db.historyTopic.update({ where: { id: topicId }, data: { name, order } });
  }

  async getQuestionById(questionId: number): Promise<void> {
    await this.db.historyQuestion.findUnique({ where: { id: questionId } });
  }

  async getQuestionsByTopic(topicId: number): Promise<
    Array<{
      id: number;
      topicId: number;
      type: string;
      name: string;
    }>
  > {
    return await this.db.historyQuestion.findMany({
      where: { topicId },
      select: {
        id: true,
        topicId: true,
        type: true,
        name: true,
      },
    });
  }

  async createQuestion(data: Prisma.HistoryQuestionCreateInput): Promise<{ id: number }> {
    return await this.db.historyQuestion.create({ data, select: { id: true } });
  }

  async updateQuestion(
    questionId: number,
    data: Prisma.HistoryQuestionUpdateInput,
  ): Promise<{ id: number }> {
    return await this.db.historyQuestion.update({
      where: { id: questionId },
      data,
      select: { id: true },
    });
  }

  async deleteQuestion(questionId: number): Promise<void> {
    await this.db.historyQuestion.delete({ where: { id: questionId } });
  }

  async createTicket(data: Prisma.HistoryTicketCreateInput): Promise<void> {
    await this.db.historyTicket.create({ data });
  }

  async updateTicket(ticketId: number, data: Prisma.HistoryTicketUpdateInput): Promise<void> {
    await this.db.historyTicket.update({ where: { id: ticketId }, data });
  }
}
