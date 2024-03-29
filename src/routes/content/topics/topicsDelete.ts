import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

const params = Type.Object({
  id: Type.String(),
});

const schema: FastifySchema = {
  params,
  response: { '2xx': Type.Object({ id: Type.Number() }) },
};

interface T extends RouteGenericInterface {
  Params: Static<typeof params>;
}

export async function topicsDelete(fastify: FastifyInstance): Promise<void> {
  fastify.delete<T>('/topics/:id', { schema }, async (req, res) => {
    await fastify.historyContent.deleteTopic(Number(req.params.id));
    res.status(200).send();
  });
}
