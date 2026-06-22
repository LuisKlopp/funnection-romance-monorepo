export const LOVE_LANGUAGES = [
  "인정하는 말",
  "함께하는 시간",
  "선물",
  "봉사",
  "스킨쉽",
] as const;

export type LoveLanguageName = (typeof LOVE_LANGUAGES)[number];

export const LOVE_LANGUAGE_STYLES: Record<
  string,
  { background: string; emoji: string; textColor: string }
> = {
  "인정하는 말": {
    background: "#DBEAFE",
    emoji: "💬",
    textColor: "#2563EB",
  },
  "함께하는 시간": {
    background: "#FCE7F3",
    emoji: "⏳",
    textColor: "#DB2777",
  },
  선물: {
    background: "#FEF3C7",
    emoji: "🎁",
    textColor: "#D97706",
  },
  봉사: {
    background: "#DCFCE7",
    emoji: "🤝",
    textColor: "#16A34A",
  },
  스킨쉽: {
    background: "#FEE2E2",
    emoji: "👩🏻‍❤️‍👨🏻",
    textColor: "#DC2626",
  },
};

export const getLoveLanguageStyle = (loveLanguage: string) =>
  LOVE_LANGUAGE_STYLES[loveLanguage] ?? {
    background: "#F3F4F6",
    emoji: "💗",
    textColor: "#795E67",
  };
