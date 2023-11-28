"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServer = void 0;
const fastify_1 = __importDefault(require("fastify"));
const plugins_1 = require("./plugins");
const routes_1 = require("./routes");
function buildServer(config, envSchema) {
    const app = (0, fastify_1.default)({
        logger: config.logger,
    }).withTypeProvider();
    app.decorate('env', envSchema);
    app.register(plugins_1.validatorPlugin);
    app.register(plugins_1.prismaPlugin);
    app.register(plugins_1.jwtPlugin);
    app.register(plugins_1.rolesAccessPlugin);
    app.register(routes_1.routes);
    return app;
}
exports.buildServer = buildServer;
