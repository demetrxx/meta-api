import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify, { type FastifyInstance } from 'fastify';

import { type Config, type IEnvSchema } from '../config';
import { jwtPlugin, prismaPlugin, rolesAccessPlugin, validatorPlugin } from './plugins';
import { routes } from './routes';

export function buildServer(config: Config, envSchema: IEnvSchema): FastifyInstance {
  const app = Fastify({
    logger: config.logger,
  }).withTypeProvider<TypeBoxTypeProvider>();
  app.decorate('env', envSchema);

  app.register(validatorPlugin);
  app.register(prismaPlugin);

  app.register(jwtPlugin);
  app.register(rolesAccessPlugin);

  app.register(routes);

  return app;
}
