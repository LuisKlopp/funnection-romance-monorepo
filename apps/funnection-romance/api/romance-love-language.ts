import axios from "axios";

export type LoveLanguage = {
  loveLanguage: string;
  loveLanguageOrder: number;
};

export type LoveLanguages = Record<string, LoveLanguage[]>;

export type LoveLanguageSimilarPair = {
  user1: string;
  user2: string;
  score: number;
};

export type LoveLanguageUserCount = {
  userCount: number;
};

export type LoveLanguageAverage = {
  loveLanguage: string;
  averageOrder: string;
};

export type LoveLanguageAverageResponse = {
  loveLanguageStats: LoveLanguageAverage[];
};

export type CreateLoveLanguageRequest = {
  userId: string;
  loveLanguages: LoveLanguage[];
};

export const ROMANCE_LOVE_LANGUAGE_QUERY_KEY = [
  "funnection-romance",
  "love-language",
] as const;

export const ROMANCE_LOVE_LANGUAGE_LIST_QUERY_KEY = [
  ...ROMANCE_LOVE_LANGUAGE_QUERY_KEY,
  "list",
] as const;

export const ROMANCE_LOVE_LANGUAGE_PAIR_QUERY_KEY = [
  ...ROMANCE_LOVE_LANGUAGE_QUERY_KEY,
  "similar-pair",
] as const;

export const ROMANCE_LOVE_LANGUAGE_COUNT_QUERY_KEY = [
  ...ROMANCE_LOVE_LANGUAGE_QUERY_KEY,
  "user-count",
] as const;

export const ROMANCE_LOVE_LANGUAGE_AVERAGE_QUERY_KEY = [
  ...ROMANCE_LOVE_LANGUAGE_QUERY_KEY,
  "average",
] as const;

const romanceLoveLanguageApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "",
});

export const createRomanceLoveLanguage = async ({
  userId,
  loveLanguages,
}: CreateLoveLanguageRequest) => {
  const { data } = await romanceLoveLanguageApi.post(
    "/funnection-romance/love-language",
    {
      userId: userId.trim(),
      loveLanguages,
    }
  );

  return data;
};

export const getRomanceLoveLanguages = async () => {
  const { data } = await romanceLoveLanguageApi.get<LoveLanguages>(
    "/funnection-romance/love-language"
  );

  return data;
};

export const getRomanceLoveLanguageSimilarPair = async () => {
  const { data } =
    await romanceLoveLanguageApi.get<LoveLanguageSimilarPair>(
      "/funnection-romance/love-language/similar-pair"
    );

  return data;
};

export const getRomanceLoveLanguageUserCount = async () => {
  const { data } = await romanceLoveLanguageApi.get<LoveLanguageUserCount>(
    "/funnection-romance/love-language/user-count"
  );

  return data;
};

export const getRomanceLoveLanguageAverage = async () => {
  const { data } =
    await romanceLoveLanguageApi.get<LoveLanguageAverageResponse>(
      "/funnection-romance/love-language/average"
    );

  return data;
};
