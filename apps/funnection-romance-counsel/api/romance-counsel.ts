import axios from "axios";

export type RomanceCounsel = {
  id: number;
  content: string;
  createdAt: string;
};

export type CreateRomanceCounselRequest = {
  content: string;
};

export const ROMANCE_COUNSEL_QUERY_KEY = [
  "funnection-romance",
  "counsel",
] as const;

const romanceCounselApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "",
});

export const createRomanceCounsel = async ({
  content,
}: CreateRomanceCounselRequest) => {
  const { data } = await romanceCounselApi.post<RomanceCounsel>(
    "/funnection-romance/counsel",
    {
      content: content.trim(),
    }
  );

  return data;
};
