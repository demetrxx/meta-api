import { type HistorySession } from '@prisma/client';
import { type FastifyInstance } from 'fastify';
import errors from 'http-errors';

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

  // async recordAnswer({}: {}): Promise<void> {}
  //
  // async finish({ userId }: { userId: number }): Promise<void> {}
  //
  // async getById({}: {}): Promise<void> {}
  //
  // async deleteById({}: {}): Promise<void> {}
}
