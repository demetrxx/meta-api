"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topicsUpdate = void 0;
const typebox_1 = require("@sinclair/typebox");
const topic_1 = require("../../../modules/history/typebox/topic");
const params = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
});
const body = typebox_1.Type.Partial(topic_1.TBHistoryTopicInput);
const schema = {
    body,
    params,
    response: { '2xx': typebox_1.Type.Object({ id: typebox_1.Type.Number() }) },
};
async function topicsUpdate(fastify) {
    fastify.patch('/topics/:id', { schema }, async (req) => {
        await fastify.historyContent.updateTopic(Number(req.params.id), req.body);
        return { id: Number(req.params.id) };
    });
}
exports.topicsUpdate = topicsUpdate;
