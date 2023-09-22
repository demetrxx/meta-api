import {
  type FastifyPluginAsync,
  type FastifyPluginOptions,
  type FastifyReply,
  type FastifyRequest,
} from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, res: FastifyReply) => Promise<void>;
  }
}

export const jwtPlugin: FastifyPluginAsync = fp(async (server, opts: FastifyPluginOptions) => {
  server.register(fastifyJwt, { secret: opts.JWT_SECRET });
  server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
