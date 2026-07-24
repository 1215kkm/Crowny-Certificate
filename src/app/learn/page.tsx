"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ListChecks, GraduationCap, Code2, Play, Home } from "lucide-react";
import { TRACKS } from "@/data/learn";
import { LearnProvider, useLearn, useProgress } from "@/components/learn/learn-store";
import { PaneStages } from "@/components/learn/pane-stages";
import { PaneTeacher } from "@/components/learn/pane-teacher";
import { PaneStudent } from "@/components/learn/pane-student";
import { PanePreview } from "@/components/learn/pane-preview";

type MobileTab = "stages" | "teacher" | "student" | "preview";

const MOBILE_TABS: { id: MobileTab; label: string; icon: typeof ListChecks }[] = [
  { id: "stages", label: "목차", icon: ListChecks },
  { id: "teacher", label: "설명", icon: GraduationCap },
  { id: "student", label: "내 코드", icon: Code2 },
  { id: "preview", label: "미리보기", icon: Play },
];

/** 데스크톱(4분할)인지 판단 — 1024px 부터 4칸을 편다 */
function useIsWide() {
  const [wide, setWide] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setWide(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return wide;
}

export default function LearnPage() {
  return (
    <LearnProvider>
      <LearnShell />
    </LearnProvider>
  );
}

function LearnShell() {
  const { trackId, setTrack, course } = useLearn();
  const { percent } = useProgress();
  const wide = useIsWide();
  const [tab, setTab] = useState<MobileTab>("stages");

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-muted/50">
      {/* ── 상단: 언어 선택 ─────────────────────────── */}
      <header className="shrink-0 bg-white border-b border-border">
        <div className="flex items-center gap-3 px-3 h-12">
          <Link href="/" className="flex items-center shrink-0" aria-label="KAIAT 홈">
            <Image
              src="/logo.png"
              alt="KAIAT"
              width={987}
              height={398}
              className="h-6 w-auto"
              priority
            />
          </Link>

          <span className="hidden sm:inline text-[14px] font-bold text-foreground shrink-0">
            따라하며 코딩 배우기
          </span>

          <span className="hidden md:inline text-[12px] text-muted-foreground shrink-0">
            로그인 없이 바로 시작
          </span>

          <div className="ml-auto flex items-center gap-2 shrink-0">
            {course && (
              <span className="hidden sm:flex items-center gap-2">
                <span className="w-24 h-1.5 rounded-full bg-primary-100 overflow-hidden">
                  <span
                    className="block h-full bg-gradient-brand transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </span>
                <span className="text-[12px] font-semibold text-primary tabular-nums">
                  {percent}%
                </span>
              </span>
            )}
            <Link
              href="/"
              className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground px-2 py-1.5 rounded transition"
            >
              <Home className="w-3.5 h-3.5" aria-hidden />
              <span className="hidden sm:inline">KAIAT 홈</span>
            </Link>
          </div>
        </div>

        {/* 언어 탭 */}
        <div className="flex items-center gap-1.5 px-3 pb-2 overflow-x-auto">
          <span className="text-[12px] font-bold text-muted-foreground shrink-0 pr-1">
            무엇을 배울까요?
          </span>
          {TRACKS.map((t) => {
            const on = t.id === trackId;
            return (
              <button
                key={t.id}
                onClick={() => setTrack(t.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[13px] font-semibold transition ${
                  on
                    ? "bg-primary text-white border-primary"
                    : t.ready
                      ? "bg-white border-border text-foreground hover:border-primary-300"
                      : "bg-white border-dashed border-border text-muted-foreground"
                }`}
              >
                {t.label}
                {!t.ready && (
                  <span className="text-[10px] opacity-70">준비 중</span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── 하단: 4분할 (모바일은 탭) ───────────────── */}
      {wide === null ? (
        <div className="flex-1 grid place-items-center text-[13px] text-muted-foreground">
          화면 준비 중…
        </div>
      ) : wide ? (
        <div className="flex-1 min-h-0 flex gap-px bg-border">
          <section className="w-[17%] min-w-[210px] min-h-0">
            <PaneStages />
          </section>
          <section className="flex-1 min-w-0 min-h-0">
            <PaneTeacher />
          </section>
          <section className="w-[26%] min-w-[280px] min-h-0">
            <PaneStudent />
          </section>
          <section className="w-[21%] min-w-[250px] min-h-0">
            <PanePreview />
          </section>
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-0">
            {tab === "stages" && <PaneStages onPick={() => setTab("teacher")} />}
            {tab === "teacher" && <PaneTeacher active />}
            {tab === "student" && <PaneStudent />}
            {tab === "preview" && <PanePreview />}
          </div>

          <nav className="shrink-0 grid grid-cols-4 bg-white border-t border-border pb-[env(safe-area-inset-bottom)]">
            {MOBILE_TABS.map(({ id, label, icon: Icon }) => {
              const on = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition ${
                    on ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" aria-hidden />
                  {label}
                </button>
              );
            })}
          </nav>
        </>
      )}
    </div>
  );
}
