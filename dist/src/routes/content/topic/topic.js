"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topic = void 0;
const typebox_1 = require("@sinclair/typebox");
const params = typebox_1.Type.Object({
    topicId: typebox_1.Type.String(),
});
const body = typebox_1.Type.Object({
    questionId: typebox_1.Type.Number(),
    given: typebox_1.Type.Union([typebox_1.Type.Array(typebox_1.Type.String()), typebox_1.Type.String()]),
});
const schema = { body };
async function topic(fastify) {
    fastify.get('/question/:topicId', { schema }, async (req, res) => {
        const questions = await fastify.historyTopicPractice.getQuestions({
            userId: fastify.user.id,
            topicId: Number(req.params.topicId),
        });
        return JSON.stringify(questions);
    });
    fastify.post('/practice', { schema }, async (req, res) => {
        const { questionId, given } = req.body;
        await fastify.historyTopicPractice.recordAnswer({
            given,
            questionId,
            userId: fastify.user.id,
        });
        return JSON.stringify(req.user);
    });
}
exports.topic = topic;
