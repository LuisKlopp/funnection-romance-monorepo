"use client";

import { Home, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SubmitModal } from "@/components";
import {
  impressionKeywords,
  impressionNicknames,
} from "@/constants/impression-keywords";

export default function ImpressionPage() {
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [drawnKeywords, setDrawnKeywords] = useState<string[]>([]);
  const [drawCount, setDrawCount] = useState(0);
  const [submittedMessage, setSubmittedMessage] = useState("");

  const remainingCount = impressionKeywords.length - drawnKeywords.length;
  const isNicknameDisabled = currentKeyword.length === 0;

  const submittedKeywordSet = useMemo(() => {
    return new Set(drawnKeywords);
  }, [drawnKeywords]);

  useEffect(() => {
    if (!submittedMessage) return;

    const timeoutId = window.setTimeout(() => {
      setSubmittedMessage("");
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [submittedMessage]);

  const handleDrawKeyword = () => {
    const keywordPool =
      drawnKeywords.length === impressionKeywords.length
        ? [...impressionKeywords]
        : impressionKeywords.filter((keyword) => {
            return !submittedKeywordSet.has(keyword);
          });
    const nextKeyword =
      keywordPool[Math.floor(Math.random() * keywordPool.length)];

    setCurrentKeyword(nextKeyword);
    setDrawCount((prev) => prev + 1);
    setDrawnKeywords((prev) => {
      if (prev.length === impressionKeywords.length) {
        return [nextKeyword];
      }

      return [...prev, nextKeyword];
    });
  };

  const handleSubmitImpression = (nickname: string) => {
    if (!currentKeyword) return;

    setSubmittedMessage(`${nickname}님에게 '${currentKeyword}' 전달 완료`);
    setCurrentKeyword("");
  };

  return (
    <main className="bg-romance-gradient text-romance-ink fixed inset-0 h-[100dvh] w-full">
      <section className="mdl:hidden mx-auto flex h-full w-full max-w-[480px] flex-col px-4 pb-4 pt-5">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <Link
            href="/"
            className="btn-press-in bg-romance-surface/85 text-romance-accent shadow-soft-card flex h-10 w-10 items-center justify-center rounded-full border border-white/80 backdrop-blur"
            aria-label="홈으로 이동"
          >
            <Home className="h-5 w-5" />
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="text-romance-highlight text-xs font-bold">
              Funnection 연애특집
            </p>
            <h1 className="text-romance-accent text-shadow-01 mt-1 text-2xl font-extrabold leading-none">
              첫인상
            </h1>
          </div>

          <div className="h-10 w-10" aria-hidden="true" />
        </header>

        <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4">
          <section className="bg-romance-surface/60 shadow-soft-card flex shrink-0 flex-col items-center rounded-[24px] border border-white/75 px-4 py-4 text-center backdrop-blur">
            <div className="flex min-h-[58px] w-full items-center justify-center rounded-[18px] border border-white/80 bg-white/70 px-4">
              {currentKeyword ? (
                <span
                  key={drawCount}
                  className="impression-keyword-pop text-shadow-01 text-[24px] font-extrabold leading-none text-slate-800"
                >
                  {currentKeyword}
                </span>
              ) : (
                <span className="text-romance-muted/65 text-xs font-extrabold">
                  키워드를 뽑아주세요
                </span>
              )}
            </div>

            <div className="mt-3 flex w-full items-center gap-3">
              <button
                type="button"
                onClick={handleDrawKeyword}
                className="btn-press-in bg-romance-accent shadow-soft-card flex h-11 min-w-[142px] items-center justify-center gap-2 rounded-full border border-white/80 px-4 text-sm font-extrabold text-white transition hover:brightness-105"
              >
                <Sparkles className="h-4 w-4" />
                키워드 뽑기
              </button>

              <p className="text-romance-muted/80 flex-1 text-right text-xs font-semibold">
                남은 키워드{" "}
                {remainingCount === 0
                  ? impressionKeywords.length
                  : remainingCount}
                개
              </p>
            </div>
          </section>

          <section className="bg-romance-surface/55 shadow-soft-card flex shrink-0 flex-col rounded-[28px] border border-white/70 p-3 backdrop-blur">
            <div className="mb-3 flex shrink-0 items-center justify-between px-1">
              <p className="text-romance-ink text-sm font-extrabold">닉네임</p>
              <p className="text-romance-muted text-xs font-semibold">
                {impressionNicknames.length}명
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-1">
              {impressionNicknames.map((nickname) => (
                <button
                  key={nickname}
                  type="button"
                  onClick={() => handleSubmitImpression(nickname)}
                  disabled={isNicknameDisabled}
                  className={`btn-press-in shadow-soft-card flex min-h-[46px] items-center justify-center rounded-xl border px-3 text-sm font-extrabold transition ${
                    isNicknameDisabled
                      ? "text-romance-muted/45 border-white/70 bg-white/55"
                      : "text-romance-accent hover:border-romance-line hover:bg-romance-tint border-white/85 bg-white/90"
                  }`}
                  aria-label={
                    currentKeyword
                      ? `${nickname}에게 ${currentKeyword} 키워드 전달`
                      : `${nickname} 선택 비활성화`
                  }
                >
                  {nickname}
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="mdl:flex hidden h-full w-full flex-col items-center justify-center gap-6 px-8">
        <h1 className="text-romance-accent text-shadow-01 text-[42px] font-extrabold leading-none">
          Funnection 첫인상 키워드
        </h1>
        <button
          type="button"
          className="btn-press-in bg-romance-surface/90 text-romance-accent shadow-soft-card min-w-[160px] rounded-xl border border-white/80 px-6 py-3 text-lg font-extrabold backdrop-blur hover:bg-white"
        >
          첫인상 확인
        </button>
      </section>

      {submittedMessage && (
        <SubmitModal
          contents={submittedMessage}
          overlayClassName="mdl:hidden"
        />
      )}
    </main>
  );
}
