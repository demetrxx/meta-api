"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketsGetAll = void 0;
const typebox_1 = require("@sinclair/typebox");
const ticket_1 = require("../../../modules/history/typebox/ticket");
const schema = {
    response: { '2xx': typebox_1.Type.Array(ticket_1.TBHistoryTicketOutput) },
};
async function ticketsGetAll(fastify) {
    fastify.get('/tickets', { schema }, async () => {
        return await fastify.historyContent.getAllTickets();
    });
}
exports.ticketsGetAll = ticketsGetAll;
