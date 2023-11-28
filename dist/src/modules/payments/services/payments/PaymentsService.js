"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const cloudipsp_node_js_sdk_1 = __importDefault(require("cloudipsp-node-js-sdk"));
const payments_1 = require("@/modules/payments");
const errMsg_1 = require("@/shared/consts/errMsg");
class PaymentsService {
    db;
    fondy;
    env;
    constructor(app) {
        this.db = app.prisma;
        this.env = app.env;
        this.fondy = new cloudipsp_node_js_sdk_1.default({
            merchantId: Number(app.env.FONDY_MERCHANT_ID),
            secretKey: app.env.FONDY_SECRET,
            creditKey: app.env.FONDY_CREDIT,
        });
    }
    async createPayment({ userId, paymentOptionId, }) {
        const user = await this.db.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error(errMsg_1.errMsg.invalidUserId);
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
        const CALLBACK_URL = this.env.API_URL + (0, payments_1.paymentsCallbackPath)(true);
        const REDIRECT_URL = this.env.API_URL + (0, payments_1.paymentsRedirectPath)(true);
        let res;
        function formatDate(date) {
            return date.toISOString().slice(0, 10);
        }
        if (paymentOption.type === 'SUBSCRIPTION') {
            const now = new Date();
            const startDate = formatDate(now);
            now.setFullYear(now.getFullYear() + 1);
            const endDate = formatDate(now);
            const subsData = {
                order_desc: 'test order',
                order_id: 29,
                currency: 'UAH',
                amount: 5200,
                recurring_data: {
                    every: 1,
                    period: 'month',
                    amount: 5200,
                    start_time: startDate,
                    end_time: endDate,
                    conditions: { quantity: 12 },
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
            throw new Error(errMsg_1.errMsg.paymentCreationFailed);
        }
        return { paymentUrl: res?.checkout_url };
    }
    async receivePayment(payment) {
        console.log(payment);
    }
    isPaymentSuccess(payment) {
        return payment.response_status === 'success';
    }
}
exports.PaymentsService = PaymentsService;
