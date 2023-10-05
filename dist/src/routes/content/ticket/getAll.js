"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const typebox_1 = require("@sinclair/typebox");
const topic_1 = require("@/shared/typebox/topics");
const schema = {
    response: { '2xx': typebox_1.Type.Array(topic_1.TBHistoryTopicOutput) },
};
async function update(fastify) {
    fastify.get('/tickets', { schema }, async () => {
        return await fastify.historyContent.getAllTickets();
    });
}
exports.update = update;
