import axios from "axios";

export type RomanceCounsel = {
  id: number;
  content: string;
  createdAt: string;
};

export const ROMANCE_COUNSEL_QUERY_KEY = [
  "funnection-romance",
  "counsel",
] as const;

const romanceCounselApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "",
});

export const getRomanceCounsels = async () => {
  const { data } = await romanceCounselApi.get<RomanceCounsel[]>(
    "/funnection-romance/counsel"
  );

  return data;
};
