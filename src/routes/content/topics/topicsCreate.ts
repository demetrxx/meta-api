import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBHistoryTopicInput } from '@/modules/history/typebox/topic';

const body = TBHistoryTopicInput;

const response = { '2xx': Type.Object({ id: Type.Number() }) };

const schema: FastifySchema = { body, response };

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
}

export async function topicsCreate(fastify: FastifyInstance): Promise<void> {
  fastify.post<T>('/topics', { schema }, async (req, res) => {
    const result = await fastify.historyContent.createTopic(req.body);

    res.status(201);

    return result;
  });
}
