"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  getRomanceCounsels,
  ROMANCE_COUNSEL_QUERY_KEY,
  type RomanceCounsel,
} from "@/api";

const shuffleCounsels = (counsels: RomanceCounsel[]) => {
  const shuffled = [...counsels];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
};

export default function CounselPage() {
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCounselOpen, setIsCounselOpen] = useState(false);
  const counselsQuery = useQuery({
    queryKey: ROMANCE_COUNSEL_QUERY_KEY,
    queryFn: getRomanceCounsels,
  });

  const counsels = counselsQuery.data ?? [];
  const shuffledCounsels = useMemo(
    () => shuffleCounsels(counsels),
    [counsels, shuffleSeed]
  );
  const currentCounsel = shuffledCounsels[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
    setIsCounselOpen(false);
  }, [counsels.length, shuffleSeed]);

  const openCounsel = () => {
    if (shuffledCounsels.length === 0) return;

    setIsCounselOpen(true);
  };

  const showNextCounsel = () => {
    if (shuffledCounsels.length === 0) return;

    setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledCounsels.length);
  };

  const reshuffleCounsels = () => {
    setShuffleSeed((prevSeed) => prevSeed + 1);
  };

  return (
    <main className="bg-romance-gradient text-romance-ink fixed inset-0 flex h-[100dvh] w-full">
      <section className="mdl:hidden mx-auto flex h-full w-full max-w-[480px] flex-col items-center justify-center px-5 text-center">
        <h1 className="text-romance-accent text-shadow-01 text-3xl font-extrabold">
          대나무숲
        </h1>
        <p className="text-romance-muted leading-middlePlus mt-3 text-sm font-semibold">
          대나무숲은 데스크톱 화면에서만 이용할 수 있습니다.
        </p>
        <Link
          href="/"
          className="btn-press-in bg-romance-surface/90 text-romance-accent shadow-soft-card mt-6 flex h-12 min-w-[128px] items-center justify-center gap-2 rounded-full border border-white/80 px-5 text-sm font-extrabold backdrop-blur"
        >
          <Home className="h-5 w-5" />
          Home
        </Link>
      </section>

      <section className="mdl:mx-auto mdl:flex mdl:h-full mdl:w-full mdl:max-w-[900px] mdl:flex-col mdl:px-8 mdl:pb-8 mdl:pt-8 hidden">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <Link
            href="/"
            className="btn-press-in bg-romance-surface/85 text-romance-accent shadow-soft-card mdl:h-12 mdl:w-12 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 backdrop-blur"
            aria-label="홈으로 이동"
          >
            <Home className="h-5 w-5" />
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="text-romance-highlight mdl:text-sm text-xs font-bold">
              Funnection 연애특집
            </p>
            <h1 className="text-romance-accent text-shadow-01 mdl:text-[44px] mt-1 text-2xl font-extrabold leading-none">
              대나무숲
            </h1>
          </div>

          <button
            type="button"
            onClick={reshuffleCounsels}
            disabled={counselsQuery.isLoading || counsels.length < 2}
            className="btn-press-in bg-romance-surface/85 text-romance-muted shadow-soft-card hover:text-romance-accent mdl:h-12 mdl:w-12 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 backdrop-blur disabled:opacity-45"
            aria-label="랜덤 순서 다시 섞기"
          >
            <RefreshCcw className="h-5 w-5" />
          </button>
        </header>

        <div className="bg-romance-surface/55 shadow-soft-card mt-8 flex min-h-0 flex-1 flex-col rounded-[32px] border border-white/70 p-8 backdrop-blur">
          {counselsQuery.isLoading && (
            <div className="flex min-h-0 flex-1 flex-col justify-center gap-4">
              <div
                className="shadow-soft-card h-[280px] rounded-[28px] border border-white/70 bg-white/45"
                aria-hidden="true"
              />
              <div
                className="mx-auto h-12 w-full max-w-[220px] rounded-full bg-white/45"
                aria-hidden="true"
              />
            </div>
          )}

          {counselsQuery.isError && (
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <button
                type="button"
                onClick={() => counselsQuery.refetch()}
                className="btn-press-in text-romance-accent shadow-soft-card rounded-2xl border border-white/80 bg-white/85 px-5 py-4 text-sm font-extrabold"
              >
                고민 다시 불러오기
              </button>
            </div>
          )}

          {!counselsQuery.isLoading &&
            !counselsQuery.isError &&
            counsels.length === 0 && (
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <p className="text-romance-muted text-center text-sm font-semibold">
                  아직 등록된 고민이 없습니다
                </p>
              </div>
            )}

          {!counselsQuery.isLoading &&
            !counselsQuery.isError &&
            currentCounsel && (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
                {!isCounselOpen ? (
                  <button
                    type="button"
                    onClick={openCounsel}
                    className="btn-press-in bg-romance-accent shadow-soft-card flex h-14 min-w-[160px] items-center justify-center rounded-full border border-white/80 px-8 text-xl font-extrabold text-white transition hover:brightness-105"
                  >
                    고민
                  </button>
                ) : (
                  <>
                    <div className="shadow-soft-card min-h-70 inline-flex max-h-full w-full max-w-full overflow-y-auto rounded-[28px] border border-white/85 bg-white/90 px-8 py-7">
                      <p className="text-romance-ink font-jua whitespace-pre-wrap break-words text-2xl font-medium">
                        {currentCounsel.content}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={showNextCounsel}
                      className="btn-press-in bg-romance-accent shadow-soft-card mt-6 flex h-12 min-w-[160px] items-center justify-center gap-2 rounded-full border border-white/80 px-6 text-sm font-extrabold text-white transition hover:brightness-105"
                    >
                      다음 고민
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            )}
        </div>
      </section>
    </main>
  );
}
