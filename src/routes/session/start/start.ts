import { type FastifyInstance } from 'fastify';

export async function start(fastify: FastifyInstance): Promise<void> {
  fastify.post('/', async (req) => {
    return await fastify.historySession.create({ userId: req.user.id });
  });
}
