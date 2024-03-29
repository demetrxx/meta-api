import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBHistoryTicketUpdateInput } from '@/modules/history/typebox/ticket';

const params = Type.Object({
  id: Type.String(),
});

const body = Type.Partial(TBHistoryTicketUpdateInput);

const schema: FastifySchema = {
  body,
  params,
  response: { '2xx': Type.Object({ id: Type.Number() }) },
};

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
  Params: Static<typeof params>;
}

export async function ticketsUpdate(fastify: FastifyInstance): Promise<void> {
  fastify.patch<T>('/tickets/:id', { schema }, async (req) => {
    await fastify.historyContent.updateTicket(Number(req.params.id), {
      ...req.body,
      questions: { set: req.body.questions },
    });

    return { id: Number(req.params.id) };
  });
}
