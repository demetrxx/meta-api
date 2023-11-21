import { type HistoryQuestion, type HistorySession } from '@prisma/client';
import { type FastifyInstance } from 'fastify';
import errors from 'http-errors';

import { calcTimePassed } from '@/lib';
import { getHistorySessionAnalytics } from '@/modules/history/lib/getHistorySessionAnalytics/getHistorySessionAnalytics';
import { getHistorySessionProgress } from '@/modules/history/lib/getHistorySessionProgress/getHistorySessionProgress';
import { type HistorySessionAnswers } from '@/modules/history/types/session';
import { errMsg } from '@/shared/consts/errMsg';
import { toIdsObjArr } from '@/shared/lib';
import { type IdObject } from '@/shared/types/IdObject';

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
      include: { ticket: { select: { questions: { orderBy: { order: 'asc' } } } } },
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
  }): Promise<IdObject> {
    const activeSession = await this.getActive({ userId });

    const timePassed = calcTimePassed({
      prevTimePassed: activeSession.timePassed,
      lastViewed: activeSession.lastViewed,
    });

    return await this.db.historySession.update({
      where: { id: activeSession.id },
      data: {
        timePassed,
        answers,
      },
      select: { id: true },
    });
  }

  async getActive({
    userId,
  }: {
    userId: number;
  }): Promise<HistorySession & { ticket: { questions: HistoryQuestion[] } }> {
    const { activeSession } = await this.db.historyProfile.findUniqueOrThrow({
      where: { userId },
      select: {
        activeSession: {
          include: { ticket: { include: { questions: { orderBy: { order: 'asc' } } } } },
        },
      },
    });

    if (!activeSession) {
      throw new errors.BadRequest(errMsg.noActiveSession);
    }

    await this.db.historySession.update({
      where: { id: activeSession.id },
      data: { lastViewed: new Date() },
    });

    return activeSession;
  }

  async finish({ userId }: { userId: number }): Promise<HistorySession> {
    const activeSession = await this.getActive({ userId });

    const timePassed = calcTimePassed({
      prevTimePassed: activeSession.timePassed,
      lastViewed: activeSession.lastViewed,
    });

    const { score, failed, rate, answered } = getHistorySessionAnalytics(
      activeSession.ticket.questions,
      activeSession.answers as HistorySessionAnswers,
    );

    const session = await this.db.historySession.update({
      where: { id: activeSession.id },
      data: {
        score,
        rate,
        timePassed,
        done: true,
        lastViewed: new Date(),
      },
      include: {
        profile: { select: { progressTopics: true } },
      },
    });

    const { progressTopics } = session.profile;

    const completeSessions = await this.db.historySession.findMany({
      where: { profileId: session.profileId, done: true },
      orderBy: { lastViewed: 'desc' },
    });

    const progressSession = getHistorySessionProgress(completeSessions);
    const progressTotal = (progressTopics + progressSession) / 2;

    await this.db.historyProfile.update({
      where: { userId },
      data: {
        progressTotal,
        progressSession,
        seen: { connect: activeSession.ticket.questions.map(({ id }) => ({ id })) },
        answered: { connect: toIdsObjArr(answered) },
        failed: { connect: toIdsObjArr(failed) },
        activeSession: { disconnect: true },
      },
    });

    return session;
  }

  async getById(id: number, { userId }: { userId: number }): Promise<HistorySession> {
    const session = await this.db.historySession.findUnique({
      where: { id, done: false },
      include: { profile: { select: { userId: true } } },
    });

    if (!session) {
      throw new errors.BadRequest(errMsg.invalidSessionId);
    }

    if (session.profile.userId !== userId) {
      throw new errors.Forbidden();
    }

    return session;
  }

  async deleteById(id: number, { userId }: { userId: number }): Promise<void> {
    const session = await this.db.historySession.findUnique({
      where: { id },
      select: { profile: { select: { userId: true } }, ticketId: true },
    });

    if (!session) {
      throw new errors.InternalServerError(errMsg.invalidSessionId);
    }

    if (session.profile.userId !== userId) {
      throw new errors.Forbidden();
    }

    await this.db.historySession.delete({ where: { id } });
    await this.db.historyProfile.update({
      where: { userId },
      data: { ticketsSeen: { disconnect: { id: session.ticketId } } },
    });
  }
}
