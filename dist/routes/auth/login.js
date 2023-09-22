"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
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
async function login(fastify) {
    fastify.post('/login', { schema }, async (req, res) => {
        const { email } = req.body;
        const user = await fastify.prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401);
            throw new Error('unauthorized');
        }
        // TODO: validate password
        // if (false) {
        //   res.status(401).send();
        //   return;
        // }
        return user;
    });
}
exports.login = login;
