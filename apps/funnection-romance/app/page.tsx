import { ArrowRight, MessageCircle, PenLine, Sparkles } from "lucide-react";
import Link from "next/link";

const menuItems = [
  {
    href: "/impression-page",
    title: "첫인상",
    description: "가볍게 남겨보는 첫 느낌",
    icon: Sparkles,
  },
  {
    href: "/choice-page",
    title: "연애특집 OX",
    description: "정답은 없어요.",
    icon: MessageCircle,
  },
  {
    href: "/question-page",
    title: "연애특집 문답",
    description: "떠오르는 생각을 그대로 표현해주세요.",
    icon: PenLine,
  },
] as const;

export default function Home() {
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

        <nav className="mdl:grid-cols-3 mdl:gap-5 grid w-full grid-cols-1 gap-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="btn-press-in bg-romance-surface/85 shadow-soft-card hover:border-romance-line mdl:min-h-[92px] mdl:gap-4 mdl:px-6 group flex min-h-[74px] w-full items-center gap-3 rounded-2xl border border-white/70 px-4 py-3 text-left backdrop-blur transition hover:bg-white"
              >
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
              </Link>
            );
          })}
        </nav>
      </section>
    </main>
  );
}
