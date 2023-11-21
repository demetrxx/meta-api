"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordAnswer = void 0;
const typebox_1 = require("@sinclair/typebox");
const body = typebox_1.Type.Record(typebox_1.Type.Number(), typebox_1.Type.Array(typebox_1.Type.Number()));
const schema = { body };
async function recordAnswer(fastify) {
    fastify.patch('/', { schema }, async (req) => {
        return await fastify.historySession.recordAnswer({
            userId: req.user.id,
            answers: req.body,
        });
    });
}
exports.recordAnswer = recordAnswer;
