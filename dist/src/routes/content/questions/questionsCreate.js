"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionsCreate = void 0;
const typebox_1 = require("@sinclair/typebox");
const question_1 = require("@/modules/history/typebox/question");
const body = question_1.TBHistoryQuestionInput;
const response = { '2xx': typebox_1.Type.Object({ id: typebox_1.Type.Number() }) };
const schema = { body, response };
async function questionsCreate(fastify) {
    fastify.post('/questions', { schema }, async (req, res) => {
        const result = await fastify.historyContent.createQuestion({
            ...req.body,
            topic: { connect: { id: req.body.topicId } },
            keyWords: { connect: req.body.keyWords },
        });
        res.status(201);
        return result;
    });
}
exports.questionsCreate = questionsCreate;
