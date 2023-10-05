"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TBHistoryTicketOutput = exports.TBHistoryTicketInput = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.TBHistoryTicketInput = typebox_1.Type.Object({
    questions: typebox_1.Type.Array(typebox_1.Type.Object({ id: typebox_1.Type.Number() })),
    meta: typebox_1.Type.Object({
        year: typebox_1.Type.Number(),
        type: typebox_1.Type.Union([typebox_1.Type.Literal('MAIN'), typebox_1.Type.Literal('ADDITIONAL'), typebox_1.Type.Literal('TEST')]),
    }),
});
exports.TBHistoryTicketOutput = typebox_1.Type.Object({
    id: typebox_1.Type.Number(),
    questions: typebox_1.Type.Array(typebox_1.Type.Object({ id: typebox_1.Type.Number() })),
    meta: typebox_1.Type.Object({
        year: typebox_1.Type.Number(),
        type: typebox_1.Type.Union([typebox_1.Type.Literal('MAIN'), typebox_1.Type.Literal('ADDITIONAL'), typebox_1.Type.Literal('TEST')]),
    }),
});
