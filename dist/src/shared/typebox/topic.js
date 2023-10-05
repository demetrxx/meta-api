"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TBHistoryTopicOutput = exports.TBHistoryTopicInput = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.TBHistoryTopicInput = typebox_1.Type.Object({
    name: typebox_1.Type.String(),
    desc: typebox_1.Type.Optional(typebox_1.Type.String()),
    order: typebox_1.Type.Number(),
});
exports.TBHistoryTopicOutput = typebox_1.Type.Object({
    id: typebox_1.Type.Number(),
    name: typebox_1.Type.String(),
    desc: typebox_1.Type.Optional(typebox_1.Type.String()),
    order: typebox_1.Type.Number(),
});
