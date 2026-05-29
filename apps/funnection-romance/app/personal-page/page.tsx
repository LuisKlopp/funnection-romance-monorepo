"use client";

import { useQuery } from "@tanstack/react-query";
import { Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getRomancePersonalUsers,
  ROMANCE_PERSONAL_QUERY_KEY,
  type RomancePersonalUser,
} from "@/api";
import { getPersonalSubmittedUserIds } from "@/lib";

export default function PersonalPage() {
  const [submittedUserIds, setSubmittedUserIds] = useState<number[]>([]);
  const usersQuery = useQuery({
    queryKey: ROMANCE_PERSONAL_QUERY_KEY,
    queryFn: getRomancePersonalUsers,
  });

  const users = usersQuery.data ?? [];

  useEffect(() => {
    setSubmittedUserIds(getPersonalSubmittedUserIds());
  }, []);

  return (
    <main className="bg-romance-gradient text-romance-ink fixed inset-0 flex h-[100dvh] w-full">
      <section className="mdl:max-w-[1080px] mdl:px-8 mdl:pb-8 mdl:pt-8 mx-auto flex h-full w-full max-w-[480px] flex-col px-4 pb-4 pt-5">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <Link
            href="/image-page"
            className="btn-press-in bg-romance-surface/85 text-romance-accent shadow-soft-card mdl:h-12 mdl:w-12 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 backdrop-blur"
            aria-label="이미지 게임으로 이동"
          >
            <Home className="h-5 w-5" />
          </Link>

          <div className="mdl:text-left min-w-0 flex-1 text-center">
            <p className="text-romance-highlight mdl:text-sm text-xs font-bold">
              Funnection 연애특집
            </p>
            <h1 className="text-romance-accent text-shadow-01 mdl:text-[44px] mt-1 text-2xl font-extrabold leading-none">
              퍼스널 페이퍼
            </h1>
          </div>

          <button
            type="button"
            onClick={() => usersQuery.refetch()}
            className="btn-press-in bg-romance-surface/85 text-romance-muted shadow-soft-card hover:text-romance-accent mdl:h-12 mdl:w-12 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 backdrop-blur"
            aria-label="유저 다시 불러오기"
          >
            <RefreshCcw className="h-5 w-5" />
          </button>
        </header>

        <div className="bg-romance-surface/55 shadow-soft-card mdl:mt-8 mdl:rounded-[32px] mdl:p-6 mt-4 flex min-h-0 flex-1 flex-col rounded-[28px] border border-white/70 p-3 backdrop-blur">
          <div className="no-scrollbar mdl:flex mdl:flex-wrap mdl:items-start mdl:justify-center mdl:gap-x-6 mdl:gap-y-5 grid min-h-0 flex-1 grid-cols-2 content-start gap-x-4 gap-y-5 overflow-y-auto p-2">
            {usersQuery.isLoading &&
              Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className="shadow-soft-card h-[136px] w-[102px] rounded-lg border border-white/70 bg-white/45 mdl:h-[176px] mdl:w-[132px]"
                    aria-hidden="true"
                  />
                  <div
                    className="h-5 w-20 rounded-full bg-white/45"
                    aria-hidden="true"
                  />
                </div>
              ))}

            {usersQuery.isError && (
              <button
                type="button"
                onClick={() => usersQuery.refetch()}
                className="btn-press-in text-romance-accent col-span-3 rounded-2xl border border-white/80 bg-white/85 px-4 py-5 text-sm font-extrabold"
              >
                유저 다시 불러오기
              </button>
            )}

            {!usersQuery.isLoading &&
              !usersQuery.isError &&
              users.length === 0 && (
                <p className="text-romance-muted col-span-3 py-8 text-center text-sm font-semibold">
                  표시할 유저가 없습니다
                </p>
              )}

            {users.map((user) => (
              <PersonalUserCard
                key={user.id}
                user={user}
                isSubmitted={submittedUserIds.includes(user.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const PersonalUserCard = ({
  user,
  isSubmitted,
}: {
  user: RomancePersonalUser;
  isSubmitted: boolean;
}) => {
  const imageSrc = getPersonalImageSource(user);

  return (
    <Link
      href={`/personal-page/${encodeURIComponent(user.generateString)}`}
      className="btn-press-in text-romance-accent flex flex-col items-center gap-2 transition"
    >
      <span className="relative">
        {isSubmitted && (
          <span className="absolute inset-0 z-10 flex items-end justify-center rounded-lg bg-slate-900/55 pb-2 text-xs font-extrabold text-white mdl:text-sm">
            답변완료
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={`${user.nickname} 이미지`}
          width={132}
          height={176}
          decoding="async"
          className="shadow-soft-card h-[136px] w-[102px] rounded-lg border-2 border-slate-700 bg-white object-contain mdl:h-[176px] mdl:w-[132px] mdl:border-[3px]"
        />
      </span>
      <span className="max-w-[102px] truncate text-center text-base font-extrabold mdl:max-w-[132px] mdl:text-xl">
        {user.nickname}
      </span>
    </Link>
  );
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
