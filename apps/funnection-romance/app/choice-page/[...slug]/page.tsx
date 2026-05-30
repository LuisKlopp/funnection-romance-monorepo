import { notFound } from "next/navigation";

import { ChoiceDetailClient } from "./choice-detail-client";

type ChoiceDetailPageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function ChoiceDetailPage({
  params,
}: ChoiceDetailPageProps) {
  const { slug } = await params;
  const id = Number(slug[0]);

  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  return <ChoiceDetailClient id={id} />;
}
