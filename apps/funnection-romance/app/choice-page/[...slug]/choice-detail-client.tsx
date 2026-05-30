"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { RomanceChoiceAnswerValue } from "@/api";
import {
  getRomanceChoice,
  getRomanceChoiceResult,
  getRomanceChoiceTotal,
  romanceChoiceDetailQueryKey,
  romanceChoiceResultQueryKey,
  romanceChoiceTotalQueryKey,
  saveRomanceChoiceAnswer,
} from "@/api";
import { SubmitModal } from "@/components";
import {
  CHOICE_ANSWERED_STORAGE_KEY,
  ROMANCE_NICKNAME_STORAGE_KEY,
} from "@/constants/choice-questions";

interface ChoiceDetailClientProps {
  id: number;
}

export const ChoiceDetailClient = ({ id }: ChoiceDetailClientProps) => {
  const queryClient = useQueryClient();
  const [selectedAnswer, setSelectedAnswer] =
    useState<RomanceChoiceAnswerValue | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [hasCheckedTotal, setHasCheckedTotal] = useState(false);

  const choiceQuery = useQuery({
    queryKey: romanceChoiceDetailQueryKey(id),
    queryFn: () => getRomanceChoice(id),
  });

  const resultQuery = useQuery({
    queryKey: romanceChoiceResultQueryKey(id),
    queryFn: () => getRomanceChoiceResult(id),
    enabled: false,
  });

  const totalQuery = useQuery({
    queryKey: romanceChoiceTotalQueryKey(id),
    queryFn: () => getRomanceChoiceTotal(id),
    enabled: false,
  });

  const answerMutation = useMutation({
    mutationFn: ({
      answer,
      nickname,
    }: {
      answer: RomanceChoiceAnswerValue;
      nickname: string;
    }) => saveRomanceChoiceAnswer(id, { nickname, answer }),
    onSuccess: (savedAnswer) => {
      const savedIds = localStorage.getItem(CHOICE_ANSWERED_STORAGE_KEY);
      const answeredIds = savedIds ? parseAnsweredIds(savedIds) : [];
      const nextAnsweredIds = answeredIds.includes(id)
        ? answeredIds
        : [...answeredIds, id];

      localStorage.setItem(
        CHOICE_ANSWERED_STORAGE_KEY,
        JSON.stringify(nextAnsweredIds)
      );
      setSelectedAnswer(savedAnswer.answer);
      setSubmitMessage(`${savedAnswer.answer}로 제출됐습니다`);
      queryClient.invalidateQueries({
        queryKey: romanceChoiceResultQueryKey(id),
      });
      queryClient.invalidateQueries({
        queryKey: romanceChoiceTotalQueryKey(id),
      });
    },
    onError: () => {
      setSubmitMessage(null);
    },
  });

  const result = resultQuery.data ?? { questionId: id, O: 0, X: 0 };
  const totalCount = totalQuery.data?.total ?? 0;
  const isAnswerDisabled =
    answerMutation.isPending ||
    !!selectedAnswer ||
    choiceQuery.isLoading ||
    choiceQuery.isError;

  useEffect(() => {
    if (!submitMessage) return;

    const timeoutId = window.setTimeout(() => {
      setSubmitMessage(null);
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [submitMessage]);

  const handleAnswerClick = (answer: RomanceChoiceAnswerValue) => {
    if (isAnswerDisabled) return;

    const savedNickname = getSavedNickname();

    if (!savedNickname) {
      setSubmitMessage("닉네임을 먼저 입력해주세요");
      return;
    }

    answerMutation.mutate({ answer, nickname: savedNickname });
  };

  const handleShowResults = async () => {
    const result = await resultQuery.refetch();

    if (result.data) {
      setShowResults(true);
    }
  };

  const handleCheckTotal = () => {
    setHasCheckedTotal(true);
    totalQuery.refetch();
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
            <p className="text-romance-ink font-jua leading-tightPlus mdl:block mdl:text-4xl hidden break-keep text-center text-xl font-medium text-slate-800">
              {id}.{" "}
              {choiceQuery.isLoading
                ? "질문을 불러오는 중입니다"
                : choiceQuery.data?.question}
            </p>

            <p className="text-shadow-01 mdl:hidden text-center text-2xl font-extrabold text-slate-800">
              {id}번 질문
            </p>

            {choiceQuery.isError && (
              <button
                type="button"
                onClick={() => choiceQuery.refetch()}
                className="btn-press-in text-romance-accent rounded-xl border border-white/80 bg-white/85 px-4 py-3 text-sm font-extrabold"
              >
                질문 다시 불러오기
              </button>
            )}

            <div className="mdl:hidden grid w-full grid-cols-1 gap-4">
              <AnswerButton
                answer="O"
                disabled={isAnswerDisabled}
                onClick={() => handleAnswerClick("O")}
              />
              <AnswerButton
                answer="X"
                disabled={isAnswerDisabled}
                onClick={() => handleAnswerClick("X")}
              />
            </div>

            <div className="mdl:flex hidden w-full flex-col items-center gap-10">
              <div className="mx-auto flex w-full max-w-[560px] items-start justify-center gap-24">
                <AnswerResult
                  answer="O"
                  count={result.O}
                  showCount={showResults}
                />
                <AnswerResult
                  answer="X"
                  count={result.X}
                  showCount={showResults}
                />
              </div>

              {!showResults && (
                <button
                  type="button"
                  onClick={handleShowResults}
                  className="btn-press-in bg-romance-surface/90 text-romance-accent shadow-soft-card min-w-[150px] rounded-xl border border-white/80 px-6 py-4 text-xl font-extrabold backdrop-blur hover:bg-white"
                >
                  결과 확인
                </button>
              )}

              <button
                type="button"
                onClick={handleCheckTotal}
                className="btn-press-in text-romance-muted/75 text-sm font-semibold hover:text-romance-accent"
              >
                {hasCheckedTotal
                  ? `현재 ${totalCount}명이 답변했어요`
                  : "현재 0명이 답변했어요"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {submitMessage && (
        <SubmitModal contents={submitMessage} overlayClassName="mdl:hidden" />
      )}
    </main>
  );
};

const getSavedNickname = () =>
  localStorage.getItem(ROMANCE_NICKNAME_STORAGE_KEY)?.trim() ?? "";

const parseAnsweredIds = (value: string): number[] => {
  try {
    const parsedValue = JSON.parse(value);

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

interface AnswerButtonProps {
  answer: RomanceChoiceAnswerValue;
  disabled: boolean;
  onClick: () => void;
}

const AnswerButton = ({
  answer,
  disabled,
  onClick,
}: AnswerButtonProps) => {
  const isPositive = answer === "O";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`btn-press-in shadow-soft-card min-h-17.5 flex flex-col items-center justify-center rounded-[20px] border px-6 py-3 transition disabled:cursor-not-allowed ${
        disabled
          ? "border-romance-accent/25 bg-romance-accent text-white"
          : isPositive
            ? "border-[#bfdbfe] bg-white/90 text-[#2563eb] hover:bg-[#eff6ff]"
            : "border-[#fecaca] bg-white/90 text-[#dc2626] hover:bg-[#fef2f2]"
      }`}
      aria-label={`${answer} 선택`}
    >
      <span
        className={`text-[36px] font-extrabold leading-none ${
          disabled
            ? "text-shadow-01"
            : isPositive
              ? "text-shadow-01"
              : "text-shadow-02"
        }`}
      >
        {answer}
      </span>
    </button>
  );
};

interface AnswerResultProps {
  answer: RomanceChoiceAnswerValue;
  count: number;
  showCount: boolean;
}

const AnswerResult = ({
  answer,
  count,
  showCount,
}: AnswerResultProps) => {
  const isPositive = answer === "O";

  return (
    <div className="mdl:min-h-[180px] mdl:min-w-[180px] mdl:gap-7 flex min-w-[120px] flex-col items-center justify-start gap-4">
      <span
        className={`text-shadow-04 mdl:text-[112px] text-[64px] font-extrabold leading-none ${
          isPositive ? "text-[#2563eb]" : "text-[#dc2626]"
        }`}
      >
        {answer}
      </span>
      {showCount && (
        <div className="relative flex min-h-10 items-start justify-center">
          <span className="text-shadow-01 mdl:text-[40px] text-[28px] font-semibold text-slate-800">
            {count}
          </span>
          <span className="text-romance-muted ml-1 pt-3 text-sm font-bold">
            개
          </span>
        </div>
      )}
    </div>
  );
};
