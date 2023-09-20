"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServer = void 0;
const fastify_1 = __importDefault(require("fastify"));
const routes_1 = require("./routes");
const plugins_1 = require("./plugins");
const jwt_1 = __importDefault(require("@fastify/jwt"));
function buildServer(config) {
    const fastify = (0, fastify_1.default)({
        logger: config.logger,
    });
    fastify.register(plugins_1.prismaPlugin);
    fastify.register(jwt_1.default, { secret: 'superkey' });
    fastify.register(async function authenticatedContext(childServer) {
        childServer.addHook('onRequest', async (request, reply) => {
            try {
                await request.jwtVerify();
            }
            catch (err) {
                reply.send(err);
            }
        });
        childServer.register(routes_1.ping);
        childServer.register(routes_1.routes);
    });
    fastify.register(async function publicContext(childServer) {
        childServer.register(routes_1.auth);
        childServer.decorateRequest('foo', 'foo');
    });
    return fastify;
}
exports.buildServer = buildServer;
