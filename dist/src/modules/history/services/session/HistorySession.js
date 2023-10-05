"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistorySessionService = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const errMsg_1 = require("@/shared/consts/errMsg");
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
}
exports.HistorySessionService = HistorySessionService;
