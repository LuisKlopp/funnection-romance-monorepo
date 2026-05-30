"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import {
  getPersonalPaperMessages,
  type PersonalPaperMessage,
  personalPaperMessagesQueryKey,
} from "@/api";

interface PersonalPaperDetailClientProps {
  generateString: string;
}

export const PersonalPaperDetailClient = ({
  generateString,
}: PersonalPaperDetailClientProps) => {
  const messagesQuery = useQuery({
    queryKey: personalPaperMessagesQueryKey(generateString),
    queryFn: () => getPersonalPaperMessages(generateString),
  });

  const recipient = messagesQuery.data?.user;
  const recipientNickname = recipient?.nickname ?? "";
  const messages = messagesQuery.data?.messages ?? [];

  return (
    <main className="fixed inset-0 flex h-[100dvh] w-full bg-[#fff9f4] text-slate-800">
      <section className="mdl:max-w-[920px] mdl:px-8 mdl:py-8 mx-auto flex h-full w-full max-w-[480px] flex-col px-4 py-5">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <Link
            href="/"
            className="btn-press-in box-shadow-02 flex h-10 min-w-20 items-center justify-center rounded-full border border-white/80 bg-white/85 px-4 text-sm font-extrabold text-[#8b2248]"
          >
            뒤로
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="mdl:text-sm text-xs font-bold text-[#d94c6a]">
              받은 메시지
            </p>
            <h1 className="text-shadow-01 mdl:text-[40px] mt-1 truncate text-2xl font-extrabold text-[#8b2248]">
              {messagesQuery.isLoading ? "퍼스널 페이퍼" : recipientNickname}
            </h1>
          </div>

          <div className="h-10 min-w-20" aria-hidden="true" />
        </header>

        <div className="box-shadow-02 mdl:mt-8 mdl:rounded-[32px] mdl:p-6 mt-5 flex min-h-0 flex-1 flex-col rounded-[28px] border border-white/80 bg-white/60 p-4 backdrop-blur">
          {messagesQuery.isLoading && (
            <div className="flex min-h-0 flex-1 flex-col gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="box-shadow-02 h-[112px] rounded-2xl border border-white/70 bg-white/45"
                  aria-hidden="true"
                />
              ))}
            </div>
          )}

          {messagesQuery.isError && (
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <button
                type="button"
                onClick={() => messagesQuery.refetch()}
                className="btn-press-in rounded-2xl border border-white/80 bg-white/90 px-5 py-4 text-sm font-extrabold text-[#8b2248]"
              >
                메시지 다시 불러오기
              </button>
            </div>
          )}

          {!messagesQuery.isLoading &&
            !messagesQuery.isError &&
            messages.length === 0 && (
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <p className="text-center text-sm font-semibold text-slate-500">
                  아직 받은 메시지가 없습니다
                </p>
              </div>
            )}

          {!messagesQuery.isLoading &&
            !messagesQuery.isError &&
            messages.length > 0 && (
              <div className="no-scrollbar mdl:grid-cols-2 mdl:gap-4 grid min-h-0 flex-1 grid-cols-1 content-start items-start gap-3 overflow-y-auto p-1">
                {messages.map((message) => (
                  <PersonalPaperMessageCard
                    key={message.id}
                    message={message}
                  />
                ))}
              </div>
            )}
        </div>
      </section>
    </main>
  );
};

const PersonalPaperMessageCard = ({
  message,
}: {
  message: PersonalPaperMessage;
}) => {
  const fontClassName =
    message.font && message.font !== "default" ? message.font : "";

  return (
    <article className="box-shadow-02 bg-romance-accent flex h-fit flex-col rounded-2xl border border-white/45 px-5 py-4">
      <p
        className={`${fontClassName} mdl:text-lg whitespace-pre-wrap break-words text-base font-semibold leading-relaxed text-white`}
      >
        {message.message}
      </p>
    </article>
  );
};
