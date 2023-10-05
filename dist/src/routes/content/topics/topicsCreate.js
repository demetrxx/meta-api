"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topicsCreate = void 0;
const typebox_1 = require("@sinclair/typebox");
const topic_1 = require("@/modules/history/typebox/topic");
const body = topic_1.TBHistoryTopicInput;
const response = { '2xx': typebox_1.Type.Object({ id: typebox_1.Type.Number() }) };
const schema = { body, response };
async function topicsCreate(fastify) {
    fastify.post('/topics', { schema }, async (req, res) => {
        const result = await fastify.historyContent.createTopic(req.body);
        res.status(201);
        return result;
    });
}
exports.topicsCreate = topicsCreate;
