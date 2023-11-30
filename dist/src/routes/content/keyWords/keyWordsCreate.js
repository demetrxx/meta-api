"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyWordsCreate = void 0;
const typebox_1 = require("@sinclair/typebox");
const keyWord_1 = require("@/modules/history/typebox/keyWord");
const body = keyWord_1.TBHistoryKeyWordInput;
const response = { '2xx': typebox_1.Type.Object({ id: typebox_1.Type.Number() }) };
const schema = { body, response };
async function keyWordsCreate(fastify) {
    fastify.post('/keywords', { schema }, async (req, res) => {
        const result = await fastify.historyContent.createKeyWord({
            ...req.body,
            topic: { connect: { id: req.body.topicId } },
        });
        res.status(201);
        return result;
    });
}
exports.keyWordsCreate = keyWordsCreate;
