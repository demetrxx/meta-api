"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TBHistoryQuestionOutput = exports.TBHistoryQuestionInput = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.TBHistoryQuestionInput = typebox_1.Type.Object({
    name: typebox_1.Type.String(),
    type: typebox_1.Type.Union([typebox_1.Type.Literal('SINGLE'), typebox_1.Type.Literal('ORDER'), typebox_1.Type.Literal('MATCH'), typebox_1.Type.Literal('SELECT')]),
    order: typebox_1.Type.Optional(typebox_1.Type.Number()),
    options: typebox_1.Type.Array(typebox_1.Type.Any()),
    correct: typebox_1.Type.Array(typebox_1.Type.Number()),
    topics: typebox_1.Type.Array(typebox_1.Type.Number()),
    keyWords: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Object({ id: typebox_1.Type.Number() }))),
    solution: typebox_1.Type.Optional(typebox_1.Type.String()),
    whereToLearn: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    advice: typebox_1.Type.Optional(typebox_1.Type.String()),
});
exports.TBHistoryQuestionOutput = typebox_1.Type.Object({
    id: typebox_1.Type.Number(),
    name: typebox_1.Type.String(),
    type: typebox_1.Type.String(),
    order: typebox_1.Type.Optional(typebox_1.Type.Number()),
    options: typebox_1.Type.Array(typebox_1.Type.Any()),
    correct: typebox_1.Type.Array(typebox_1.Type.Number()),
    topics: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Number())),
    keyWords: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Object({ id: typebox_1.Type.Number(), value: typebox_1.Type.String() }))),
    solution: typebox_1.Type.Optional(typebox_1.Type.String()),
    whereToLearn: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    advice: typebox_1.Type.Optional(typebox_1.Type.String()),
});
