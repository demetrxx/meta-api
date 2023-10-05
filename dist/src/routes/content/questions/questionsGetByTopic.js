"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionsGetByTopic = void 0;
const typebox_1 = require("@sinclair/typebox");
const question_1 = require("@/modules/history/typebox/question");
const querystring = typebox_1.Type.Object({
    topicId: typebox_1.Type.String(),
});
const schema = {
    querystring,
    response: { 200: typebox_1.Type.Array(question_1.TBHistoryQuestionOutput) },
};
async function questionsGetByTopic(fastify) {
    fastify.get('/questions/:topicId', { schema }, async (req, res) => {
        const questions = await fastify.historyContent.getQuestionsByTopic(Number(req.query.topicId));
        return JSON.stringify(questions);
    });
}
exports.questionsGetByTopic = questionsGetByTopic;
