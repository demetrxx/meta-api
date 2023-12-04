import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBPPaymentOptionInput } from '@/modules/payments';

const params = Type.Object({
  id: Type.String(),
});

const body = Type.Partial(TBPPaymentOptionInput);

const schema: FastifySchema = {
  body,
  params,
  response: { '2xx': Type.Object({ id: Type.Number() }) },
};

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
  Params: Static<typeof params>;
}

export async function paymentOptionUpdate(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('onRequest', fastify.verifyOwner);
  fastify.patch<T>('/options/:id', { schema }, async (req, res) => {
    return await fastify.paymentsService.updatePaymentOption(Number(req.params.id), req.body);
  });
}
