"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryContent = void 0;
class HistoryContent {
    db;
    constructor(app) {
        this.db = app.prisma;
    }
    async getAllTopics() {
        return await this.db.historyTopic.findMany();
    }
    async createTopic(data) {
        return await this.db.historyTopic.create({ data, select: { id: true } });
    }
    async updateTopic(topicId, { name, order }) {
        await this.db.historyTopic.update({ where: { id: topicId }, data: { name, order } });
    }
    async deleteTopic(topicId) {
        await this.db.historyTopic.delete({ where: { id: topicId } });
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
        return await this.db.historyQuestion.create({ data, select: { id: true } });
    }
    async updateQuestion(questionId, data) {
        return await this.db.historyQuestion.update({
            where: { id: questionId },
            data,
            select: { id: true },
        });
    }
    async deleteQuestion(questionId) {
        await this.db.historyQuestion.delete({ where: { id: questionId } });
    }
    async getAllTickets() {
        return await this.db.historyTicket.findMany();
    }
    async createTicket(data) {
        return await this.db.historyTicket.create({ data, select: { id: true } });
    }
    async updateTicket(ticketId, data) {
        await this.db.historyTicket.update({ where: { id: ticketId }, data });
    }
    async deleteTicket(id) {
        await this.db.historyTicket.delete({ where: { id } });
    }
}
exports.HistoryContent = HistoryContent;
