import { type FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { authRoutes } from './auth';
import { contentRoutes } from './content';
import { practiceRoutes } from './practice';
import { sessionRoutes } from './session';
import { userRoutes } from './user';

export const routes: FastifyPluginAsync = fp(async (fastify) => {
  fastify.register(async function (privateServer) {
    privateServer.addHook('onRequest', privateServer.authenticate);
    privateServer.register(sessionRoutes);
    privateServer.register(practiceRoutes);
    privateServer.register(contentRoutes);
    privateServer.register(userRoutes);
  });

  fastify.register(async function (publicServer) {
    publicServer.register(authRoutes);
  });
});
