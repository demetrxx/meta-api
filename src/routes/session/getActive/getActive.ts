import { type FastifyInstance } from 'fastify';

export async function getActive(fastify: FastifyInstance): Promise<void> {
  fastify.get('/active', async () => {
    return await fastify.historySession.getActive({ userId: fastify.user.id });
  });
}
