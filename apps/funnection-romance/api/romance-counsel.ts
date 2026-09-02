import axios from "axios";

export type RomanceCounsel = {
  id: number;
  content: string;
  createdAt: string;
};

export type RomanceCounselSource = "default" | "second";

export const ROMANCE_COUNSEL_QUERY_KEY = [
  "funnection-romance",
  "counsel",
] as const;

const ROMANCE_COUNSEL_ENDPOINTS = {
  default: "/funnection-romance/counsel",
  second: "/funnection-romance/counsel-second",
} as const satisfies Record<RomanceCounselSource, string>;

const romanceCounselApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "",
});

export const getRomanceCounselQueryKey = (source: RomanceCounselSource) =>
  [...ROMANCE_COUNSEL_QUERY_KEY, source] as const;

export const getRomanceCounsels = async (
  source: RomanceCounselSource = "default"
) => {
  const { data } = await romanceCounselApi.get<RomanceCounsel[]>(
    ROMANCE_COUNSEL_ENDPOINTS[source]
  );

  return data;
};
