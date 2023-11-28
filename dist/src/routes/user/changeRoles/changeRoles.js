"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeRoles = void 0;
const typebox_1 = require("@sinclair/typebox");
const params = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
});
const body = typebox_1.Type.Object({
    roles: typebox_1.Type.Array(typebox_1.Type.Union([typebox_1.Type.Literal('USER'), typebox_1.Type.Literal('ADMIN'), typebox_1.Type.Literal('OWNER')])),
});
const schema = { params, body };
async function changeRoles(fastify) {
    fastify.addHook('onRequest', fastify.verifyOwner);
    fastify.patch('/roles/:id', { schema }, async (req, res) => {
        await fastify.userService.changeRoles(Number(req.params.id), req.body.roles);
        return { id: req.params.id };
    });
}
exports.changeRoles = changeRoles;
