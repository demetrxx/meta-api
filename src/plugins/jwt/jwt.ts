import fastifyJwt, { type JWT as JWTType } from '@fastify/jwt';
import { type FastifyPluginAsync, type FastifyReply, type FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
export interface RefreshTokenData {
  id: number;
}

export interface JwtUser {
  id: number;
  roles?: string[];
}

export const jwtPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: fastify.env.JWT_SECRET_ACCESS,
    namespace: 'access',
  });
  fastify.register(fastifyJwt, {
    secret: fastify.env.JWT_SECRET_REFRESH,
    namespace: 'refresh',
  });

  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.accessJwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.decorate('generateAccessToken', (value) =>
    fastify.jwt.access.sign(value, { expiresIn: '3h' }),
  );

  fastify.decorate('generateRefreshToken', (value) =>
    fastify.jwt.refresh.sign(value, { expiresIn: '60d' }),
  );
});

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtUser;
    user: JwtUser;
  }

  interface JWT {
    access: JWTType;
    refresh: JWTType;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, res: FastifyReply) => Promise<void>;
    generateAccessToken: (value: JwtUser) => string;
    generateRefreshToken: (value: RefreshTokenData) => string;
    user: JwtUser;
  }
  interface FastifyRequest {
    accessJwtVerify: () => Promise<void>;
  }
}
