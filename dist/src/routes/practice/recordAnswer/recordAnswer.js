"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordAnswer = void 0;
const typebox_1 = require("@sinclair/typebox");
const body = typebox_1.Type.Object({
    questionId: typebox_1.Type.Number(),
    given: typebox_1.Type.Union([typebox_1.Type.Array(typebox_1.Type.String()), typebox_1.Type.String()]),
});
const schema = { body };
async function recordAnswer(fastify) {
    fastify.post('/practice', { schema }, async (req, res) => {
        const { questionId, given } = req.body;
        await fastify.historyTopicPractice.recordAnswer({
            given,
            questionId,
            userId: fastify.user.id,
        });
        return { questionId };
    });
}
exports.recordAnswer = recordAnswer;
