"use client";

import {
  ArrowRight,
  MessageCircle,
  PenLine,
  Sparkles,
  Trees,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { ROMANCE_NICKNAME_STORAGE_KEY } from "@/constants/choice-questions";

const menuItems = [
  {
    href: "/impression-page",
    title: "첫인상",
    description: "가볍게 남겨보는 첫 느낌",
    icon: Sparkles,
    requiresNickname: false,
  },
  {
    href: "/choice-page",
    title: "연애특집 OX",
    description: "정답은 없어요.",
    icon: MessageCircle,
    requiresNickname: true,
  },
  {
    href: "/question-page",
    title: "연애특집 문답",
    description: "떠오르는 생각을 그대로 표현해주세요.",
    icon: PenLine,
    requiresNickname: true,
  },
  {
    href: "/counsel-page",
    title: "익명 고민방",
    description: "익명 고민을 하나씩 둘러봐요.",
    icon: Trees,
    requiresNickname: false,
    desktopOnly: true,
  },
] as const;

export default function Home() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const isNicknameModalOpen = !!pendingHref;
  const trimmedNickname = nickname.trim();

  const handleProtectedNavigate = (href: string) => {
    const savedNickname =
      localStorage.getItem(ROMANCE_NICKNAME_STORAGE_KEY)?.trim() ?? "";

    if (savedNickname) {
      router.push(href);
      return;
    }

    setPendingHref(href);
  };

  const handleSubmitNickname = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedNickname || !pendingHref) return;

    localStorage.setItem(ROMANCE_NICKNAME_STORAGE_KEY, trimmedNickname);
    router.push(pendingHref);
  };

  const closeNicknameModal = () => {
    setPendingHref(null);
    setNickname("");
  };

  return (
    <main className="bg-romance-gradient text-romance-ink mdl:items-center mdl:justify-center mdl:px-8 fixed inset-0 flex h-[100dvh] w-full overflow-y-auto px-5 py-8">
      <section className="mdl:min-h-0 mdl:max-w-[1040px] mdl:gap-9 mx-auto flex min-h-full w-full max-w-[440px] flex-col items-center justify-center gap-7">
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <div className="flex flex-col items-stretch gap-2">
            <h1 className="text-romance-accent text-shadow-01 mdl:text-[68px] cursor-default text-[42px] font-extrabold leading-none tracking-normal">
              Funnection
            </h1>
            <span className="text-romance-ink mdl:text-base text-right text-sm font-bold tracking-normal">
              연애특집
            </span>
          </div>

          <p className="leading-middlePlus text-romance-muted mdl:max-w-[430px] mdl:text-base max-w-[320px] text-sm font-medium">
            조금 더 솔직하게 나를 꺼내보는 시간
          </p>
        </div>

        <nav className="mdl:max-w-[440px] grid w-full grid-cols-1 gap-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const contents = (
              <>
                <span className="bg-romance-tint text-romance-accent group-hover:bg-romance-mint mdl:h-12 mdl:w-12 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="text-romance-ink mdl:whitespace-nowrap mdl:text-lg block text-base font-extrabold">
                    {item.title}
                  </span>
                  <span className="leading-tightPlus text-romance-muted mdl:whitespace-nowrap mdl:text-sm mt-1 block text-xs font-medium">
                    {item.description}
                  </span>
                </span>

                <ArrowRight className="text-romance-highlight mdl:h-5 mdl:w-5 h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" />
              </>
            );
            const className =
              `btn-press-in bg-romance-surface/85 shadow-soft-card hover:border-romance-line mdl:min-h-[92px] mdl:gap-4 mdl:px-6 group min-h-[74px] w-full items-center gap-3 rounded-2xl border border-white/70 px-4 py-3 text-left backdrop-blur transition hover:bg-white ${
                "desktopOnly" in item && item.desktopOnly
                  ? "hidden mdl:flex"
                  : "flex"
              }`;

            return item.requiresNickname ? (
              <button
                key={item.href}
                type="button"
                onClick={() => handleProtectedNavigate(item.href)}
                className={className}
              >
                {contents}
              </button>
            ) : (
              <Link key={item.href} href={item.href} className={className}>
                {contents}
              </Link>
            );
          })}
        </nav>
      </section>

      {isNicknameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-5">
          <form
            onSubmit={handleSubmitNickname}
            className="bg-romance-surface shadow-soft-card flex w-full max-w-[360px] flex-col gap-4 rounded-2xl border border-white/80 p-5"
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-romance-ink text-lg font-extrabold">
                닉네임 입력
              </h2>
              <p className="text-romance-muted text-sm font-semibold">
                닉네임을 입력하고 제출해주세요.
              </p>
            </div>

            <input
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="닉네임"
              autoFocus
              className="text-romance-ink placeholder:text-romance-muted/45 focus:border-romance-accent focus:ring-romance-accent/15 h-12 rounded-2xl border border-white/85 bg-white/90 px-4 text-base font-bold outline-none transition focus:bg-white focus:ring-4"
              aria-label="닉네임 입력"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeNicknameModal}
                className="btn-press-in text-romance-muted h-11 flex-1 rounded-full border border-white/80 bg-white/70 text-sm font-extrabold"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!trimmedNickname}
                className="btn-press-in bg-romance-accent h-11 flex-1 rounded-full border border-white/80 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-45"
              >
                제출
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
