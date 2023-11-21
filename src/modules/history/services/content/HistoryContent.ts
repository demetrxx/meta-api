import {
  type HistoryKeyWord,
  type HistoryQuestion,
  type HistoryTicket,
  type HistoryTopic,
  type Prisma,
} from '@prisma/client';
import { type FastifyInstance } from 'fastify';

import { errMsg } from '@/shared/consts/errMsg';
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
    return await this.db.historyTopic.findMany({ orderBy: { order: 'asc' } });
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

  async getQuestionById(questionId: number): Promise<HistoryQuestion | null> {
    return await this.db.historyQuestion.findUnique({ where: { id: questionId } });
  }

  async getQuestionsMany({
    topicId,
    text,
    ticketId,
  }: {
    text?: string;
    topicId?: number;
    ticketId?: number;
  }): Promise<
    Array<{
      id: number;
      topics: IdObject[];
      type: string;
      name: string;
    }>
  > {
    if (topicId) {
      const topic = await this.db.historyTopic.findUnique({
        where: { id: topicId },
        select: {
          questions: {
            where: { name: { contains: text }, topics: { some: { id: topicId } } },
            select: {
              id: true,
              topics: { select: { id: true } },
              type: true,
              name: true,
            },
          },
        },
      });

      if (!topic) throw new Error(errMsg.invalidTopicId);

      return topic.questions;
    }

    if (ticketId) {
      const ticket = await this.db.historyTicket.findUnique({
        where: { id: ticketId },
        select: {
          questions: {
            where: { name: { contains: text } },
            select: {
              id: true,
              topics: { select: { id: true } },
              type: true,
              name: true,
              order: true,
              options: true,
              correct: true,
              solution: true,
            },
            orderBy: { order: 'asc' },
          },
        },
      });

      if (!ticket) throw new Error(errMsg.invalidTicketId);

      return ticket.questions;
    }

    return await this.db.historyQuestion.findMany({
      where: { name: { contains: text } },
      select: {
        id: true,
        topics: { select: { id: true } },
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
    return await this.db.historyTicket.findMany({ include: { questions: true } });
  }

  async getTicketById(ticketId: number): Promise<HistoryTicket | null> {
    return await this.db.historyTicket.findUnique({
      where: { id: ticketId },
      include: { questions: true },
    });
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

  async getKeyWordsByTopic(topicId: number): Promise<HistoryKeyWord[]> {
    return await this.db.historyKeyWord.findMany({ where: { topicId } });
  }

  async createKeyWord(data: Prisma.HistoryKeyWordCreateInput): Promise<IdObject> {
    return await this.db.historyKeyWord.create({ data, select: { id: true } });
  }

  async updateKeyWord(id: number, data: Prisma.HistoryKeyWordUpdateInput): Promise<void> {
    await this.db.historyKeyWord.update({ where: { id }, data });
  }

  async deleteKeyWord(id: number): Promise<void> {
    await this.db.historyKeyWord.delete({ where: { id } });
  }
}
