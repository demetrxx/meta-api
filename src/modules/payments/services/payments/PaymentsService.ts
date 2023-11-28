import CloudIpsp from 'cloudipsp-node-js-sdk';
import { type FastifyInstance } from 'fastify';

import { type FondyPayment, paymentsCallbackPath, paymentsRedirectPath } from '@/modules/payments';
import { errMsg } from '@/shared/consts/errMsg';

import { type IEnvSchema } from '../../../../../config';

declare module 'fastify' {
  interface FastifyInstance {
    paymentsService: PaymentsService;
  }
}

export class PaymentsService {
  db: FastifyInstance['prisma'];
  fondy: any;
  env: IEnvSchema;

  constructor(app: FastifyInstance) {
    this.db = app.prisma;
    this.env = app.env;
    this.fondy = new CloudIpsp({
      merchantId: Number(app.env.FONDY_MERCHANT_ID),
      secretKey: app.env.FONDY_SECRET,
      creditKey: app.env.FONDY_CREDIT,
    });
  }

  async createPayment({
    userId,
    paymentOptionId,
  }: {
    userId: Id;
    paymentOptionId: Id;
  }): Promise<{ paymentUrl: string }> {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error(errMsg.invalidUserId);

    // const paymentOption = await this.db.paymentOption.findUnique({ where: { id: paymentOptionId } });
    // if (!order) throw new Error(errMsg.invalidOrderId);

    const paymentOption = {
      id: 1,
      type: 'SUBSCRIPTION',
      data: {
        name: 'Whole lotta red',
        amount: 5200,
        order_desc: 'Benzomaggedon',
        currency: 'UAH',
      },
    };

    // TODO: create order
    // const order = await this.db.order.findUnique({ where: { id: orderId } });

    const order = {
      id: 15,
      paymentOptionId: paymentOption.id,
      userId: user.id,
      status: 'CREATED',
      createdAt: new Date(),
    };

    const CALLBACK_URL = this.env.API_URL + paymentsCallbackPath(true);
    const REDIRECT_URL = this.env.API_URL + paymentsRedirectPath(true);

    let res;

    function formatDate(date: Date): string {
      return date.toISOString().slice(0, 10);
    }

    if (paymentOption.type === 'SUBSCRIPTION') {
      const now = new Date();
      const startDate = formatDate(now);
      now.setFullYear(now.getFullYear() + 1);
      const endDate = formatDate(now);

      const subsData = {
        order_desc: 'test order',
        order_id: 30,
        currency: 'UAH',
        amount: 5200,
        recurring_data: {
          every: 1,
          period: 'day',
          amount: 5200,
          start_time: startDate,
          end_time: endDate,
          state: 'y',
          readonly: 'y',
        },
        response_url: REDIRECT_URL,
        // subscription_callback_url: CALLBACK_URL,
        server_callback_url: CALLBACK_URL,
      };

      res = await this.fondy.Subscription(subsData);
    }

    if (paymentOption.type === 'PAYMENT') {
      const paymentData = {
        ...paymentOption.data,
        product_id: paymentOption.id,

        order_id: order.id,
        sender_email: user.email,

        // payment meta
        server_callback_url: CALLBACK_URL,
        response_url: REDIRECT_URL,
      };
      res = await this.fondy.Checkout(paymentData);
    }

    if (res.response_status === 'failure') {
      console.log(res);
      throw new Error(errMsg.paymentCreationFailed);
    }

    return { paymentUrl: res?.checkout_url };
  }

  async receivePayment(payment: FondyPayment): Promise<void> {
    console.log(payment);
  }

  isPaymentSuccess(payment: FondyPayment): boolean {
    return payment.response_status === 'success';
  }
}
