import { type FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { register } from './register';
import { login } from './login';

export const authRoutes: FastifyPluginAsync = fp(async (server) => {
  const opts = { prefix: '/auth' } as const;

  server.register(register, opts);
  server.register(login, opts);
});
