import { type FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { ping } from '@/routes/ping';
import { authRoutes } from './auth';

export const routes: FastifyPluginAsync = fp(async (server) => {
  server.register(async function privateContext(privateServer) {
    privateServer.addHook('onRequest', privateServer.authenticate);
    privateServer.register(ping);
  });

  server.register(async function publicContext(publicServer) {
    publicServer.register(authRoutes);
  });
});
