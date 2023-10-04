"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questions = void 0;
const question_1 = require("@/shared/typebox/question");
const body = question_1.TBHistoryQuestionInput;
const schema = { body };
async function questions(fastify) {
    fastify.post('/question', { schema }, async (req, res) => {
        await fastify.historyContent.createQuestion({
            ...req.body,
            topic: { connect: { id: req.body.topicId } },
            keyWords: { connect: req.body.keyWords },
        });
        return await res.status(201).send();
    });
}
exports.questions = questions;
