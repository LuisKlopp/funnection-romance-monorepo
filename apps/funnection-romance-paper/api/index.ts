import axios from "axios";

export type PersonalPaperRecipient = {
  id: number;
  nickname: string;
  gender: string;
  generateString: string;
  visitCount: string;
  checkImagePath: number;
};

export type PersonalPaperMessage = {
  id: number;
  message: string;
  font: string;
  nickname: string | null;
};

export type PersonalPaperMessagesResponse = {
  user: PersonalPaperRecipient;
  messages: PersonalPaperMessage[];
};

export const PERSONAL_PAPER_RECIPIENTS_QUERY_KEY = [
  "funnection-romance",
  "history-user",
  "current-users",
] as const;

export const personalPaperMessagesQueryKey = (generateString: string) =>
  [
    "funnection-romance",
    "history-user",
    generateString,
    "messages",
  ] as const;

const personalPaperApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "",
});

export const getPersonalPaperRecipients = async () => {
  const { data } = await personalPaperApi.get<PersonalPaperRecipient[]>(
    "/funnection-romance/history-user/current-users"
  );

  return data;
};

export const getPersonalPaperMessages = async (generateString: string) => {
  const { data } = await personalPaperApi.get<PersonalPaperMessagesResponse>(
    `/funnection-romance/history-user/${generateString}/messages`
  );

  return data;
};
