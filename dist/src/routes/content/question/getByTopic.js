"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByTopic = void 0;
const typebox_1 = require("@sinclair/typebox");
const question_1 = require("@/shared/typebox/questions");
const querystring = typebox_1.Type.Object({
    topicId: typebox_1.Type.String(),
});
const schema = {
    querystring,
    response: { 200: typebox_1.Type.Array(question_1.TBHistoryQuestionOutput) },
};
async function getByTopic(fastify) {
    fastify.get('/questions/:topicId', { schema }, async (req, res) => {
        const questions = await fastify.historyContent.getQuestionsByTopic(Number(req.query.topicId));
        return JSON.stringify(questions);
    });
}
exports.getByTopic = getByTopic;
