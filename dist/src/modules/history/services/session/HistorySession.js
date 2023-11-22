"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistorySessionService = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const lib_1 = require("@/lib");
const getHistorySessionAnalytics_1 = require("@/modules/history/lib/getHistorySessionAnalytics/getHistorySessionAnalytics");
const getHistorySessionProgress_1 = require("@/modules/history/lib/getHistorySessionProgress/getHistorySessionProgress");
const errMsg_1 = require("@/shared/consts/errMsg");
const lib_2 = require("@/shared/lib");
class HistorySessionService {
    db;
    constructor(app) {
        this.db = app.prisma;
    }
    async create({ userId }) {
        const profile = await this.db.historyProfile.findUnique({
            where: { userId },
            select: { ticketsSeen: { select: { id: true } } },
        });
        if (!profile) {
            throw new http_errors_1.default.InternalServerError(errMsg_1.errMsg.invalidUserId);
        }
        let ticket = await this.db.historyTicket.findFirst({
            where: { id: { notIn: profile.ticketsSeen.map(({ id }) => id) } },
            orderBy: { year: 'desc' },
            select: { id: true },
        });
        // Seen all tickets, start from the beginning
        if (!ticket) {
            await this.db.historyProfile.update({
                where: { userId },
                data: { ticketsSeen: { set: [] } },
            });
            ticket = await this.db.historyTicket.findFirst({
                orderBy: { year: 'desc' },
                select: { id: true },
            });
        }
        if (!ticket)
            throw new http_errors_1.default.InternalServerError(errMsg_1.errMsg.noTickets);
        const session = await this.db.historySession.create({
            data: {
                ticket: { connect: { id: ticket.id } },
                profile: { connect: { userId } },
                answers: {},
            },
            include: { ticket: { select: { questions: { orderBy: { order: 'asc' } } } } },
        });
        await this.db.historyProfile.update({
            where: { userId },
            data: {
                ticketsSeen: { connect: { id: ticket.id } },
                activeSession: { connect: { id: session.id } },
            },
        });
        return session;
    }
    async recordAnswer({ userId, answers, }) {
        const activeSession = await this.getActive({ userId });
        const timePassed = (0, lib_1.calcTimePassed)({
            prevTimePassed: activeSession.timePassed,
            lastViewed: activeSession.lastViewed,
        });
        return await this.db.historySession.update({
            where: { id: activeSession.id },
            data: {
                timePassed,
                answers,
            },
            select: { id: true },
        });
    }
    async getActive({ userId, }) {
        const { activeSession } = await this.db.historyProfile.findUniqueOrThrow({
            where: { userId },
            select: {
                activeSession: {
                    include: { ticket: { include: { questions: { orderBy: { order: 'asc' } } } } },
                },
            },
        });
        if (!activeSession) {
            throw new http_errors_1.default.BadRequest(errMsg_1.errMsg.noActiveSession);
        }
        await this.db.historySession.update({
            where: { id: activeSession.id },
            data: { lastViewed: new Date() },
        });
        return activeSession;
    }
    async finish({ userId }) {
        const activeSession = await this.getActive({ userId });
        const timePassed = (0, lib_1.calcTimePassed)({
            prevTimePassed: activeSession.timePassed,
            lastViewed: activeSession.lastViewed,
        });
        const { score, failed, rate, answered } = (0, getHistorySessionAnalytics_1.getHistorySessionAnalytics)(activeSession.ticket.questions, activeSession.answers);
        const session = await this.db.historySession.update({
            where: { id: activeSession.id },
            data: {
                score,
                rate,
                timePassed,
                done: true,
                lastViewed: new Date(),
            },
            include: {
                profile: { select: { progressTopics: true } },
            },
        });
        const { progressTopics } = session.profile;
        const completeSessions = await this.db.historySession.findMany({
            where: { profileId: session.profileId, done: true },
            orderBy: { lastViewed: 'desc' },
        });
        const progressSession = (0, getHistorySessionProgress_1.getHistorySessionProgress)(completeSessions);
        const progressTotal = (progressTopics + progressSession) / 2;
        await this.db.historyProfile.update({
            where: { userId },
            data: {
                progressTotal,
                progressSession,
                seen: { connect: activeSession.ticket.questions.map(({ id }) => ({ id })) },
                answered: { connect: (0, lib_2.toIdsObjArr)(answered) },
                failed: { connect: (0, lib_2.toIdsObjArr)(failed) },
                activeSession: { disconnect: true },
            },
        });
        return session;
    }
    async getById(id, { userId }) {
        const session = await this.db.historySession.findUnique({
            where: { id, done: false },
            include: { profile: { select: { userId: true } } },
        });
        if (!session) {
            throw new http_errors_1.default.BadRequest(errMsg_1.errMsg.invalidSessionId);
        }
        if (session.profile.userId !== userId) {
            throw new http_errors_1.default.Forbidden();
        }
        return session;
    }
    async deleteById(id, { userId }) {
        const session = await this.db.historySession.findUnique({
            where: { id },
            select: { profile: { select: { userId: true } }, ticketId: true },
        });
        if (!session) {
            throw new http_errors_1.default.InternalServerError(errMsg_1.errMsg.invalidSessionId);
        }
        if (session.profile.userId !== userId) {
            throw new http_errors_1.default.Forbidden();
        }
        await this.db.historySession.delete({ where: { id } });
        await this.db.historyProfile.update({
            where: { userId },
            data: { ticketsSeen: { disconnect: { id: session.ticketId } } },
        });
    }
}
exports.HistorySessionService = HistorySessionService;
