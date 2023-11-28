const PAYMENTS_PATH = '/payments';

export const paymentsRedirectPath = (full = false): string => {
  const path = '/public/fondy/redirect';
  return full ? PAYMENTS_PATH + path : path;
};

export const paymentsCallbackPath = (full = false): string => {
  const path = '/public/fondy/callback';
  return full ? PAYMENTS_PATH + path : path;
};
