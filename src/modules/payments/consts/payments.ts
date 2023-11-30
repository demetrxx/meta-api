const PAYMENTS_PATH = '/payments';

const getPath =
  (path: string) =>
  (full = false): string => {
    return full ? PAYMENTS_PATH + path : path;
  };

export const paymentsRedirectPath = getPath('/public/fondy/redirect');
export const paymentsCallbackPath = getPath('/public/fondy/callback');
export const subsCallbackPath = getPath('/public/fondy/subs-callback');
