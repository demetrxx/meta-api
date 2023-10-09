import { type HistorySession } from '@prisma/client';

import { HISTORY_MAX_SCORE } from '../../consts/common';

export const ANALYSE_SESSIONS_NUM = 10;
export const GOAL_COMPLETE_SESSIONS = 30;

export function getHistorySessionProgress(completeSessions: HistorySession[]): number {
  const doneCount = completeSessions.length;
  const doneShare = doneCount / GOAL_COMPLETE_SESSIONS;

  const lastAvgScore =
    completeSessions
      .slice(0, ANALYSE_SESSIONS_NUM)
      .reduce((acc, { score }) => acc + (score ?? 0), 0) / ANALYSE_SESSIONS_NUM;

  const scoreShare = lastAvgScore / HISTORY_MAX_SCORE;

  return Math.round(((doneShare + scoreShare) / 2) * 100);
}
