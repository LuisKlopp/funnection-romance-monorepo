"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useState } from "react";

import { createRomanceCounsel, ROMANCE_COUNSEL_QUERY_KEY } from "@/api";

const MAX_COUNSEL_LENGTH = 500;

export default function Home() {
  const queryClient = useQueryClient();
  const [counsel, setCounsel] = useState("");
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const trimmedCounsel = counsel.trim();

  const counselMutation = useMutation({
    mutationFn: createRomanceCounsel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ROMANCE_COUNSEL_QUERY_KEY,
      });
      setCounsel("");
      setSubmitMessage("제출되었습니다");
    },
    onError: () => {
      setSubmitMessage("제출에 실패했습니다. 다시 시도해주세요");
    },
  });

  useEffect(() => {
    if (!submitMessage) return;

    const timeoutId = window.setTimeout(() => {
      setSubmitMessage(null);
    }, 1600);

    return () => window.clearTimeout(timeoutId);
  }, [submitMessage]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedCounsel) {
      setSubmitMessage("고민을 입력해주세요");
      return;
    }

    counselMutation.mutate({
      content: trimmedCounsel,
    });
  };

  return (
    <main className="bg-romance-gradient text-romance-ink mdl:items-center mdl:justify-center mdl:px-8 fixed inset-0 flex h-[100dvh] w-full overflow-y-auto px-5 py-8">
      <form
        onSubmit={handleSubmit}
        className="mdl:max-w-[640px] mdl:gap-8 mdl:rounded-[32px] mdl:px-12 mdl:py-12 shadow-soft-card bg-romance-surface/70 mx-auto flex min-h-full w-full max-w-[440px] flex-col justify-center gap-7 rounded-[28px] border border-white/70 px-5 py-8 backdrop-blur"
      >
        <div className="flex flex-col items-center text-center">
          <h1 className="text-romance-accent text-shadow-01 mdl:text-[46px] text-[34px] font-extrabold leading-8 tracking-normal">
            Funnection <br className="mdl:hidden" />{" "}
            <span className="text-romance-accent text-[24px]">연애특집</span>
          </h1>
          <p className="text-romance-muted mb-1 mt-2 max-w-[320px] text-base font-medium">
            연애 및 결혼과 관련된 고민을 남겨주세요.
          </p>
          <p className="text-romance-muted text-sm">
            (다른 고민이 있다면 그것도 괜찮아요!)
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <textarea
            value={counsel}
            onChange={(event) => setCounsel(event.target.value)}
            maxLength={MAX_COUNSEL_LENGTH}
            placeholder="고민을 입력해주세요"
            className="text-romance-ink placeholder:text-romance-muted/45 focus:border-romance-accent focus:ring-romance-accent/20 mdl:min-h-[260px] min-h-[240px] w-full resize-none rounded-[24px] border border-white/85 bg-white/90 px-5 py-5 text-base font-semibold leading-relaxed outline-none transition focus:bg-white focus:ring-4"
            aria-label="익명 고민 입력"
          />

          <p className="text-romance-muted text-right text-xs font-semibold">
            {counsel.length}/{MAX_COUNSEL_LENGTH}
          </p>
        </div>

        <button
          type="submit"
          disabled={counselMutation.isPending}
          className="btn-press-in bg-romance-accent shadow-soft-card flex h-10 w-full items-center justify-center rounded-full border border-white/80 text-base font-extrabold text-white transition hover:brightness-105 disabled:opacity-45"
        >
          {counselMutation.isPending ? "제출 중" : "제출"}
        </button>
      </form>

      {submitMessage && (
        <div className="fixed inset-x-0 bottom-8 z-50 flex justify-center px-5">
          <div className="shadow-soft-card bg-romance-surface/95 text-romance-accent rounded-2xl border border-white/80 px-5 py-4 text-sm font-extrabold backdrop-blur">
            {submitMessage}
          </div>
        </div>
      )}
    </main>
  );
}
