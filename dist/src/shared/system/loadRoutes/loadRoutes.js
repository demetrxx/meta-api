"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRoutes = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const loadRoutes = (routes, opts, decorators = {}) => (0, fastify_plugin_1.default)(async (fastify) => {
    for (const name of Object.keys(decorators)) {
        const decorator = decorators[name];
        fastify.decorate(name, typeof decorator === 'function' ? decorator(fastify) : decorator);
    }
    routes.forEach((route) => {
        fastify.register(route, opts);
    });
});
exports.loadRoutes = loadRoutes;
