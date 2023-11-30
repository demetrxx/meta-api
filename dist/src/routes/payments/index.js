"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsRoutes = void 0;
const payments_1 = require("@/modules/payments");
const system_1 = require("@/shared/system");
const createPayment_1 = require("./createPayment/createPayment");
const fondyCallback_1 = require("./fondyCallback/fondyCallback");
exports.paymentsRoutes = (0, system_1.loadRoutes)({
    routes: [createPayment_1.createPayment, fondyCallback_1.fondyCallback],
    opts: { prefix: '/payments' },
    decorators: {
        paymentsService: (fastify) => new payments_1.PaymentsService(fastify),
    },
});
