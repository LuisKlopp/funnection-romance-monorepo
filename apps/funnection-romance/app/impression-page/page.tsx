"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Home, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { FirstImpressionResultItem } from "@/api";
import {
  FIRST_IMPRESSION_QUERY_KEY,
  FIRST_IMPRESSION_RESULT_QUERY_KEY,
  getFirstImpression,
  getFirstImpressionResults,
  getRomancePersonalUsers,
  ROMANCE_PERSONAL_QUERY_KEY,
  sendFirstImpression,
} from "@/api";
import { SubmitModal } from "@/components";

export default function ImpressionPage() {
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [drawnKeywords, setDrawnKeywords] = useState<string[]>([]);
  const [submittedNicknames, setSubmittedNicknames] = useState<string[]>([]);
  const [drawCount, setDrawCount] = useState(0);
  const [submittedMessage, setSubmittedMessage] = useState("");
  const [selectedResult, setSelectedResult] =
    useState<FirstImpressionResultItem | null>(null);
  const [isNicknameVisible, setIsNicknameVisible] = useState(false);

  const firstImpressionQuery = useQuery({
    queryKey: FIRST_IMPRESSION_QUERY_KEY,
    queryFn: getFirstImpression,
  });

  const firstImpressionResultQuery = useQuery({
    queryKey: FIRST_IMPRESSION_RESULT_QUERY_KEY,
    queryFn: getFirstImpressionResults,
    enabled: false,
  });

  const romanceUsersQuery = useQuery({
    queryKey: ROMANCE_PERSONAL_QUERY_KEY,
    queryFn: getRomancePersonalUsers,
  });

  const sendMutation = useMutation({
    mutationFn: sendFirstImpression,
    onSuccess: (sentItem) => {
      setSubmittedMessage(
        `${sentItem.nickname}님에게 '${sentItem.impression}' 전달 완료`
      );
      setSubmittedNicknames((prev) =>
        prev.includes(sentItem.nickname.trim())
          ? prev
          : [...prev, sentItem.nickname.trim()]
      );
      setCurrentKeyword("");
    },
    onError: () => {
      setSubmittedMessage("키워드 전달에 실패했습니다");
    },
  });

  const impressions = firstImpressionQuery.data?.impressions ?? [];
  const remainingCount = impressions.length - drawnKeywords.length;
  const displayedRemainingCount =
    impressions.length === 0
      ? 0
      : remainingCount === 0
        ? impressions.length
        : remainingCount;
  const isKeywordDrawDisabled =
    firstImpressionQuery.isLoading || impressions.length === 0;
  const isNicknameDisabled =
    currentKeyword.trim().length === 0 || sendMutation.isPending;
  const nicknames = useMemo(
    () =>
      (romanceUsersQuery.data ?? [])
        .filter((user) => user.id !== 9)
        .map((user) => user.nickname.trim())
        .filter(Boolean),
    [romanceUsersQuery.data]
  );

  const submittedKeywordSet = useMemo(() => {
    return new Set(drawnKeywords);
  }, [drawnKeywords]);
  const submittedNicknameSet = useMemo(() => {
    return new Set(submittedNicknames);
  }, [submittedNicknames]);
  const results = firstImpressionResultQuery.data?.results ?? [];

  useEffect(() => {
    if (!submittedMessage) return;

    const timeoutId = window.setTimeout(() => {
      setSubmittedMessage("");
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [submittedMessage]);

  const handleDrawKeyword = () => {
    if (isKeywordDrawDisabled) return;

    const keywordPool =
      drawnKeywords.length === impressions.length
        ? [...impressions]
        : impressions.filter((keyword) => {
            return !submittedKeywordSet.has(keyword);
          });
    const nextKeyword =
      keywordPool[Math.floor(Math.random() * keywordPool.length)];

    setCurrentKeyword(nextKeyword);
    setDrawCount((prev) => prev + 1);
    setDrawnKeywords((prev) => {
      if (prev.length === impressions.length) {
        return [nextKeyword];
      }

      return [...prev, nextKeyword];
    });
  };

  const handleSubmitImpression = (nickname: string) => {
    const trimmedNickname = nickname.trim();
    const trimmedKeyword = currentKeyword.trim();

    if (
      !trimmedNickname ||
      !trimmedKeyword ||
      submittedNicknameSet.has(trimmedNickname) ||
      sendMutation.isPending
    ) {
      return;
    }

    sendMutation.mutate({
      nickname: trimmedNickname,
      impression: trimmedKeyword,
    });
  };

  const handleShowResults = () => {
    setSelectedResult(null);
    setIsNicknameVisible(false);
    firstImpressionResultQuery.refetch();
  };

  const handleOpenResult = (result: FirstImpressionResultItem) => {
    setSelectedResult(result);
    setIsNicknameVisible(false);
  };

  const handleCloseResult = () => {
    setSelectedResult(null);
    setIsNicknameVisible(false);
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
              {firstImpressionQuery.isLoading ? (
                <span className="text-romance-muted/65 text-xs font-extrabold">
                  키워드를 불러오는 중입니다
                </span>
              ) : firstImpressionQuery.isError ? (
                <button
                  type="button"
                  onClick={() => firstImpressionQuery.refetch()}
                  className="btn-press-in text-romance-highlight text-xs font-extrabold"
                >
                  키워드 다시 불러오기
                </button>
              ) : currentKeyword ? (
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
                disabled={isKeywordDrawDisabled}
                className="btn-press-in bg-romance-accent shadow-soft-card flex h-11 min-w-[142px] items-center justify-center gap-2 rounded-full border border-white/80 px-4 text-sm font-extrabold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Sparkles className="h-4 w-4" />
                키워드 뽑기
              </button>

              <p className="text-romance-muted/80 flex-1 text-right text-xs font-semibold">
                남은 키워드 {displayedRemainingCount}개
              </p>
            </div>
          </section>

          <section className="bg-romance-surface/55 shadow-soft-card flex shrink-0 flex-col rounded-[28px] border border-white/70 p-3 backdrop-blur">
            <div className="mb-3 flex shrink-0 items-center justify-between px-1">
              <p className="text-romance-ink text-sm font-extrabold">닉네임</p>
              <p className="text-romance-muted text-xs font-semibold">
                {nicknames.length}명
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-1">
              {romanceUsersQuery.isLoading &&
                Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="shadow-soft-card min-h-[46px] rounded-xl border border-white/70 bg-white/45"
                    aria-hidden="true"
                  />
                ))}

              {romanceUsersQuery.isError && (
                <button
                  type="button"
                  onClick={() => romanceUsersQuery.refetch()}
                  className="btn-press-in text-romance-accent col-span-2 rounded-xl border border-white/80 bg-white/85 px-4 py-4 text-sm font-extrabold"
                >
                  닉네임 다시 불러오기
                </button>
              )}

              {!romanceUsersQuery.isLoading &&
                !romanceUsersQuery.isError &&
                nicknames.length === 0 && (
                  <p className="text-romance-muted col-span-2 py-4 text-center text-sm font-semibold">
                    표시할 닉네임이 없습니다
                  </p>
                )}

              {nicknames.map((nickname) => {
                const isSubmitted = submittedNicknameSet.has(nickname);
                const isDisabled = isNicknameDisabled || isSubmitted;

                return (
                  <button
                    key={nickname}
                    type="button"
                    onClick={() => handleSubmitImpression(nickname)}
                    disabled={isDisabled}
                    className={`btn-press-in shadow-soft-card flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl border px-3 text-sm font-extrabold transition disabled:cursor-not-allowed ${
                      isSubmitted
                        ? "border-romance-highlight bg-romance-accent/85 text-white"
                        : isNicknameDisabled
                          ? "text-romance-muted/45 border-white/70 bg-white/55"
                          : "text-romance-accent hover:border-romance-line hover:bg-romance-tint border-white/85 bg-white/90"
                    }`}
                    aria-label={
                      isSubmitted
                        ? `${nickname} 키워드 전달 완료`
                        : currentKeyword
                          ? `${nickname}에게 ${currentKeyword} 키워드 전달`
                          : `${nickname} 선택 비활성화`
                    }
                  >
                    <span>{nickname}</span>
                    {isSubmitted && (
                      <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold leading-none">
                        완료
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      <section className="mdl:flex hidden h-full w-full overflow-y-auto px-8 py-10">
        <Link
          href="/"
          className="btn-press-in bg-romance-surface/85 text-romance-accent shadow-soft-card absolute left-8 top-8 flex h-12 w-12 items-center justify-center rounded-full border border-white/80 backdrop-blur"
          aria-label="홈으로 이동"
        >
          <Home className="h-5 w-5" />
        </Link>

        <div className="mx-auto flex min-h-full w-full max-w-[960px] flex-col items-center justify-center gap-6">
          <h1 className="text-romance-accent text-shadow-01 text-center text-[42px] font-extrabold leading-none">
            Funnection 첫인상 키워드
          </h1>

          {firstImpressionResultQuery.isFetching && (
            <div className="bg-romance-surface/80 shadow-soft-card mt-2 flex min-h-[132px] w-full max-w-[520px] flex-col items-center justify-center gap-4 rounded-2xl border border-white/80 px-6 py-6 text-center backdrop-blur">
              <div className="border-romance-accent h-9 w-9 animate-spin rounded-full border-4 border-t-transparent" />
              <p className="text-romance-accent text-sm font-extrabold">
                첫인상 결과를 만들고 있습니다
              </p>
            </div>
          )}

          {firstImpressionResultQuery.isError &&
            !firstImpressionResultQuery.isFetching && (
              <div className="bg-romance-surface/80 shadow-soft-card mt-2 flex min-h-[116px] w-full max-w-[520px] flex-col items-center justify-center gap-3 rounded-2xl border border-white/80 px-6 py-5 text-center backdrop-blur">
                <p className="text-romance-highlight text-sm font-extrabold">
                  첫인상 결과를 불러오지 못했습니다
                </p>
                <button
                  type="button"
                  onClick={handleShowResults}
                  className="btn-press-in bg-romance-accent rounded-full px-5 py-2 text-sm font-extrabold text-white"
                >
                  다시 확인
                </button>
              </div>
            )}

          {firstImpressionResultQuery.isSuccess &&
            !firstImpressionResultQuery.isFetching && (
              <div className="my-8 w-full">
                {results.length > 0 ? (
                  <div className="slow-fade-in-up grid w-full grid-cols-8 justify-items-center gap-1">
                    {results.map((result) => (
                      <button
                        key={`${result.index}-${result.nickname}`}
                        type="button"
                        onClick={() => handleOpenResult(result)}
                        className="btn-press-in bg-romance-accent shadow-soft-card flex h-16 w-24 items-center justify-center rounded-xl border border-white/70 px-3 text-lg font-extrabold text-white transition hover:brightness-105"
                        aria-label={`${result.index}번 첫인상 결과 보기`}
                      >
                        {result.index}번
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-romance-muted bg-romance-surface/75 shadow-soft-card rounded-2xl border border-white/80 px-6 py-5 text-center text-sm font-semibold">
                    표시할 첫인상 결과가 없습니다
                  </p>
                )}
              </div>
            )}

          <button
            type="button"
            onClick={handleShowResults}
            disabled={firstImpressionResultQuery.isFetching}
            className="btn-press-in bg-romance-surface/90 text-romance-accent shadow-soft-card min-w-[160px] rounded-xl border border-white/80 px-6 py-3 text-lg font-extrabold backdrop-blur hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            첫인상 확인
          </button>
        </div>
      </section>

      {selectedResult && (
        <div
          className="mdl:flex absolute inset-0 z-50 hidden items-center justify-center bg-black/35 px-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedResult.index}번 첫인상 결과`}
        >
          <div className="slow-fade-in-up bg-romance-surface shadow-soft-card relative flex max-h-[82dvh] w-full max-w-[560px] flex-col overflow-y-auto rounded-2xl border border-white/80 px-6 py-6 backdrop-blur">
            <button
              type="button"
              onClick={handleCloseResult}
              className="btn-press-in text-romance-muted hover:text-romance-accent absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/70"
              aria-label="첫인상 결과 닫기"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="text-romance-highlight text-sm font-extrabold">
              {selectedResult.index}번 첫인상 결과
            </p>
            <h2 className="text-romance-accent mt-3 pr-12 text-3xl font-extrabold leading-tight">
              {selectedResult.job}
            </h2>
            <p className="leading-middlePlus text-romance-ink mt-4 text-lg font-semibold">
              {selectedResult.sentence}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {selectedResult.impressions.map((impression, index) => (
                <span
                  key={`${selectedResult.index}-${impression}-${index}`}
                  className="bg-romance-tint text-romance-accent rounded-full px-3 py-1.5 text-base font-extrabold"
                >
                  {impression}
                </span>
              ))}
            </div>

            <div className="border-romance-line/45 mt-6 flex min-h-[46px] items-center justify-between gap-3 border-t pt-5">
              {isNicknameVisible ? (
                <p className="text-romance-ink text-2xl font-semibold">
                  {selectedResult.nickname}
                </p>
              ) : (
                <p className="text-romance-muted text-sm font-semibold">
                  닉네임은 버튼을 누른 뒤 공개됩니다
                </p>
              )}

              {!isNicknameVisible && (
                <button
                  type="button"
                  onClick={() => setIsNicknameVisible(true)}
                  className="btn-press-in bg-romance-accent shrink-0 rounded-full px-5 py-2.5 text-sm font-extrabold text-white"
                >
                  닉네임 보기
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {submittedMessage && (
        <SubmitModal
          contents={submittedMessage}
          overlayClassName="mdl:hidden"
        />
      )}
    </main>
  );
}
