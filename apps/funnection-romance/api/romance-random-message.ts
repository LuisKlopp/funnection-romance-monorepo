import axios from "axios";

export type RomanceRandomMessage = {
  id: number;
  randomMessage: string;
};

export const ROMANCE_RANDOM_MESSAGE_QUERY_KEY = [
  "funnection-romance",
  "random-message",
] as const;

export const romanceRandomMessageDetailQueryKey = (messageId: number) =>
  [...ROMANCE_RANDOM_MESSAGE_QUERY_KEY, messageId] as const;

const romanceRandomMessageApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "",
});

export const getRomanceRandomMessages = async () => {
  const { data } = await romanceRandomMessageApi.get<RomanceRandomMessage[]>(
    "/funnection-romance/random-message"
  );

  return data;
};

export const getRomanceRandomMessage = async (messageId: number) => {
  const { data } = await romanceRandomMessageApi.get<RomanceRandomMessage>(
    `/funnection-romance/random-message/${messageId}`
  );

  return data;
};
