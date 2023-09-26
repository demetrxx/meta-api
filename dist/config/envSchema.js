"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const env_schema_1 = __importDefault(require("env-schema"));
const schema = typebox_1.Type.Object({
    PORT: typebox_1.Type.Number(),
    NODE_ENV: typebox_1.Type.Union([typebox_1.Type.Literal('production'), typebox_1.Type.Literal('development')]),
    JWT_SECRET_ACCESS: typebox_1.Type.String(),
    JWT_SECRET_REFRESH: typebox_1.Type.String(),
    CLIENT_URL: typebox_1.Type.String(),
    API_URL: typebox_1.Type.String(),
    GOOGLE_SECRET: typebox_1.Type.String(),
    GOOGLE_ID: typebox_1.Type.String(),
    GOOGLE_CLIENT_REDIRECT_PATH: typebox_1.Type.String(),
});
exports.envSchema = (0, env_schema_1.default)({
    schema,
    dotenv: true,
});
