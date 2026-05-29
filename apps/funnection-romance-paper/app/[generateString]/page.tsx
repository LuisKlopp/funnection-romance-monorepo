import { notFound } from "next/navigation";

import { PersonalPaperDetailClient } from "./personal-paper-detail-client";

type PersonalPaperDetailPageProps = {
  params: Promise<{ generateString: string }>;
};

export default async function PersonalPaperDetailPage({
  params,
}: PersonalPaperDetailPageProps) {
  const { generateString } = await params;

  if (!generateString) {
    notFound();
  }

  return (
    <PersonalPaperDetailClient
      generateString={decodeURIComponent(generateString)}
    />
  );
}
