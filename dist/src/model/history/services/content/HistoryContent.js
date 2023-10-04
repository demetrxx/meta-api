"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryContent = void 0;
class HistoryContent {
    db;
    constructor(app) {
        this.db = app.prisma;
    }
    async createTopic(data) {
        await this.db.historyTopic.create({ data });
    }
    async updateTopic(topicId, { name, order }) {
        await this.db.historyTopic.update({ where: { id: topicId }, data: { name, order } });
    }
    async getQuestionById(questionId) {
        await this.db.historyQuestion.findUnique({ where: { id: questionId } });
    }
    async getQuestionsByTopic(topicId) {
        return await this.db.historyQuestion.findMany({
            where: { topicId },
            select: {
                id: true,
                topicId: true,
                type: true,
                name: true,
            },
        });
    }
    async createQuestion(data) {
        await this.db.historyQuestion.create({ data });
    }
    async updateQuestion(questionId, data) {
        await this.db.historyQuestion.update({ where: { id: questionId }, data });
    }
    async deleteQuestion(questionId) {
        await this.db.historyQuestion.delete({ where: { id: questionId } });
    }
    async createTicket(data) {
        await this.db.historyTicket.create({ data });
    }
    async updateTicket(ticketId, data) {
        await this.db.historyTicket.update({ where: { id: ticketId }, data });
    }
}
exports.HistoryContent = HistoryContent;
