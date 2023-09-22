"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtPlugin = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
exports.jwtPlugin = (0, fastify_plugin_1.default)(async (server) => {
    server.decorate('user', null);
    server.addHook('onRequest', async (request, reply) => {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            reply.send(err);
        }
    });
});
