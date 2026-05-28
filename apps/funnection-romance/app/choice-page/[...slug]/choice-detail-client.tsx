"use client";

import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { CHOICE_ANSWERED_STORAGE_KEY } from "@/constants/choice-questions";

type ChoiceAnswer = "O" | "X";

interface ChoiceDetailClientProps {
  id: number;
  question: string;
}

export const ChoiceDetailClient = ({
  id,
  question,
}: ChoiceDetailClientProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<ChoiceAnswer | null>(
    null
  );
  const [counts, setCounts] = useState<Record<ChoiceAnswer, number>>({
    O: 0,
    X: 0,
  });

  const handleAnswerClick = (answer: ChoiceAnswer) => {
    if (selectedAnswer) return;

    const savedIds = localStorage.getItem(CHOICE_ANSWERED_STORAGE_KEY);
    const answeredIds = savedIds ? parseAnsweredIds(savedIds) : [];
    const nextAnsweredIds = answeredIds.includes(id)
      ? answeredIds
      : [...answeredIds, id];

    localStorage.setItem(
      CHOICE_ANSWERED_STORAGE_KEY,
      JSON.stringify(nextAnsweredIds)
    );
    setSelectedAnswer(answer);
    setCounts((prev) => ({
      ...prev,
      [answer]: prev[answer] + 1,
    }));
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
            <p className="text-romance-highlight mdl:block mdl:text-sm hidden text-xs font-bold">
              OX {id}번 질문
            </p>
            <h1 className="text-romance-accent text-shadow-01 mdl:text-[44px] mt-1 text-2xl font-extrabold leading-none">
              <span className="mdl:hidden">연애특집 OX</span>
              <span className="mdl:inline hidden">OX 질문</span>
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

        <div className="bg-romance-surface/55 shadow-soft-card mdl:mt-8 mdl:rounded-[32px] mdl:p-10 mt-4 flex min-h-0 flex-1 flex-col justify-center rounded-[28px] border border-white/70 p-4 backdrop-blur">
          <div className="mdl:gap-12 mx-auto flex w-full max-w-[820px] flex-col items-center gap-6">
            <p className="text-romance-ink font-jua leading-tightPlus mdl:block mdl:text-4xl hidden break-keep text-center text-xl font-extrabold text-slate-800">
              {id}. {question}
            </p>

            <p className="text-shadow-01 mdl:hidden text-center text-2xl font-extrabold text-slate-800">
              {id}번 질문
            </p>

            <div className="mdl:hidden grid w-full grid-cols-1 gap-4">
              <AnswerButton
                answer="O"
                selectedAnswer={selectedAnswer}
                onClick={() => handleAnswerClick("O")}
              />
              <AnswerButton
                answer="X"
                selectedAnswer={selectedAnswer}
                onClick={() => handleAnswerClick("X")}
              />
            </div>

            <div className="mdl:flex hidden w-full items-start justify-center gap-32">
              <AnswerResult answer="O" count={counts.O} />
              <AnswerResult answer="X" count={counts.X} />
            </div>
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
};

const parseAnsweredIds = (value: string): number[] => {
  try {
    const parsedValue = JSON.parse(value);

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

interface AnswerButtonProps {
  answer: ChoiceAnswer;
  selectedAnswer: ChoiceAnswer | null;
  onClick: () => void;
}

const AnswerButton = ({
  answer,
  selectedAnswer,
  onClick,
}: AnswerButtonProps) => {
  const isSelected = selectedAnswer === answer;
  const isDimmed = !!selectedAnswer && !isSelected;
  const isPositive = answer === "O";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!!selectedAnswer}
      className={`btn-press-in shadow-soft-card flex min-h-[104px] flex-col items-center justify-center rounded-[24px] border px-6 py-5 transition ${
        isSelected
          ? isPositive
            ? "border-[#2563eb] bg-[#2563eb] text-white"
            : "border-[#dc2626] bg-[#dc2626] text-white"
          : isPositive
            ? "border-[#bfdbfe] bg-white/90 text-[#2563eb] hover:bg-[#eff6ff]"
            : "border-[#fecaca] bg-white/90 text-[#dc2626] hover:bg-[#fef2f2]"
      } ${isDimmed ? "opacity-55" : ""}`}
      aria-label={`${answer} 선택`}
    >
      <span
        className={`text-[48px] font-extrabold leading-none ${
          isPositive ? "text-shadow-01" : "text-shadow-02"
        }`}
      >
        {answer}
      </span>
    </button>
  );
};

interface AnswerResultProps {
  answer: ChoiceAnswer;
  count: number;
}

const AnswerResult = ({ answer, count }: AnswerResultProps) => {
  const isPositive = answer === "O";

  return (
    <div className="flex min-w-[180px] flex-col items-center gap-12">
      <span
        className={`text-shadow-04 text-[132px] font-extrabold leading-none ${
          isPositive ? "text-[#2563eb]" : "text-[#dc2626]"
        }`}
      >
        {answer}
      </span>
      <div className="relative flex min-h-20 items-start justify-center">
        <span className="text-shadow-01 text-5xl font-extrabold text-slate-800">
          {count}
        </span>
        <span className="text-romance-muted ml-2 pt-6 text-xl font-bold">
          개
        </span>
      </div>
    </div>
  );
};
