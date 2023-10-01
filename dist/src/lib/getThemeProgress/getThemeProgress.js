"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThemeProgress = void 0;
const GOAL = 50;
const FAILED_SHARE_RATIO = 0.5;
function getThemeProgress({ answered, failed, }) {
    let goalShare = answered / GOAL;
    if (goalShare > 1)
        goalShare = 1;
    let failedShare = (failed / GOAL) * FAILED_SHARE_RATIO;
    if (failedShare > goalShare)
        failedShare = goalShare;
    return Math.round((goalShare - failedShare) * 100);
}
exports.getThemeProgress = getThemeProgress;
