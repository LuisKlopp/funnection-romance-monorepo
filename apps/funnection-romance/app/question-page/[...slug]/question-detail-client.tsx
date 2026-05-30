"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

import {
  createRomanceQuestionAnswer,
  getRomanceQuestion,
  getRomanceQuestionAnswers,
  romanceQuestionAnswersQueryKey,
  romanceQuestionDetailQueryKey,
} from "@/api";
import { SubmitModal } from "@/components";
import { ROMANCE_NICKNAME_STORAGE_KEY } from "@/constants/choice-questions";

const ANSWER_REVEAL_DELAY_MS = 800;

interface QuestionDetailClientProps {
  id: number;
}

export const QuestionDetailClient = ({ id }: QuestionDetailClientProps) => {
  const queryClient = useQueryClient();
  const [answer, setAnswer] = useState("");
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [visibleAnswerCount, setVisibleAnswerCount] = useState(0);
  const [checkedAnswerCount, setCheckedAnswerCount] = useState<number | null>(
    null
  );
  const [isRevealingAnswers, setIsRevealingAnswers] = useState(false);
  const [isLoadingAnswersForReveal, setIsLoadingAnswersForReveal] =
    useState(false);
  const revealTimeoutIds = useRef<number[]>([]);

  const questionQuery = useQuery({
    queryKey: romanceQuestionDetailQueryKey(id),
    queryFn: () => getRomanceQuestion(id),
  });

  const answersQuery = useQuery({
    queryKey: romanceQuestionAnswersQueryKey(id),
    queryFn: () => getRomanceQuestionAnswers(id),
  });

  const answerMutation = useMutation({
    mutationFn: ({ nickname, answer }: { nickname: string; answer: string }) =>
      createRomanceQuestionAnswer(id, { nickname, answer }),
    onSuccess: () => {
      setAnswer("");
      setSubmitMessage("답변이 제출되었습니다");
      queryClient.invalidateQueries({
        queryKey: romanceQuestionAnswersQueryKey(id),
      });
    },
    onError: () => {
      setSubmitMessage("답변 제출에 실패했습니다");
    },
  });

  const answerItems = answersQuery.data?.answers ?? [];
  const visibleAnswers = answerItems.slice(0, visibleAnswerCount);
  const trimmedAnswer = answer.trim();
  const isSubmitDisabled =
    trimmedAnswer.length === 0 || answerMutation.isPending;

  useEffect(() => {
    if (!submitMessage) return;

    const timeoutId = window.setTimeout(() => {
      setSubmitMessage(null);
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [submitMessage]);

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

    const savedNickname = getSavedNickname();

    if (!savedNickname || !trimmedAnswer) {
      setSubmitMessage("닉네임과 답변을 입력해주세요");
      return;
    }

    answerMutation.mutate({
      nickname: savedNickname,
      answer: trimmedAnswer,
    });
  };

  const handleShowAnswers = async () => {
    if (isRevealingAnswers || isLoadingAnswersForReveal) {
      return;
    }

    setIsLoadingAnswersForReveal(true);

    try {
      const result = await answersQuery.refetch();
      const nextAnswers = result.data?.answers ?? [];

      setCheckedAnswerCount(nextAnswers.length);

      if (visibleAnswerCount === nextAnswers.length) {
        return;
      }

      if (nextAnswers.length === 0) {
        return;
      }

      revealTimeoutIds.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      revealTimeoutIds.current = [];
      setVisibleAnswerCount(0);
      setIsRevealingAnswers(true);

      nextAnswers.forEach((_, index) => {
        const timeoutId = window.setTimeout(
          () => {
            setVisibleAnswerCount(index + 1);

            if (index === nextAnswers.length - 1) {
              setIsRevealingAnswers(false);
            }
          },
          (index + 1) * ANSWER_REVEAL_DELAY_MS
        );

        revealTimeoutIds.current.push(timeoutId);
      });
    } finally {
      setIsLoadingAnswersForReveal(false);
    }
  };

  const handleCheckAnswerCount = async () => {
    const result = await answersQuery.refetch();
    setCheckedAnswerCount(result.data?.answers.length ?? 0);
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
                disabled={answerMutation.isPending}
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

              {answersQuery.isError && (
                <button
                  type="button"
                  onClick={() => answersQuery.refetch()}
                  className="btn-press-in text-romance-accent rounded-xl border border-white/80 bg-white/85 px-4 py-3 text-sm font-extrabold"
                >
                  답변 다시 불러오기
                </button>
              )}
            </form>

            <div className="mdl:flex relative mx-auto hidden h-full w-full max-w-[820px] flex-col items-center justify-center gap-8">
              <p className="font-jua leading-tightPlus text-center text-[36px] font-medium text-slate-700">
                {id}.{" "}
                {questionQuery.isLoading
                  ? "질문을 불러오는 중입니다"
                  : questionQuery.data?.question}
              </p>

              {questionQuery.isError && (
                <button
                  type="button"
                  onClick={() => questionQuery.refetch()}
                  className="btn-press-in text-romance-accent rounded-xl border border-white/80 bg-white/85 px-4 py-3 text-sm font-extrabold"
                >
                  질문 다시 불러오기
                </button>
              )}

              {visibleAnswers.length > 0 && (
                <div className="flex w-full max-w-[680px] flex-col gap-3">
                  {visibleAnswers.map((item, index) => (
                    <div
                      key={item.id}
                      className="answer-scrollbar fade-in-up font-jua text-romance-accent max-h-[64px] overflow-y-auto rounded-lg bg-[#fff1f6]/95 px-5 py-3 pr-7 text-[24px] font-medium leading-tight shadow-[0_10px_22px_rgba(139,34,72,0.14)]"
                    >
                      <span className="text-romance-muted">{index + 1}번:</span>{" "}
                      {item.answer}
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleShowAnswers}
                disabled={isLoadingAnswersForReveal || isRevealingAnswers}
                className="btn-press-in mt-4 flex h-[58px] min-w-[190px] items-center justify-center rounded-xl bg-slate-600 px-7 text-lg font-extrabold text-white shadow-[0_10px_22px_rgba(61,76,101,0.24)] transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                답변 확인
              </button>

              <button
                type="button"
                onClick={handleCheckAnswerCount}
                className="absolute bottom-0 right-0 cursor-pointer text-base font-extrabold text-slate-700 disabled:cursor-pointer"
              >
                답변 현황 : {checkedAnswerCount ?? 0}
              </button>
            </div>
          </div>
        </div>
      </section>

      {answerMutation.isPending && <SubmittingOverlay />}
      {submitMessage && <SubmitModal contents={submitMessage} />}
    </main>
  );
};

const getSavedNickname = () =>
  localStorage.getItem(ROMANCE_NICKNAME_STORAGE_KEY)?.trim() ?? "";

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
