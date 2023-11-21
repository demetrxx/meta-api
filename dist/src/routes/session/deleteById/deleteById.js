"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteById = void 0;
const typebox_1 = require("@sinclair/typebox");
const params = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
});
const schema = {
    params,
    response: { '2xx': typebox_1.Type.Object({ id: typebox_1.Type.Number() }) },
};
async function deleteById(fastify) {
    fastify.delete('/:id', { schema }, async (req, res) => {
        await fastify.historySession.deleteById(Number(req.params.id), { userId: req.user.id });
        return { id: Number(req.params.id) };
    });
}
exports.deleteById = deleteById;
