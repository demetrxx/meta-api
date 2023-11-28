import { type FastifyInstance } from 'fastify';

import { PaymentsService } from '@/modules/payments';
import { loadRoutes } from '@/shared/system';

import { createPayment } from './createPayment/createPayment';
import { fondyCallback } from './fondyCallback/fondyCallback';

export const paymentsRoutes = loadRoutes({
  routes: [createPayment, fondyCallback],
  opts: { prefix: '/payments' },
  decorators: {
    paymentsService: (fastify: FastifyInstance) => new PaymentsService(fastify),
  },
});
