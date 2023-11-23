import {
  type FastifyInstance,
  type FastifyPluginAsync,
  type FastifyRegisterOptions,
} from 'fastify';
import fp from 'fastify-plugin';

export const loadRoutes = ({
  routes,
  opts,
  decorators = {},
  adminsOnly,
}: {
  routes: Array<(s: FastifyInstance) => Promise<void>>;
  opts?: FastifyRegisterOptions<object>;
  decorators?: Record<string, any>;
  adminsOnly?: boolean;
}): FastifyPluginAsync =>
  fp(async (fastify) => {
    for (const name of Object.keys(decorators)) {
      const decorator = decorators[name];

      fastify.decorate(name, typeof decorator === 'function' ? decorator(fastify) : decorator);
    }

    if (adminsOnly) {
      fastify.addHook('onRequest', fastify.verifyAdmin);
    }

    routes.forEach((route) => {
      fastify.register(route, opts);
    });
  });
