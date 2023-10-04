"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.practice = void 0;
const typebox_1 = require("@sinclair/typebox");
const HistoryTopicPractice_1 = require("@/modules/history/modules/practice/HistoryTopicPractice");
const params = typebox_1.Type.Object({
    topicId: typebox_1.Type.String(),
});
// const schema: FastifySchema = {
//   params: {
//     topicId: {
//       type: 'string'
//     }
//   },
//   response: {
//     200: {
//       type: 'string',
//     },
//   },
// };
const schema = { params };
async function practice(fastify) {
    fastify.decorate('historyTopicPracticeService', new HistoryTopicPractice_1.HistoryTopicPractice(fastify));
    fastify.get('/practice/:topicId', { schema }, async (req, res) => {
        const questions = await fastify.historyTopicPractice.getQuestions({
            userId: fastify.user.id,
            topicId: Number(req.params.topicId),
        });
        return JSON.stringify(questions);
    });
    fastify.post('/practice', { schema }, async (req, res) => {
        console.log(req.body);
        return JSON.stringify(req.user);
    });
}
exports.practice = practice;
