"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayment = void 0;
const typebox_1 = require("@sinclair/typebox");
const body = typebox_1.Type.Object({
    paymentOption: typebox_1.Type.Number(),
});
const schema = { body };
async function createPayment(fastify) {
    fastify.post('/', { schema }, async (req, res) => {
        const { paymentOption } = req.body;
        return await fastify.paymentsService.createPayment({
            userId: req.user.id,
            paymentOptionId: paymentOption,
        });
    });
}
exports.createPayment = createPayment;
