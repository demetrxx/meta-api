import { type HistoryQuestion } from '@prisma/client';

import { evalHistoryAnswer } from '../../lib';
import { type HistorySessionAnswers } from '../../types/session';

interface HistorySessionAnalytics {
  score: number;
  rate: number;
  failed: number[];
  answered: number[];
}

function getHistoryRateFromScore2021(score: number): number {
  if (score >= 25 && score <= 48) {
    return 100 + (score - 25) * 3;
  } else if (score >= 49 && score <= 72) {
    return 153 + (score - 49) * 2;
  } else if (score >= 73 && score <= 94) {
    if (score === 85) {
      return 192.5;
    } else if (score === 92) {
      return 198.5;
    } else {
      return 181 + (score - 73);
    }
  } else {
    return 0;
  }
}

export function getHistorySessionAnalytics(
  questions: HistoryQuestion[],
  answers: HistorySessionAnswers,
): HistorySessionAnalytics {
  const answered = [];
  const failed = [];
  let totalScore = 0;

  for (const { id, correct, type } of questions) {
    const { isValid, score } = evalHistoryAnswer({
      type,
      correct,
      given: answers[id],
    });

    totalScore += score;

    if (isValid) {
      answered.push(id);
    } else {
      failed.push(id);
    }
  }

  const rate = getHistoryRateFromScore2021(totalScore);

  return {
    rate,
    answered,
    failed,
    score: totalScore,
  };
}
