"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtPlugin = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
exports.jwtPlugin = (0, fastify_plugin_1.default)(async (server, opts) => {
    server.register(jwt_1.default, {
        secret: opts.JWT_SECRET_ACCESS,
        namespace: 'access',
    });
    server.register(jwt_1.default, {
        secret: opts.JWT_SECRET_REFRESH,
        namespace: 'refresh',
    });
    server.decorate('authenticate', async (request, reply) => {
        try {
            await request.accessJwtVerify();
        }
        catch (err) {
            reply.send(err);
        }
    });
    server.decorate('generateAccessToken', (value) => server.jwt.access.sign(value, { expiresIn: '3h' }));
    server.decorate('generateRefreshToken', (value) => server.jwt.refresh.sign(value, { expiresIn: '60d' }));
});
