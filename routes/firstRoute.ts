import { type FastifyInstance } from 'fastify';

export async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/', async (req, res) => {
    await fastify.prisma.user.create({ data: { email: 'demetrxx@gmail.com', password: '1234' } });
    return await fastify.prisma.user.findMany();
  });
}
