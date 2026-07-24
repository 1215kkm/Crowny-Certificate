"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { signOut } from "@/lib/firebase-auth";

const NAV_ITEMS = [
  { label: "강의", href: "/courses" },
  { label: "시험 신청", href: "/exams" },
  { label: "인증서 발급", href: "/certificates" },
  { label: "합격작", href: "/showcase" },
  { label: "마이페이지", href: "/mypage" },
];

/** 별개 메뉴 — 로그인 없이 쓰는 학습 도구. 새 창으로 띄운다. */
const LEARN_HREF = "/learn";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="KAIAT 홈">
          <Image
            src="/logo.png"
            alt="KAIAT (Korea AI Ability Test) 자격증"
            width={987}
            height={398}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              {item.label}
            </Link>
          ))}

          <a
            href={LEARN_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-gradient-brand text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:opacity-90 transition"
          >
            따라하며 코딩 배우기
            <ExternalLink className="w-3.5 h-3.5" aria-hidden />
            <span className="sr-only">새 창에서 열림</span>
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-20 h-8 bg-muted rounded animate-pulse" />
          ) : user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {user.displayName || user.email}
              </span>
              <Link
                href="/profile"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
              >
                내정보
              </Link>
              {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  관리자
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
              >
                로그인
              </Link>
              <Link
                href="/auth/register"
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition"
              >
                회원가입
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="메뉴 열기"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <nav className="px-4 py-4 space-y-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <a
              href={LEARN_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-gradient-brand text-white px-4 py-2.5 rounded-md text-sm font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              따라하며 코딩 배우기
              <ExternalLink className="w-3.5 h-3.5" aria-hidden />
            </a>

            <hr className="border-border" />
            {user ? (
              <>
                <div className="text-sm text-muted-foreground">
                  {user.displayName || user.email}
                </div>
                <Link
                  href="/profile"
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  내정보
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block text-sm font-medium text-red-500"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  href="/auth/register"
                  className="block bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
