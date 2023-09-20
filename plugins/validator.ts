import { type FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import Ajv from 'ajv';

export const validatorPlugin: FastifyPluginAsync = fp(async (server) => {
  const ajv = new Ajv({ removeAdditional: 'all' });
  server.setValidatorCompiler(({ schema }) => ajv.compile(schema));
});
