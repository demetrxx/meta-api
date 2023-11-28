"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByEmail = void 0;
const typebox_1 = require("@sinclair/typebox");
const querystring = typebox_1.Type.Object({
    email: typebox_1.Type.String(),
});
const schema = {
    querystring,
};
async function getByEmail(fastify) {
    fastify.get('/unique', { schema }, async (req, res) => {
        return await fastify.userService.getByEmail(req.query.email);
    });
}
exports.getByEmail = getByEmail;
