import { type HistorySession } from '@prisma/client';
import { type FastifyInstance } from 'fastify';
import errors from 'http-errors';

import { calcTimePassed, getSessionProgress } from '@/lib';
import { getTicketScore } from '@/modules/history/lib/getTicketScore/getTicketScore';
import { type HistorySessionAnswers } from '@/modules/history/types/session';
import { errMsg } from '@/shared/consts/errMsg';

declare module 'fastify' {
  interface FastifyInstance {
    historySession: HistorySessionService;
  }
}

export class HistorySessionService {
  private readonly db: FastifyInstance['prisma'];

  constructor(app: FastifyInstance) {
    this.db = app.prisma;
  }

  async create({ userId }: { userId: number }): Promise<HistorySession> {
    const profile = await this.db.historyProfile.findUnique({
      where: { userId },
      select: { ticketsSeen: { select: { id: true } } },
    });

    if (!profile) {
      throw new errors.InternalServerError(errMsg.invalidUserId);
    }

    let ticket = await this.db.historyTicket.findFirst({
      where: { id: { notIn: profile.ticketsSeen.map(({ id }) => id) } },
      orderBy: { year: 'desc' },
      select: { id: true },
    });

    // Seen all tickets, start from the beginning
    if (!ticket) {
      await this.db.historyProfile.update({
        where: { userId },
        data: { ticketsSeen: { set: [] } },
      });

      ticket = await this.db.historyTicket.findFirst({
        orderBy: { year: 'desc' },
        select: { id: true },
      });
    }

    if (!ticket) throw new errors.InternalServerError(errMsg.noTickets);

    const session = await this.db.historySession.create({
      data: {
        ticket: { connect: { id: ticket.id } },
        profile: { connect: { userId } },
        answers: {},
      },
      include: { ticket: { select: { questions: true } } },
    });

    await this.db.historyProfile.update({
      where: { userId },
      data: {
        ticketsSeen: { connect: { id: ticket.id } },
        activeSession: { connect: { id: session.id } },
      },
    });

    return session;
  }

  async recordAnswer({
    userId,
    answers,
  }: {
    userId: number;
    answers: HistorySessionAnswers;
  }): Promise<void> {
    const activeSession = await this.getActive({ userId });

    const timePassed = calcTimePassed({
      prevTimePassed: activeSession.timePassed,
      lastViewed: activeSession.lastViewed,
    });

    await this.db.historySession.update({
      where: { id: activeSession.id },
      data: {
        timePassed,
        answers: { set: answers },
        lastViewed: new Date(),
      },
    });
  }

  async getActive({ userId }: { userId: number }): Promise<HistorySession> {
    const { activeSession } = await this.db.historyProfile.findUniqueOrThrow({
      where: { userId },
      select: { activeSession: true },
    });

    if (!activeSession) {
      throw new errors.InternalServerError(errMsg.noActiveSession);
    }

    return activeSession;
  }

  async finish({ userId }: { userId: number }): Promise<void> {
    const activeSession = await this.getActive({ userId });

    const timePassed = calcTimePassed({
      prevTimePassed: activeSession.timePassed,
      lastViewed: activeSession.lastViewed,
    });
    const score = getTicketScore(activeSession.answers as HistorySessionAnswers);

    const {
      profile: { progressTopics },
    } = await this.db.historySession.update({
      where: { id: activeSession.id },
      data: {
        score,
        timePassed,
        done: true,
        lastViewed: new Date(),
      },
      select: {
        profile: { select: { progressTopics: true } },
      },
    });

    const progressSession = getSessionProgress();
    const progressTotal = (progressTopics + progressSession) / 2;

    await this.db.historyProfile.update({
      where: { userId },
      data: {
        progressTotal,
        progressSession,
        activeSession: { disconnect: true },
      },
    });
  }

  async getById(id: number, { userId }: { userId: number }): Promise<HistorySession> {
    const session = await this.db.historySession.findUnique({
      where: { id },
      include: { profile: { select: { userId: true } } },
    });

    if (!session) {
      throw new errors.InternalServerError(errMsg.invalidSessionId);
    }

    if (session.profile.userId !== userId) {
      throw new errors.Forbidden();
    }

    return session;
  }

  async deleteById(id: number, { userId }: { userId: number }): Promise<void> {
    const session = await this.db.historySession.findUnique({
      where: { id },
      select: { profile: { select: { userId: true } } },
    });

    if (!session) {
      throw new errors.InternalServerError(errMsg.invalidSessionId);
    }

    if (session.profile.userId !== userId) {
      throw new errors.Forbidden();
    }

    await this.db.historySession.delete({ where: { id } });
  }
}
