"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TBHistoryTicketOutput = exports.TBHistoryTicketUpdateInput = exports.TBHistoryTicketInput = void 0;
const typebox_1 = require("@sinclair/typebox");
const question_1 = require("@/modules/history/typebox/question");
const types = ['MAIN', 'ADDITIONAL', 'TEST', 'FIRST', 'SECOND', 'DEMO'];
const type = typebox_1.Type.Union(types.map((i) => typebox_1.Type.Literal(i)));
exports.TBHistoryTicketInput = typebox_1.Type.Object({
    questions: typebox_1.Type.Array(question_1.TBHistoryQuestionInput),
    year: typebox_1.Type.Number(),
    type,
});
exports.TBHistoryTicketUpdateInput = typebox_1.Type.Object({
    questions: typebox_1.Type.Array(typebox_1.Type.Object({ id: typebox_1.Type.Number() })),
    year: typebox_1.Type.Number(),
    type,
});
exports.TBHistoryTicketOutput = typebox_1.Type.Object({
    id: typebox_1.Type.Number(),
    questions: typebox_1.Type.Array(question_1.TBHistoryQuestionOutput),
    year: typebox_1.Type.Number(),
    type,
});
