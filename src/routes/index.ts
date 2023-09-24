import { type FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { ping } from '@/routes/ping';

import { authRoutes } from './auth';

export const routes: FastifyPluginAsync = fp(async (fastify) => {
  fastify.register(async function (privateServer) {
    privateServer.addHook('onRequest', privateServer.authenticate);
    privateServer.register(ping);
  });

  fastify.register(async function (publicServer) {
    publicServer.register(authRoutes);
  });
});
