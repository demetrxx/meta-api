import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';
import { Type, type Static } from '@sinclair/typebox';
import errors from 'http-errors';
import { hashPassword } from '@/lib';

const body = Type.Strict(
  Type.Object({
    email: Type.String(),
    password: Type.String(),
  }),
);

const response = {
  200: Type.Object({}),
};

const schema: FastifySchema = { body, response };

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
}

export async function register(fastify: FastifyInstance): Promise<void> {
  fastify.post<T>('/register', { schema }, async (req, res) => {
    const { email, password } = req.body;

    const user = await fastify.prisma.user.findUnique({ where: { email } });

    if (user) {
      return new errors.Conflict('Email is already taken.');
    }

    const hashedPassword = await hashPassword(password);

    await fastify.prisma.user.create({ data: { email, password: hashedPassword } });

    return req.body;
  });
}
