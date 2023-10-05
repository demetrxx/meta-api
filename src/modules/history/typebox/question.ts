import { Type as t } from '@sinclair/typebox';

export const TBHistoryQuestionInput = t.Object({
  name: t.String(),
  desc: t.Optional(t.String()),
  type: t.Union([t.Literal('SINGLE'), t.Literal('ORDER'), t.Literal('MATCH'), t.Literal('SELECT')]),
  img: t.Optional(t.String()),
  options: t.Array(t.Any()),
  correct: t.Union([t.Array(t.String()), t.String()]),
  topicId: t.Number(),
  keyWords: t.Optional(t.Array(t.Object({ id: t.Number() }))),
  solution: t.Optional(t.String()),
  whereToLearn: t.Optional(t.Array(t.String())),
  advice: t.Optional(t.String()),
});

export const TBHistoryQuestionOutput = t.Object({
  id: t.Number(),
  name: t.String(),
  desc: t.Optional(t.String()),
  type: t.String(),
  img: t.Optional(t.String()),
  options: t.Array(t.Any()),
  correct: t.Union([t.Array(t.String()), t.String()]),
  topicId: t.Number(),
  keyWords: t.Optional(t.Array(t.Object({ id: t.Number(), value: t.String() }))),
  solution: t.Optional(t.String()),
  whereToLearn: t.Optional(t.Array(t.String())),
  advice: t.Optional(t.String()),
});
