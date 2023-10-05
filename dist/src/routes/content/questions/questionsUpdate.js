"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionsUpdate = void 0;
const typebox_1 = require("@sinclair/typebox");
const question_1 = require("@/modules/history/typebox/question");
const params = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
});
const body = typebox_1.Type.Partial(question_1.TBHistoryQuestionInput);
const schema = {
    body,
    params,
    response: { '2xx': typebox_1.Type.Object({ id: typebox_1.Type.Number() }) },
};
async function questionsUpdate(fastify) {
    fastify.patch('/questions/:id', { schema }, async (req, res) => {
        return await fastify.historyContent.updateQuestion(Number(req.params.id), {
            ...req.body,
            topic: { connect: { id: req.body.topicId } },
            keyWords: { set: req.body.keyWords },
        });
    });
}
exports.questionsUpdate = questionsUpdate;
