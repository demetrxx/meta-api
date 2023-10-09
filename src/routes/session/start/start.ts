import { type FastifyInstance } from 'fastify';

export async function start(fastify: FastifyInstance): Promise<void> {
  fastify.post('/', async () => {
    return await fastify.historySession.create({ userId: fastify.user.id });
  });
}
