import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

const body = Type.Record(Type.Number(), Type.Union([Type.Array(Type.String()), Type.String()]));

const schema: FastifySchema = { body };

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
}

export async function recordAnswer(fastify: FastifyInstance): Promise<void> {
  fastify.patch<T>('/', { schema }, async (req) => {
    return await fastify.historySession.recordAnswer({
      userId: fastify.user.id,
      answers: req.body,
    });
  });
}
