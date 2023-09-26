import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';
import errors from 'http-errors';

import { type RefreshTokenData } from '@/plugins';
import { errMsg } from '@/shared/consts/errMsg';

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
      throw new errors.Unauthorized(errMsg.noRefreshToken);
    }

    let id: number | undefined;

    try {
      const data: RefreshTokenData = fastify.jwt.refresh.verify(refreshToken);
      id = data.id;
    } catch (err) {
      throw new errors.Unauthorized(errMsg.invalidRefreshToken);
    }

    if (!id) {
      throw new errors.Unauthorized(errMsg.invalidRefreshToken);
    }

    const user = await fastify.prisma.user.findUnique({
      where: { id },
      select: { id: true, roles: true },
    });

    if (!user) {
      throw new errors.Unauthorized(errMsg.invalidRefreshToken);
    }

    await fastify.prisma.user.update({ where: { id }, data: { lastVisitDate: new Date() } });

    const accessToken = fastify.generateAccessToken(user);

    return { accessToken, refreshToken };
  });
}
