import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

const params = Type.Object({
  topicId: Type.String(),
});

const schema: FastifySchema = { params };

interface T extends RouteGenericInterface {
  Params: Static<typeof params>;
}

export async function getProgress(fastify: FastifyInstance): Promise<void> {
  fastify.get<T>('/progress/:topicId', { schema }, async (req, res) => {
    return await fastify.historyProfile.getProgress({
      userId: req.user.id,
      topicId: Number(req.params.topicId),
    });
  });
}
