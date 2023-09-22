import { type FastifyInstance, type FastifySchema } from 'fastify';

const schema: FastifySchema = {
  response: {
    200: {
      type: 'string',
    },
  },
};

export async function ping(fastify: FastifyInstance): Promise<void> {
  fastify.post('/ping', { schema }, async (req, res) => {
    console.log(req.body);
    return JSON.stringify(req.user);
  });
}
