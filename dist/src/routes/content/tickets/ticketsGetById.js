"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketsGetById = void 0;
const typebox_1 = require("@sinclair/typebox");
const ticket_1 = require("@/modules/history/typebox/ticket");
const params = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
});
const schema = { params, response: { 200: ticket_1.TBHistoryTicketOutput } };
async function ticketsGetById(fastify) {
    fastify.get('/tickets/:id', { schema }, async (req, res) => {
        return await fastify.historyContent.getTicketById(Number(req.params.id));
    });
}
exports.ticketsGetById = ticketsGetById;
