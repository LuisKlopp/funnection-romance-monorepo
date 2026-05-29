import "../styles/globals.css";

import type { Metadata } from "next";

import ReactQueryProvider from "@/providers/react-query-provider";

export const metadata: Metadata = {
  title: "퍼넥션 연애특집 고민함",
  description: "퍼넥션 연애특집 익명 고민 제출",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-pretendard">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
