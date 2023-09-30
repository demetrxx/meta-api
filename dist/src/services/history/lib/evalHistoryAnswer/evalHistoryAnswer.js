"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalHistoryAnswer = void 0;
const client_1 = require("@prisma/client");
const http_errors_1 = __importDefault(require("http-errors"));
const errMsg_1 = require("@/shared/consts/errMsg");
function evalSingle({ correct, given }) {
    const res = correct === given;
    return { isValid: res, score: Number(res) };
}
function evalOrder({ correct, given }) {
    const givenArr = JSON.parse(given);
    const correctArr = JSON.parse(correct);
    if (!Array.isArray(givenArr) || givenArr.length !== 4) {
        throw http_errors_1.default.BadRequest(errMsg_1.errMsg.invalidMatchQInput);
    }
    if (correctArr.every((i, idx) => i === givenArr[idx])) {
        return { isValid: true, score: 3 };
    }
    if (correctArr[0] === givenArr[0] && correctArr[3] === givenArr[3]) {
        return { isValid: false, score: 2 };
    }
    if (correctArr[0] === givenArr[0] || correctArr[3] === givenArr[3]) {
        return { isValid: false, score: 1 };
    }
    return { isValid: false, score: 0 };
}
function evalMatch({ correct, given }) {
    const givenArr = JSON.parse(given);
    const correctArr = JSON.parse(correct);
    if (!Array.isArray(givenArr) || givenArr.length !== 4) {
        throw http_errors_1.default.BadRequest(errMsg_1.errMsg.invalidMatchQInput);
    }
    const score = correctArr.filter((i, idx) => i === givenArr[idx]).length;
    const isValid = score === 4;
    return { score, isValid };
}
function evalSelect({ correct, given }) {
    const correctArr = JSON.parse(correct);
    const givenArr = JSON.parse(given);
    if (!Array.isArray(givenArr) || givenArr.length !== 3) {
        throw http_errors_1.default.BadRequest(errMsg_1.errMsg.invalidMatchQInput);
    }
    let score = 0;
    correctArr.forEach((i) => {
        if (givenArr.includes(i)) {
            score += 1;
        }
    });
    const isValid = score === 3;
    return { score, isValid };
}
const handlerMap = {
    [client_1.HistoryQuestionType.SINGLE]: evalSingle,
    [client_1.HistoryQuestionType.ORDER]: evalOrder,
    [client_1.HistoryQuestionType.MATCH]: evalMatch,
    [client_1.HistoryQuestionType.SELECT]: evalSelect,
};
function evalHistoryAnswer(input) {
    return handlerMap[input.type](input);
}
exports.evalHistoryAnswer = evalHistoryAnswer;
