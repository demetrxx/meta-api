import * as console from 'console';
import { type FastifyInstance } from 'fastify';

import { getFondyPaymentData, subsCallbackPath } from '@/modules/payments';

export async function fondySubsCallback(fastify: FastifyInstance): Promise<void> {
  fastify.post(subsCallbackPath(), async (req, res) => {
    const payment = getFondyPaymentData(req.body);

    if (!payment) {
      console.error('Subscription callback error! No subscription.');
      return;
    }

    await fastify.paymentsService.receiveSubscription(payment);
  });
}
