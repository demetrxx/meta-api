"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const cloudipsp_node_js_sdk_1 = __importDefault(require("cloudipsp-node-js-sdk"));
const payments_1 = require("@/modules/payments");
const formatFondyDate_1 = require("@/modules/payments/lib/formatFondyDate");
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
        // Find user
        const user = await this.db.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error(errMsg_1.errMsg.invalidUserId);
        // Find payment option
        const paymentOption = await this.db.paymentOption.findUnique({
            where: { id: paymentOptionId },
        });
        if (!paymentOption)
            throw new Error(errMsg_1.errMsg.invalidPaymentOptionId);
        // Create order
        const order = await this.db.order.create({
            data: {
                paymentOptionId: paymentOption.id,
                type: paymentOption.orderType,
                userId: user.id,
                status: 'CREATED',
            },
        });
        const CALLBACK_URL = this.env.API_URL + (0, payments_1.paymentsCallbackPath)(true);
        const REDIRECT_URL = this.env.API_URL + (0, payments_1.paymentsRedirectPath)(true);
        const SUBS_CALLBACK_URL = this.env.API_URL + (0, payments_1.subsCallbackPath)(true);
        let res;
        // Create payment data
        const paymentData = {
            ...paymentOption.fondyInput,
            product_id: paymentOption.id,
            order_id: order.id,
            sender_email: user.email,
            response_url: REDIRECT_URL,
            server_callback_url: CALLBACK_URL,
        };
        // Subscribe
        if (paymentOption.orderType === 'SUBSCRIPTION') {
            if (!paymentData.recurring_data)
                throw new Error(errMsg_1.errMsg.invalidSubsData);
            paymentData.recurring_data.start_time = (0, formatFondyDate_1.formatFondyDate)(new Date());
            paymentData.subscription_callback_url = SUBS_CALLBACK_URL;
            res = await this.fondy.Subscription(paymentData);
        }
        // Pay once
        if (paymentOption.orderType === 'SINGLE_PAYMENT') {
            res = await this.fondy.Checkout(paymentData);
        }
        if (!res || !this.isPaymentSuccess(res)) {
            console.error(res);
            throw new Error(errMsg_1.errMsg.paymentCreationFailed);
        }
        return { paymentUrl: res.checkout_url };
    }
    async receivePayment(payment) {
        // check if payment is unique
        const existingPayment = await this.db.payment.findUnique({
            where: { id: Number(payment.payment_id) },
        });
        if (existingPayment)
            throw new Error(errMsg_1.errMsg.paymentAlreadyExists);
        // create payment & connect to order
        const { order } = await this.db.payment.create({
            data: {
                id: Number(payment.payment_id),
                date: new Date(),
                status: this.isPaymentSuccess(payment) ? 'SUCCESS' : 'FAILURE',
                orderId: Number(payment.order_id),
                data: payment,
            },
            select: { order: { select: { userId: true, paymentOption: true } } },
        });
        // update user data
        await this.db.historyProfile.update({
            where: { userId: order.userId },
            data: { accessUntil: this.getAccessUntil(order.paymentOption) },
        });
    }
    async receiveSubscription(payment) {
        console.log(payment);
    }
    isPaymentSuccess(payment) {
        return payment.response_status === 'success';
    }
    getAccessUntil(paymentOption) {
        const isSubscription = paymentOption.orderType === 'SUBSCRIPTION';
        if (isSubscription) {
            const now = new Date();
            now.setMonth(now.getMonth() + 1);
            return now;
        }
        if (!paymentOption.accessUntil)
            throw new Error(errMsg_1.errMsg.invalidPaymentOptionFinalDate);
        return paymentOption.accessUntil;
    }
}
exports.PaymentsService = PaymentsService;
