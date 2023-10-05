import { Type as t } from '@sinclair/typebox';

export const TBHistoryTopicInput = t.Object({
  name: t.String(),
  desc: t.Optional(t.String()),
  order: t.Number(),
});

export const TBHistoryTopicOutput = t.Object({
  id: t.Number(),
  name: t.String(),
  desc: t.Optional(t.String()),
  order: t.Number(),
});
