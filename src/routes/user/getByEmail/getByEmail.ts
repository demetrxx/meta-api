import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

const querystring = Type.Object({
  email: Type.String(),
});

const schema: FastifySchema = {
  querystring,
};

interface T extends RouteGenericInterface {
  Querystring: Static<typeof querystring>;
}
export async function getByEmail(fastify: FastifyInstance): Promise<void> {
  fastify.get<T>('/unique', { schema }, async (req, res) => {
    return await fastify.userService.getByEmail(req.query.email);
  });
}
