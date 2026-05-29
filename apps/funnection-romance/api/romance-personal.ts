import axios from "axios";

export type RomancePersonalUser = {
  id: number;
  nickname: string;
  gender: string;
  generateString: string;
  visitCount: string;
  checkImagePath: number;
};

export type RomancePersonalMessage = {
  id: number;
  message: string;
  font: string;
  nickname: string | null;
};

export type RomancePersonalUserMessages = {
  messages: RomancePersonalMessage[];
  user: RomancePersonalUser;
};

export type CreateRomancePersonalMessageRequest = {
  message: string;
  font: string;
  nickname?: string | null;
};

export const ROMANCE_PERSONAL_QUERY_KEY = [
  "funnection-romance",
  "personal",
] as const;

export const romancePersonalUserQueryKey = (generateString: string) =>
  [...ROMANCE_PERSONAL_QUERY_KEY, generateString] as const;

const romancePersonalApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "",
});

export const getRomancePersonalUsers = async () => {
  const { data } = await romancePersonalApi.get<RomancePersonalUser[]>(
    "/funnection-romance/history-user"
  );

  return data;
};

export const getRomancePersonalUserMessages = async (
  generateString: string
) => {
  const { data } = await romancePersonalApi.get<RomancePersonalUserMessages>(
    `/funnection-romance/history-user/${generateString}/messages`
  );

  return data;
};

export const createRomancePersonalMessage = async (
  userId: number,
  { message, font, nickname }: CreateRomancePersonalMessageRequest
) => {
  const requestBody: CreateRomancePersonalMessageRequest = {
    message: message.trim(),
    font,
  };

  if (nickname?.trim()) {
    requestBody.nickname = nickname.trim();
  }

  const { data } = await romancePersonalApi.post(
    `/funnection-romance/history-user/${userId}/answers`,
    requestBody
  );

  return data;
};
