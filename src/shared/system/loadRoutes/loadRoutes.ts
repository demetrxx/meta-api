import {
  type FastifyInstance,
  type FastifyPluginAsync,
  type FastifyRegisterOptions,
} from 'fastify';
import fp from 'fastify-plugin';

export const loadRoutes = (
  routes: Array<(s: FastifyInstance) => Promise<void>>,
  opts?: FastifyRegisterOptions<object>,
): FastifyPluginAsync =>
  fp(async (fastify) => {
    routes.forEach((route) => {
      fastify.register(route, opts);
    });
  });
