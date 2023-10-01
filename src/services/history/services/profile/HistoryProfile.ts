import { type FastifyInstance } from 'fastify';

export class HistoryProfile {
  db: FastifyInstance['prisma'];

  constructor(app: FastifyInstance) {
    this.db = app.prisma;
  }
}
