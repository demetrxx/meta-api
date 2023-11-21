"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complete = void 0;
async function complete(fastify) {
    fastify.get('/done', async (req) => {
        return await fastify.historySession.finish({ userId: req.user.id });
    });
}
exports.complete = complete;
