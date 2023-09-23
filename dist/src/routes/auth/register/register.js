"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const typebox_1 = require("@sinclair/typebox");
const http_errors_1 = __importDefault(require("http-errors"));
const lib_1 = require("@/lib");
const body = typebox_1.Type.Strict(typebox_1.Type.Object({
    email: typebox_1.Type.String(),
    password: typebox_1.Type.String(),
}));
const response = {
    200: typebox_1.Type.Object({}),
};
const schema = { body, response };
async function register(fastify) {
    fastify.post('/register', { schema }, async (req, res) => {
        const { email, password } = req.body;
        const user = await fastify.prisma.user.findUnique({ where: { email } });
        if (user) {
            return new http_errors_1.default.Conflict('Email is already taken.');
        }
        const hashedPassword = await (0, lib_1.hashPassword)(password);
        await fastify.prisma.user.create({ data: { email, password: hashedPassword } });
        return req.body;
    });
}
exports.register = register;
