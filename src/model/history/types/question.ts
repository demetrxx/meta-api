interface OptionData {
  text?: string;
  img?: string;
}

export type HistoryQuestionAnswer = string | string[];

export type HistoryQuestionOptions = Record<string, OptionData>;
