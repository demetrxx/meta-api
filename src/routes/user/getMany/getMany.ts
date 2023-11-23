import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

const querystring = Type.Object({
  page: Type.String(),
  limit: Type.String(),
});

const schema: FastifySchema = {
  querystring,
};

interface T extends RouteGenericInterface {
  Querystring: Static<typeof querystring>;
}
export async function getMany(fastify: FastifyInstance): Promise<void> {
  fastify.get<T>('/', { schema }, async (req, res) => {
    const { page, limit } = req.query;

    return await fastify.userService.getMany({ page: Number(page), limit: Number(limit) });
  });
}
