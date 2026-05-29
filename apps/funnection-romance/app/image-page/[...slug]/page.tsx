import { notFound } from "next/navigation";

import { ImageDetailClient } from "./image-detail-client";

type ImageDetailPageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function ImageDetailPage({
  params,
}: ImageDetailPageProps) {
  const { slug } = await params;
  const id = Number(slug[0]);

  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  return <ImageDetailClient id={id} />;
}
