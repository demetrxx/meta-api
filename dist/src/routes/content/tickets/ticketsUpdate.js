"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketsUpdate = void 0;
const typebox_1 = require("@sinclair/typebox");
const ticket_1 = require("@/modules/history/typebox/ticket");
const params = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
});
const body = typebox_1.Type.Partial(ticket_1.TBHistoryTicketUpdateInput);
const schema = {
    body,
    params,
    response: { '2xx': typebox_1.Type.Object({ id: typebox_1.Type.Number() }) },
};
async function ticketsUpdate(fastify) {
    fastify.patch('/tickets/:id', { schema }, async (req) => {
        await fastify.historyContent.updateTicket(Number(req.params.id), {
            ...req.body,
            questions: { set: req.body.questions },
        });
        return { id: Number(req.params.id) };
    });
}
exports.ticketsUpdate = ticketsUpdate;
