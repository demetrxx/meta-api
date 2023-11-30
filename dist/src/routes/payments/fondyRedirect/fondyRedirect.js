"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fondyRedirect = void 0;
const payments_1 = require("../../../modules/payments");
async function fondyRedirect(fastify) {
    fastify.post((0, payments_1.paymentsRedirectPath)(), async (req, res) => {
        function redirect(isSuccess = true) {
            const redirectPath = isSuccess
                ? fastify.env.PAYMENT_SUCCESS_REDIRECT_PATH
                : fastify.env.PAYMENT_FAILURE_REDIRECT_PATH;
            res.redirect(`${fastify.env.CLIENT_URL}${redirectPath}`);
        }
        const payment = (0, payments_1.getFondyPaymentData)(req.body);
        if (!payment) {
            redirect(false);
            return;
        }
        const isSuccess = fastify.paymentsService.isPaymentSuccess(payment);
        if (!isSuccess) {
            redirect(false);
            return;
        }
        redirect();
    });
}
exports.fondyRedirect = fondyRedirect;
