"use client";

import { useQuery } from "@tanstack/react-query";
import { Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getRomanceChoices, ROMANCE_CHOICE_QUERY_KEY } from "@/api";
import { QuestionCategoryBadge } from "@/components";
import { CHOICE_ANSWERED_STORAGE_KEY } from "@/constants/choice-questions";

export default function ChoicePage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const choicesQuery = useQuery({
    queryKey: ROMANCE_CHOICE_QUERY_KEY,
    queryFn: getRomanceChoices,
  });

  const choices = choicesQuery.data ?? [];

  const resetAnsweredChoices = () => {
    localStorage.removeItem(CHOICE_ANSWERED_STORAGE_KEY);
    setSelectedIds([]);
  };

  const markChoiceAsClicked = (choiceId: number) => {
    const nextSelectedIds = selectedIds.includes(choiceId)
      ? selectedIds
      : [...selectedIds, choiceId];

    setSelectedIds(nextSelectedIds);
    localStorage.setItem(
      CHOICE_ANSWERED_STORAGE_KEY,
      JSON.stringify(nextSelectedIds)
    );
  };

  useEffect(() => {
    const savedIds = localStorage.getItem(CHOICE_ANSWERED_STORAGE_KEY);
    if (!savedIds) return;

    try {
      const parsedIds = JSON.parse(savedIds);

      if (Array.isArray(parsedIds)) {
        setSelectedIds(parsedIds);
      }
    } catch {
      localStorage.removeItem(CHOICE_ANSWERED_STORAGE_KEY);
    }
  }, []);

  return (
    <main className="bg-romance-gradient text-romance-ink fixed inset-0 flex h-[100dvh] w-full">
      <section className="mdl:max-w-[1080px] mdl:px-8 mdl:pb-8 mdl:pt-8 mx-auto flex h-full w-full max-w-[480px] flex-col px-4 pb-4 pt-5">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <div className="mdl:hidden h-10 w-10" aria-hidden="true" />

          <div className="mdl:text-left min-w-0 flex-1 text-center">
            <p className="text-romance-highlight mdl:text-sm text-xs font-bold">
              Funnection 연애특집
            </p>
            <h1 className="text-romance-accent text-shadow-01 mdl:text-[44px] mt-1 text-2xl font-extrabold leading-none">
              <span className="mdl:hidden">OX 질문</span>
              <Link
                href="/chemistry-page"
                className="hover:text-romance-highlight mdl:inline hidden transition"
              >
                OX 질문
              </Link>
            </h1>
          </div>

          <button
            type="button"
            onClick={resetAnsweredChoices}
            className="btn-press-in bg-romance-surface/85 text-romance-muted shadow-soft-card hover:text-romance-accent mdl:h-12 mdl:w-12 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 backdrop-blur"
            aria-label="선택 초기화"
          >
            <RefreshCcw className="h-5 w-5" />
          </button>
        </header>

        <div className="bg-romance-surface/55 shadow-soft-card mdl:mt-8 mdl:rounded-[32px] mdl:p-6 mt-4 flex min-h-0 flex-1 flex-col rounded-[28px] border border-white/70 p-3 backdrop-blur">
          <div className="mdl:mb-5 mb-3 flex shrink-0 items-center justify-between gap-2 px-1">
            <p className="text-romance-muted mdl:text-base text-sm font-bold">
              {selectedIds.length} / {choices.length}
            </p>
          </div>

          <div className="no-scrollbar mdl:grid-cols-7 mdl:gap-x-5 mdl:gap-y-6 mdl:p-2 grid min-h-0 flex-1 touch-pan-y grid-cols-3 content-start gap-x-4 gap-y-6 overflow-x-hidden overflow-y-auto overscroll-x-none p-2">
            {choicesQuery.isLoading &&
              Array.from({ length: 21 }).map((_, index) => (
                <div
                  key={index}
                  className="shadow-soft-card mdl:h-[112px] mdl:rounded-[24px] h-[96px] rounded-2xl border border-white/70 bg-white/45"
                  aria-hidden="true"
                />
              ))}

            {choicesQuery.isError && (
              <button
                type="button"
                onClick={() => choicesQuery.refetch()}
                className="btn-press-in text-romance-accent col-span-3 rounded-2xl border border-white/80 bg-white/85 px-4 py-5 text-sm font-extrabold"
              >
                OX 질문 다시 불러오기
              </button>
            )}

            {!choicesQuery.isLoading &&
              !choicesQuery.isError &&
              choices.length === 0 && (
                <p className="text-romance-muted col-span-3 py-8 text-center text-sm font-semibold">
                  표시할 OX 질문이 없습니다
                </p>
              )}

            {choices.map((choice) => {
              const isSelected = selectedIds.includes(choice.id);

              return (
                <Link
                  key={choice.id}
                  href={`/choice-page/${choice.id}`}
                  onClick={() => markChoiceAsClicked(choice.id)}
                  className={`btn-press-in shadow-soft-card mdl:h-[112px] mdl:rounded-[24px] relative flex h-[96px] items-center justify-center rounded-2xl border text-2xl font-extrabold transition ${
                    isSelected
                      ? "bg-romance-accent text-white"
                      : "text-romance-accent hover:border-romance-tint hover:bg-romance-tint border-white/85 bg-white/90"
                  }`}
                  aria-label={`${choice.id}번 OX 질문: ${choice.question}`}
                >
                  <span className="mdl:left-3 mdl:top-3 mdl:h-2.5 mdl:w-2.5 absolute left-2 top-2 h-2 w-2 rounded-full bg-current opacity-35" />
                  <QuestionCategoryBadge category={choice.category} />
                  <span>{choice.id}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <footer className="mt-4 flex shrink-0 justify-between">
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
}
