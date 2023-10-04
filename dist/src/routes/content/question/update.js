"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const typebox_1 = require("@sinclair/typebox");
const question_1 = require("@/shared/typebox/question");
const params = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
});
const body = typebox_1.Type.Partial(question_1.TBHistoryQuestionInput);
const schema = {
    body,
    params,
    response: { '2xx': typebox_1.Type.Object({ id: typebox_1.Type.Number() }) },
};
async function update(fastify) {
    fastify.patch('/question/:id', { schema }, async (req, res) => {
        return await fastify.historyContent.updateQuestion(Number(req.params.id), {
            ...req.body,
            topic: { connect: { id: req.body.topicId } },
            keyWords: { connect: req.body.keyWords },
        });
    });
}
exports.update = update;
