import { type FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

export const jwtPlugin: FastifyPluginAsync = fp(async (server) => {
  server.decorate('user', null);
  server.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
