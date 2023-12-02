import { type PaymentOption, type Prisma } from '@prisma/client';
import CloudIpsp from 'cloudipsp-node-js-sdk';
import { type FastifyInstance } from 'fastify';

import {
  type FondyPayment,
  paymentsCallbackPath,
  paymentsRedirectPath,
  subsCallbackPath,
} from '@/modules/payments';
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
    const SUBS_CALLBACK_URL = this.env.API_URL + subsCallbackPath(true);

    let res;

    // Create payment data
    const paymentData: Partial<FondyPaymentInput> = {
      ...(paymentOption.fondyInput as Partial<FondyPaymentInput>),

      product_id: paymentOption.id,
      order_id: order.id,
      sender_email: user.email,

      response_url: REDIRECT_URL,
      server_callback_url: CALLBACK_URL,
    };

    // Subscribe
    if (paymentOption.orderType === 'SUBSCRIPTION') {
      if (!paymentData.recurring_data) throw new Error(errMsg.invalidSubsData);
      paymentData.recurring_data.start_time = formatFondyDate(new Date());
      paymentData.subscription_callback_url = SUBS_CALLBACK_URL;

      res = await this.fondy.Subscription(paymentData);
    }

    // Pay once
    if (paymentOption.orderType === 'SINGLE_PAYMENT') {
      res = await this.fondy.Checkout(paymentData);
    }

    if (!res || !this.isPaymentSuccess(res)) {
      console.error(res);
      throw new Error(errMsg.paymentCreationFailed);
    }

    return { paymentUrl: res.checkout_url };
  }

  async receivePayment(payment: FondyPayment): Promise<void> {
    // check if payment is unique
    const existingPayment = await this.db.payment.findUnique({
      where: { id: Number(payment.payment_id) },
    });
    if (existingPayment) throw new Error(errMsg.paymentAlreadyExists);

    // create payment & connect to order
    const { order } = await this.db.payment.create({
      data: {
        id: Number(payment.payment_id),
        date: new Date(),
        status: this.isPaymentSuccess(payment) ? 'SUCCESS' : 'FAILURE',
        orderId: Number(payment.order_id),
        data: payment as unknown as Prisma.JsonObject,
      },
      select: { order: { select: { userId: true, paymentOption: true } } },
    });

    // update user data
    await this.db.historyProfile.update({
      where: { userId: order.userId },
      data: { accessUntil: this.getAccessUntil(order.paymentOption) },
    });
  }

  async receiveSubscription(payment: FondyPayment): Promise<void> {
    console.log(payment);
  }

  isPaymentSuccess(payment: FondyPayment): boolean {
    return payment.response_status === 'success';
  }

  getAccessUntil(paymentOption: PaymentOption): Date {
    const isSubscription = paymentOption.orderType === 'SUBSCRIPTION';
    if (isSubscription) {
      const now = new Date();
      now.setMonth(now.getMonth() + 1);
      return now;
    }

    if (!paymentOption.accessUntil) throw new Error(errMsg.invalidPaymentOptionFinalDate);
    return paymentOption.accessUntil;
  }
}
