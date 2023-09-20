"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const fluent_json_schema_1 = __importDefault(require("fluent-json-schema"));
const body = fluent_json_schema_1.default.object()
    .prop('username', fluent_json_schema_1.default.string().required())
    .prop('password', fluent_json_schema_1.default.string().required())
    .valueOf();
// interface IQuerystring {
//   username: string;
//   password: string;
// }
//
// interface IHeaders {
//   'h-Custom': string;
// }
// interface IReply {
//   200: { success: boolean };
//   302: { url: string };
//   '4xx': { error: string };
// }
async function auth(fastify) {
    fastify.post('/auth', {
        schema: { body },
        // preValidation: (req, res, done) => {
        //   const { username } = req.query;
        //   done(username !== 'admin' ? new Error('Must be admin') : undefined);
        // },
    }, async (req, res) => {
        // const customerHeader = req.headers['h-Custom'];
        const token = fastify.jwt.sign(req.body);
        // res.code(200).send({ success: true });
        // res.code(404).send({error: 'Not found'});
        return { token };
    });
}
exports.auth = auth;
