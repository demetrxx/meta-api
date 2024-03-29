"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topicsGetAll = void 0;
const typebox_1 = require("@sinclair/typebox");
const topic_1 = require("../../../modules/history/typebox/topic");
const schema = {
    response: { '2xx': typebox_1.Type.Array(topic_1.TBHistoryTopicOutput) },
};
async function topicsGetAll(fastify) {
    fastify.get('/topics', { schema }, async () => {
        return await fastify.historyContent.getAllTopics();
    });
}
exports.topicsGetAll = topicsGetAll;
