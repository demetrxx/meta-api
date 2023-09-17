import { buildServer } from './main';
import { configMap } from './config';
const env = (process.env.NODE_ENV ?? 'development') as Env;

(async () => {
  const config = configMap[env];
  const fastify = buildServer(config);

  try {
    await fastify.listen({ port: Number(process.env.PORT) });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
