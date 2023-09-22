import Fastify, { type FastifyInstance } from 'fastify';
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { routes, ping, auth } from './routes';
import { prismaPlugin, jwtPlugin, validatorPlugin } from './plugins';
import { type Config, type IEnvSchema } from '../config';
import { login } from '@/routes/auth/login';
import { register } from '@/routes/auth/register';

export function buildServer(config: Config, envSchema: IEnvSchema): FastifyInstance {
  const app = Fastify({
    logger: config.logger,
  }).withTypeProvider<TypeBoxTypeProvider>();

  app.register(validatorPlugin);
  app.register(prismaPlugin);
  app.register(jwtPlugin, envSchema);

  app.register(async function authContext(authServer) {
    authServer.addHook('onRequest', authServer.authenticate);
    authServer.register(ping);
    authServer.register(routes);
  });

  app.register(async function publicContext(publicServer) {
    publicServer.register(register);
    publicServer.register(login);
    publicServer.register(auth);
  });

  return app;
}
