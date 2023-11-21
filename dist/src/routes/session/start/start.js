"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
async function start(fastify) {
    fastify.post('/', async () => {
        return await fastify.historySession.create({ userId: fastify.user.id });
    });
}
exports.start = start;
