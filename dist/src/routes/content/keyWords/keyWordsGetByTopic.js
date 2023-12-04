"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyWordsGetByTopic = void 0;
const typebox_1 = require("@sinclair/typebox");
const keyWord_1 = require("../../../modules/history/typebox/keyWord");
const querystring = typebox_1.Type.Object({
    topicId: typebox_1.Type.String(),
});
const schema = {
    querystring,
    response: { '2xx': typebox_1.Type.Array(keyWord_1.TBHistoryKeyWordOutput) },
};
async function keyWordsGetByTopic(fastify) {
    fastify.get('/keywords', { schema }, async (req) => {
        return await fastify.historyContent.getKeyWordsByTopic(Number(req.query.topicId));
    });
}
exports.keyWordsGetByTopic = keyWordsGetByTopic;
