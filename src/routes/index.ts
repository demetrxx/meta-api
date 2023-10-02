import { type FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { authRoutes } from './auth';

export const routes: FastifyPluginAsync = fp(async (fastify) => {
  fastify.register(async function (privateServer) {
    privateServer.addHook('onRequest', privateServer.authenticate);
  });

  fastify.register(async function (publicServer) {
    publicServer.register(authRoutes);
  });
});
