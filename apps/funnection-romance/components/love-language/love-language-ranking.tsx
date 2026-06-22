"use client";

import { useMutation } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, GripVertical, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { createRomanceLoveLanguage } from "@/api";
import { SubmitModal } from "@/components";
import {
  getLoveLanguageStyle,
  LOVE_LANGUAGES,
  type LoveLanguageName,
} from "@/constants";

interface LoveLanguageRankingProps {
  userId: string;
  onSubmitted: () => void;
}

type SubmitState = "idle" | "error";

export const LoveLanguageRanking = ({
  userId,
  onSubmitted,
}: LoveLanguageRankingProps) => {
  const [loveLanguages, setLoveLanguages] = useState<LoveLanguageName[]>([
    ...LOVE_LANGUAGES,
  ]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const submitMutation = useMutation({
    mutationFn: createRomanceLoveLanguage,
    onSuccess: () => {
      setIsSubmitted(true);
      setIsSubmitModalOpen(true);
      onSubmitted();
    },
    onError: () => {
      setSubmitState("error");
    },
  });

  useEffect(() => {
    if (!isSubmitModalOpen) return;

    const timeoutId = window.setTimeout(() => {
      setIsSubmitModalOpen(false);
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [isSubmitModalOpen]);

  const moveLanguage = (fromIndex: number, toIndex: number) => {
    if (
      submitMutation.isPending ||
      isSubmitted ||
      fromIndex === toIndex ||
      toIndex < 0 ||
      toIndex >= loveLanguages.length
    ) {
      return;
    }

    setLoveLanguages((previous) => {
      const next = [...previous];
      const [movedLanguage] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, movedLanguage);
      return next;
    });
    setSubmitState("idle");
  };

  const handleSubmit = () => {
    if (!userId.trim() || submitMutation.isPending || isSubmitted) return;

    setSubmitState("idle");
    submitMutation.mutate({
      userId,
      loveLanguages: loveLanguages.map((loveLanguage, index) => ({
        loveLanguage,
        loveLanguageOrder: index + 1,
      })),
    });
  };

  return (
    <section className="bg-romance-surface/70 shadow-soft-card relative flex flex-col rounded-[28px] border border-white/75 p-4 backdrop-blur mdl:rounded-[32px] mdl:p-6">
      {isSubmitModalOpen && (
        createPortal(
          <SubmitModal contents="제출되었습니다" position="fixed" />,
          document.body
        )
      )}

      <div>
        <p className="text-romance-highlight text-xs font-extrabold mdl:text-sm">
          나의 우선순위
        </p>
        <h2 className="text-romance-ink mt-1 text-xl font-extrabold mdl:text-2xl">
          순위를 정해주세요
        </h2>
      </div>

      <p className="text-romance-muted leading-middlePlus mt-2 text-xs font-semibold mdl:text-sm">
        카드를 드래그하거나 화살표를 눌러 순서를 바꿀 수 있어요.
      </p>

      <ol className="mt-4 flex flex-col gap-2.5">
        {loveLanguages.map((loveLanguage, index) => {
          const style = getLoveLanguageStyle(loveLanguage);

          return (
            <li
              key={loveLanguage}
              draggable={!submitMutation.isPending && !isSubmitted}
              onDragStart={() => setDraggedIndex(index)}
              onDragEnd={() => setDraggedIndex(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (draggedIndex === null) return;
                moveLanguage(draggedIndex, index);
                setDraggedIndex(null);
              }}
              className={`shadow-soft-card flex min-h-[58px] items-center gap-2 rounded-2xl border border-white/85 px-2.5 py-2 transition mdl:min-h-[64px] mdl:px-3 ${
                draggedIndex === index ? "opacity-55" : "opacity-100"
              }`}
              style={{ backgroundColor: style.background }}
            >
              <span className="text-romance-muted flex shrink-0 items-center gap-1">
                <GripVertical className="hidden h-4 w-4 mdl:block" aria-hidden="true" />
                <span className="w-5 text-center text-base font-extrabold">
                  {index + 1}
                </span>
              </span>

              <span className="min-w-0 flex-1 text-sm font-extrabold text-slate-800 mdl:text-base">
                {loveLanguage}
              </span>
              <span className="text-lg" aria-hidden="true">
                {style.emoji}
              </span>

              <span className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => moveLanguage(index, index - 1)}
                  disabled={
                    index === 0 || submitMutation.isPending || isSubmitted
                  }
                  className="btn-press-in flex h-9 w-9 items-center justify-center rounded-full bg-white/70 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label={`${loveLanguage} 순위를 위로 이동`}
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveLanguage(index, index + 1)}
                  disabled={
                    index === loveLanguages.length - 1 ||
                    submitMutation.isPending ||
                    isSubmitted
                  }
                  className="btn-press-in flex h-9 w-9 items-center justify-center rounded-full bg-white/70 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label={`${loveLanguage} 순위를 아래로 이동`}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </span>
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitMutation.isPending || isSubmitted}
        className="btn-press-in bg-romance-accent shadow-soft-card mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/80 text-sm font-extrabold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitMutation.isPending && (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {submitMutation.isPending
          ? "제출 중"
          : isSubmitted
            ? "제출 완료"
            : "내 사랑의 언어 제출"}
      </button>

      {submitState === "error" && (
        <div
          role="alert"
          className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-extrabold text-red-700"
        >
          제출하지 못했습니다. 잠시 후 다시 시도해주세요.
        </div>
      )}
    </section>
  );
};
