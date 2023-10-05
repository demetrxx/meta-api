"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TBHistoryKeyWordOutput = exports.TBHistoryKeyWordInput = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.TBHistoryKeyWordInput = typebox_1.Type.Object({
    name: typebox_1.Type.String(),
    topicId: typebox_1.Type.Number(),
});
exports.TBHistoryKeyWordOutput = typebox_1.Type.Object({
    id: typebox_1.Type.Number(),
    name: typebox_1.Type.String(),
    topicId: typebox_1.Type.Number(),
});
