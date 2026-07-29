"use client";

import { useQuery } from "@tanstack/react-query";
import { Home, RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  getRomanceRandomMessages,
  ROMANCE_RANDOM_MESSAGE_QUERY_KEY,
} from "@/api";
import LetterClosedCircle from "@/public/images/letter-closed-circle.png";

export default function RandomMessagePage() {
  const randomMessagesQuery = useQuery({
    queryKey: ROMANCE_RANDOM_MESSAGE_QUERY_KEY,
    queryFn: getRomanceRandomMessages,
  });

  const randomMessages = randomMessagesQuery.data ?? [];

  return (
    <main className="bg-romance-gradient text-romance-ink fixed inset-0 flex h-[100dvh] w-full">
      <section className="mdl:max-w-[1080px] mdl:px-8 mdl:pb-8 mdl:pt-8 mx-auto flex h-full w-full max-w-[480px] flex-col px-4 pb-4 pt-5">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <div className="mdl:hidden h-10 w-10" aria-hidden="true" />

          <div className="mdl:text-left min-w-0 flex-1 text-center">
            <p className="text-romance-highlight mdl:text-sm text-xs font-bold">
              Funnection 연애특집
            </p>
            <h1 className="text-romance-accent text-shadow-01 mdl:text-[44px] mt-1 text-2xl font-extrabold leading-none">
              랜덤 메시지
            </h1>
          </div>

          <button
            type="button"
            onClick={() => randomMessagesQuery.refetch()}
            disabled={randomMessagesQuery.isLoading}
            className="btn-press-in bg-romance-surface/85 text-romance-muted shadow-soft-card hover:text-romance-accent mdl:h-12 mdl:w-12 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 backdrop-blur disabled:opacity-45"
            aria-label="랜덤 메시지 다시 불러오기"
          >
            <RefreshCcw className="h-5 w-5" />
          </button>
        </header>

        <div className="bg-romance-surface/55 shadow-soft-card mdl:mt-8 mdl:rounded-[32px] mdl:p-6 mt-4 flex min-h-0 flex-1 flex-col rounded-[28px] border border-white/70 p-3 backdrop-blur">
          <div className="mdl:mb-5 mb-3 flex shrink-0 items-center justify-between gap-2 px-1">
            <p className="text-romance-muted mdl:text-base text-sm font-bold">
              전체 {randomMessages.length}개
            </p>
          </div>

          <div className="no-scrollbar mdl:grid-cols-5 mdl:gap-x-8 mdl:gap-y-8 mdl:p-2 grid min-h-0 flex-1 touch-pan-y grid-cols-3 content-start gap-x-4 gap-y-6 overflow-x-hidden overflow-y-auto overscroll-x-none p-2">
            {randomMessagesQuery.isLoading &&
              Array.from({ length: 21 }).map((_, index) => (
                <div
                  key={index}
                  className="shadow-soft-card mdl:h-[112px] mdl:rounded-[24px] h-[96px] rounded-2xl border border-white/70 bg-white/45"
                  aria-hidden="true"
                />
              ))}

            {randomMessagesQuery.isError && (
              <button
                type="button"
                onClick={() => randomMessagesQuery.refetch()}
                className="btn-press-in text-romance-accent col-span-3 rounded-2xl border border-white/80 bg-white/85 px-4 py-5 text-sm font-extrabold"
              >
                랜덤 메시지 다시 불러오기
              </button>
            )}

            {!randomMessagesQuery.isLoading &&
              !randomMessagesQuery.isError &&
              randomMessages.length === 0 && (
                <p className="text-romance-muted col-span-3 py-8 text-center text-sm font-semibold">
                  표시할 랜덤 메시지가 없습니다
                </p>
              )}

            {randomMessages.map((randomMessage) => (
              <Link
                key={randomMessage.id}
                href={`/random-message/${randomMessage.id}`}
                className="btn-press-in shadow-soft-card text-romance-accent hover:border-romance-tint hover:bg-romance-tint mdl:h-[112px] mdl:rounded-[24px] relative flex h-[96px] items-center justify-center rounded-2xl border border-white/85 bg-white/90 transition"
                aria-label={`${randomMessage.id}번 랜덤 메시지 열기`}
              >
                <span className="bg-romance-highlight absolute -right-2 -top-2 flex h-8 min-w-8 rotate-12 items-center justify-center rounded-full px-2 text-sm font-extrabold text-white shadow-sm">
                  {randomMessage.id}
                </span>
                <Image
                  src={LetterClosedCircle}
                  alt={`${randomMessage.id}번 랜덤 메시지 편지`}
                  className="mdl:h-24 mdl:w-24 h-16 w-16 object-contain"
                />
              </Link>
            ))}
          </div>
        </div>

        <footer className="mt-4 flex shrink-0 justify-between">
          <Link
            href="/"
            className="btn-press-in bg-romance-surface/90 text-romance-accent shadow-soft-card mdl:min-w-[150px] mdl:text-base flex h-12 min-w-[128px] items-center justify-center gap-2 rounded-full border border-white/80 px-5 text-sm font-extrabold backdrop-blur hover:bg-white"
          >
            <Home className="h-5 w-5" />
            Home
          </Link>
        </footer>
      </section>
    </main>
  );
}
