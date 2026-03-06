import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/contexts/auth-context";

export const metadata: Metadata = {
  title: "Crowny AI 활용 자격증 - 온라인 AI 자격증 시험 플랫폼",
  description:
    "AI 활용 능력을 검증하는 공신력 있는 자격증. 온라인 강의, 시험, 인증서 발급까지 한 곳에서.",
  keywords: ["AI 자격증", "AI 활용", "온라인 시험", "자격증 발급", "Crowny"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
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
