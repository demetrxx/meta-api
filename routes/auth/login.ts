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

export async function login(fastify: FastifyInstance): Promise<void> {
  fastify.post<T>('/login', { schema }, async (req, res) => {
    const { email } = req.body;
    const user = await fastify.prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401);
      throw new Error('unauthorized');
    }

    // TODO: validate password

    // if (false) {
    //   res.status(401).send();
    //   return;
    // }

    return user;
  });
}
