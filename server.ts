import { configMap, envSchema } from './config';
import { buildServer } from './src/main';

(async () => {
  const config = configMap[envSchema.NODE_ENV];
  const fastify = buildServer(config, envSchema);

  try {
    await fastify.listen({ port: envSchema.PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
