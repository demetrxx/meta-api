import { type Static, Type } from '@sinclair/typebox';
import { type FastifyInstance, type FastifySchema, type RouteGenericInterface } from 'fastify';

const body = Type.Object({
  paymentOption: Type.Number(),
});

const schema: FastifySchema = { body };

interface T extends RouteGenericInterface {
  Body: Static<typeof body>;
}

export async function createPayment(fastify: FastifyInstance): Promise<void> {
  fastify.post<T>('/', { schema }, async (req, res) => {
    const { paymentOption } = req.body;

    return await fastify.paymentsService.createPayment({
      userId: req.user.id,
      paymentOptionId: paymentOption,
    });
  });
}
