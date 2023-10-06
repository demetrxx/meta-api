"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryProfile = void 0;
class HistoryProfile {
    db;
    constructor(app) {
        this.db = app.prisma;
    }
    async createProfile({ userId }) {
        const topicIds = await this.db.historyTopic.findMany({ select: { id: true } });
        const progresses = topicIds.map(({ id }) => ({ topicId: id }));
        const profile = await this.db.historyProfile.create({
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
        return profile.id;
    }
}
exports.HistoryProfile = HistoryProfile;
