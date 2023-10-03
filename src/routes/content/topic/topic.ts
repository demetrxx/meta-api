import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

const params = Type.Object({
  topicId: Type.String(),
});

const body = Type.Object({
  questionId: Type.Number(),
  given: Type.Union([Type.Array(Type.String()), Type.String()]),
});

const schema: FastifySchema = { body };

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
  Params: Static<typeof params>;
}

export async function topic(fastify: FastifyInstance): Promise<void> {
  fastify.get<T>('/question/:topicId', { schema }, async (req, res) => {
    const questions = await fastify.historyTopicPractice.getQuestions({
      userId: fastify.user.id,
      topicId: Number(req.params.topicId),
    });
    return JSON.stringify(questions);
  });
  fastify.post<T>('/practice', { schema }, async (req, res) => {
    const { questionId, given } = req.body;

    await fastify.historyTopicPractice.recordAnswer({
      given,
      questionId,
      userId: fastify.user.id,
    });

    return JSON.stringify(req.user);
  });
}
