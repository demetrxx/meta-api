import Fastify, { type FastifyInstance } from 'fastify';
import { routes, ping, auth } from './routes';
import { prismaPlugin, jwtPlugin, validatorPlugin } from './plugins';
import fastifyJwt from '@fastify/jwt';
import { type Config, type IEnvSchema } from './config';

export function buildServer(config: Config, envSchema: IEnvSchema): FastifyInstance {
  const app = Fastify({
    logger: config.logger,
  });

  app.register(validatorPlugin);
  app.register(prismaPlugin);
  app.register(fastifyJwt, { secret: envSchema.JWT_SECRET });

  app.register(async function authContext(authServer) {
    authServer.register(jwtPlugin);
    authServer.register(ping);
    authServer.register(routes);
  });

  app.register(async function publicContext(publicServer) {
    publicServer.register(auth);
    publicServer.decorateRequest('foo', 'foo');
  });

  return app;
}
