import { type FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { register } from './register/register';
import { login } from './login/login';
import { token } from './token/token';

export const authRoutes: FastifyPluginAsync = fp(async (server) => {
  const opts = { prefix: '/auth' } as const;

  server.register(register, opts);
  server.register(login, opts);
  server.register(token, opts);
});
