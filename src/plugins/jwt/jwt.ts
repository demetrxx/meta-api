import {
  type FastifyPluginAsync,
  type FastifyPluginOptions,
  type FastifyReply,
  type FastifyRequest,
} from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt, { type JWT as JWTType } from '@fastify/jwt';
export interface RefreshTokenData {
  id: number;
}

export interface JwtUser {
  id: number;
  roles?: string[];
}

export const jwtPlugin: FastifyPluginAsync = fp(async (server, opts: FastifyPluginOptions) => {
  server.register(fastifyJwt, {
    secret: opts.JWT_SECRET_ACCESS,
    namespace: 'access',
  });
  server.register(fastifyJwt, {
    secret: opts.JWT_SECRET_REFRESH,
    namespace: 'refresh',
  });

  server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.accessJwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  server.decorate('generateAccessToken', (value) =>
    server.jwt.access.sign(value, { expiresIn: '3h' }),
  );

  server.decorate('generateRefreshToken', (value) =>
    server.jwt.refresh.sign(value, { expiresIn: '60d' }),
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
