import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBHistoryKeyWordOutput } from '@/modules/history/typebox/keyWord';

const querystring = Type.Object({
  topicId: Type.String(),
});

const schema: FastifySchema = {
  querystring,
  response: { '2xx': Type.Array(TBHistoryKeyWordOutput) },
};

interface T extends RouteGenericInterface {
  Querystring: Static<typeof querystring>;
}

export async function keyWordsGetByTopic(fastify: FastifyInstance): Promise<void> {
  fastify.get<T>('/keywords', { schema }, async (req) => {
    return await fastify.historyContent.getKeyWordsByTopic(Number(req.query.topicId));
  });
}
