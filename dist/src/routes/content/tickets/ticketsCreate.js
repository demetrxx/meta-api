"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketsCreate = void 0;
const typebox_1 = require("@sinclair/typebox");
const ticket_1 = require("@/modules/history/typebox/ticket");
const body = ticket_1.TBHistoryTicketInput;
const response = { '2xx': typebox_1.Type.Object({ id: typebox_1.Type.Number() }) };
const schema = { body, response };
async function ticketsCreate(fastify) {
    fastify.post('/tickets', { schema }, async (req, res) => {
        const result = await fastify.historyContent.createTicket({
            ...req.body,
            questions: { connect: req.body.questions },
        });
        res.status(201);
        return result;
    });
}
exports.ticketsCreate = ticketsCreate;
