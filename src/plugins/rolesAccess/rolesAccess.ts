import { Role } from '@prisma/client';
import { type FastifyPluginAsync, type FastifyReply, type FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import errors from 'http-errors';

import { errMsg } from '@/shared/consts/errMsg';

export const rolesAccessPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorate('verifyAccess', async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.user.roles?.includes(Role.ADMIN)) return;

    // TODO: remove
    // const date = new Date();
    // date.setFullYear(2024);
    //
    // await fastify.prisma.historyProfile.update({
    //   where: { userId: request.user.id },
    //   data: { accessUntil: date },
    // });

    const profile = await fastify.prisma.historyProfile.findUnique({
      where: { userId: request.user.id },
      select: { accessUntil: true },
    });

    if (!profile) throw errors.Forbidden(errMsg.noProfile);
    if (!profile.accessUntil) throw errors.Forbidden(errMsg.noSubscription);

    const canAccess = profile.accessUntil.getTime() > Date.now();
    if (!canAccess) throw errors.Forbidden(errMsg.subscriptionExpired);
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    verifyAccess: (req: FastifyRequest, res: FastifyReply) => Promise<void>;
  }
}
