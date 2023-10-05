"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const typebox_1 = require("@sinclair/typebox");
const topic_1 = require("@/shared/typebox/topics");
const params = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
});
const body = typebox_1.Type.Partial(topic_1.TBHistoryTopicInput);
const schema = {
    body,
    params,
    response: { '2xx': typebox_1.Type.Object({ id: typebox_1.Type.Number() }) },
};
async function update(fastify) {
    fastify.patch('/topics/:id', { schema }, async (req) => {
        await fastify.historyContent.updateTopic(Number(req.params.id), req.body);
        return { id: Number(req.params.id) };
    });
}
exports.update = update;
