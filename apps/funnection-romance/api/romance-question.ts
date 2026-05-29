import axios from "axios";

export type RomanceQuestion = {
  id: number;
  question: string;
};

export type RomanceAnswer = {
  id: number;
  questionId: number;
  nickname: string;
  answer: string;
  createdAt: string;
};

export type CreateRomanceAnswerRequest = {
  nickname: string;
  answer: string;
};

export type RomanceQuestionAnswersResponse = {
  questionId: number;
  answers: RomanceAnswer[];
};

export const ROMANCE_QUESTION_QUERY_KEY = [
  "funnection-romance",
  "question",
] as const;

export const romanceQuestionDetailQueryKey = (questionId: number) =>
  [...ROMANCE_QUESTION_QUERY_KEY, questionId] as const;

export const romanceQuestionAnswersQueryKey = (questionId: number) =>
  [...ROMANCE_QUESTION_QUERY_KEY, questionId, "answers"] as const;

const romanceQuestionApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "",
});

export const getRomanceQuestions = async () => {
  const { data } = await romanceQuestionApi.get<RomanceQuestion[]>(
    "/funnection-romance/question"
  );

  return data;
};

export const getRomanceQuestion = async (questionId: number) => {
  const { data } = await romanceQuestionApi.get<RomanceQuestion>(
    `/funnection-romance/question/${questionId}`
  );

  return data;
};

export const createRomanceQuestionAnswer = async (
  questionId: number,
  { nickname, answer }: CreateRomanceAnswerRequest
) => {
  const { data } = await romanceQuestionApi.post<RomanceAnswer>(
    `/funnection-romance/question/${questionId}/answer`,
    {
      nickname: nickname.trim(),
      answer: answer.trim(),
    }
  );

  return data;
};

export const getRomanceQuestionAnswers = async (questionId: number) => {
  const { data } =
    await romanceQuestionApi.get<RomanceQuestionAnswersResponse>(
      `/funnection-romance/question/${questionId}/answers`
    );

  return data;
};
