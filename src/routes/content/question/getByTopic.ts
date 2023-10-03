import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBHistoryQuestionOutput } from '@/shared/typebox/question';

const querystring = Type.Object({
  topicId: Type.String(),
});

const schema: FastifySchema = {
  querystring,
  response: { 200: Type.Array(TBHistoryQuestionOutput) },
};

interface T extends RouteGenericInterface {
  Querystring: Static<typeof querystring>;
}

export async function getByTopic(fastify: FastifyInstance): Promise<void> {
  fastify.get<T>('/questions/:topicId', { schema }, async (req, res) => {
    const questions = await fastify.historyContent.getQuestionsByTopic(Number(req.query.topicId));
    return JSON.stringify(questions);
  });
}
