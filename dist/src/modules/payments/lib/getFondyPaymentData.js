"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFondyPaymentData = void 0;
function getFondyPaymentData(data) {
    let payment = data;
    if (payment.data) {
        try {
            payment = JSON.parse(Buffer.from(payment.data, 'base64').toString('utf-8'))?.order;
        }
        catch (err) {
            console.error('Fondy subscription parse error:\n', err);
            return;
        }
    }
    return payment;
}
exports.getFondyPaymentData = getFondyPaymentData;
