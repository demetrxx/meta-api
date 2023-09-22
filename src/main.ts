import Fastify, { type FastifyInstance } from 'fastify';
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { routes } from './routes';
import { prismaPlugin, jwtPlugin, validatorPlugin } from './plugins';
import { type Config, type IEnvSchema } from '../config';

export function buildServer(config: Config, envSchema: IEnvSchema): FastifyInstance {
  const app = Fastify({
    logger: config.logger,
  }).withTypeProvider<TypeBoxTypeProvider>();

  app.register(validatorPlugin);
  app.register(prismaPlugin);
  app.register(jwtPlugin, envSchema);

  app.register(routes);

  return app;
}
