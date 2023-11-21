import { type FastifyInstance } from 'fastify';

export async function complete(fastify: FastifyInstance): Promise<void> {
  fastify.get('/done', async (req) => {
    return await fastify.historySession.finish({ userId: req.user.id });
  });
}
