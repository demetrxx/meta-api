import { Type as t } from '@sinclair/typebox';

export const TBHistoryTicketInput = t.Object({
  questions: t.Array(t.Object({ id: t.Number() })),
  meta: t.Object({
    year: t.Number(),
    type: t.Union([t.Literal('MAIN'), t.Literal('ADDITIONAL'), t.Literal('TEST')]),
  }),
});

export const TBHistoryTicketOutput = t.Object({
  id: t.Number(),
  questions: t.Array(t.Object({ id: t.Number() })),
  meta: t.Object({
    year: t.Number(),
    type: t.Union([t.Literal('MAIN'), t.Literal('ADDITIONAL'), t.Literal('TEST')]),
  }),
});
