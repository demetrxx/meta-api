"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ping = void 0;
const fluent_json_schema_1 = __importDefault(require("fluent-json-schema"));
const body = fluent_json_schema_1.default.object()
    .prop('username', fluent_json_schema_1.default.string().required())
    .prop('password', fluent_json_schema_1.default.string().required())
    .valueOf();
const schema = {
    response: {
        200: {
            type: 'string',
        },
    },
    body,
    // body: {
    //   type: 'object',
    //   required: [],
    //   properties: {
    //     hey: { type: 'boolean' },
    //     hoe: { type: 'string' },
    //   },
    // },
};
async function ping(fastify) {
    fastify.post('/ping', { schema }, async (req, res) => {
        console.log(req.body);
        res.status(200).send(JSON.stringify(req.user));
    });
}
exports.ping = ping;
