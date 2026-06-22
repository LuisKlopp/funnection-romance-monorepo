"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  HeartHandshake,
  Home,
  LoaderCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getRomanceLoveLanguageAverage,
  getRomanceLoveLanguages,
  getRomanceLoveLanguageSimilarPair,
  getRomanceLoveLanguageUserCount,
  ROMANCE_LOVE_LANGUAGE_AVERAGE_QUERY_KEY,
  ROMANCE_LOVE_LANGUAGE_COUNT_QUERY_KEY,
  ROMANCE_LOVE_LANGUAGE_LIST_QUERY_KEY,
  ROMANCE_LOVE_LANGUAGE_PAIR_QUERY_KEY,
} from "@/api";
import {
  AverageDialog,
  SimilarPairDialog,
  UserLanguageDialog,
} from "@/components/love-language/love-language-dialogs";
import { LoveLanguageRanking } from "@/components/love-language/love-language-ranking";
import { ROMANCE_NICKNAME_STORAGE_KEY } from "@/constants/choice-questions";

type OpenDialog =
  | { type: "user"; userId: string }
  | { type: "pair" }
  | { type: "average" }
  | null;

export default function LoveLanguagePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<OpenDialog>(null);

  const loveLanguagesQuery = useQuery({
    queryKey: ROMANCE_LOVE_LANGUAGE_LIST_QUERY_KEY,
    queryFn: getRomanceLoveLanguages,
    enabled: false,
  });
  const similarPairQuery = useQuery({
    queryKey: ROMANCE_LOVE_LANGUAGE_PAIR_QUERY_KEY,
    queryFn: getRomanceLoveLanguageSimilarPair,
    enabled: false,
  });
  const averageQuery = useQuery({
    queryKey: ROMANCE_LOVE_LANGUAGE_AVERAGE_QUERY_KEY,
    queryFn: getRomanceLoveLanguageAverage,
    enabled: false,
  });
  const userCountQuery = useQuery({
    queryKey: ROMANCE_LOVE_LANGUAGE_COUNT_QUERY_KEY,
    queryFn: getRomanceLoveLanguageUserCount,
  });

  useEffect(() => {
    setUserId(
      localStorage.getItem(ROMANCE_NICKNAME_STORAGE_KEY)?.trim() ?? ""
    );
  }, []);

  const loveLanguages = loveLanguagesQuery.data ?? {};
  const userIds = Object.keys(loveLanguages);
  const similarPair = similarPairQuery.data;
  const averages = averageQuery.data?.loveLanguageStats ?? [];
  const isResultsFetching =
    loveLanguagesQuery.isFetching ||
    similarPairQuery.isFetching ||
    averageQuery.isFetching;
  const hasResultsError =
    loveLanguagesQuery.isError ||
    similarPairQuery.isError ||
    averageQuery.isError;
  const hasLoadedResults =
    loveLanguagesQuery.data !== undefined || hasResultsError;

  const loadResults = () => {
    if (isResultsFetching) return;

    void Promise.all([
      loveLanguagesQuery.refetch(),
      similarPairQuery.refetch(),
      averageQuery.refetch(),
    ]);
  };

  const handleSubmitted = () => {
    void userCountQuery.refetch();

    if (hasLoadedResults) {
      loadResults();
    }
  };

  if (userId === null) {
    return (
      <main className="bg-romance-gradient fixed inset-0 flex h-[100dvh] w-full items-center justify-center">
        <LoaderCircle
          className="text-romance-accent h-8 w-8 animate-spin"
          aria-label="사용자 정보 확인 중"
        />
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="bg-romance-gradient text-romance-ink fixed inset-0 flex h-[100dvh] w-full items-center justify-center px-5">
        <section className="bg-romance-surface/85 shadow-soft-card flex w-full max-w-[420px] flex-col items-center rounded-[28px] border border-white/80 px-6 py-8 text-center backdrop-blur">
          <HeartHandshake className="text-romance-accent h-10 w-10" />
          <h1 className="text-romance-accent mt-4 text-2xl font-extrabold">
            닉네임이 필요합니다
          </h1>
          <p className="text-romance-muted leading-middlePlus mt-2 text-sm font-semibold">
            홈에서 닉네임을 등록한 뒤 사랑의 언어를 이용해주세요.
          </p>
          <Link
            href="/"
            className="btn-press-in bg-romance-accent mt-6 flex h-12 min-w-[150px] items-center justify-center gap-2 rounded-full text-sm font-extrabold text-white"
          >
            <Home className="h-5 w-5" />
            홈으로 이동
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-romance-gradient text-romance-ink fixed inset-0 h-[100dvh] w-full overflow-y-auto">
      <section className="mx-auto flex min-h-full w-full max-w-[1080px] flex-col px-4 pb-6 pt-5 mdl:px-8 mdl:pb-10 mdl:pt-8">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <Link
            href="/"
            className="btn-press-in bg-romance-surface/85 text-romance-accent shadow-soft-card flex h-10 w-10 items-center justify-center rounded-full border border-white/80 backdrop-blur mdl:h-12 mdl:w-12"
            aria-label="홈으로 이동"
          >
            <Home className="h-5 w-5" />
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="text-romance-highlight text-xs font-bold mdl:text-sm">
              Funnection 연애특집
            </p>
            <h1 className="text-romance-accent text-shadow-01 mt-1 text-2xl font-extrabold leading-none mdl:text-[44px]">
              사랑의 언어
            </h1>
          </div>

          <div className="h-10 w-10 mdl:h-12 mdl:w-12" aria-hidden="true" />
        </header>

        <div className="mt-5 flex flex-1 items-start mdl:mt-8">
          <div className="w-full mdl:hidden">
            <LoveLanguageRanking
              userId={userId}
              onSubmitted={handleSubmitted}
            />
          </div>

          <section className="bg-romance-surface/70 shadow-soft-card mx-auto hidden min-h-[590px] w-full max-w-[720px] flex-col rounded-[32px] border border-white/75 p-6 backdrop-blur mdl:flex">
            <div className="flex justify-end">
              <div className="bg-romance-tint text-romance-accent flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-extrabold">
                <Users className="h-4 w-4" aria-hidden="true" />
                {userCountQuery.isLoading
                  ? "확인 중"
                  : userCountQuery.isError
                    ? "확인 실패"
                    : `${userCountQuery.data?.userCount ?? 0}명 참여`}
              </div>
            </div>

            {!hasLoadedResults && !isResultsFetching && (
              <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
                <button
                  type="button"
                  onClick={loadResults}
                  className="btn-press-in bg-romance-accent shadow-soft-card flex h-12 min-w-[180px] items-center justify-center rounded-full px-6 text-sm font-extrabold text-white"
                >
                  결과 불러오기
                </button>
              </div>
            )}

            {isResultsFetching && (
              <div
                className="flex flex-1 flex-col items-center justify-center py-10"
                role="status"
              >
                <LoaderCircle className="text-romance-accent h-8 w-8 animate-spin" />
                <p className="text-romance-muted mt-3 text-sm font-extrabold">
                  사랑의 언어 결과를 불러오는 중입니다
                </p>
              </div>
            )}

            {hasLoadedResults && !isResultsFetching && (
              <div className="mt-5 flex min-h-0 flex-1 flex-col">
                {hasResultsError && (
                  <div
                    role="alert"
                    className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3"
                  >
                    <p className="text-sm font-extrabold text-red-700">
                      일부 결과를 불러오지 못했습니다.
                    </p>
                    <button
                      type="button"
                      onClick={loadResults}
                      className="btn-press-in shrink-0 rounded-full bg-red-700 px-3 py-1.5 text-xs font-extrabold text-white"
                    >
                      다시 시도
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setOpenDialog({ type: "pair" })}
                    disabled={
                      !similarPair?.user1 ||
                      !similarPair?.user2 ||
                      similarPairQuery.isError
                    }
                    className="btn-press-in bg-romance-surface shadow-soft-card text-romance-accent flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-2xl border border-white/85 px-3 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <HeartHandshake className="h-5 w-5" aria-hidden="true" />
                    <span className="text-sm font-extrabold">케미스트리</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenDialog({ type: "average" })}
                    disabled={averages.length === 0 || averageQuery.isError}
                    className="btn-press-in bg-romance-surface shadow-soft-card text-romance-accent flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-2xl border border-white/85 px-3 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <BarChart3 className="h-5 w-5" aria-hidden="true" />
                    <span className="text-sm font-extrabold">전체 평균</span>
                  </button>
                </div>

                <div className="border-romance-line/35 mt-5 flex items-center justify-between border-t pt-4">
                  <h3 className="text-romance-ink text-sm font-extrabold mdl:text-base">
                    참여자별 결과
                  </h3>
                  <span className="text-romance-muted text-xs font-bold">
                    {userIds.length}명
                  </span>
                </div>

                {loveLanguagesQuery.isError ? (
                  <p className="text-romance-muted py-8 text-center text-sm font-semibold">
                    참여자 결과를 불러오지 못했습니다.
                  </p>
                ) : userIds.length === 0 ? (
                  <p className="text-romance-muted py-8 text-center text-sm font-semibold">
                    아직 제출된 결과가 없습니다.
                  </p>
                ) : (
                  <div className="no-scrollbar mt-3 grid max-h-[245px] grid-cols-2 gap-2 overflow-y-auto pr-1 smd:grid-cols-3 mdl:grid-cols-2">
                    {userIds.map((resultUserId) => (
                      <button
                        key={resultUserId}
                        type="button"
                        onClick={() =>
                          setOpenDialog({ type: "user", userId: resultUserId })
                        }
                        className="btn-press-in text-romance-accent hover:border-romance-line hover:bg-romance-tint min-h-11 truncate rounded-xl border border-white/85 bg-white/85 px-3 text-sm font-extrabold transition"
                        aria-label={`${resultUserId}님의 사랑의 언어 결과 보기`}
                      >
                        {resultUserId}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </section>

      {openDialog?.type === "user" && (
        <UserLanguageDialog
          userId={openDialog.userId}
          languages={loveLanguages[openDialog.userId] ?? []}
          onClose={() => setOpenDialog(null)}
        />
      )}
      {openDialog?.type === "pair" && similarPair && (
        <SimilarPairDialog
          pair={similarPair}
          loveLanguages={loveLanguages}
          onClose={() => setOpenDialog(null)}
        />
      )}
      {openDialog?.type === "average" && (
        <AverageDialog
          averages={averages}
          onClose={() => setOpenDialog(null)}
        />
      )}
    </main>
  );
}
