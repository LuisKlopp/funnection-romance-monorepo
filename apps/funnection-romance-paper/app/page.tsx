"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import {
  getPersonalPaperRecipients,
  PERSONAL_PAPER_RECIPIENTS_QUERY_KEY,
} from "@/api";

export default function Home() {
  const recipientsQuery = useQuery({
    queryKey: PERSONAL_PAPER_RECIPIENTS_QUERY_KEY,
    queryFn: getPersonalPaperRecipients,
  });

  const recipients = recipientsQuery.data ?? [];

  return (
    <main className="fixed inset-0 flex h-[100dvh] w-full bg-[#fff9f4] text-slate-800">
      <section className="mdl:max-w-[1080px] mdl:px-8 mdl:py-8 mx-auto flex h-full w-full max-w-[480px] flex-col px-4 py-5">
        <header className="mdl:text-left shrink-0 text-center">
          <p className="mdl:text-sm text-xs font-bold text-[#d94c6a]">
            Funnection 연애특집
          </p>
          <h1 className="text-shadow-01 mdl:text-[44px] mt-1 text-3xl font-extrabold text-[#8b2248]">
            퍼스널 페이퍼
          </h1>
        </header>

        <div className="box-shadow-02 mdl:mt-8 mdl:rounded-[32px] mdl:p-6 mt-5 flex min-h-0 flex-1 flex-col rounded-[28px] border border-white/80 bg-white/60 p-4 backdrop-blur">
          <div className="no-scrollbar mdl:grid-cols-4 mdl:gap-5 grid min-h-0 flex-1 grid-cols-2 content-start gap-3 overflow-y-auto p-1">
            {recipientsQuery.isLoading &&
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="box-shadow-02 mdl:h-[140px] h-[112px] rounded-2xl border border-white/70 bg-white/45"
                  aria-hidden="true"
                />
              ))}

            {recipientsQuery.isError && (
              <button
                type="button"
                onClick={() => recipientsQuery.refetch()}
                className="btn-press-in mdl:col-span-4 col-span-2 rounded-2xl border border-white/80 bg-white/90 px-4 py-5 text-sm font-extrabold text-[#8b2248]"
              >
                유저 다시 불러오기
              </button>
            )}

            {!recipientsQuery.isLoading &&
              !recipientsQuery.isError &&
              recipients.length === 0 && (
                <p className="mdl:col-span-4 col-span-2 py-8 text-center text-sm font-semibold text-slate-500">
                  표시할 유저가 없습니다
                </p>
              )}

            {recipients.map((recipient) => (
              <Link
                key={recipient.id}
                href={`/${encodeURIComponent(recipient.generateString)}`}
                className="btn-press-in box-shadow-02 mdl:min-h-[140px] flex min-h-[112px] flex-col justify-between rounded-2xl border border-white/80 bg-white/90 p-4 transition hover:bg-white"
              >
                <span className="text-xs font-bold text-[#d94c6a]">
                  {recipient.visitCount}
                </span>
                <span className="mdl:text-2xl break-words text-center text-xl font-extrabold text-[#8b2248]">
                  {recipient.nickname}
                </span>
                <span className="text-right text-xs font-semibold text-slate-500">
                  메시지 보기
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
