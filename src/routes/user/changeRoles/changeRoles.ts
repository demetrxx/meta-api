import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

const params = Type.Object({
  id: Type.String(),
});

const body = Type.Object({
  roles: Type.Array(
    Type.Union([Type.Literal('USER'), Type.Literal('ADMIN'), Type.Literal('OWNER')]),
  ),
});

const schema: FastifySchema = { params, body };

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
  Params: Static<typeof params>;
}
export async function changeRoles(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('onRequest', fastify.verifyOwner);
  fastify.patch<T>('/roles/:id', { schema }, async (req, res) => {
    await fastify.userService.changeRoles(Number(req.params.id), req.body.roles);
    return { id: req.params.id };
  });
}
