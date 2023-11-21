import { Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema } from 'fastify';

import { TBHistoryTicketOutput } from '@/modules/history/typebox/ticket';

const schema: FastifySchema = {
  response: { '2xx': Type.Array(TBHistoryTicketOutput) },
};

export async function ticketsGetAll(fastify: FastifyInstance): Promise<void> {
  fastify.get('/tickets', { schema }, async () => {
    return await fastify.historyContent.getAllTickets();
  });
}
