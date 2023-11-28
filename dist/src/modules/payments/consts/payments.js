"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsCallbackPath = exports.paymentsRedirectPath = void 0;
const PAYMENTS_PATH = '/payments';
const paymentsRedirectPath = (full = false) => {
    const path = '/public/fondy/redirect';
    return full ? PAYMENTS_PATH + path : path;
};
exports.paymentsRedirectPath = paymentsRedirectPath;
const paymentsCallbackPath = (full = false) => {
    const path = '/public/fondy/callback';
    return full ? PAYMENTS_PATH + path : path;
};
exports.paymentsCallbackPath = paymentsCallbackPath;
