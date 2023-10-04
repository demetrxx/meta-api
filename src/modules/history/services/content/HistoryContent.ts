import { type HistoryTicket, type HistoryTopic, type Prisma } from '@prisma/client';
import { type FastifyInstance } from 'fastify';

import { type IdObject } from '@/shared/types/IdObject';

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

  async getAllTopics(): Promise<HistoryTopic[]> {
    return await this.db.historyTopic.findMany();
  }

  async createTopic(data: Prisma.HistoryTopicCreateInput): Promise<IdObject> {
    return await this.db.historyTopic.create({ data, select: { id: true } });
  }

  async updateTopic(
    topicId: number,
    { name, order }: Prisma.HistoryTopicUpdateInput,
  ): Promise<void> {
    await this.db.historyTopic.update({ where: { id: topicId }, data: { name, order } });
  }

  async deleteTopic(topicId: number): Promise<void> {
    await this.db.historyTopic.delete({ where: { id: topicId } });
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

  async createQuestion(data: Prisma.HistoryQuestionCreateInput): Promise<IdObject> {
    return await this.db.historyQuestion.create({ data, select: { id: true } });
  }

  async updateQuestion(
    questionId: number,
    data: Prisma.HistoryQuestionUpdateInput,
  ): Promise<IdObject> {
    return await this.db.historyQuestion.update({
      where: { id: questionId },
      data,
      select: { id: true },
    });
  }

  async deleteQuestion(questionId: number): Promise<void> {
    await this.db.historyQuestion.delete({ where: { id: questionId } });
  }

  async getAllTickets(): Promise<HistoryTicket[]> {
    return await this.db.historyTicket.findMany();
  }

  async createTicket(data: Prisma.HistoryTicketCreateInput): Promise<IdObject> {
    return await this.db.historyTicket.create({ data, select: { id: true } });
  }

  async updateTicket(ticketId: number, data: Prisma.HistoryTicketUpdateInput): Promise<void> {
    await this.db.historyTicket.update({ where: { id: ticketId }, data });
  }

  async deleteTicket(id: number): Promise<void> {
    await this.db.historyTicket.delete({ where: { id } });
  }
}
