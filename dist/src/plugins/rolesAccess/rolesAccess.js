"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolesAccessPlugin = void 0;
const client_1 = require("@prisma/client");
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const http_errors_1 = __importDefault(require("http-errors"));
const errMsg_1 = require("@/shared/consts/errMsg");
exports.rolesAccessPlugin = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.decorate('verifyAccess', async (request, reply) => {
        if (request.user.roles?.includes(client_1.Role.ADMIN))
            return;
        if (request.user.accountStatus !== 'active')
            throw http_errors_1.default.Forbidden(errMsg_1.errMsg.userBlocked);
        // TODO: remove
        // const date = new Date();
        // date.setFullYear(2024);
        //
        // await fastify.prisma.historyProfile.update({
        //   where: { userId: request.profile.id },
        //   data: { accessUntil: date },
        // });
        const profile = await fastify.prisma.historyProfile.findUnique({
            where: { userId: request.user.id },
            select: { accessUntil: true },
        });
        if (!profile)
            throw http_errors_1.default.Forbidden(errMsg_1.errMsg.noProfile);
        if (!profile.accessUntil)
            throw http_errors_1.default.Forbidden(errMsg_1.errMsg.noSubscription);
        const canAccess = profile.accessUntil.getTime() > Date.now();
        if (!canAccess)
            throw http_errors_1.default.Forbidden(errMsg_1.errMsg.subscriptionExpired);
    });
    fastify.decorate('verifyAdmin', async (request, reply) => {
        if (!request.user.roles?.includes(client_1.Role.ADMIN))
            throw http_errors_1.default.Forbidden(errMsg_1.errMsg.notAdmin);
    });
    fastify.decorate('verifyOwner', async (request, reply) => {
        if (!request.user.roles?.includes(client_1.Role.OWNER))
            throw http_errors_1.default.Forbidden(errMsg_1.errMsg.notOwner);
    });
});
