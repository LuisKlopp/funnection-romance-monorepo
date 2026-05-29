"use client";

import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

import { SubmitModal } from "@/components";
import { QUESTION_ANSWERED_STORAGE_KEY } from "@/constants/question-questions";

interface QuestionDetailClientProps {
  id: number;
  question: string;
}

const sampleAnswers = [
  "새로운 도전과 경험을 하고싶어요",
  "점점 마음이 단단해지는 중이에요",
  "맑음. 생각보다 편안한 하루예요",
  "평온해요. 그냥 조용하고 평범한 하루를 보내요, 평온해요. 그냥 조용하고 평범한 하루를 보내요, 평온해요. 그냥 조용하고 평범한 하루를 보내요",
  "안정적이지만, 더 큰 안정을 추구하는 상태",
  "만족합니다",
  "새로운 시작이 가능한 충전상태",
  "앞으로의 방향을 정리하는 상태",
] as const;

export const QuestionDetailClient = ({
  id,
  question,
}: QuestionDetailClientProps) => {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [displayAnswers, setDisplayAnswers] = useState<string[]>([]);
  const [visibleAnswerCount, setVisibleAnswerCount] = useState(0);
  const [isRevealingAnswers, setIsRevealingAnswers] = useState(false);
  const revealTimeoutIds = useRef<number[]>([]);

  const isSubmitDisabled = answer.trim().length === 0 || isSubmitting;
  const visibleAnswers = displayAnswers.slice(0, visibleAnswerCount);
  const answerCount = displayAnswers.length || sampleAnswers.length;

  useEffect(() => {
    if (!isSubmitted) return;

    const timeoutId = window.setTimeout(() => {
      setIsSubmitted(false);
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [isSubmitted]);

  useEffect(() => {
    return () => {
      revealTimeoutIds.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitDisabled) return;

    setIsSubmitting(true);

    window.setTimeout(() => {
      const savedIds = localStorage.getItem(QUESTION_ANSWERED_STORAGE_KEY);
      const answeredIds = savedIds ? parseAnsweredIds(savedIds) : [];
      const nextAnsweredIds = answeredIds.includes(id)
        ? answeredIds
        : [...answeredIds, id];

      localStorage.setItem(
        QUESTION_ANSWERED_STORAGE_KEY,
        JSON.stringify(nextAnsweredIds)
      );
      setAnswer("");
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  const handleShowAnswers = () => {
    if (isRevealingAnswers || visibleAnswerCount === answerCount) {
      return;
    }

    const shuffledAnswers = shuffleAnswers(sampleAnswers);

    revealTimeoutIds.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    revealTimeoutIds.current = [];
    setDisplayAnswers(shuffledAnswers);
    setVisibleAnswerCount(0);
    setIsRevealingAnswers(true);

    shuffledAnswers.forEach((_, index) => {
      const timeoutId = window.setTimeout(
        () => {
          setVisibleAnswerCount(index + 1);

          if (index === shuffledAnswers.length - 1) {
            setIsRevealingAnswers(false);
          }
        },
        (index + 1) * 2000
      );

      revealTimeoutIds.current.push(timeoutId);
    });
  };

  return (
    <main className="bg-romance-gradient mdl:bg-[#c7d8fb] text-romance-ink fixed inset-0 flex h-[100dvh] w-full">
      <section className="mdl:max-w-[1080px] mdl:px-8 mdl:pb-8 mdl:pt-8 mx-auto flex h-full w-full max-w-[480px] flex-col px-4 pb-4 pt-5">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <Link
            href="/question-page"
            className="btn-press-in bg-romance-surface/85 text-romance-accent shadow-soft-card mdl:h-12 mdl:w-12 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 backdrop-blur"
            aria-label="문답 질문 목록으로 이동"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="text-romance-highlight mdl:hidden text-xs font-bold">
              문답 {id}번 질문
            </p>
            <h1 className="text-romance-accent text-shadow-01 mdl:hidden mt-1 text-2xl font-extrabold leading-none">
              연애특집 문답
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

        <div className="mdl:mt-8 mt-4 flex min-h-0 flex-1 flex-col justify-center">
          <div className="bg-romance-surface/55 shadow-soft-card mdl:flex-1 mdl:justify-center mdl:rounded-[32px] mdl:border-transparent mdl:bg-transparent mdl:p-10 mdl:shadow-none flex flex-col rounded-[28px] border border-white/70 p-4 backdrop-blur">
            <form
              onSubmit={handleSubmit}
              className="mdl:hidden mx-auto flex w-full max-w-[820px] flex-col items-center gap-6"
            >
              <p className="text-shadow-01 mdl:hidden text-center text-2xl font-extrabold text-slate-800">
                {id}번 질문
              </p>

              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="답변을 입력해주세요"
                disabled={isSubmitting}
                className="shadow-soft-card text-romance-ink placeholder:text-romance-muted/55 focus:border-romance-accent focus:ring-romance-accent/20 mdl:min-h-[220px] mdl:max-w-[680px] mdl:text-xl min-h-[210px] w-full resize-none rounded-[24px] border border-white/85 bg-white/90 px-5 py-5 text-base font-semibold leading-relaxed outline-none backdrop-blur transition focus:bg-white focus:ring-4 disabled:opacity-70"
                aria-label={`${id}번 질문 답변 입력`}
              />

              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="btn-press-in bg-romance-accent shadow-soft-card mdl:max-w-[240px] mdl:text-lg h-13 flex w-full items-center justify-center rounded-full border border-white/80 px-6 text-base font-extrabold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
              >
                제출
              </button>
            </form>

            <div className="mdl:flex relative mx-auto hidden h-full w-full max-w-[820px] flex-col items-center justify-center gap-8">
              <p className="font-jua leading-tightPlus text-center text-[36px] font-extrabold text-slate-700">
                {id}. {question}
              </p>

              {visibleAnswers.length > 0 && (
                <div className="flex w-full max-w-[680px] flex-col gap-3">
                  {visibleAnswers.map((item, index) => (
                    <div
                      key={item}
                      className="answer-scrollbar fade-in-up font-jua text-romance-accent max-h-[64px] overflow-y-auto rounded-lg bg-[#fff1f6]/95 px-5 py-3 pr-7 text-[24px] font-extrabold leading-tight shadow-[0_10px_22px_rgba(139,34,72,0.14)]"
                    >
                      {index + 1}. {item}
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleShowAnswers}
                disabled={
                  isRevealingAnswers || visibleAnswerCount === answerCount
                }
                className="btn-press-in mt-4 flex h-[58px] min-w-[190px] items-center justify-center rounded-xl bg-slate-600 px-7 text-lg font-extrabold text-white shadow-[0_10px_22px_rgba(61,76,101,0.24)] transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                답변 확인
              </button>

              <p className="absolute bottom-0 right-0 text-base font-extrabold text-slate-700">
                답변 현황 : {visibleAnswerCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      {isSubmitting && <SubmittingOverlay />}
      {isSubmitted && <SubmitModal contents="답변이 제출되었습니다" />}
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

const shuffleAnswers = (answers: readonly string[]) => {
  const shuffledAnswers = [...answers];

  for (let index = shuffledAnswers.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledAnswers[index], shuffledAnswers[randomIndex]] = [
      shuffledAnswers[randomIndex],
      shuffledAnswers[index],
    ];
  }

  return shuffledAnswers;
};

const SubmittingOverlay = () => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="fade-in-up bg-romance-surface/95 shadow-soft-card flex min-w-[160px] flex-col items-center gap-3 rounded-2xl border border-white/80 px-6 py-5 backdrop-blur">
        <div className="border-romance-accent h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-romance-accent text-sm font-extrabold">
          제출 중입니다
        </p>
      </div>
    </div>
  );
};
