"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  getRomanceCounselQueryKey,
  getRomanceCounsels,
  type RomanceCounsel,
  type RomanceCounselSource,
} from "@/api";

const COUNSEL_SOURCE_OPTIONS: {
  label: string;
  source: RomanceCounselSource;
}[] = [
  {
    label: "First Time",
    source: "default",
  },
  {
    label: "Second Time",
    source: "second",
  },
];

const getCounselSource = (): RomanceCounselSource => {
  if (typeof window === "undefined") return "default";

  const searchParams = new URLSearchParams(window.location.search);

  return searchParams.get("source") === "second" ? "second" : "default";
};

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
  const [counselSource, setCounselSource] =
    useState<RomanceCounselSource | null>(null);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCounselOpen, setIsCounselOpen] = useState(false);
  const counselsQuery = useQuery({
    queryKey: counselSource
      ? getRomanceCounselQueryKey(counselSource)
      : ["funnection-romance", "counsel", "pending"],
    queryFn: () => getRomanceCounsels(counselSource ?? "default"),
    enabled: counselSource !== null,
  });

  useEffect(() => {
    setCounselSource(getCounselSource());
  }, []);

  const counsels = counselsQuery.data ?? [];
  const isCounselsLoading = counselSource === null || counselsQuery.isLoading;
  const shuffledCounsels = useMemo(
    () => shuffleCounsels(counsels),
    [counsels, shuffleSeed]
  );
  const currentCounsel = shuffledCounsels[currentIndex];
  const hasNextCounsel = currentIndex < shuffledCounsels.length - 1;

  useEffect(() => {
    setCurrentIndex(0);
    setIsCounselOpen(false);
  }, [counselSource, counsels.length, shuffleSeed]);

  const openCounsel = () => {
    if (shuffledCounsels.length === 0) return;

    setIsCounselOpen(true);
  };

  const showNextCounsel = () => {
    if (!hasNextCounsel) return;

    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const reshuffleCounsels = () => {
    setShuffleSeed((prevSeed) => prevSeed + 1);
  };

  const selectCounselSource = (source: RomanceCounselSource) => {
    setCounselSource(source);

    const url = new URL(window.location.href);

    if (source === "second") {
      url.searchParams.set("source", "second");
    } else {
      url.searchParams.delete("source");
    }

    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  };

  return (
    <main className="bg-romance-gradient text-romance-ink fixed inset-0 flex h-[100dvh] w-full">
      <section className="mdl:hidden mx-auto flex h-full w-full max-w-[480px] flex-col items-center justify-center px-5 text-center">
        <h1 className="text-romance-accent text-shadow-01 text-3xl font-extrabold">
          익명 고민방
        </h1>
        <p className="text-romance-muted leading-middlePlus mt-3 text-sm font-semibold">
          익명 고민방은 데스크톱 화면에서만 이용할 수 있습니다.
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

          <div className="flex-1" aria-hidden="true" />

          <div
            className="bg-romance-surface/85 shadow-soft-card flex h-12 items-center gap-1 rounded-full border border-white/80 p-1 backdrop-blur"
            aria-label="고민 타임 선택"
            role="group"
          >
            {COUNSEL_SOURCE_OPTIONS.map(({ label, source }) => {
              const isSelected = counselSource === source;

              return (
                <button
                  key={source}
                  type="button"
                  onClick={() => selectCounselSource(source)}
                  className={`btn-press-in flex h-10 min-w-[86px] items-center justify-center rounded-full px-4 text-sm font-extrabold transition ${
                    isSelected
                      ? "bg-romance-accent text-white shadow-[0_8px_18px_rgba(242,109,139,0.24)]"
                      : "text-romance-muted hover:text-romance-accent"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={reshuffleCounsels}
            disabled={isCounselsLoading || counsels.length < 2}
            className="btn-press-in bg-romance-surface/85 text-romance-muted shadow-soft-card hover:text-romance-accent mdl:h-12 mdl:w-12 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 backdrop-blur disabled:opacity-45"
            aria-label="랜덤 순서 다시 섞기"
          >
            <RefreshCcw className="h-5 w-5" />
          </button>
        </header>

        <div className="bg-romance-surface/55 shadow-soft-card mt-8 flex min-h-0 flex-1 flex-col rounded-[32px] border border-white/70 p-8 backdrop-blur">
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8">
            <div className="shrink-0 text-center">
              <p className="text-romance-highlight text-lg font-bold">
                Funnection 연애특집
              </p>
              <h1 className="text-romance-accent text-shadow-01 mt-1 text-[44px] font-extrabold leading-none">
                익명 고민방
              </h1>
            </div>

            {isCounselsLoading && (
              <>
                <div
                  className="shadow-soft-card h-[280px] w-full rounded-[28px] border border-white/70 bg-white/45"
                  aria-hidden="true"
                />
                <div
                  className="h-12 w-full max-w-[220px] rounded-full bg-white/45"
                  aria-hidden="true"
                />
              </>
            )}

            {counselsQuery.isError && (
              <button
                type="button"
                onClick={() => counselsQuery.refetch()}
                className="btn-press-in text-romance-accent shadow-soft-card rounded-2xl border border-white/80 bg-white/85 px-5 py-4 text-sm font-extrabold"
              >
                고민 다시 불러오기
              </button>
            )}

            {!isCounselsLoading &&
              !counselsQuery.isError &&
              counsels.length === 0 && (
                <p className="text-romance-muted text-center text-3xl font-medium">
                  아직 제출된 고민이 없습니다.
                </p>
              )}

            {!isCounselsLoading &&
              !counselsQuery.isError &&
              currentCounsel &&
              (!isCounselOpen ? (
                <button
                  type="button"
                  onClick={openCounsel}
                  className="btn-press-in bg-romance-accent shadow-soft-card flex h-14 min-w-[160px] items-center justify-center rounded-full border border-white/80 px-8 text-xl font-extrabold text-white transition hover:brightness-105"
                >
                  들어보기
                </button>
              ) : (
                <>
                  <div className="shadow-soft-card min-h-70 inline-flex max-h-full w-full max-w-full overflow-y-auto rounded-[28px] border border-white/85 bg-white/90 px-8 py-7">
                    <p className="text-romance-ink font-jua whitespace-pre-wrap break-words text-2xl font-medium">
                      {currentCounsel.content}
                    </p>
                  </div>

                  {hasNextCounsel && (
                    <button
                      type="button"
                      onClick={showNextCounsel}
                      className="btn-press-in bg-romance-accent shadow-soft-card flex h-12 min-w-[160px] items-center justify-center gap-2 rounded-full border border-white/80 px-6 text-sm font-extrabold text-white transition hover:brightness-105"
                    >
                      다음 고민
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
