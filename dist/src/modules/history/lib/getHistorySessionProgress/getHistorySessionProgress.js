"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistorySessionProgress = exports.GOAL_COMPLETE_SESSIONS = exports.ANALYSE_SESSIONS_NUM = void 0;
const common_1 = require("../../consts/common");
exports.ANALYSE_SESSIONS_NUM = 10;
exports.GOAL_COMPLETE_SESSIONS = 30;
function getHistorySessionProgress(completeSessions) {
    const doneCount = completeSessions.length;
    const doneShare = doneCount / exports.GOAL_COMPLETE_SESSIONS;
    const lastAvgScore = completeSessions
        .slice(0, exports.ANALYSE_SESSIONS_NUM)
        .reduce((acc, { score }) => acc + (score ?? 0), 0) / exports.ANALYSE_SESSIONS_NUM;
    const scoreShare = lastAvgScore / common_1.HISTORY_MAX_SCORE;
    return Math.round(((doneShare + scoreShare) / 2) * 100);
}
exports.getHistorySessionProgress = getHistorySessionProgress;
