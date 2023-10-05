import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBHistoryKeyWordInput } from '@/modules/history/typebox/keyWord';

const params = Type.Object({
  id: Type.String(),
});

const body = Type.Partial(TBHistoryKeyWordInput);

const schema: FastifySchema = {
  body,
  params,
  response: { '2xx': Type.Object({ id: Type.Number() }) },
};

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
  Params: Static<typeof params>;
}

export async function keyWordsUpdate(fastify: FastifyInstance): Promise<void> {
  fastify.patch<T>('/keywords/:id', { schema }, async (req) => {
    await fastify.historyContent.updateKeyWord(Number(req.params.id), req.body);
    return { id: Number(req.params.id) };
  });
}
