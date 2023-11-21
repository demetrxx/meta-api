import { Type as t } from '@sinclair/typebox';

import {
  TBHistoryQuestionInput,
  TBHistoryQuestionOutput,
} from '@/modules/history/typebox/question';

const types = ['MAIN', 'ADDITIONAL', 'TEST', 'FIRST', 'SECOND', 'DEMO'] as const;

const type = t.Union(types.map((i) => t.Literal(i)));

export const TBHistoryTicketInput = t.Object({
  questions: t.Array(TBHistoryQuestionInput),
  year: t.Number(),
  type,
});

export const TBHistoryTicketUpdateInput = t.Object({
  questions: t.Array(t.Object({ id: t.Number() })),
  year: t.Number(),
  type,
});

export const TBHistoryTicketOutput = t.Object({
  id: t.Number(),
  questions: t.Array(TBHistoryQuestionOutput),
  year: t.Number(),
  type,
});
