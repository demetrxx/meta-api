"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = void 0;
async function getProfile(fastify) {
    fastify.get('/profile', async (req, res) => {
        return await fastify.historyProfile.getProfile({ userId: req.user.id });
    });
}
exports.getProfile = getProfile;
