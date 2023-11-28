import { type FondyPayment, type FondySubscription } from '../types/payments';

export function getFondyPaymentData(data: any): FondyPayment | undefined {
  let payment = data;

  if ((payment as FondySubscription).data) {
    try {
      payment = JSON.parse(
        Buffer.from((payment as FondySubscription).data, 'base64').toString('utf-8'),
      )?.order;
    } catch (err) {
      console.error('Fondy subscription parse error:\n', err);
      return;
    }
  }

  return payment;
}
