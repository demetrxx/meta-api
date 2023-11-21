import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBHistoryQuestionOutput } from '@/modules/history/typebox/question';

const querystring = Type.Object({
  topicId: Type.Optional(Type.String()),
  ticketId: Type.Optional(Type.String()),
  text: Type.Optional(Type.String()),
});

const schema: FastifySchema = {
  querystring,
  response: { 200: Type.Array(TBHistoryQuestionOutput) },
};

interface T extends RouteGenericInterface {
  Querystring: Static<typeof querystring>;
}

export async function questionsGetMany(fastify: FastifyInstance): Promise<void> {
  fastify.get<T>('/questions', { schema }, async (req, res) => {
    const { topicId, text, ticketId } = req.query;

    const questions = await fastify.historyContent.getQuestionsMany({
      text,
      topicId: topicId ? Number(topicId) : undefined,
      ticketId: ticketId ? Number(ticketId) : undefined,
    });

    return JSON.stringify(questions);
  });
}
