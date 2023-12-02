import { type FastifyInstance } from 'fastify';

import { PaymentsService } from '@/modules/payments';
import { loadRoutes } from '@/shared/system';

import { createPayment } from './createPayment/createPayment';
import { fondyCallback } from './fondyCallback/fondyCallback';
import { fondyRedirect } from './fondyRedirect/fondyRedirect';

export const paymentsRoutes = loadRoutes({
  routes: [createPayment, fondyCallback, fondyRedirect],
  opts: { prefix: '/payments' },
  decorators: {
    paymentsService: (fastify: FastifyInstance) => new PaymentsService(fastify),
  },
});
