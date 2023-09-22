"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const typebox_1 = require("@sinclair/typebox");
const body = typebox_1.Type.Strict(typebox_1.Type.Object({
    email: typebox_1.Type.String(),
    password: typebox_1.Type.String(),
}));
// const response = Type.Object({
//   200: Type.Any(),
//   401: Type.Object({}),
// });
const schema = { body };
async function register(fastify) {
    fastify.post('/register', { schema }, async (req, res) => {
        // const { email, password } = req.body;
        await fastify.prisma.user.create({ data: req.body });
        // TODO: validate password
        return req.body;
    });
}
exports.register = register;
