import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBHistoryKeyWordInput } from '@/modules/history/typebox/keyWord';

const body = TBHistoryKeyWordInput;

const response = { '2xx': Type.Object({ id: Type.Number() }) };

const schema: FastifySchema = { body, response };

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
}

export async function keyWordsCreate(fastify: FastifyInstance): Promise<void> {
  fastify.post<T>('/keywords', { schema }, async (req, res) => {
    const result = await fastify.historyContent.createKeyWord({
      ...req.body,
      topic: { connect: { id: req.body.topicId } },
    });

    res.status(201);

    return result;
  });
}
