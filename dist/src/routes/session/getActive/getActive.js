"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActive = void 0;
async function getActive(fastify) {
    fastify.get('/active', async () => {
        return await fastify.historySession.getActive({ userId: fastify.user.id });
    });
}
exports.getActive = getActive;
