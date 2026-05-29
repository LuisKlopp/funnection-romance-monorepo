import axios from "axios";

export type FirstImpressionResponse = {
  impressions: string[];
};

export type FirstImpressionSentItem = {
  id: number;
  nickname: string;
  impression: string;
};

export type FirstImpressionResultItem = {
  index: number;
  nickname: string;
  impressions: string[];
  job: string;
  sentence: string;
};

export type FirstImpressionResultResponse = {
  results: FirstImpressionResultItem[];
};

export type SendFirstImpressionRequest = {
  nickname: string;
  impression: string;
};

export const FIRST_IMPRESSION_QUERY_KEY = [
  "funnection-romance",
  "first-impression",
] as const;

export const FIRST_IMPRESSION_RESULT_QUERY_KEY = [
  "funnection-romance",
  "first-impression",
  "send",
  "result",
] as const;

const firstImpressionApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "",
});

export const getFirstImpression = async () => {
  const { data } = await firstImpressionApi.get<FirstImpressionResponse>(
    "/funnection-romance/first-impression"
  );

  return data;
};

export const getFirstImpressionResults = async () => {
  const { data } = await firstImpressionApi.get<FirstImpressionResultResponse>(
    "/funnection-romance/first-impression/send"
  );

  return data;
};

export const sendFirstImpression = async ({
  nickname,
  impression,
}: SendFirstImpressionRequest) => {
  const { data } = await firstImpressionApi.post<FirstImpressionSentItem>(
    "/funnection-romance/first-impression/send",
    {
      nickname: nickname.trim(),
      impression: impression.trim(),
    }
  );

  return data;
};
