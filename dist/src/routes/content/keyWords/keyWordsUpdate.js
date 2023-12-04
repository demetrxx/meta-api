"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyWordsUpdate = void 0;
const typebox_1 = require("@sinclair/typebox");
const keyWord_1 = require("../../../modules/history/typebox/keyWord");
const params = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
});
const body = typebox_1.Type.Partial(keyWord_1.TBHistoryKeyWordInput);
const schema = {
    body,
    params,
    response: { '2xx': typebox_1.Type.Object({ id: typebox_1.Type.Number() }) },
};
async function keyWordsUpdate(fastify) {
    fastify.patch('/keywords/:id', { schema }, async (req) => {
        await fastify.historyContent.updateKeyWord(Number(req.params.id), req.body);
        return { id: Number(req.params.id) };
    });
}
exports.keyWordsUpdate = keyWordsUpdate;
