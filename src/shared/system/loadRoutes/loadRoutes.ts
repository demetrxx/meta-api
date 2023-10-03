import {
  type FastifyInstance,
  type FastifyPluginAsync,
  type FastifyRegisterOptions,
} from 'fastify';
import fp from 'fastify-plugin';

export const loadRoutes = (
  routes: Array<(s: FastifyInstance) => Promise<void>>,
  opts?: FastifyRegisterOptions<object>,
  decorators: Record<string, any> = {},
): FastifyPluginAsync =>
  fp(async (fastify) => {
    routes.forEach((route) => {
      for (const name of Object.keys(decorators)) {
        const decorator = decorators[name];

        fastify.decorate(
          decorator,
          typeof decorator === 'function' ? decorator(fastify) : decorator,
        );
      }

      fastify.register(route, opts);
    });
  });
