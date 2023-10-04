import { Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema } from 'fastify';

import { TBHistoryTopicOutput } from '@/shared/typebox/topic';

const schema: FastifySchema = {
  response: { '2xx': Type.Array(TBHistoryTopicOutput) },
};

export async function update(fastify: FastifyInstance): Promise<void> {
  fastify.get('/tickets', { schema }, async () => {
    return await fastify.historyContent.getAllTickets();
  });
}
