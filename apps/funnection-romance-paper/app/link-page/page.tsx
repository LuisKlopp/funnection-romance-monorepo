"use client";

import { useQuery } from "@tanstack/react-query";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

import {
  getPersonalPaperRecipients,
  PERSONAL_PAPER_RECIPIENTS_QUERY_KEY,
  type PersonalPaperRecipient,
} from "@/api";

const PERSONAL_PAPER_ORIGIN = "https://funnection-romance-paper.vercel.app";
const COPY_FEEDBACK_DURATION_MS = 1200;

export default function LinkPage() {
  const recipientsQuery = useQuery({
    queryKey: PERSONAL_PAPER_RECIPIENTS_QUERY_KEY,
    queryFn: getPersonalPaperRecipients,
  });

  const recipients = recipientsQuery.data ?? [];

  return (
    <main className="fixed inset-0 flex h-[100dvh] w-full bg-[#fff9f4] text-slate-800">
      <section className="mdl:max-w-[920px] mdl:px-8 mdl:py-8 mx-auto flex h-full w-full max-w-[480px] flex-col px-4 py-5">
        <header className="shrink-0 text-center mdl:text-left">
          <p className="text-xs font-bold text-[#d94c6a] mdl:text-sm">
            Funnection 연애특집
          </p>
          <h1 className="text-shadow-01 mt-1 text-3xl font-extrabold text-[#8b2248] mdl:text-[44px]">
            퍼스널 페이퍼 링크
          </h1>
        </header>

        <div className="box-shadow-02 mt-5 flex min-h-0 flex-1 flex-col rounded-[28px] border border-white/80 bg-white/60 p-4 backdrop-blur mdl:mt-8 mdl:rounded-[32px] mdl:p-6">
          <div className="no-scrollbar grid min-h-0 flex-1 grid-cols-1 content-start gap-3 overflow-y-auto p-1 mdl:grid-cols-2 mdl:gap-4">
            {recipientsQuery.isLoading &&
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="box-shadow-02 h-[104px] rounded-2xl border border-white/70 bg-white/45"
                  aria-hidden="true"
                />
              ))}

            {recipientsQuery.isError && (
              <button
                type="button"
                onClick={() => recipientsQuery.refetch()}
                className="btn-press-in rounded-2xl border border-white/80 bg-white/90 px-4 py-5 text-sm font-extrabold text-[#8b2248] mdl:col-span-2"
              >
                링크 다시 불러오기
              </button>
            )}

            {!recipientsQuery.isLoading &&
              !recipientsQuery.isError &&
              recipients.length === 0 && (
                <p className="py-8 text-center text-sm font-semibold text-slate-500 mdl:col-span-2">
                  표시할 링크가 없습니다
                </p>
              )}

            {recipients.map((recipient) => (
              <PersonalPaperLinkCard
                key={recipient.id}
                recipient={recipient}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const PersonalPaperLinkCard = ({
  recipient,
}: {
  recipient: PersonalPaperRecipient;
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const paperLink = `${PERSONAL_PAPER_ORIGIN}/${encodeURIComponent(
    recipient.generateString
  )}`;

  useEffect(() => {
    if (!isCopied) return;

    const timeoutId = window.setTimeout(() => {
      setIsCopied(false);
    }, COPY_FEEDBACK_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isCopied]);

  const handleCopyLink = async () => {
    await copyText(paperLink);
    setIsCopied(true);
  };

  return (
    <article className="box-shadow-02 flex min-h-[104px] flex-col justify-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-5 py-4">
      <p className="break-words text-xl font-extrabold text-[#8b2248]">
        {recipient.nickname}
      </p>
      <div className="flex items-start gap-2">
        <a
          href={paperLink}
          target="_blank"
          rel="noreferrer"
          className="min-w-0 flex-1 break-all text-sm font-bold leading-relaxed text-slate-600 underline-offset-4 hover:underline"
        >
          {paperLink}
        </a>
        <button
          type="button"
          onClick={handleCopyLink}
          className="btn-press-in flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8b2248] text-white"
          aria-label={`${recipient.nickname} 퍼스널 페이퍼 링크 복사`}
        >
          {isCopied ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </article>
  );
};

const copyText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};
