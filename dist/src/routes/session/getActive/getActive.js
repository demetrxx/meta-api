"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActive = void 0;
async function getActive(fastify) {
    fastify.get('/active', async (req) => {
        return await fastify.historySession.getActive({ userId: req.user.id });
    });
}
exports.getActive = getActive;
