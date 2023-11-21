interface OptionData {
  text?: string;
  img?: string;
}

export type HistoryQuestionAnswer = number[];

export type HistoryQuestionOptions = Record<string, OptionData>;
