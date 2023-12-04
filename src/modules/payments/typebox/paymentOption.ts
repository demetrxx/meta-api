import { Type as t } from '@sinclair/typebox';

const ORDER_TYPE = t.Union([t.Literal('SINGLE_PAYMENT'), t.Literal('SUBSCRIPTION')]);

export const TBPPaymentOptionInput = t.Object({
  name: t.String(),

  accessUntil: t.String(),
  orderType: ORDER_TYPE,

  price: t.Number(),
  discount: t.Optional(t.Number()),
  active: t.Optional(t.Boolean()),

  fondyInput: t.Any(),
  subjects: t.Optional(t.String()),

  order: t.Optional(t.Number()),
  options: t.Array(t.Any()),
  correct: t.Array(t.Number()),
  topics: t.Array(t.Number()),
  keyWords: t.Optional(t.Array(t.Object({ id: t.Number() }))),
  solution: t.Optional(t.String()),
  whereToLearn: t.Optional(t.Array(t.String())),
  advice: t.Optional(t.String()),
});

export const TBPaymentOptionOutput = t.Object({
  id: t.Number(),
  name: t.String(),
  type: t.String(),
  order: t.Optional(t.Number()),
  options: t.Array(t.Any()),
  correct: t.Array(t.Number()),
  topics: t.Optional(t.Array(t.Number())),
  keyWords: t.Optional(t.Array(t.Object({ id: t.Number(), value: t.String() }))),
  solution: t.Optional(t.String()),
  whereToLearn: t.Optional(t.Array(t.String())),
  advice: t.Optional(t.String()),
});
