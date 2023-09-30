import { HistoryQuestionType } from '@prisma/client';
import errors from 'http-errors';

import { errMsg } from '@/shared/consts/errMsg';

interface RateAnswerInput {
  type: HistoryQuestionType;
  correct: string;
  given: string;
}

interface RateAnswerOutput {
  isValid: boolean;
  score: number;
}

type QuestionOrder = [string, string, string, string];
type QuestionMatch = [string, string, string, string];
type QuestionSelect = [string, string, string];

function evalSingle({ correct, given }: RateAnswerInput): RateAnswerOutput {
  const res = correct === given;

  return { isValid: res, score: Number(res) };
}

function evalOrder({ correct, given }: RateAnswerInput): RateAnswerOutput {
  const givenArr = JSON.parse(given) as QuestionOrder;
  const correctArr = JSON.parse(correct) as QuestionOrder;

  if (!Array.isArray(givenArr) || givenArr.length !== 4) {
    throw errors.BadRequest(errMsg.invalidMatchQInput);
  }

  if (correctArr.every((i, idx) => i === givenArr[idx])) {
    return { isValid: true, score: 3 };
  }

  if (correctArr[0] === givenArr[0] && correctArr[3] === givenArr[3]) {
    return { isValid: false, score: 2 };
  }

  if (correctArr[0] === givenArr[0] || correctArr[3] === givenArr[3]) {
    return { isValid: false, score: 1 };
  }

  return { isValid: false, score: 0 };
}

function evalMatch({ correct, given }: RateAnswerInput): RateAnswerOutput {
  const givenArr = JSON.parse(given) as QuestionMatch;
  const correctArr = JSON.parse(correct) as QuestionMatch;

  if (!Array.isArray(givenArr) || givenArr.length !== 4) {
    throw errors.BadRequest(errMsg.invalidMatchQInput);
  }

  const score = correctArr.filter((i, idx) => i === givenArr[idx]).length;
  const isValid = score === 4;

  return { score, isValid };
}

function evalSelect({ correct, given }: RateAnswerInput): RateAnswerOutput {
  const correctArr = JSON.parse(correct) as QuestionSelect;
  const givenArr = JSON.parse(given) as QuestionSelect;

  if (!Array.isArray(givenArr) || givenArr.length !== 3) {
    throw errors.BadRequest(errMsg.invalidMatchQInput);
  }

  let score = 0;

  correctArr.forEach((i) => {
    if (givenArr.includes(i)) {
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
