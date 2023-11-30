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
    if (!Array.isArray(correct) || correct.length !== 1) {
        throw http_errors_1.default.InternalServerError(errMsg_1.errMsg.invalidQuestionData);
    }
    if (!Array.isArray(given) || given.length !== 1) {
        throw http_errors_1.default.BadRequest(errMsg_1.errMsg.invalidQInput);
    }
    const res = correct[0] === given[0];
    return { isValid: res, score: Number(res) };
}
function evalOrder({ correct, given }) {
    if (!Array.isArray(correct)) {
        throw http_errors_1.default.InternalServerError(errMsg_1.errMsg.invalidQuestionData);
    }
    if (!Array.isArray(given) || given.length !== 4) {
        throw http_errors_1.default.BadRequest(errMsg_1.errMsg.invalidQInput);
    }
    if (correct.every((i, idx) => i === given[idx])) {
        return { isValid: true, score: 3 };
    }
    if (correct[0] === given[0] && correct[3] === given[3]) {
        return { isValid: false, score: 2 };
    }
    if (correct[0] === given[0] || correct[3] === given[3]) {
        return { isValid: false, score: 1 };
    }
    return { isValid: false, score: 0 };
}
function evalMatch({ correct, given }) {
    if (!Array.isArray(correct)) {
        throw http_errors_1.default.InternalServerError(errMsg_1.errMsg.invalidQuestionData);
    }
    if (!Array.isArray(given) || given.length !== 4) {
        throw http_errors_1.default.BadRequest(errMsg_1.errMsg.invalidQInput);
    }
    const score = correct.filter((i, idx) => i === given[idx]).length;
    const isValid = score === 4;
    return { score, isValid };
}
function evalSelect({ correct, given }) {
    if (!Array.isArray(correct)) {
        throw http_errors_1.default.InternalServerError(errMsg_1.errMsg.invalidQuestionData);
    }
    if (!Array.isArray(given) || given.length !== 3) {
        throw http_errors_1.default.BadRequest(errMsg_1.errMsg.invalidQInput);
    }
    let score = 0;
    correct.forEach((i) => {
        if (given.includes(i)) {
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
