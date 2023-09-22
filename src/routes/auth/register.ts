import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';
import { Type, type Static } from '@sinclair/typebox';

const body = Type.Strict(
  Type.Object({
    email: Type.String(),
    password: Type.String(),
  }),
);

// const response = Type.Object({
//   200: Type.Any(),
//   401: Type.Object({}),
// });

const schema: FastifySchema = { body };

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
}

export async function register(fastify: FastifyInstance): Promise<void> {
  fastify.post<T>('/register', { schema }, async (req, res) => {
    // const { email, password } = req.body;
    await fastify.prisma.user.create({ data: req.body });

    // TODO: validate password

    return req.body;
  });
}
