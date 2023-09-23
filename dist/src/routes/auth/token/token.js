"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
const typebox_1 = require("@sinclair/typebox");
const http_errors_1 = __importDefault(require("http-errors"));
const body = typebox_1.Type.Strict(typebox_1.Type.Object({
    refreshToken: typebox_1.Type.String(),
}));
const response = {
    200: typebox_1.Type.Object({
        accessToken: typebox_1.Type.String(),
    }),
};
const schema = { body, response };
async function token(fastify) {
    fastify.post('/token', { schema }, async (req, res) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new http_errors_1.default.Unauthorized('Provide your refresh token.');
        }
        let id;
        try {
            const data = fastify.jwt.refresh.verify(refreshToken);
            id = data.id;
        }
        catch (err) {
            throw new http_errors_1.default.Unauthorized(err.message);
        }
        if (!id) {
            throw new http_errors_1.default.Unauthorized('Invalid token.');
        }
        const user = await fastify.prisma.user.findUnique({
            where: { id },
            select: { id: true, roles: true },
        });
        if (!user) {
            throw new http_errors_1.default.Unauthorized('Invalid token');
        }
        const accessToken = fastify.generateAccessToken(user);
        return { accessToken, refreshToken };
    });
}
exports.token = token;
