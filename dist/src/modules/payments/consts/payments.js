"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subsCallbackPath = exports.paymentsCallbackPath = exports.paymentsRedirectPath = void 0;
const PAYMENTS_PATH = '/payments';
const getPath = (path) => (full = false) => {
    return full ? PAYMENTS_PATH + path : path;
};
exports.paymentsRedirectPath = getPath('/public/fondy/redirect');
exports.paymentsCallbackPath = getPath('/public/fondy/callback');
exports.subsCallbackPath = getPath('/public/fondy/subs-callback');
