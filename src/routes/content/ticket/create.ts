import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBHistoryTicketInput } from '@/shared/typebox/ticket';

const body = TBHistoryTicketInput;

const response = { '2xx': Type.Object({ id: Type.Number() }) };

const schema: FastifySchema = { body, response };

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
}

export async function create(fastify: FastifyInstance): Promise<void> {
  fastify.post<T>('/tickets', { schema }, async (req, res) => {
    const result = await fastify.historyContent.createTicket({
      ...req.body,
      questions: { connect: req.body.questions },
    });

    res.status(201);

    return result;
  });
}
