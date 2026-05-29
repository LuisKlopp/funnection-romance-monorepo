import { notFound } from "next/navigation";

import { PersonalDetailClient } from "./personal-detail-client";

type PersonalDetailPageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function PersonalDetailPage({
  params,
}: PersonalDetailPageProps) {
  const { slug } = await params;
  const generateString = slug[0];

  if (!generateString) {
    notFound();
  }

  return <PersonalDetailClient generateString={decodeURIComponent(generateString)} />;
}
