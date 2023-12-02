import { PrismaClient } from '@prisma/client';

import { formatFondyDate } from '@/modules/payments/lib/formatFondyDate';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const now = new Date();
  const startDate = formatFondyDate(now);
  now.setFullYear(now.getFullYear() + 1);
  const endDate = formatFondyDate(now);

  const a = await prisma.paymentOption.create({
    data: {
      orderType: 'SUBSCRIPTION',
      name: '1 month subscription',
      price: 5200,

      fondyInput: {
        name: '1 month subscription',
        amount: 5200,
        order_desc: 'Hurtz',
        currency: 'UAH',
        recurring_data: {
          every: 1,
          period: 'month',
          amount: 5200,
          start_time: startDate,
          end_time: endDate,
          state: 'y',
          readonly: 'y',
        },
      },
    },
  });

  console.log(a);

  const b = await prisma.paymentOption.create({
    data: {
      orderType: 'SINGLE_PAYMENT',
      name: 'Full year subscription',
      price: 81200,
      accessUntil: new Date('2023-09-01'),
      fondyInput: {
        name: 'Full year subscription',
        amount: 81200,
        order_desc: 'Vandal',
        currency: 'UAH',
      },
    },
  });

  console.log(b);

  await prisma.order.createMany({
    data: new Array(35).fill(0).map(() => ({
      type: 'SINGLE_PAYMENT',
      status: 'FAILURE',
      paymentOptionId: b.id,
      userId: 1,
    })),
  });
}

main()
  .catch((e) => {
    throw e;
  })
  // eslint-disable-next-line
  .finally(async (): Promise<void> => {
    await prisma.$disconnect();
  });
