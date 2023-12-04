import { Type as t } from '@sinclair/typebox';

const ORDER_TYPE = t.Union([t.Literal('SINGLE_PAYMENT'), t.Literal('SUBSCRIPTION')]);
const SUBJECT = t.Union([t.Literal('HISTORY')]);

export const TBPPaymentOptionInput = t.Object({
  name: t.String(),

  accessUntil: t.String(),
  orderType: ORDER_TYPE,

  price: t.Number(),
  discount: t.Optional(t.Number()),
  active: t.Optional(t.Boolean()),

  fondyInput: t.Any(),
  subjects: t.Array(SUBJECT),
});

export const TBPaymentOptionOutput = t.Object({
  id: t.Number(),
  name: t.String(),

  accessUntil: t.String(),
  orderType: ORDER_TYPE,

  price: t.Number(),
  discount: t.Optional(t.Number()),
  active: t.Optional(t.Boolean()),

  fondyInput: t.Any(),
  subjects: t.Array(SUBJECT),
});
