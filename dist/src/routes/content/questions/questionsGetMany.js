"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionsGetMany = void 0;
const typebox_1 = require("@sinclair/typebox");
const question_1 = require("../../../modules/history/typebox/question");
const querystring = typebox_1.Type.Object({
    topicId: typebox_1.Type.Optional(typebox_1.Type.String()),
    ticketId: typebox_1.Type.Optional(typebox_1.Type.String()),
    text: typebox_1.Type.Optional(typebox_1.Type.String()),
});
const schema = {
    querystring,
    response: { 200: typebox_1.Type.Array(question_1.TBHistoryQuestionOutput) },
};
async function questionsGetMany(fastify) {
    fastify.get('/questions', { schema }, async (req, res) => {
        const { topicId, text, ticketId } = req.query;
        const questions = await fastify.historyContent.getQuestionsMany({
            text,
            topicId: topicId ? Number(topicId) : undefined,
            ticketId: ticketId ? Number(ticketId) : undefined,
        });
        return JSON.stringify(questions);
    });
}
exports.questionsGetMany = questionsGetMany;
