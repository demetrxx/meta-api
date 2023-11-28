"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeStatus = void 0;
const typebox_1 = require("@sinclair/typebox");
const params = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
});
const body = typebox_1.Type.Object({
    status: typebox_1.Type.Union([typebox_1.Type.Literal('active'), typebox_1.Type.Literal('blocked')]),
});
const schema = { params, body };
async function changeStatus(fastify) {
    fastify.patch('/status/:id', { schema }, async (req, res) => {
        await fastify.userService.changeStatus(Number(req.params.id), req.body.status);
        return { id: req.params.id };
    });
}
exports.changeStatus = changeStatus;
