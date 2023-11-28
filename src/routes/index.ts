import { type FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { authRoutes } from './auth';
import { contentRoutes } from './content';
import { paymentsRoutes } from './payments';
import { practiceRoutes } from './practice';
import { profileRoutes } from './profile';
import { sessionRoutes } from './session';
import { userRoutes } from './user';

export const routes: FastifyPluginAsync = fp(async (fastify) => {
  fastify.register(async function (privateServer) {
    privateServer.addHook('onRequest', privateServer.authenticate);
    privateServer.addHook('onRequest', privateServer.verifyAccess);

    privateServer.register(sessionRoutes);
    privateServer.register(practiceRoutes);
    privateServer.register(contentRoutes);
    privateServer.register(profileRoutes);

    // user
    privateServer.register(userRoutes);
    privateServer.register(paymentsRoutes);
  });

  fastify.register(async function (publicServer) {
    publicServer.register(authRoutes);
  });
});
