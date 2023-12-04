"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const formatFondyDate_1 = require("../src/modules/payments/lib/formatFondyDate");
const prisma = new client_1.PrismaClient();
async function setPaymentsData() {
    const now = new Date();
    const startDate = (0, formatFondyDate_1.formatFondyDate)(now);
    now.setFullYear(now.getFullYear() + 1);
    const endDate = (0, formatFondyDate_1.formatFondyDate)(now);
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
            accessUntil: new Date('2024-09-01'),
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
async function main() {
    await prisma.paymentOption.update({
        where: { id: 4 },
        data: { accessUntil: new Date('2024-09-01') },
    });
}
main()
    .catch((e) => {
    throw e;
})
    // eslint-disable-next-line
    .finally(async () => {
    await prisma.$disconnect();
});
