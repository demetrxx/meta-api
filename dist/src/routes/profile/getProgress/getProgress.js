"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProgress = void 0;
const typebox_1 = require("@sinclair/typebox");
const params = typebox_1.Type.Object({
    topicId: typebox_1.Type.String(),
});
const schema = { params };
async function getProgress(fastify) {
    fastify.get('/progress/:topicId', { schema }, async (req, res) => {
        return await fastify.historyProfile.getProgress({
            userId: req.user.id,
            topicId: Number(req.params.topicId),
        });
    });
}
exports.getProgress = getProgress;
