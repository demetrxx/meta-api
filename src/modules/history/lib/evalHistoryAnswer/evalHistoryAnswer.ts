import { HistoryQuestionType, type Prisma } from '@prisma/client';
import errors from 'http-errors';

import { errMsg } from '@/shared/consts/errMsg';

interface RateAnswerInput {
  type: HistoryQuestionType;
  correct: Prisma.JsonValue;
  given: Prisma.JsonValue;
}

interface RateAnswerOutput {
  isValid: boolean;
  score: number;
}

function evalSingle({ correct, given }: RateAnswerInput): RateAnswerOutput {
  const res = correct === given;

  return { isValid: res, score: Number(res) };
}

function evalOrder({ correct, given }: RateAnswerInput): RateAnswerOutput {
  if (!Array.isArray(correct)) {
    throw errors.InternalServerError(errMsg.invalidQuestionData);
  }

  if (!Array.isArray(given) || given.length !== 4) {
    throw errors.BadRequest(errMsg.invalidQInput);
  }

  if (correct.every((i, idx) => i === given[idx])) {
    return { isValid: true, score: 3 };
  }

  if (correct[0] === given[0] && correct[3] === given[3]) {
    return { isValid: false, score: 2 };
  }

  if (correct[0] === given[0] || correct[3] === given[3]) {
    return { isValid: false, score: 1 };
  }

  return { isValid: false, score: 0 };
}

function evalMatch({ correct, given }: RateAnswerInput): RateAnswerOutput {
  if (!Array.isArray(correct)) {
    throw errors.InternalServerError(errMsg.invalidQuestionData);
  }

  if (!Array.isArray(given) || given.length !== 4) {
    throw errors.BadRequest(errMsg.invalidQInput);
  }

  const score = correct.filter((i, idx) => i === given[idx]).length;
  const isValid = score === 4;

  return { score, isValid };
}

function evalSelect({ correct, given }: RateAnswerInput): RateAnswerOutput {
  if (!Array.isArray(correct)) {
    throw errors.InternalServerError(errMsg.invalidQuestionData);
  }

  if (!Array.isArray(given) || given.length !== 3) {
    throw errors.BadRequest(errMsg.invalidQInput);
  }

  let score = 0;

  correct.forEach((i) => {
    if (given.includes(i)) {
      score += 1;
    }
  });

  const isValid = score === 3;

  return { score, isValid };
}

const handlerMap = {
  [HistoryQuestionType.SINGLE]: evalSingle,
  [HistoryQuestionType.ORDER]: evalOrder,
  [HistoryQuestionType.MATCH]: evalMatch,
  [HistoryQuestionType.SELECT]: evalSelect,
};

export function evalHistoryAnswer(input: RateAnswerInput): RateAnswerOutput {
  return handlerMap[input.type](input);
}
