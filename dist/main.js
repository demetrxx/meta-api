"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServer = void 0;
const fastify_1 = __importDefault(require("fastify"));
const routes_1 = require("./routes");
const plugins_1 = require("./plugins");
function buildServer(config) {
    const fastify = (0, fastify_1.default)({
        logger: config.logger,
    });
    fastify.register(plugins_1.prismaPlugin);
    fastify.register(routes_1.routes);
    fastify.register(routes_1.auth);
    fastify.register(routes_1.ping);
    return fastify;
}
exports.buildServer = buildServer;
