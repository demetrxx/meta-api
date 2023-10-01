import { type Prisma } from '@prisma/client';
import { type FastifyInstance } from 'fastify';
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

  async createQuestion(data: Prisma.HistoryQuestionCreateInput): Promise<void> {
    await this.db.historyQuestion.create({ data });
  }

  async updateQuestion(questionId: number, data: Prisma.HistoryQuestionUpdateInput): Promise<void> {
    await this.db.historyQuestion.update({ where: { id: questionId }, data });
  }

  async createTicket(data: Prisma.HistoryTicketCreateInput): Promise<void> {
    await this.db.historyTicket.create({ data });
  }

  async updateTicket(ticketId: number, data: Prisma.HistoryTicketUpdateInput): Promise<void> {
    await this.db.historyTicket.update({ where: { id: ticketId }, data });
  }
}
