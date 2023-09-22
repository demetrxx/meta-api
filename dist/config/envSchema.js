"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const fluent_json_schema_1 = __importDefault(require("fluent-json-schema"));
const env_schema_1 = __importDefault(require("env-schema"));
const schema = fluent_json_schema_1.default.object()
    .prop('PORT', fluent_json_schema_1.default.number().required())
    .prop('NODE_ENV', fluent_json_schema_1.default.enum(['production', 'development']).required())
    .prop('JWT_SECRET', fluent_json_schema_1.default.string().required());
exports.envSchema = (0, env_schema_1.default)({
    schema: schema,
    dotenv: true,
});
