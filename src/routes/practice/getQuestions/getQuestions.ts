import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

const params = Type.Object({
  topicId: Type.String(),
});

const schema: FastifySchema = { params };

interface T extends RouteGenericInterface {
  Params: Static<typeof params>;
}

export async function getQuestions(fastify: FastifyInstance): Promise<void> {
  fastify.get<T>('/practice/:topicId', { schema }, async (req, res) => {
    return await fastify.historyTopicPractice.getQuestions({
      userId: fastify.user.id,
      topicId: Number(req.params.topicId),
    });
  });
}
