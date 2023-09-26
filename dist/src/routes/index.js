"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const ping_1 = require("@/routes/ping");
const auth_1 = require("./auth");
exports.routes = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.register(async function (privateServer) {
        privateServer.addHook('onRequest', privateServer.authenticate);
        privateServer.register(ping_1.ping);
    });
    fastify.register(async function (publicServer) {
        publicServer.register(auth_1.authRoutes);
    });
});
