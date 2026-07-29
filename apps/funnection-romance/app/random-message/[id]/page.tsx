import { notFound } from "next/navigation";

import { RandomMessageDetailClient } from "./random-message-detail-client";

type RandomMessageDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RandomMessageDetailPage({
  params,
}: RandomMessageDetailPageProps) {
  const { id } = await params;
  const messageId = Number(id);

  if (!Number.isInteger(messageId) || messageId < 1) {
    notFound();
  }

  return <RandomMessageDetailClient messageId={messageId} />;
}
