import * as console from 'console';
import { type FastifyInstance } from 'fastify';

import { getFondyPaymentData, paymentsCallbackPath } from '@/modules/payments';

export async function fondyCallback(fastify: FastifyInstance): Promise<void> {
  fastify.post(paymentsCallbackPath(), async (req, res) => {
    const payment = getFondyPaymentData(req.body);

    if (!payment) {
      console.error('Payment callback error! No payment.');
      return;
    }

    await fastify.paymentsService.receivePayment(payment);
  });
}
