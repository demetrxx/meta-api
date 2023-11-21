import { Type as t } from '@sinclair/typebox';

export const TBHistoryQuestionInput = t.Object({
  name: t.String(),
  type: t.Union([t.Literal('SINGLE'), t.Literal('ORDER'), t.Literal('MATCH'), t.Literal('SELECT')]),
  order: t.Optional(t.Number()),
  options: t.Array(t.Any()),
  correct: t.Array(t.Number()),
  topics: t.Array(t.Number()),
  keyWords: t.Optional(t.Array(t.Object({ id: t.Number() }))),
  solution: t.Optional(t.String()),
  whereToLearn: t.Optional(t.Array(t.String())),
  advice: t.Optional(t.String()),
});

export const TBHistoryQuestionOutput = t.Object({
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
