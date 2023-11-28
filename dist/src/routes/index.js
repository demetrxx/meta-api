"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const auth_1 = require("./auth");
const content_1 = require("./content");
const practice_1 = require("./practice");
const profile_1 = require("./profile");
const session_1 = require("./session");
const user_1 = require("./user");
exports.routes = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.register(async function (privateServer) {
        privateServer.addHook('onRequest', privateServer.authenticate);
        privateServer.addHook('onRequest', privateServer.verifyAccess);
        privateServer.register(session_1.sessionRoutes);
        privateServer.register(practice_1.practiceRoutes);
        privateServer.register(content_1.contentRoutes);
        privateServer.register(profile_1.profileRoutes);
        privateServer.register(user_1.userRoutes);
    });
    fastify.register(async function (publicServer) {
        publicServer.register(auth_1.authRoutes);
    });
});
