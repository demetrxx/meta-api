import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBHistoryQuestionOutput } from '@/shared/typebox/question';

const params = Type.Object({
  id: Type.String(),
});

const schema: FastifySchema = { params, response: { 200: TBHistoryQuestionOutput } };

interface T extends RouteGenericInterface {
  Params: Static<typeof params>;
}

export async function getById(fastify: FastifyInstance): Promise<void> {
  fastify.get<T>('/questions/:id', { schema }, async (req, res) => {
    const question = await fastify.historyContent.getQuestionsByTopic(Number(req.params.id));
    return JSON.stringify(question);
  });
}
