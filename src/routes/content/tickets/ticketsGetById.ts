import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBHistoryTicketOutput } from '@/modules/history/typebox/ticket';

const params = Type.Object({
  id: Type.String(),
});

const schema: FastifySchema = { params, response: { 200: TBHistoryTicketOutput } };

interface T extends RouteGenericInterface {
  Params: Static<typeof params>;
}

export async function ticketsGetById(fastify: FastifyInstance): Promise<void> {
  fastify.get<T>('/tickets/:id', { schema }, async (req, res) => {
    return await fastify.historyContent.getTicketById(Number(req.params.id));
  });
}
