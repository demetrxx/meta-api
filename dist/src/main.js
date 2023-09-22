"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServer = void 0;
const fastify_1 = __importDefault(require("fastify"));
const routes_1 = require("./routes");
const plugins_1 = require("./plugins");
const login_1 = require("@/routes/auth/login");
const register_1 = require("@/routes/auth/register");
function buildServer(config, envSchema) {
    const app = (0, fastify_1.default)({
        logger: config.logger,
    }).withTypeProvider();
    app.register(plugins_1.validatorPlugin);
    app.register(plugins_1.prismaPlugin);
    app.register(plugins_1.jwtPlugin, envSchema);
    app.register(async function authContext(authServer) {
        authServer.addHook('onRequest', authServer.authenticate);
        authServer.register(routes_1.ping);
        authServer.register(routes_1.routes);
    });
    app.register(async function publicContext(publicServer) {
        publicServer.register(register_1.register);
        publicServer.register(login_1.login);
        publicServer.register(routes_1.auth);
    });
    return app;
}
exports.buildServer = buildServer;
