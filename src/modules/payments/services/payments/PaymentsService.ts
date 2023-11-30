import CloudIpsp from 'cloudipsp-node-js-sdk';
import { type FastifyInstance } from 'fastify';

import { type FondyPayment, paymentsCallbackPath, paymentsRedirectPath } from '@/modules/payments';
import { formatFondyDate } from '@/modules/payments/lib/formatFondyDate';
import { type FondyPaymentInput } from '@/modules/payments/types/payments';
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
    // Find user
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error(errMsg.invalidUserId);

    // Find payment option
    const paymentOption = await this.db.paymentOption.findUnique({
      where: { id: paymentOptionId },
    });
    if (!paymentOption) throw new Error(errMsg.invalidPaymentOptionId);

    // Create order
    const order = await this.db.order.create({
      data: {
        paymentOptionId: paymentOption.id,
        type: paymentOption.orderType,
        userId: user.id,
        status: 'CREATED',
      },
    });

    const CALLBACK_URL = this.env.API_URL + paymentsCallbackPath(true);
    const REDIRECT_URL = this.env.API_URL + paymentsRedirectPath(true);

    let res;

    // Create payment data
    const paymentData = {
      ...(paymentOption.fondyInput as Partial<FondyPaymentInput>),

      product_id: paymentOption.id,
      order_id: order.id,
      sender_email: user.email,

      response_url: REDIRECT_URL,
      server_callback_url: CALLBACK_URL,
      // subscription_callback_url: CALLBACK_URL,
    };

    // Subscribe
    if (paymentOption.orderType === 'SUBSCRIPTION') {
      if (!paymentData.recurring_data) throw new Error(errMsg.invalidSubsData);
      paymentData.recurring_data.start_time = formatFondyDate(new Date());

      res = await this.fondy.Subscription(paymentData);
    }

    // Pay once
    if (paymentOption.orderType === 'SINGLE_PAYMENT') {
      res = await this.fondy.Checkout(paymentData);
    }

    if (!res || res.response_status === 'failure') {
      console.error(res);
      throw new Error(errMsg.paymentCreationFailed);
    }

    return { paymentUrl: res.checkout_url };
  }

  async receivePayment(payment: FondyPayment): Promise<void> {
    console.log(payment);
  }

  isPaymentSuccess(payment: FondyPayment): boolean {
    return payment.response_status === 'success';
  }
}
