import { notFound } from "next/navigation";

import { questionItems } from "@/constants/question-questions";

import { QuestionDetailClient } from "./question-detail-client";

type QuestionDetailPageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function QuestionDetailPage({
  params,
}: QuestionDetailPageProps) {
  const { slug } = await params;
  const id = Number(slug[0]);

  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  const question = questionItems[id - 1];

  if (!question) {
    notFound();
  }

  return <QuestionDetailClient id={id} question={question} />;
}
