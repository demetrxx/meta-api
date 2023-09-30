"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryTopicPractice = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
function getIdsMap(items) {
    return items?.map((i) => i.id) ?? [];
}
class HistoryTopicPractice {
    db;
    constructor(app) {
        this.db = app.prisma;
    }
    async getQuestions({ topicId, profileId, }) {
        const QS_NUM = 10;
        const profile = await this.db.historyProfile.findUnique({
            where: { id: profileId },
            select: { seen: { select: { id: true } }, failed: { select: { id: true } } },
        });
        if (!profile) {
            throw http_errors_1.default.InternalServerError('Invalid profile.');
        }
        const questions = [];
        // Get unseen
        const unseenQs = await this.db.historyQuestion.findMany({
            where: {
                topic: { id: topicId },
                id: { notIn: getIdsMap(profile.seen) },
            },
            take: QS_NUM,
        });
        questions.push(...unseenQs);
        // Seen all, get failed ones
        if (questions.length < QS_NUM) {
            const failedQs = await this.db.historyQuestion.findMany({
                where: {
                    topic: { id: topicId },
                    id: { in: getIdsMap(profile.failed) },
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
                    id: { notIn: getIdsMap(profile.failed) },
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
}
exports.HistoryTopicPractice = HistoryTopicPractice;
