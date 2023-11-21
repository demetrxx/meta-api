"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketsCreate = void 0;
const typebox_1 = require("@sinclair/typebox");
const ticket_1 = require("@/modules/history/typebox/ticket");
const lib_1 = require("@/shared/lib");
const body = ticket_1.TBHistoryTicketInput;
const response = { '2xx': typebox_1.Type.Object({ id: typebox_1.Type.Number() }) };
const schema = { body, response };
async function ticketsCreate(fastify) {
    fastify.post('/tickets', { schema }, async (req, res) => {
        const questions = await Promise.all(req.body.questions.map(async (q) => {
            const res = await fastify.historyContent.createQuestion({
                ...q,
                topics: { connect: (0, lib_1.toIdsObjArr)(q.topics) },
                keyWords: { connect: q.keyWords },
            });
            if (q.order === 49 || q.order === 50) {
                console.log(res.id);
            }
            return res;
        }));
        const result = await fastify.historyContent.createTicket({
            ...req.body,
            questions: { connect: questions },
        });
        res.status(201);
        return result;
    });
}
exports.ticketsCreate = ticketsCreate;
