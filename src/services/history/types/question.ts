type Option = 'A' | 'B' | 'C' | 'D' | 'E';
type OptionNumber = string;

interface OptionData {
  text?: string;
  img?: string;
}

type HistoryQuestionSingleCorrect = Option;
type HistoryQuestionOrderCorrect = [Option, Option, Option, Option];
type HistoryQuestionMatchCorrect = [Option, Option, Option, Option];
type HistoryQuestionSelectCorrect = [OptionNumber, OptionNumber, OptionNumber];

export type HistoryQuestionCorrect =
  | HistoryQuestionSingleCorrect
  | HistoryQuestionOrderCorrect
  | HistoryQuestionMatchCorrect
  | HistoryQuestionSelectCorrect;

export type HistoryQuestionOptions = OptionalRecord<Option | OptionNumber, OptionData>;
