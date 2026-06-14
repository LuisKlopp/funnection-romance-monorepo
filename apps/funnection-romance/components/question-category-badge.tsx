import type { RomanceCategory } from "@/api";

const CATEGORY_BADGE = {
  love: {
    emoji: "💌",
    label: "연애 카테고리",
    className: "rotate-[25deg]",
  },
  adult: {
    emoji: "🔞",
    label: "성인 카테고리",
    className: "",
  },
} as const;

export const QuestionCategoryBadge = ({
  category,
}: {
  category: RomanceCategory;
}) => {
  if (category !== "love" && category !== "adult") {
    return null;
  }

  const badge = CATEGORY_BADGE[category];

  return (
    <span
      className={`absolute -right-1.5 -top-1.5 z-10 text-[26px] leading-none ${badge.className}`}
      role="img"
      aria-label={badge.label}
    >
      {badge.emoji}
    </span>
  );
};
