"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getById = void 0;
const typebox_1 = require("@sinclair/typebox");
const question_1 = require("@/shared/typebox/question");
const params = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
});
const schema = { params, response: { 200: question_1.TBHistoryQuestionOutput } };
async function getById(fastify) {
    fastify.get('/questions/:id', { schema }, async (req, res) => {
        const question = await fastify.historyContent.getQuestionsByTopic(Number(req.params.id));
        return JSON.stringify(question);
    });
}
exports.getById = getById;
