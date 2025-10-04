// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/organisms/header";
import { AuthProvider } from "@/lib/contexts/settings-context";
import { QuotesMarquee } from "@/components/molecules/quotes-marquee";
import { ConsoleBanner } from "@/components/molecules/console-banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://commitrade.io"),
  title: {
    default: "Commitrade - 원칙을 지키는 트레이딩",
    template: "%s | Commitrade",
  },
  description:
    "체계적인 매매 원칙과 체크리스트로 감정적 거래를 방지하고, 데이터 기반 트레이딩을 실현하세요. 리스크 관리, 손익 추적, 통계 분석을 한 곳에서.",
  keywords: [
    "트레이딩",
    "매매일지",
    "암호화폐",
    "주식",
    "투자",
    "리스크관리",
    "손익관리",
    "트레이딩 저널",
    "매매 기록",
    "투자 일지",
  ],
  authors: [{ name: "Yongki Hong" }],
  creator: "Yongki Hong",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://commitrade.io",
    siteName: "Commitrade",
    title: "Commitrade - 원칙을 지키는 트레이딩",
    description:
      "체계적인 매매 원칙과 체크리스트로 감정적 거래를 방지하고, 데이터 기반 트레이딩을 실현하세요.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Commitrade",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
    title: "Commitrade - 원칙을 지키는 트레이딩",
    description:
      "체계적인 매매 원칙과 체크리스트로 감정적 거래를 방지하고, 데이터 기반 트레이딩을 실현하세요.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ConsoleBanner />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            <QuotesMarquee />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
