import { notFound } from "next/navigation";

import { questionItems } from "@/constants/question-questions";

import { QuestionDetailClient } from "./question-detail-client";

type QuestionDetailPageProps = {
  params: Promise<{ slug: string[] }>;
};

export const generateStaticParams = () =>
  questionItems.map((_, index) => ({
    slug: [String(index + 1)],
  }));

export default async function QuestionDetailPage({
  params,
}: QuestionDetailPageProps) {
  const { slug } = await params;
  const id = Number(slug[0]);
  const question = questionItems[id - 1];

  if (!Number.isInteger(id) || !question) {
    notFound();
  }

  return <QuestionDetailClient id={id} question={question} />;
}
