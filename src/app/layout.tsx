import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/contexts/auth-context";

const SITE_URL = "https://kaiat.co.kr";
const SITE_NAME = "KAIAT · Korea AI Ability Test";
const TITLE = "KAIAT 자격증 (Korea AI Ability Test) - 온라인 AI 활용 자격증 시험 플랫폼";
const DESCRIPTION =
  "KAIAT(Korea AI Ability Test)는 AI 활용 능력을 검증하는 공신력 있는 자격증입니다. 온라인 강의, 시험, 인증서 발급까지 한 곳에서 — 3급·2급·1급·특급.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | KAIAT (Korea AI Ability Test)",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "KAIAT",
    "Korea AI Ability Test",
    "AI 자격증",
    "AI 활용 자격증",
    "AI 활용 능력 시험",
    "온라인 시험",
    "자격증 발급",
    "Crowny",
    "kaiat.co.kr",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/aiat_w.png", alt: "KAIAT - Korea AI Ability Test" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/aiat_w.png"],
  },
  // 구글 서치콘솔 소유 확인 시: 발급받은 코드를 넣으면 됩니다.
  // verification: { google: "구글-서치콘솔-인증코드" },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: ["KAIAT", "Korea AI Ability Test", "Crowny AI 자격증"],
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      email: "rute20002@gmail.com",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DESCRIPTION,
      inLanguage: "ko-KR",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/exams?grade={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
