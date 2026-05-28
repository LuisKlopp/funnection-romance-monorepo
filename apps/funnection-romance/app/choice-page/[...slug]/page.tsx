import { notFound } from "next/navigation";

import { oxQuestions } from "@/constants/choice-questions";

import { ChoiceDetailClient } from "./choice-detail-client";

type ChoiceDetailPageProps = {
  params: Promise<{ slug: string[] }>;
};

export const generateStaticParams = () =>
  oxQuestions.map((_, index) => ({
    slug: [String(index + 1)],
  }));

export default async function ChoiceDetailPage({
  params,
}: ChoiceDetailPageProps) {
  const { slug } = await params;
  const id = Number(slug[0]);
  const question = oxQuestions[id - 1];

  if (!Number.isInteger(id) || !question) {
    notFound();
  }

  return <ChoiceDetailClient id={id} question={question} />;
}
