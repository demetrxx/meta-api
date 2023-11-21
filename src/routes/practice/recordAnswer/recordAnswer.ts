import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

const body = Type.Object({
  questionId: Type.Number(),
  given: Type.Array(Type.Number()),
});

const schema: FastifySchema = { body };

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
}

export async function recordAnswer(fastify: FastifyInstance): Promise<void> {
  fastify.post<T>('/', { schema }, async (req, res) => {
    const { questionId, given } = req.body;

    await fastify.historyTopicPractice.recordAnswer({
      given,
      questionId,
      userId: req.user.id,
    });

    return { questionId };
  });
}
