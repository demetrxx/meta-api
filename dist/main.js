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
function buildServer(config, envSchema) {
    const app = (0, fastify_1.default)({
        logger: config.logger,
    });
    app.register(plugins_1.validatorPlugin);
    app.register(plugins_1.prismaPlugin);
    app.register(jwt_1.default, { secret: envSchema.JWT_SECRET });
    app.register(async function authContext(authServer) {
        authServer.register(plugins_1.jwtPlugin);
        authServer.register(routes_1.ping);
        authServer.register(routes_1.routes);
    });
    app.register(async function publicContext(publicServer) {
        publicServer.register(routes_1.auth);
        publicServer.decorateRequest('foo', 'foo');
    });
    return app;
}
exports.buildServer = buildServer;
