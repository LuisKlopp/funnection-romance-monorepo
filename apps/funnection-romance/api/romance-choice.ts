import axios from "axios";

export type RomanceChoiceAnswerValue = "O" | "X";

export type RomanceChoice = {
  id: number;
  question: string;
};

export type RomanceChoiceAnswer = {
  id: number;
  choiceId: number;
  nickname: string;
  answer: RomanceChoiceAnswerValue;
  createdAt: string;
  updatedAt: string;
};

export type SaveRomanceChoiceAnswerRequest = {
  nickname: string;
  answer: RomanceChoiceAnswerValue;
};

export type RomanceChoiceResultResponse = {
  questionId: number;
  O: number;
  X: number;
};

export type RomanceChoiceTotalResponse = {
  questionId: number;
  total: number;
};

export type RomanceChoiceChemistryResponse = {
  questionId: number;
  nickname: string;
  answer: RomanceChoiceAnswerValue;
  count: number;
  chemistry: {
    id: number;
    nickname: string;
    answer: RomanceChoiceAnswerValue;
  }[];
};

export type RomanceChoiceTopChemistryCouple = {
  id?: number;
  nickname1?: string;
  nickname2?: string;
  firstNickname?: string;
  secondNickname?: string;
  leftNickname?: string;
  rightNickname?: string;
  nicknames?: string[];
  matchedCount?: number;
  matchCount?: number;
  sameAnswerCount?: number;
};

export type RomanceChoiceTopChemistryResponse = {
  totalQuestionCount?: number;
  totalQuestions?: number;
  questionCount?: number;
  matchedQuestionCount?: number;
  matchedCount?: number;
  matchCount?: number;
  sameAnswerCount?: number;
  coupleCount?: number;
  couples?: RomanceChoiceTopChemistryCouple[];
  topCouples?: RomanceChoiceTopChemistryCouple[];
  items?: RomanceChoiceTopChemistryCouple[];
};

export const ROMANCE_CHOICE_QUERY_KEY = [
  "funnection-romance",
  "choice",
] as const;

export const romanceChoiceDetailQueryKey = (choiceId: number) =>
  [...ROMANCE_CHOICE_QUERY_KEY, choiceId] as const;

export const romanceChoiceResultQueryKey = (choiceId: number) =>
  [...ROMANCE_CHOICE_QUERY_KEY, choiceId, "result"] as const;

export const romanceChoiceTotalQueryKey = (choiceId: number) =>
  [...ROMANCE_CHOICE_QUERY_KEY, choiceId, "total"] as const;

export const romanceChoiceChemistryQueryKey = (
  choiceId: number,
  nickname: string
) => [...ROMANCE_CHOICE_QUERY_KEY, choiceId, "chemistry", nickname] as const;

export const romanceChoiceTopChemistryQueryKey = (
  questionIds: readonly number[] = []
) => [...ROMANCE_CHOICE_QUERY_KEY, "chemistry", questionIds] as const;

const romanceChoiceApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "",
});

export const getRomanceChoices = async () => {
  const { data } = await romanceChoiceApi.get<RomanceChoice[]>(
    "/funnection-romance/choice"
  );

  return data;
};

export const getRomanceChoice = async (choiceId: number) => {
  const { data } = await romanceChoiceApi.get<RomanceChoice>(
    `/funnection-romance/choice/${choiceId}`
  );

  return data;
};

export const saveRomanceChoiceAnswer = async (
  choiceId: number,
  { nickname, answer }: SaveRomanceChoiceAnswerRequest
) => {
  const { data } = await romanceChoiceApi.post<RomanceChoiceAnswer>(
    `/funnection-romance/choice/${choiceId}/answer`,
    {
      nickname: nickname.trim(),
      answer,
    }
  );

  return data;
};

export const getRomanceChoiceResult = async (choiceId: number) => {
  const { data } = await romanceChoiceApi.get<RomanceChoiceResultResponse>(
    `/funnection-romance/choice/${choiceId}/result`
  );

  return data;
};

export const getRomanceChoiceTotal = async (choiceId: number) => {
  const { data } = await romanceChoiceApi.get<RomanceChoiceTotalResponse>(
    `/funnection-romance/choice/${choiceId}/total`
  );

  return data;
};

export const getRomanceChoiceChemistry = async (
  choiceId: number,
  nickname: string
) => {
  const { data } = await romanceChoiceApi.get<RomanceChoiceChemistryResponse>(
    `/funnection-romance/choice/${choiceId}/chemistry`,
    {
      params: {
        nickname: nickname.trim(),
      },
    }
  );

  return data;
};

export const getRomanceChoiceTopChemistry = async (
  questionIds: readonly number[] = []
) => {
  const { data } = await romanceChoiceApi.get<RomanceChoiceTopChemistryResponse>(
    "/funnection-romance/choice/chemistry",
    {
      params: questionIds.length
        ? {
            questionIds: questionIds.join(","),
          }
        : undefined,
    }
  );

  return data;
};
