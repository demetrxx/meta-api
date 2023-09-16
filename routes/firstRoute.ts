import {FastifyInstance} from "fastify";

export async function routes (fastify: FastifyInstance) {
  fastify.get('/', async (req, res) => {
    // await fastify.prisma.user.create({data: {email: 'demetrxx@gmail.com', name: 'Dmytro'}})
    const allUsers = await fastify.prisma.user.findMany()
    return allUsers;
  })
}