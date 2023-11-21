import { type FastifyInstance } from 'fastify';

export async function getActive(fastify: FastifyInstance): Promise<void> {
  fastify.get('/active', async (req) => {
    return await fastify.historySession.getActive({ userId: req.user.id });
  });
}
