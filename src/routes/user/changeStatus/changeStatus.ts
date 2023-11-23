import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

const params = Type.Object({
  id: Type.String(),
});

const body = Type.Object({
  status: Type.Union([Type.Literal('active'), Type.Literal('blocked')]),
});

const schema: FastifySchema = { params, body };

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
  Params: Static<typeof params>;
}
export async function changeStatus(fastify: FastifyInstance): Promise<void> {
  fastify.patch<T>('/status/:id', { schema }, async (req, res) => {
    await fastify.userService.changeStatus(Number(req.params.id), req.body.status);

    return { id: req.params.id };
  });
}
