import { Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema } from 'fastify';

import { TBHistoryTopicOutput } from '@/modules/history/typebox/topic';

const schema: FastifySchema = {
  response: { '2xx': Type.Array(TBHistoryTopicOutput) },
};

export async function topicsGetAll(fastify: FastifyInstance): Promise<void> {
  fastify.get('/topics', { schema }, async () => {
    return await fastify.historyContent.getAllTopics();
  });
}
