"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionsGetById = void 0;
const typebox_1 = require("@sinclair/typebox");
const question_1 = require("../../../modules/history/typebox/question");
const params = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
});
const schema = { params, response: { 200: question_1.TBHistoryQuestionOutput } };
async function questionsGetById(fastify) {
    fastify.get('/questions/:id', { schema }, async (req, res) => {
        return await fastify.historyContent.getQuestionById(Number(req.params.id));
    });
}
exports.questionsGetById = questionsGetById;
