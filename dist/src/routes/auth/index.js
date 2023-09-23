"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const register_1 = require("./register/register");
const login_1 = require("./login/login");
exports.authRoutes = (0, fastify_plugin_1.default)(async (server) => {
    const opts = { prefix: '/auth' };
    server.register(register_1.register, opts);
    server.register(login_1.login, opts);
});
