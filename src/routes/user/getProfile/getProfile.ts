import { type FastifyInstance } from 'fastify';

export async function getProfile(fastify: FastifyInstance): Promise<void> {
  fastify.get('/profile', async (req, res) => {
    return await fastify.historyProfile.getProfile({ userId: req.user.id });
  });
}
