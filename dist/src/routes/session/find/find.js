"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.find = void 0;
const typebox_1 = require("@sinclair/typebox");
const params = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
});
const schema = {
    params,
};
async function find(fastify) {
    fastify.get('/:id', { schema }, async (req) => {
        await fastify.historySession.getById(Number(req.params.id), { userId: fastify.user.id });
        return { id: Number(req.params.id) };
    });
}
exports.find = find;
