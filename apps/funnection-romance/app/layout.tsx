import "../styles/globals.css";

import type { Metadata } from "next";

import ReactQueryProvider from "@/providers/react-query-provider";
import { dmDisplay, pretendard } from "@/public/fonts/fonts";

export const metadata: Metadata = {
  title: "Funnection Romance",
  description: "Funnection Romance",
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
