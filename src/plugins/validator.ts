import Ajv from 'ajv';
import { type FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

export const validatorPlugin: FastifyPluginAsync = fp(async (fastify) => {
  const ajv = new Ajv({ removeAdditional: 'all' });
  fastify.setValidatorCompiler(({ schema }) => ajv.compile(schema));
});
