"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const typebox_1 = require("@sinclair/typebox");
const ticket_1 = require("@/shared/typebox/tickets");
const body = ticket_1.TBHistoryTicketInput;
const response = { '2xx': typebox_1.Type.Object({ id: typebox_1.Type.Number() }) };
const schema = { body, response };
async function create(fastify) {
    fastify.post('/tickets', { schema }, async (req, res) => {
        const result = await fastify.historyContent.createTicket({
            ...req.body,
            questions: { connect: req.body.questions },
        });
        res.status(201);
        return result;
    });
}
exports.create = create;
