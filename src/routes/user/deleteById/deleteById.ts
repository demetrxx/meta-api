import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

const params = Type.Object({
  id: Type.String(),
});

const schema: FastifySchema = { params };

interface T extends RouteGenericInterface {
  Params: Static<typeof params>;
}
export async function deleteById(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('onRequest', fastify.verifyOwner);
  fastify.delete<T>('/:id', { schema }, async (req, res) => {
    await fastify.userService.deleteById(Number(req.params.id));

    return { id: req.params.id };
  });
}
