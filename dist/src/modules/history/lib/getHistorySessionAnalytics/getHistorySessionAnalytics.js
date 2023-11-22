"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistorySessionAnalytics = void 0;
const lib_1 = require("../../lib");
const scoreToRate = {
    '0': 0,
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '7': 0,
    '8': 0,
    '9': 0,
    '10': 0,
    '11': 0,
    '12': 0,
    '13': 0,
    '14': 0,
    '15': 0,
    '16': 0,
    '17': 0,
    '18': 0,
    '19': 0,
    '20': 0,
    '21': 0,
    '22': 0,
    '23': 0,
    '24': 0,
    '25': 0,
    '26': 0,
    '27': 100,
    '28': 103,
    '29': 106,
    '30': 109,
    '31': 112,
    '32': 115,
    '33': 118,
    '34': 121,
    '35': 124,
    '36': 127,
    '37': 129,
    '38': 132,
    '39': 134,
    '40': 137,
    '41': 139,
    '42': 141,
    '43': 143,
    '44': 145,
    '45': 147,
    '46': 148,
    '47': 150,
    '48': 152,
    '49': 153,
    '50': 155,
    '51': 156,
    '52': 157,
    '53': 159,
    '54': 160,
    '55': 161,
    '56': 163,
    '57': 164,
    '58': 165,
    '59': 166,
    '60': 167,
    '61': 169,
    '62': 170,
    '63': 171,
    '64': 172,
    '65': 173,
    '66': 174,
    '67': 175,
    '68': 176,
    '69': 177,
    '70': 178,
    '71': 179,
    '72': 180,
    '73': 181,
    '74': 182,
    '75': 183,
    '76': 184,
    '77': 185,
    '78': 186,
    '79': 187,
    '80': 188,
    '81': 189,
    '82': 190,
    '83': 191,
    '84': 192,
    '85': 192.5,
    '86': 193,
    '87': 194,
    '88': 195,
    '89': 196,
    '90': 197,
    '91': 198,
    '92': 198.5,
    '93': 199,
    '94': 200,
};
function getHistoryRateFromScore2021(score) {
    return scoreToRate[score];
}
function getHistorySessionAnalytics(questions, answers) {
    const answered = [];
    const failed = [];
    let totalScore = 0;
    for (const { id, correct, type } of questions) {
        if (!answers[id]) {
            continue;
        }
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
