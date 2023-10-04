import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBHistoryTopicInput } from '@/shared/typebox/topic';

const params = Type.Object({
  id: Type.String(),
});

const body = Type.Partial(TBHistoryTopicInput);

const schema: FastifySchema = {
  body,
  params,
  response: { '2xx': Type.Object({ id: Type.Number() }) },
};

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
  Params: Static<typeof params>;
}

export async function update(fastify: FastifyInstance): Promise<void> {
  fastify.patch<T>('/topics/:id', { schema }, async (req) => {
    await fastify.historyContent.updateTopic(Number(req.params.id), req.body);

    return { id: Number(req.params.id) };
  });
}
