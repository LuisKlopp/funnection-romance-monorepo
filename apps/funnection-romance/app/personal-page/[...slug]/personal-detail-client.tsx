"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import {
  createRomancePersonalMessage,
  getRomancePersonalUserMessages,
  type RomancePersonalUser,
  romancePersonalUserQueryKey,
} from "@/api";
import { SubmitModal } from "@/components";
import { ROMANCE_NICKNAME_STORAGE_KEY } from "@/constants/choice-questions";
import { savePersonalSubmittedUserId } from "@/lib";

const MAX_MESSAGE_LENGTH = 500;
const DEFAULT_FONT = "font-jua";

interface PersonalDetailClientProps {
  generateString: string;
}

export const PersonalDetailClient = ({
  generateString,
}: PersonalDetailClientProps) => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const userQuery = useQuery({
    queryKey: romancePersonalUserQueryKey(generateString),
    queryFn: () => getRomancePersonalUserMessages(generateString),
  });

  const user = userQuery.data?.user;
  const trimmedMessage = message.trim();

  const messageMutation = useMutation({
    mutationFn: () => {
      if (!user) {
        throw new Error("User is missing");
      }

      return createRomancePersonalMessage(user.id, {
        message: trimmedMessage,
        font: DEFAULT_FONT,
        nickname: getSavedWriterNickname(),
      });
    },
    onSuccess: () => {
      if (user) {
        savePersonalSubmittedUserId(user.id);
      }
      setMessage("");
      setSubmitMessage("메시지가 전달되었습니다");
      queryClient.invalidateQueries({
        queryKey: romancePersonalUserQueryKey(generateString),
      });
    },
    onError: () => {
      setSubmitMessage("메시지 전송에 실패했습니다");
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

    if (!trimmedMessage) {
      setSubmitMessage("메시지를 입력해주세요");
      return;
    }

    messageMutation.mutate();
  };

  return (
    <main className="bg-romance-gradient mdl:bg-[#c7d8fb] text-romance-ink fixed inset-0 flex h-[100dvh] w-full">
      <section className="mdl:max-w-[1080px] mdl:px-8 mdl:pb-8 mdl:pt-8 mx-auto flex h-full w-full max-w-[480px] flex-col px-4 pb-4 pt-5">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <Link
            href="/personal-page"
            className="btn-press-in bg-romance-surface/85 text-romance-accent shadow-soft-card mdl:h-12 mdl:w-12 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 backdrop-blur"
            aria-label="퍼스널 페이퍼 목록으로 이동"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="text-romance-highlight mdl:text-sm text-xs font-bold">
              Funnection 연애특집
            </p>
            <h1 className="text-romance-accent text-shadow-01 mdl:text-[44px] mt-1 text-2xl font-extrabold leading-none">
              퍼스널 페이퍼
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
          <div className="bg-romance-surface/55 shadow-soft-card mdl:flex-1 mdl:justify-center mdl:rounded-[32px] mdl:p-10 flex min-h-0 flex-col rounded-[28px] border border-white/70 p-4 backdrop-blur">
            {userQuery.isLoading && (
              <div
                className="shadow-soft-card mx-auto h-[320px] w-full max-w-[520px] rounded-[28px] border border-white/70 bg-white/45"
                aria-hidden="true"
              />
            )}

            {userQuery.isError && (
              <button
                type="button"
                onClick={() => userQuery.refetch()}
                className="btn-press-in text-romance-accent mx-auto rounded-xl border border-white/80 bg-white/85 px-4 py-3 text-sm font-extrabold"
              >
                유저 다시 불러오기
              </button>
            )}

            {!userQuery.isLoading && !userQuery.isError && user && (
              <form
                onSubmit={handleSubmit}
                className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-5"
              >
                <PersonalUserProfile user={user} />

                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={MAX_MESSAGE_LENGTH}
                  placeholder={`${user.nickname}님께 전하고 싶은 말을 적어주세요`}
                  disabled={messageMutation.isPending}
                  className={`${DEFAULT_FONT} shadow-soft-card text-romance-ink placeholder:text-romance-muted/55 focus:border-romance-accent focus:ring-romance-accent/20 min-h-[220px] w-full resize-none rounded-[24px] border border-white/85 bg-white/90 px-5 py-5 text-base font-medium leading-relaxed outline-none transition placeholder:text-base focus:bg-white focus:ring-4 disabled:opacity-70 mdl:text-xl mdl:placeholder:text-xl`}
                  aria-label={`${user.nickname}에게 보낼 메시지 입력`}
                />

                <div className="flex w-full items-center justify-between gap-3">
                  <p className="text-romance-muted text-xs font-semibold">
                    {message.length}/{MAX_MESSAGE_LENGTH}
                  </p>
                  <button
                    type="submit"
                    disabled={messageMutation.isPending}
                    className="btn-press-in flex h-12 min-w-[150px] items-center justify-center rounded-xl bg-slate-600 px-7 text-base font-extrabold text-white shadow-[0_10px_22px_rgba(61,76,101,0.24)] transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {messageMutation.isPending ? "전송 중" : "메시지 보내기"}
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      </section>

      {submitMessage && (
        <SubmitModal contents={submitMessage} overlayClassName="backdrop-blur-sm" />
      )}
    </main>
  );
};

const PersonalUserProfile = ({ user }: { user: RomancePersonalUser }) => {
  const imageSrc = getPersonalImageSource(user);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={`${user.nickname} 이미지`}
        width={132}
        height={176}
        decoding="async"
        className="shadow-soft-card h-[176px] w-[132px] rounded-lg border-[3px] border-slate-700 bg-white object-contain"
      />
      <p className="text-romance-accent text-center text-2xl font-extrabold">
        {user.nickname}
      </p>
    </div>
  );
};

const getSavedWriterNickname = () => {
  const savedNickname =
    localStorage.getItem(ROMANCE_NICKNAME_STORAGE_KEY)?.trim() ?? "";

  return savedNickname || undefined;
};

const getPersonalImageSource = (user: RomancePersonalUser) => {
  const trimmedValue = user.generateString.trim();

  if (
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://") ||
    trimmedValue.startsWith("/") ||
    trimmedValue.startsWith("data:image/")
  ) {
    return trimmedValue;
  }

  return isMaleGender(user.gender)
    ? "/images/image-base-man.webp"
    : "/images/image-base-woman.webp";
};

const isMaleGender = (gender: string) => {
  const normalizedGender = String(gender).trim().toLowerCase();

  return (
    normalizedGender === "male" ||
    normalizedGender === "m" ||
    normalizedGender === "man" ||
    normalizedGender === "남" ||
    normalizedGender === "남자" ||
    normalizedGender === "남성"
  );
};
