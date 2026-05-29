import type { ReactNode } from "react";

interface SubmitModalProps {
  contents?: ReactNode;
  children?: ReactNode;
  className?: string;
  overlayClassName?: string;
}

const mergeClassNames = (...classNames: Array<string | undefined>) =>
  classNames.filter(Boolean).join(" ");

export const SubmitModal = ({
  contents,
  children,
  className,
  overlayClassName,
}: SubmitModalProps) => {
  return (
    <div
      className={mergeClassNames(
        "absolute inset-0 z-50 flex items-center justify-center bg-black/30",
        overlayClassName
      )}
    >
      <div
        role="status"
        className={mergeClassNames(
          "fade-in-up rounded-xl bg-slate-800 px-4 py-2 font-jua text-sm text-white shadow-lg",
          className
        )}
      >
        {children ?? contents}
      </div>
    </div>
  );
};
