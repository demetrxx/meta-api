"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistorySessionAnalytics = void 0;
const lib_1 = require("../../lib");
function getHistoryRateFromScore2021(score) {
    if (score >= 25 && score <= 48) {
        return 100 + (score - 25) * 3;
    }
    else if (score >= 49 && score <= 72) {
        return 153 + (score - 49) * 2;
    }
    else if (score >= 73 && score <= 94) {
        if (score === 85) {
            return 192.5;
        }
        else if (score === 92) {
            return 198.5;
        }
        else {
            return 181 + (score - 73);
        }
    }
    else {
        return 0;
    }
}
function getHistorySessionAnalytics(questions, answers) {
    const answered = [];
    const failed = [];
    let totalScore = 0;
    for (const { id, correct, type } of questions) {
        const { isValid, score } = (0, lib_1.evalHistoryAnswer)({
            type,
            correct,
            given: answers[id],
        });
        totalScore += score;
        if (isValid) {
            answered.push(id);
        }
        else {
            failed.push(id);
        }
    }
    const rate = getHistoryRateFromScore2021(totalScore);
    return {
        rate,
        answered,
        failed,
        score: totalScore,
    };
}
exports.getHistorySessionAnalytics = getHistorySessionAnalytics;
