"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.practiceRoutes = void 0;
const history_1 = require("@/modules/history");
const system_1 = require("@/shared/system");
const getQuestions_1 = require("./getQuestions/getQuestions");
const recordAnswer_1 = require("./recordAnswer/recordAnswer");
exports.practiceRoutes = (0, system_1.loadRoutes)({
    routes: [getQuestions_1.getQuestions, recordAnswer_1.recordAnswer],
    opts: { prefix: '/practice' },
    decorators: {
        historyTopicPractice: (fastify) => new history_1.HistoryTopicPractice(fastify),
    },
});
