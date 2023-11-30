"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryProfileService = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const errMsg_1 = require("@/shared/consts/errMsg");
const lib_1 = require("@/shared/lib");
class HistoryProfileService {
    db;
    constructor(app) {
        this.db = app.prisma;
    }
    async createProfile({ userId }) {
        const topicIds = await this.db.historyTopic.findMany({ select: { id: true } });
        const progresses = topicIds.map(({ id }) => ({ topicId: id }));
        return await this.db.historyProfile.create({
            data: {
                userId,
                progressTotal: 0,
                progressTopics: 0,
                progressSession: 0,
                progresses: {
                    createMany: { data: progresses },
                },
            },
        });
    }
    async getProfile({ userId }) {
        const profile = await this.db.historyProfile.findUnique({
            where: { userId },
            include: {
                answered: lib_1.selectId,
                failed: lib_1.selectId,
                seen: lib_1.selectId,
                progresses: true,
                ticketsSeen: lib_1.selectId,
            },
        });
        if (!profile) {
            return await this.createProfile({ userId });
            // TODO: grant access to profile on purchase
            // throw errors.InternalServerError(errMsg.invalidUserId);
        }
        return profile;
    }
    async getProgress({ userId, topicId, }) {
        const profile = await this.getProfile({ userId });
        const progress = await this.db.historyProgress.findUnique({
            where: { topicId_profileId: { topicId, profileId: profile.id } },
        });
        if (!progress) {
            throw http_errors_1.default.InternalServerError(errMsg_1.errMsg.invalidUserId);
        }
        return progress;
    }
}
exports.HistoryProfileService = HistoryProfileService;
