import { type FastifyInstance } from 'fastify';

import { PaymentsService } from '@/modules/payments';
import { loadRoutes } from '@/shared/system';

import { createPayment } from './createPayment/createPayment';
import { fondyCallback } from './fondyCallback/fondyCallback';
import { fondyRedirect } from './fondyRedirect/fondyRedirect';
import { paymentOptionAll } from './paymentOption/paymentOptionAll';
import { paymentOptionCreate } from './paymentOption/paymentOptionCreate';
import { paymentOptionDelete } from './paymentOption/paymentOptionDelete';
import { paymentOptionUpdate } from './paymentOption/paymentOptionUpdate';

export const paymentsRoutes = loadRoutes({
  routes: [
    createPayment,
    fondyCallback,
    fondyRedirect,
    paymentOptionCreate,
    paymentOptionDelete,
    paymentOptionAll,
    paymentOptionUpdate,
  ],
  opts: { prefix: '/payments' },
  decorators: {
    paymentsService: (fastify: FastifyInstance) => new PaymentsService(fastify),
  },
});
