import { Type as t } from '@sinclair/typebox';

export const TBHistoryKeyWordInput = t.Object({
  name: t.String(),
  topicId: t.Number(),
});

export const TBHistoryKeyWordOutput = t.Object({
  id: t.Number(),
  name: t.String(),
  topicId: t.Number(),
});
