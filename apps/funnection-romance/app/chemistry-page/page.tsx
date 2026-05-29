"use client";

import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { RomanceChoiceTopChemistryCouple } from "@/api";
import { getRomanceChoiceTopChemistry } from "@/api";
import { CHOICE_ANSWERED_STORAGE_KEY } from "@/constants/choice-questions";

export default function ChemistryPage() {
  const [step, setStep] = useState(0);
  const [currentCoupleIndex, setCurrentCoupleIndex] = useState(0);
  const [clickedQuestionIds, setClickedQuestionIds] = useState<number[]>([]);
  const chemistryMutation = useMutation({
    mutationFn: (questionIds: number[]) =>
      getRomanceChoiceTopChemistry(questionIds),
  });

  const chemistry = normalizeChemistry(
    chemistryMutation.data,
    clickedQuestionIds.length
  );
  const currentCouple = chemistry.couples[currentCoupleIndex];
  const isLastCouple =
    step >= 3 &&
    (chemistry.couples.length === 0 ||
      currentCoupleIndex === chemistry.couples.length - 1);

  const handleConfirm = async () => {
    if (step === 0) {
      const nextClickedQuestionIds = readClickedQuestionIds();
      setClickedQuestionIds(nextClickedQuestionIds);

      try {
        await chemistryMutation.mutateAsync(nextClickedQuestionIds);
        setStep(1);
      } catch {
        return;
      }
      return;
    }

    if (step < 3) {
      setStep((prev) => prev + 1);
      return;
    }

    if (currentCoupleIndex < chemistry.couples.length - 1) {
      setCurrentCoupleIndex((prev) => prev + 1);
    }
  };

  return (
    <main className="bg-romance-gradient text-romance-ink fixed inset-0 flex h-[100dvh] w-full">
      <section className="mdl:max-w-[1080px] mdl:px-8 mdl:pb-8 mdl:pt-8 mx-auto flex h-full w-full max-w-[480px] flex-col px-4 pb-4 pt-5">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <Link
            href="/choice-page"
            className="btn-press-in bg-romance-surface/85 text-romance-accent shadow-soft-card mdl:h-12 mdl:w-12 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 backdrop-blur"
            aria-label="OX 질문 목록으로 이동"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <h1 className="text-romance-accent text-shadow-01 mdl:text-[32px] text-2xl font-extrabold leading-tight">
              Funnection OX 케미스트리
            </h1>
          </div>

          <Link
            href="/"
            className="btn-press-in bg-romance-surface/85 text-romance-muted shadow-soft-card hover:text-romance-accent mdl:h-12 mdl:w-12 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 backdrop-blur"
            aria-label="홈으로 이동"
          >
            <Home className="h-5 w-5" />
          </Link>
        </header>

        <div className="bg-romance-surface/55 shadow-soft-card mdl:mt-8 mdl:rounded-[32px] mdl:p-10 mt-4 flex min-h-0 flex-1 flex-col justify-center rounded-[28px] border border-white/70 p-5 backdrop-blur">
          <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-10 text-center">
            <div className="flex min-h-[220px] w-full flex-col items-center justify-center gap-5">
              {step === 0 && (
                <>
                  <p className="font-jua text-romance-ink text-3xl font-medium">
                    OX 케미스트리 확인
                  </p>
                  <p className="text-romance-muted text-xl font-semibold">
                    가장 많이 겹친 답변을 순서대로 확인합니다
                  </p>
                </>
              )}

              {step === 1 && (
                <p className="font-jua text-romance-ink text-3xl font-medium">
                  총 {chemistry.totalQuestionCount}개의 질문 중{" "}
                  <span className="text-romance-accent">
                    {chemistry.matchedQuestionCount}개
                  </span>
                  가 겹쳤어요
                </p>
              )}

              {step === 2 && (
                <p className="text-romance-muted font-jua text-3xl font-medium">
                  총{" "}
                  <span className="text-romance-accent">
                    {chemistry.coupleCount}
                  </span>
                  커플
                </p>
              )}

              {step >= 3 && currentCouple && (
                <div
                  key={currentCoupleIndex}
                  className="fade-in-up flex flex-col items-center gap-3"
                >
                  <p className="text-shadow-01 text-romance-accent font-jua flex flex-wrap items-center justify-center gap-4 font-medium">
                    <span className="text-5xl">{currentCouple.nickname1}</span>
                    <span className="text-4xl">×</span>
                    <span className="text-5xl">{currentCouple.nickname2}</span>
                  </p>
                </div>
              )}

              {step >= 3 && !currentCouple && (
                <p className="text-romance-muted text-lg font-extrabold">
                  표시할 커플이 없습니다
                </p>
              )}

              {chemistryMutation.isError && (
                <p className="text-sm font-bold text-red-500">
                  케미스트리를 불러오지 못했습니다
                </p>
              )}
            </div>

            {!isLastCouple && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={chemistryMutation.isPending}
                className="btn-press-in bg-romance-accent shadow-soft-card h-13 min-w-[150px] rounded-full border border-white/80 px-8 text-lg font-extrabold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {chemistryMutation.isPending ? "확인 중..." : "확인"}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

type NormalizedChemistryCouple = {
  nickname1: string;
  nickname2: string;
  matchedCount: number;
};

type NormalizedChemistry = {
  totalQuestionCount: number;
  matchedQuestionCount: number;
  coupleCount: number;
  couples: NormalizedChemistryCouple[];
};

const normalizeChemistry = (
  data: Awaited<ReturnType<typeof getRomanceChoiceTopChemistry>> | undefined,
  clickedQuestionCount: number
): NormalizedChemistry => {
  const couples = data?.couples ?? data?.topCouples ?? data?.items ?? [];
  const normalizedCouples = couples
    .map(normalizeCouple)
    .filter((couple): couple is NormalizedChemistryCouple => !!couple);
  const matchedQuestionCount =
    data?.matchedQuestionCount ??
    data?.matchedCount ??
    data?.matchCount ??
    data?.sameAnswerCount ??
    normalizedCouples[0]?.matchedCount ??
    0;

  return {
    totalQuestionCount: clickedQuestionCount,
    matchedQuestionCount: clickedQuestionCount > 0 ? matchedQuestionCount : 0,
    coupleCount:
      clickedQuestionCount > 0
        ? (data?.coupleCount ?? normalizedCouples.length)
        : 0,
    couples: clickedQuestionCount > 0 ? normalizedCouples : [],
  };
};

const normalizeCouple = (
  couple: RomanceChoiceTopChemistryCouple
): NormalizedChemistryCouple | null => {
  const nickname1 =
    couple.nickname1 ??
    couple.firstNickname ??
    couple.leftNickname ??
    couple.nicknames?.[0] ??
    "";
  const nickname2 =
    couple.nickname2 ??
    couple.secondNickname ??
    couple.rightNickname ??
    couple.nicknames?.[1] ??
    "";

  if (!nickname1 || !nickname2) {
    return null;
  }

  return {
    nickname1,
    nickname2,
    matchedCount:
      couple.matchedCount ?? couple.matchCount ?? couple.sameAnswerCount ?? 0,
  };
};

const readClickedQuestionIds = () => {
  try {
    const savedIds = localStorage.getItem(CHOICE_ANSWERED_STORAGE_KEY);
    if (!savedIds) return [];

    const parsedIds = JSON.parse(savedIds);

    return Array.isArray(parsedIds)
      ? parsedIds.filter((id): id is number => Number.isInteger(id))
      : [];
  } catch {
    return [];
  }
};
