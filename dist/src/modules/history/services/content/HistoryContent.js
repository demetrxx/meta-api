"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryContent = void 0;
const errMsg_1 = require("@/shared/consts/errMsg");
class HistoryContent {
    db;
    constructor(app) {
        this.db = app.prisma;
    }
    async getAllTopics() {
        return await this.db.historyTopic.findMany({ orderBy: { order: 'asc' } });
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
        return await this.db.historyQuestion.findUnique({ where: { id: questionId } });
    }
    async getQuestionsMany({ topicId, text, ticketId, }) {
        if (topicId) {
            const topic = await this.db.historyTopic.findUnique({
                where: { id: topicId },
                select: {
                    questions: {
                        where: { name: { contains: text }, topics: { some: { id: topicId } } },
                        select: {
                            id: true,
                            topics: { select: { id: true } },
                            type: true,
                            name: true,
                        },
                    },
                },
            });
            if (!topic)
                throw new Error(errMsg_1.errMsg.invalidTopicId);
            return topic.questions;
        }
        if (ticketId) {
            const ticket = await this.db.historyTicket.findUnique({
                where: { id: ticketId },
                select: {
                    questions: {
                        where: { name: { contains: text } },
                        select: {
                            id: true,
                            topics: { select: { id: true } },
                            type: true,
                            name: true,
                            order: true,
                            options: true,
                            correct: true,
                            solution: true,
                        },
                        orderBy: { order: 'asc' },
                    },
                },
            });
            if (!ticket)
                throw new Error(errMsg_1.errMsg.invalidTicketId);
            return ticket.questions;
        }
        return await this.db.historyQuestion.findMany({
            where: { name: { contains: text } },
            select: {
                id: true,
                topics: { select: { id: true } },
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
        return await this.db.historyTicket.findMany({ include: { questions: true } });
    }
    async getTicketById(ticketId) {
        return await this.db.historyTicket.findUnique({
            where: { id: ticketId },
            include: { questions: true },
        });
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
    async getKeyWordsByTopic(topicId) {
        return await this.db.historyKeyWord.findMany({ where: { topicId } });
    }
    async createKeyWord(data) {
        return await this.db.historyKeyWord.create({ data, select: { id: true } });
    }
    async updateKeyWord(id, data) {
        await this.db.historyKeyWord.update({ where: { id }, data });
    }
    async deleteKeyWord(id) {
        await this.db.historyKeyWord.delete({ where: { id } });
    }
}
exports.HistoryContent = HistoryContent;
