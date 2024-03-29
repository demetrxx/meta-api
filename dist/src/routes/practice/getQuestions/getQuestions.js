"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestions = void 0;
const typebox_1 = require("@sinclair/typebox");
const params = typebox_1.Type.Object({
    topicId: typebox_1.Type.String(),
});
const schema = { params };
async function getQuestions(fastify) {
    fastify.get('/:topicId', { schema }, async (req, res) => {
        return await fastify.historyTopicPractice.getQuestions({
            userId: req.user.id,
            topicId: Number(req.params.topicId),
        });
    });
}
exports.getQuestions = getQuestions;
