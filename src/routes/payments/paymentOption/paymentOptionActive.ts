import { Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

import { TBPaymentOptionOutput } from '@/modules/payments';

const schema: FastifySchema = {
  response: { 200: Type.Array(TBPaymentOptionOutput) },
};

interface T extends RouteGenericInterface {}

export async function paymentOptionActive(fastify: FastifyInstance): Promise<void> {
  fastify.get<T>('/options', { schema }, async (req, res) => {
    const questions = await fastify.paymentsService.getPaymentOptions({ active: true });

    return JSON.stringify(questions);
  });
}
