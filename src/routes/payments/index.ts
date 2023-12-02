import { type FastifyInstance } from 'fastify';

import { PaymentsService } from '@/modules/payments';
import { loadRoutes } from '@/shared/system';

import { createPayment } from './createPayment/createPayment';
import { fondyCallback } from './fondyCallback/fondyCallback';
import { fondyRedirect } from './fondyRedirect/fondyRedirect';
import { fondySubsCallback } from './fondySubsCallback/fondySubsCallback';

export const paymentsRoutes = loadRoutes({
  routes: [createPayment, fondyCallback, fondyRedirect, fondySubsCallback],
  opts: { prefix: '/payments' },
  decorators: {
    paymentsService: (fastify: FastifyInstance) => new PaymentsService(fastify),
  },
});
