import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';
import { Type, type Static } from '@sinclair/typebox';
import errors from 'http-errors';
import { validatePassword } from '@/lib';

const body = Type.Strict(
  Type.Object({
    email: Type.String(),
    password: Type.String(),
  }),
);

const response = {
  200: Type.Object({
    accessToken: Type.String(),
    refreshToken: Type.String(),
  }),
};

const schema: FastifySchema = { body, response };

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
}

export async function login(fastify: FastifyInstance): Promise<void> {
  fastify.post<T>('/login', { schema }, async (req, res) => {
    const { email, password } = req.body;
    const user = await fastify.prisma.user.findUnique({
      where: { email },
      select: { id: true, roles: true, password: true },
    });

    if (!user) {
      throw new errors.Unauthorized('Invalid email.');
    }

    const isPasswordValid = await validatePassword(password, user.password);

    if (!isPasswordValid) {
      throw new errors.Unauthorized('Invalid password.');
    }

    const tokenData = { id: user.id, roles: user.roles };

    const accessToken = fastify.generateAccessToken(tokenData);
    const refreshToken = fastify.generateRefreshToken(tokenData);

    return { accessToken, refreshToken };
  });
}
