import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

const params = Type.Object({
  id: Type.String(),
});

const schema: FastifySchema = {
  params,
};

interface T extends RouteGenericInterface {
  Params: Static<typeof params>;
}

export async function find(fastify: FastifyInstance): Promise<void> {
  fastify.get<T>('/:id', { schema }, async (req) => {
    return await fastify.historySession.getById(Number(req.params.id), { userId: req.user.id });
  });
}
