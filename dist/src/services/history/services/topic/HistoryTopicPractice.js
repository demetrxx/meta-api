"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryTopicPractice = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const lib_1 = require("@/lib");
const errMsg_1 = require("@/shared/consts/errMsg");
const lib_2 = require("@/shared/lib");
const evalHistoryAnswer_1 = require("../../lib/evalHistoryAnswer/evalHistoryAnswer");
class HistoryTopicPractice {
    db;
    constructor(app) {
        this.db = app.prisma;
    }
    async recordAnswer({ given, questionId, profileId, }) {
        const question = await this.db.historyQuestion.findUnique({ where: { id: questionId } });
        if (!question) {
            throw new http_errors_1.default.BadRequest(errMsg_1.errMsg.invalidQuestionId);
        }
        const { type, correct, topicId } = question;
        const { isValid } = (0, evalHistoryAnswer_1.evalHistoryAnswer)({ given, type, correct });
        const answeredOrFailed = isValid ? 'answered' : 'failed';
        const { _count } = await this.db.historyProfile.update({
            where: { id: profileId },
            data: {
                seen: { connect: { id: questionId } },
                [answeredOrFailed]: { connect: { id: questionId } },
            },
            select: {
                _count: { select: { answered: true, failed: true } },
                // progresses: { where: { topicId }, select: { id: true } },
            },
        });
        await this.updateTopicProgress({
            topicId,
            profileId,
            failedCount: _count.failed,
            answeredCount: _count.answered,
        });
    }
    async getQuestions({ topicId, profileId, }) {
        const QS_NUM = 10;
        const profile = await this.db.historyProfile.findUnique({
            where: { id: profileId },
            select: { seen: { select: { id: true } }, failed: { select: { id: true } } },
        });
        if (!profile) {
            throw http_errors_1.default.InternalServerError('History profile not found.');
        }
        const questions = [];
        // Get unseen
        const unseenQs = await this.db.historyQuestion.findMany({
            where: {
                topic: { id: topicId },
                id: { notIn: (0, lib_2.getIdsArr)(profile.seen) },
            },
            take: QS_NUM,
        });
        questions.push(...unseenQs);
        // Seen all, get failed ones
        if (questions.length < QS_NUM) {
            const failedQs = await this.db.historyQuestion.findMany({
                where: {
                    topic: { id: topicId },
                    id: { in: (0, lib_2.getIdsArr)(profile.failed) },
                },
                take: QS_NUM - questions.length,
            });
            questions.push(...failedQs);
        }
        // We've got a champ out here, reset seen qs
        if (questions.length < QS_NUM) {
            const extraQs = await this.db.historyQuestion.findMany({
                where: {
                    topic: { id: topicId },
                    id: { notIn: (0, lib_2.getIdsArr)(profile.failed) },
                },
                take: QS_NUM - questions.length,
            });
            extraQs.push(...extraQs);
            await this.db.historyProfile.update({
                where: { id: profileId },
                data: { seen: { set: extraQs.map(({ id }) => ({ id })) } },
            });
        }
        return questions;
    }
    async updateTopicProgress({ topicId, profileId, answeredCount, failedCount, }) {
        const progress = (0, lib_1.getThemeProgress)({ answered: answeredCount, failed: failedCount });
        await this.db.historyProgress.update({
            where: {
                topicId_profileId: {
                    topicId,
                    profileId,
                },
            },
            data: { value: progress },
        });
    }
}
exports.HistoryTopicPractice = HistoryTopicPractice;
