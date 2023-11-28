"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteById = void 0;
const typebox_1 = require("@sinclair/typebox");
const params = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
});
const schema = { params };
async function deleteById(fastify) {
    fastify.addHook('onRequest', fastify.verifyOwner);
    fastify.delete('/:id', { schema }, async (req, res) => {
        await fastify.userService.deleteById(Number(req.params.id));
        return { id: req.params.id };
    });
}
exports.deleteById = deleteById;
