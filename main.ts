import Fastify, { type FastifyInstance } from 'fastify';
import { routes, ping, auth } from './routes';
import { prismaPlugin } from './plugins';
import fastifyJwt from '@fastify/jwt';
import { type Config } from './config';

export function buildServer(config: Config): FastifyInstance {
  const fastify = Fastify({
    logger: config.logger,
  });

  fastify.register(prismaPlugin);
  fastify.register(fastifyJwt, { secret: 'superkey' });

  fastify.register(async function authenticatedContext(childServer) {
    childServer.addHook('onRequest', async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    });

    childServer.register(ping);
    childServer.register(routes);
  });

  fastify.register(async function publicContext(childServer) {
    childServer.register(auth);
    childServer.decorateRequest('foo', 'foo');
  });

  return fastify;
}
