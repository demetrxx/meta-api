import { type FastifyInstance } from 'fastify';

import { getFondyPaymentData, paymentsRedirectPath } from '@/modules/payments';

export async function fondyRedirect(fastify: FastifyInstance): Promise<void> {
  fastify.post(paymentsRedirectPath(), async (req, res) => {
    function redirect(isSuccess = true): void {
      const redirectPath = isSuccess
        ? fastify.env.PAYMENT_SUCCESS_REDIRECT_PATH
        : fastify.env.PAYMENT_FAILURE_REDIRECT_PATH;

      res.redirect(`${fastify.env.CLIENT_URL}${redirectPath}`);
    }

    const payment = getFondyPaymentData(req.body);
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
