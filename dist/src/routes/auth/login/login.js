"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const typebox_1 = require("@sinclair/typebox");
const http_errors_1 = __importDefault(require("http-errors"));
const lib_1 = require("@/lib");
const body = typebox_1.Type.Strict(typebox_1.Type.Object({
    email: typebox_1.Type.String(),
    password: typebox_1.Type.String(),
}));
const response = {
    200: typebox_1.Type.Object({
        accessToken: typebox_1.Type.String(),
        refreshToken: typebox_1.Type.String(),
    }),
};
const schema = { body, response };
async function login(fastify) {
    fastify.post('/login', { schema }, async (req, res) => {
        const { email, password } = req.body;
        const user = await fastify.prisma.user.findUnique({
            where: { email },
            select: { id: true, roles: true, password: true },
        });
        if (!user) {
            throw new http_errors_1.default.Unauthorized('Invalid email.');
        }
        const isPasswordValid = await (0, lib_1.validatePassword)(password, user.password);
        if (!isPasswordValid) {
            throw new http_errors_1.default.Unauthorized('Invalid password.');
        }
        const tokenData = { id: user.id, roles: user.roles };
        const accessToken = fastify.generateAccessToken(tokenData);
        const refreshToken = fastify.generateRefreshToken(tokenData);
        return { accessToken, refreshToken };
    });
}
exports.login = login;
