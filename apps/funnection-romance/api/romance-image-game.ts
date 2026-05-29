import axios from "axios";

export type RomanceImageGame = {
  id: number;
  question: string;
};

export type RomanceImageGameUser = {
  id: number;
  nickname: string;
  gender: string;
  generateString: string;
  visitCount: string;
  checkImagePath: number;
  isCurrentUser: number;
  votes: number;
};

export type RomanceImageGameDetail = {
  question: RomanceImageGame;
  users: RomanceImageGameUser[];
  showElio: boolean;
};

export type RomanceImageGameVote = {
  id: number;
  votes: number;
  user: RomanceImageGameUser;
  question: RomanceImageGame;
};

export type ElioVisibilityResponse = {
  showElio: boolean;
};

export const ROMANCE_IMAGE_GAME_QUERY_KEY = [
  "funnection-romance",
  "image-game",
] as const;

export const ROMANCE_VOTES_QUERY_KEY = ["funnection-romance", "votes"] as const;

export const romanceImageGameDetailQueryKey = (questionId: number) =>
  [...ROMANCE_IMAGE_GAME_QUERY_KEY, questionId] as const;

export const romanceImageGameElioVisibilityQueryKey = [
  ...ROMANCE_IMAGE_GAME_QUERY_KEY,
  "elio-visibility",
] as const;

export const romanceVotesQueryKey = (questionId: number) =>
  [...ROMANCE_VOTES_QUERY_KEY, questionId] as const;

export const romanceVotesTotalQueryKey = (questionId: number) =>
  [...ROMANCE_VOTES_QUERY_KEY, questionId, "total"] as const;

const romanceImageGameApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "",
});

export const getRomanceImageGameQuestions = async () => {
  const { data } = await romanceImageGameApi.get<RomanceImageGame[]>(
    "/funnection-romance/image-game"
  );

  return data;
};

export const getRomanceImageGameDetail = async (questionId: number) => {
  const { data } = await romanceImageGameApi.get<RomanceImageGameDetail>(
    `/funnection-romance/image-game/${questionId}`
  );

  return data;
};

export const voteRomanceImageGameUser = async (
  userId: number,
  questionId: number
) => {
  const { data } = await romanceImageGameApi.post<RomanceImageGameVote>(
    `/funnection-romance/votes/${userId}/${questionId}`
  );

  return data;
};

export const getRomanceImageGameVotes = async (questionId: number) => {
  const { data } = await romanceImageGameApi.get<RomanceImageGameVote[]>(
    `/funnection-romance/votes/${questionId}`
  );

  return data;
};

export const getRomanceImageGameVoteTotal = async (questionId: number) => {
  const { data } = await romanceImageGameApi.get<number>(
    `/funnection-romance/votes/${questionId}/total`
  );

  return data;
};

export const getRomanceImageGameElioVisibility = async () => {
  const { data } = await romanceImageGameApi.get<ElioVisibilityResponse>(
    "/funnection-romance/image-game/elio-visibility"
  );

  return data;
};

export const updateRomanceImageGameElioVisibility = async (
  showElio: boolean
) => {
  const { data } = await romanceImageGameApi.patch<ElioVisibilityResponse>(
    "/funnection-romance/image-game/elio-visibility",
    {
      showElio,
    }
  );

  return data;
};
