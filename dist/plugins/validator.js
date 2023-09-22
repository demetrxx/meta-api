"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorPlugin = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const ajv_1 = __importDefault(require("ajv"));
exports.validatorPlugin = (0, fastify_plugin_1.default)(async (server) => {
    const ajv = new ajv_1.default({ removeAdditional: 'all' });
    server.setValidatorCompiler(({ schema }) => ajv.compile(schema));
});
