"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryTopicPractice = exports.HISTORY_QUESTIONS_COUNT = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const lib_1 = require("@/lib");
const errMsg_1 = require("@/shared/consts/errMsg");
const lib_2 = require("@/shared/lib");
const common_1 = require("../../consts/common");
const lib_3 = require("../../lib");
exports.HISTORY_QUESTIONS_COUNT = 10;
class HistoryTopicPractice {
    db;
    constructor(app) {
        this.db = app.prisma;
    }
    async recordAnswer({ given, questionId, userId, }) {
        const question = await this.db.historyQuestion.findUnique({ where: { id: questionId } });
        if (!question) {
            throw new http_errors_1.default.BadRequest(errMsg_1.errMsg.invalidQuestionId);
        }
        const { type, correct, topicId } = question;
        const { isValid } = (0, lib_3.evalHistoryAnswer)({ given, type, correct });
        const answeredOrFailed = isValid ? 'answered' : 'failed';
        const { _count, id: profileId } = await this.db.historyProfile.update({
            where: { userId },
            data: {
                seen: { connect: { id: questionId } },
                [answeredOrFailed]: { connect: { id: questionId } },
            },
            select: {
                _count: { select: { answered: true, failed: true } },
                id: true,
            },
        });
        await this.updateTopicProgress({
            topicId,
            profileId,
            failedCount: _count.failed,
            answeredCount: _count.answered,
        });
    }
    async getQuestions({ topicId, userId, }) {
        const profile = await this.db.historyProfile.findUnique({
            where: { userId },
            select: { seen: { select: { id: true } }, failed: { select: { id: true } } },
        });
        if (!profile) {
            throw http_errors_1.default.InternalServerError(errMsg_1.errMsg.invalidUserId);
        }
        const questions = [];
        // Get unseen
        const unseenQs = await this.db.historyQuestion.findMany({
            where: {
                topic: { id: topicId },
                id: { notIn: (0, lib_2.getIdsArr)(profile.seen) },
            },
            take: exports.HISTORY_QUESTIONS_COUNT,
        });
        questions.push(...unseenQs);
        // Seen all, get failed ones
        if (questions.length < exports.HISTORY_QUESTIONS_COUNT) {
            const failedQs = await this.db.historyQuestion.findMany({
                where: {
                    topic: { id: topicId },
                    id: { in: (0, lib_2.getIdsArr)(profile.failed) },
                },
                take: exports.HISTORY_QUESTIONS_COUNT - questions.length,
            });
            questions.push(...failedQs);
        }
        // We've got a champ out here, reset seen qs
        if (questions.length < exports.HISTORY_QUESTIONS_COUNT) {
            const extraQs = await this.db.historyQuestion.findMany({
                where: {
                    topic: { id: topicId },
                    id: { notIn: (0, lib_2.getIdsArr)(profile.failed) },
                },
                take: exports.HISTORY_QUESTIONS_COUNT - questions.length,
            });
            extraQs.push(...extraQs);
            await this.db.historyProfile.update({
                where: { userId },
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
    async updateTotalProgress({ profileId }) {
        const profile = await this.db.historyProfile.findUnique({
            where: { id: profileId },
            select: { progresses: { select: { value: true } }, progressSession: true },
        });
        if (!profile) {
            throw new http_errors_1.default.InternalServerError(errMsg_1.errMsg.invalidProfileId);
        }
        const { progresses, progressSession } = profile;
        if (progresses.length !== common_1.HISTORY_THEMES_COUNT) {
            throw new http_errors_1.default.InternalServerError(errMsg_1.errMsg.invalidThemeProgressesCount);
        }
        const sum = progresses.reduce((acc, i) => {
            acc += i.value;
            return acc;
        }, 0);
        const progressTopics = Math.round(sum / common_1.HISTORY_THEMES_COUNT);
        const progressTotal = (progressTopics + progressSession) / 2;
        await this.db.historyProfile.update({
            where: { id: profileId },
            data: { progressTopics, progressTotal },
        });
    }
}
exports.HistoryTopicPractice = HistoryTopicPractice;
