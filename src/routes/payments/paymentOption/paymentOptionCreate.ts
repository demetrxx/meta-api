import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBPPaymentOptionInput } from '@/modules/payments';

const body = TBPPaymentOptionInput;

const response = { '2xx': Type.Object({ id: Type.Number() }) };

const schema: FastifySchema = { body, response };

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
}

export async function paymentOptionCreate(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('onRequest', fastify.verifyOwner);
  fastify.post<T>('/options', { schema }, async (req, res) => {
    const result = await fastify.paymentsService.createPaymentOption(req.body);

    res.status(201);

    return result;
  });
}
