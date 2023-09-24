import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';
import { Type, type Static } from '@sinclair/typebox';
import errors from 'http-errors';
import { type RefreshTokenData } from '@/plugins';

const body = Type.Strict(
  Type.Object({
    refreshToken: Type.String(),
  }),
);

const response = {
  200: Type.Object({
    accessToken: Type.String(),
  }),
};

const schema: FastifySchema = { body, response };

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
}

export async function token(fastify: FastifyInstance): Promise<void> {
  fastify.post<T>('/token', { schema }, async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new errors.Unauthorized('Provide your refresh token.');
    }

    let id: number | undefined;

    try {
      const data: RefreshTokenData = fastify.jwt.refresh.verify(refreshToken);
      id = data.id;
    } catch (err: any) {
      throw new errors.Unauthorized(err.message);
    }

    if (!id) {
      throw new errors.Unauthorized('Invalid token.');
    }

    const user = await fastify.prisma.user.findUnique({
      where: { id },
      select: { id: true, roles: true },
    });

    if (!user) {
      throw new errors.Unauthorized('Invalid token');
    }

    await fastify.prisma.user.update({ where: { id }, data: { lastVisitDate: new Date() } });

    const accessToken = fastify.generateAccessToken(user);

    return { accessToken, refreshToken };
  });
}
