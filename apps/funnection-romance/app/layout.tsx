import "../styles/globals.css";

import type { Metadata } from "next";

import ReactQueryProvider from "@/providers/react-query-provider";
import { dmDisplay, pretendard } from "@/public/fonts/fonts";

export const metadata: Metadata = {
  title: "퍼넥션 연애특집",
  description: "퍼넥션 연애특집",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.className} ${dmDisplay.variable}`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
