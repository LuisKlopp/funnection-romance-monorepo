"use client";

import { X } from "lucide-react";
import { type ReactNode, useEffect } from "react";

import type {
  LoveLanguage,
  LoveLanguageAverage,
  LoveLanguages,
  LoveLanguageSimilarPair,
} from "@/api";
import { getLoveLanguageStyle } from "@/constants";

interface LoveLanguageDialogProps {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}

const LoveLanguageDialog = ({
  title,
  description,
  onClose,
  children,
}: LoveLanguageDialogProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="bg-romance-surface shadow-soft-card slow-fade-in-up relative flex max-h-[88dvh] w-full max-w-[640px] flex-col overflow-hidden rounded-[28px] border border-white/80">
        <div className="border-romance-line/35 flex shrink-0 items-start justify-between gap-4 border-b px-5 py-4 mdl:px-6 mdl:py-5">
          <div>
            <h2 className="text-romance-accent text-xl font-extrabold mdl:text-2xl">
              {title}
            </h2>
            {description && (
              <p className="text-romance-muted mt-1 text-xs font-semibold mdl:text-sm">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-press-in text-romance-muted hover:text-romance-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/75"
            aria-label={`${title} 닫기`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="no-scrollbar min-h-0 overflow-y-auto px-5 py-5 mdl:px-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const LanguageList = ({ languages }: { languages: LoveLanguage[] }) => (
  <ol className="flex flex-col gap-2.5">
    {[...languages]
      .sort((first, second) =>
        first.loveLanguageOrder > second.loveLanguageOrder ? 1 : -1
      )
      .map((item) => {
        const style = getLoveLanguageStyle(item.loveLanguage);

        return (
          <li
            key={`${item.loveLanguage}-${item.loveLanguageOrder}`}
            className="shadow-soft-card flex min-h-12 items-center gap-3 rounded-2xl border border-white/85 px-3 py-2.5"
            style={{ backgroundColor: style.background }}
          >
            <span
              className="w-6 text-center text-sm font-extrabold"
              style={{ color: style.textColor }}
            >
              {item.loveLanguageOrder}
            </span>
            <span className="min-w-0 flex-1 text-sm font-extrabold text-slate-800 mdl:text-base">
              {item.loveLanguage}
            </span>
            <span aria-hidden="true">{style.emoji}</span>
          </li>
        );
      })}
  </ol>
);

interface UserLanguageDialogProps {
  userId: string;
  languages: LoveLanguage[];
  onClose: () => void;
}

export const UserLanguageDialog = ({
  userId,
  languages,
  onClose,
}: UserLanguageDialogProps) => (
  <LoveLanguageDialog
    title={`${userId}님의 사랑의 언어`}
    description="선택한 우선순위입니다."
    onClose={onClose}
  >
    <LanguageList languages={languages} />
  </LoveLanguageDialog>
);

interface SimilarPairDialogProps {
  pair: LoveLanguageSimilarPair;
  loveLanguages: LoveLanguages;
  onClose: () => void;
}

const LOVE_LANGUAGE_MAX_DIFFERENCE_SCORE = 40;

export const SimilarPairDialog = ({
  pair,
  loveLanguages,
  onClose,
}: SimilarPairDialogProps) => (
  <LoveLanguageDialog
    title="사랑의 언어 케미스트리"
    description={`가장 비슷한 두 사람 · 유사도 ${Math.max(
      0,
      LOVE_LANGUAGE_MAX_DIFFERENCE_SCORE - pair.score
    )}점 / ${LOVE_LANGUAGE_MAX_DIFFERENCE_SCORE}점`}
    onClose={onClose}
  >
    <div className="grid grid-cols-1 gap-6 mdl:grid-cols-2">
      {[pair.user1, pair.user2].map((userId) => (
        <section key={userId}>
          <h3 className="text-romance-accent mb-3 truncate text-lg font-extrabold">
            {userId}
          </h3>
          <LanguageList languages={loveLanguages[userId] ?? []} />
        </section>
      ))}
    </div>
  </LoveLanguageDialog>
);

interface AverageDialogProps {
  averages: LoveLanguageAverage[];
  onClose: () => void;
}

export const AverageDialog = ({ averages, onClose }: AverageDialogProps) => (
  <LoveLanguageDialog
    title="사랑의 언어 평균 순위"
    description="전체 응답자의 평균 우선순위입니다."
    onClose={onClose}
  >
    <ol className="flex flex-col gap-2.5">
      {averages.map((item, index) => {
        const style = getLoveLanguageStyle(item.loveLanguage);

        return (
          <li
            key={item.loveLanguage}
            className="shadow-soft-card flex min-h-14 items-center gap-3 rounded-2xl border border-white/85 px-3 py-2.5"
            style={{ backgroundColor: style.background }}
          >
            <span
              className="w-6 text-center text-sm font-extrabold"
              style={{ color: style.textColor }}
            >
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 text-sm font-extrabold text-slate-800 mdl:text-base">
              {item.loveLanguage} <span aria-hidden="true">{style.emoji}</span>
            </span>
            <span className="text-romance-accent shrink-0 text-sm font-extrabold mdl:text-base">
              평균 {item.averageOrder}위
            </span>
          </li>
        );
      })}
    </ol>
  </LoveLanguageDialog>
);
