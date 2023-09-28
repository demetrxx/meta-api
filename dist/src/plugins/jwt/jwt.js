"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtPlugin = void 0;
const jwt_1 = __importDefault(require("@fastify/jwt"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const http_errors_1 = __importDefault(require("http-errors"));
const errMsg_1 = require("@/shared/consts/errMsg");
exports.jwtPlugin = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.register(jwt_1.default, {
        secret: fastify.env.JWT_SECRET_ACCESS,
        namespace: 'access',
    });
    fastify.register(jwt_1.default, {
        secret: fastify.env.JWT_SECRET_REFRESH,
        namespace: 'refresh',
    });
    fastify.decorate('authenticate', async (request, reply) => {
        try {
            await request.accessJwtVerify();
        }
        catch (err) {
            reply.send(http_errors_1.default.Forbidden(errMsg_1.errMsg.expiredAccessToken));
        }
    });
    fastify.decorate('generateAccessToken', (value) => fastify.jwt.access.sign(value, { expiresIn: '3d' }));
    fastify.decorate('generateRefreshToken', (value) => fastify.jwt.refresh.sign(value, { expiresIn: '30d' }));
});
