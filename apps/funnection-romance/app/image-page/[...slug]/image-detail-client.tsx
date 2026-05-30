"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  getRomanceImageGameDetail,
  getRomanceImageGameElioVisibility,
  getRomanceImageGameVoteTotal,
  romanceImageGameDetailQueryKey,
  romanceImageGameElioVisibilityQueryKey,
  type RomanceImageGameUser,
  romanceVotesQueryKey,
  romanceVotesTotalQueryKey,
  updateRomanceImageGameElioVisibility,
  voteRomanceImageGameUser,
} from "@/api";
import { SubmitModal } from "@/components";

interface ImageDetailClientProps {
  id: number;
}

const ELIO_USER_ID = 9;

export const ImageDetailClient = ({ id }: ImageDetailClientProps) => {
  const queryClient = useQueryClient();
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [isVoteTotalVisible, setIsVoteTotalVisible] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const detailQuery = useQuery({
    queryKey: romanceImageGameDetailQueryKey(id),
    queryFn: () => getRomanceImageGameDetail(id),
  });

  const voteTotalQuery = useQuery({
    queryKey: romanceVotesTotalQueryKey(id),
    queryFn: () => getRomanceImageGameVoteTotal(id),
    enabled: false,
  });

  const elioVisibilityQuery = useQuery({
    queryKey: romanceImageGameElioVisibilityQueryKey,
    queryFn: getRomanceImageGameElioVisibility,
  });

  const voteMutation = useMutation({
    mutationFn: (userId: number) => voteRomanceImageGameUser(userId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: romanceImageGameDetailQueryKey(id),
      });
      queryClient.invalidateQueries({
        queryKey: romanceVotesQueryKey(id),
      });
      queryClient.invalidateQueries({
        queryKey: romanceVotesTotalQueryKey(id),
      });
      voteTotalQuery.refetch();
      setHasVoted(true);
      setSubmitMessage("투표가 제출되었습니다");
    },
  });

  const elioVisibilityMutation = useMutation({
    mutationFn: updateRomanceImageGameElioVisibility,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: romanceImageGameElioVisibilityQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: romanceImageGameDetailQueryKey(id),
      });
    },
  });

  const detail = detailQuery.data;
  const question = detail?.question;
  const users = detail?.users ?? [];
  const showElio =
    elioVisibilityQuery.data?.showElio ?? detail?.showElio ?? false;
  const voteTotal = voteTotalQuery.data ?? 0;

  const visibleUsers = useMemo(
    () => sortImageGameUsers(users, showElio),
    [showElio, users]
  );
  const rankingUsers = useMemo(() => users, [users]);
  const topVotes = isResultVisible
    ? Math.max(0, ...rankingUsers.map((user) => user.votes))
    : 0;

  const handleVote = (userId: number) => {
    if (hasVoted) return;
    if (voteMutation.isPending) return;
    if (window.matchMedia("(min-width: 834px)").matches) return;

    voteMutation.mutate(userId);
  };

  const handleToggleElio = () => {
    if (elioVisibilityMutation.isPending) return;

    elioVisibilityMutation.mutate(!showElio);
  };

  const handleShowVoteTotal = async () => {
    await voteTotalQuery.refetch();
    setIsVoteTotalVisible(true);
  };

  const handleShowResult = async () => {
    await Promise.all([detailQuery.refetch(), voteTotalQuery.refetch()]);
    setIsResultVisible(true);
  };

  useEffect(() => {
    if (!submitMessage) return;

    const timeoutId = window.setTimeout(() => {
      setSubmitMessage(null);
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [submitMessage]);

  const closeSubmitModal = () => {
    setSubmitMessage(null);
  };

  const renderUserCard = (user: RomanceImageGameUser) => (
    <ImageGameUserCard
      key={user.id}
      user={user}
      disabled={voteMutation.isPending || hasVoted}
      winnerVotes={
        user.votes > 0 && user.votes === topVotes ? user.votes : undefined
      }
      onVote={() => handleVote(user.id)}
    />
  );

  const firstRowUsers = visibleUsers.slice(0, 4);
  const secondRowUsers = visibleUsers.slice(4);

  return (
    <main className="bg-romance-gradient mdl:bg-[#c7d8fb] text-romance-ink fixed inset-0 flex h-[100dvh] w-full">
      <section className="mdl:max-w-[1080px] mdl:px-8 mdl:pb-8 mdl:pt-8 mx-auto flex h-full w-full max-w-[480px] flex-col px-4 pb-4 pt-5">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <Link
            href="/image-page"
            className="btn-press-in bg-romance-surface/85 text-romance-accent shadow-soft-card mdl:h-12 mdl:w-12 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 backdrop-blur"
            aria-label="이미지 게임 목록으로 이동"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="text-romance-highlight mdl:hidden text-xs font-bold">
              이미지 게임 {id}번 질문
            </p>
            <h1 className="text-romance-accent text-shadow-01 mdl:hidden mt-1 text-2xl font-extrabold leading-none">
              이미지 게임
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
          <div className="bg-romance-surface/55 shadow-soft-card mdl:flex-1 mdl:justify-center mdl:rounded-[32px] mdl:border-transparent mdl:bg-transparent mdl:p-10 mdl:shadow-none flex min-h-0 flex-col rounded-[28px] border border-white/70 p-4 backdrop-blur">
            <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[860px] flex-col items-center justify-center gap-6">
              {detailQuery.isLoading && <ImageDetailSkeleton />}

              {detailQuery.isError && (
                <button
                  type="button"
                  onClick={() => detailQuery.refetch()}
                  className="btn-press-in text-romance-accent rounded-xl border border-white/80 bg-white/85 px-4 py-3 text-sm font-extrabold"
                >
                  이미지 게임 질문 다시 불러오기
                </button>
              )}

              {!detailQuery.isLoading && !detailQuery.isError && question && (
                <>
                  <div className="flex w-full shrink-0 flex-col items-center gap-3">
                    <p className="font-jua leading-tightPlus mdl:block hidden text-center text-[36px] font-medium text-slate-700">
                      {id}. {question.question}
                    </p>
                    <p className="text-shadow-01 mdl:hidden text-center text-2xl font-extrabold text-slate-800">
                      {id}번 질문
                    </p>

                    <div className="mdl:flex my-4 hidden w-full flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleShowVoteTotal}
                        disabled={voteTotalQuery.isFetching}
                        className="btn-press-in rounded-full bg-white/80 px-3 py-1 text-base font-semibold text-slate-700 disabled:opacity-60"
                      >
                        {isVoteTotalVisible ? `${voteTotal}표` : "총 투표 수"}
                      </button>
                      <button
                        type="button"
                        onClick={handleToggleElio}
                        disabled={elioVisibilityMutation.isPending}
                        className="btn-press-in rounded-full bg-slate-600 px-3 py-1 text-base font-semibold text-white disabled:opacity-50"
                      >
                        {showElio ? "Elio 숨기기" : "Elio 보이기"}
                      </button>
                    </div>
                  </div>

                  {visibleUsers.length === 0 ? (
                    <p className="text-romance-muted text-center text-sm font-semibold">
                      표시할 참여자가 없습니다
                    </p>
                  ) : (
                    <>
                      <div className="no-scrollbar mdl:hidden grid min-h-0 w-full grid-cols-3 gap-x-2 gap-y-3 overflow-y-auto p-1">
                        {visibleUsers.map(renderUserCard)}
                      </div>

                      <div className="mdl:flex hidden w-full flex-col items-center gap-y-2">
                        <div className="flex items-start justify-center gap-x-5">
                          {firstRowUsers.map(renderUserCard)}
                        </div>
                        <div
                          className={`flex items-start justify-center ${
                            showElio ? "gap-x-3" : "gap-x-5"
                          }`}
                        >
                          {secondRowUsers.map(renderUserCard)}
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={handleShowResult}
                    disabled={detailQuery.isFetching}
                    className="btn-press-in mdl:flex hidden h-[52px] min-w-[150px] items-center justify-center rounded-xl bg-slate-600 px-7 text-base font-extrabold text-white shadow-[0_10px_22px_rgba(61,76,101,0.24)] transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    결과 확인
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {submitMessage && (
        <SubmitModal
          contents={submitMessage}
          overlayClassName="mdl:hidden backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={closeSubmitModal}
            className="font-jua text-sm text-white"
          >
            {submitMessage}
          </button>
        </SubmitModal>
      )}
    </main>
  );
};

const ImageGameUserCard = ({
  user,
  disabled,
  winnerVotes,
  onVote,
}: {
  user: RomanceImageGameUser;
  disabled: boolean;
  winnerVotes?: number;
  onVote?: () => void;
}) => {
  const imageSrc = getImageSource(user);

  const handleClick = () => {
    onVote?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled && !!onVote}
      className="btn-press-in text-romance-accent mdl:pointer-events-none mdl:cursor-default flex flex-col items-center gap-2 transition disabled:opacity-70"
      aria-label={`${user.nickname}에게 투표하기`}
    >
      <span className="mdl:px-3 mdl:pt-3 relative px-1 pt-1">
        {winnerVotes !== undefined && (
          <span className="bg-romance-accent mdl:flex absolute right-0 top-0 z-10 hidden h-10 min-w-10 items-center justify-center rounded-full px-3 text-xl font-medium text-white shadow-[0_8px_18px_rgba(139,34,72,0.22)]">
            {winnerVotes}
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={`${user.nickname} 이미지`}
          width={132}
          height={176}
          decoding="async"
          className="shadow-soft-card mdl:h-[176px] mdl:w-[132px] mdl:border-[3px] h-[104px] w-[78px] rounded-lg border-2 border-slate-700 bg-white object-contain transition"
        />
      </span>
      <span
        className={`mdl:max-w-[132px] mdl:text-xl max-w-[78px] truncate text-center text-sm font-extrabold transition ${
          disabled ? "text-slate-400 opacity-70" : ""
        }`}
      >
        {user.nickname}
      </span>
    </button>
  );
};

const ImageDetailSkeleton = () => {
  return (
    <>
      <div
        className="h-12 w-full max-w-[620px] rounded-2xl bg-white/45"
        aria-hidden="true"
      />
      <div className="mdl:grid-cols-4 grid w-full grid-cols-2 gap-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="shadow-soft-card h-[168px] rounded-2xl border border-white/70 bg-white/45"
            aria-hidden="true"
          />
        ))}
      </div>
    </>
  );
};

const getImageSource = (user: RomanceImageGameUser) => {
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

const sortImageGameUsers = (
  users: RomanceImageGameUser[],
  showElio: boolean
) => {
  const sortedUsers = [...users].sort((left, right) => {
    if (left.id === ELIO_USER_ID) return 1;
    if (right.id === ELIO_USER_ID) return -1;

    return 0;
  });

  return sortedUsers.filter((user) => showElio || user.id !== ELIO_USER_ID);
};
