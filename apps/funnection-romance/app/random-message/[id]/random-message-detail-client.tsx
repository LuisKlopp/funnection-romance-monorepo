"use client";

import { useQuery } from "@tanstack/react-query";
import { Home, RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  getRomanceRandomMessage,
  romanceRandomMessageDetailQueryKey,
} from "@/api";
import LetterClosedCircle from "@/public/images/letter-closed-circle.png";

type RandomMessageDetailClientProps = {
  messageId: number;
};

export const RandomMessageDetailClient = ({
  messageId,
}: RandomMessageDetailClientProps) => {
  const isValidMessageId = Number.isInteger(messageId) && messageId > 0;
  const randomMessageQuery = useQuery({
    queryKey: romanceRandomMessageDetailQueryKey(messageId),
    queryFn: () => getRomanceRandomMessage(messageId),
    retry: false,
  });

  const randomMessage = randomMessageQuery.data;
  const messageText = randomMessage?.randomMessage ?? "";
  const messageCharacters = useMemo(() => Array.from(messageText), [messageText]);
  const [visibleMessageLength, setVisibleMessageLength] = useState(0);
  const visibleMessage = messageCharacters
    .slice(0, visibleMessageLength)
    .join("");

  useEffect(() => {
    setVisibleMessageLength(0);

    if (messageCharacters.length === 0) return;

    const intervalId = window.setInterval(() => {
      setVisibleMessageLength((prevLength) => {
        if (prevLength >= messageCharacters.length) {
          window.clearInterval(intervalId);
          return prevLength;
        }

        return prevLength + 1;
      });
    }, 85);

    return () => window.clearInterval(intervalId);
  }, [messageCharacters]);

  return (
    <main className="bg-romance-gradient text-romance-ink fixed inset-0 flex h-[100dvh] w-full">
      <section className="mdl:max-w-[860px] mdl:px-8 mdl:pb-8 mdl:pt-8 mx-auto flex h-full w-full max-w-[480px] flex-col px-4 pb-4 pt-5">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <div className="mdl:h-12 mdl:w-12 h-10 w-10" aria-hidden="true" />

          <div className="min-w-0 flex-1 text-center">
            <p className="text-romance-highlight mdl:text-sm text-xs font-bold">
              랜덤 메시지
            </p>
            <h1 className="text-romance-accent text-shadow-01 mdl:text-[44px] mt-1 truncate text-2xl font-extrabold leading-none">
              {isValidMessageId ? `${messageId}번 메시지` : "메시지 없음"}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => randomMessageQuery.refetch()}
            disabled={!isValidMessageId || randomMessageQuery.isLoading}
            className="btn-press-in bg-romance-surface/85 text-romance-muted shadow-soft-card hover:text-romance-accent mdl:h-12 mdl:w-12 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 backdrop-blur disabled:opacity-45"
            aria-label="랜덤 메시지 다시 불러오기"
          >
            <RefreshCcw className="h-5 w-5" />
          </button>
        </header>

        <div className="bg-romance-surface/55 shadow-soft-card mdl:mt-8 mdl:rounded-[32px] mdl:p-8 mt-4 flex min-h-0 flex-1 flex-col rounded-[28px] border border-white/70 p-4 backdrop-blur">
          {!isValidMessageId && (
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <p className="text-romance-muted text-center text-sm font-semibold">
                올바르지 않은 랜덤 메시지 번호입니다
              </p>
            </div>
          )}

          {isValidMessageId && randomMessageQuery.isLoading && (
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5">
              <div
                className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white bg-white"
                aria-hidden="true"
              >
                <Image
                  src={LetterClosedCircle}
                  alt=""
                  className="h-14 w-14 object-contain"
                />
              </div>
              <div
                className="h-32 w-full max-w-[560px] rounded-[28px] border border-white/70 bg-white/45"
                aria-hidden="true"
              />
            </div>
          )}

          {isValidMessageId && randomMessageQuery.isError && (
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <button
                type="button"
                onClick={() => randomMessageQuery.refetch()}
                className="btn-press-in text-romance-accent shadow-soft-card rounded-2xl border border-white/80 bg-white/85 px-5 py-4 text-sm font-extrabold"
              >
                메시지 다시 불러오기
              </button>
            </div>
          )}

          {isValidMessageId &&
            !randomMessageQuery.isLoading &&
            !randomMessageQuery.isError &&
            randomMessage && (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6">
                <div className="text-romance-accent shadow-soft-card relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-white bg-white">
                  <span className="bg-romance-highlight absolute -right-2 -top-2 flex h-8 min-w-8 rotate-12 items-center justify-center rounded-full px-2 text-sm font-extrabold text-white shadow-sm">
                    {randomMessage.id}
                  </span>
                  <Image
                    src={LetterClosedCircle}
                    alt={`${randomMessage.id}번 랜덤 메시지 편지`}
                    className="h-14 w-14 object-contain"
                    priority
                  />
                </div>

                <article className="shadow-soft-card flex max-h-full w-full max-w-[620px] items-center justify-center overflow-y-auto rounded-[28px] border border-white/85 bg-white/90 px-6 py-7">
                  <p className="text-romance-ink mdl:text-xl flex min-h-[5.25rem] items-center justify-center whitespace-pre-wrap break-keep text-center text-lg font-extrabold leading-relaxed">
                    {visibleMessage}
                  </p>
                </article>
              </div>
            )}
        </div>

        <footer className="mt-4 flex shrink-0 justify-between gap-3">
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
};
