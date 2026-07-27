"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ListChecks,
  GraduationCap,
  Code2,
  Play,
  PanelRightClose,
  PanelLeftOpen,
} from "lucide-react";
import { TRACKS } from "@/data/learn";
import { getTheme, themeToCssVars } from "@/data/learn/themes";
import { LearnProvider, useLearn } from "@/components/learn/learn-store";
import { ThemeSelect } from "@/components/learn/theme-select";
import { PaneStages, StagesStrip } from "@/components/learn/pane-stages";
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

/** 칸 사이 진행 흐름 화살표 (점선/실선) */
function FlowArrow({ left, dashed }: { left: string; dashed?: boolean }) {
  return (
    <div
      className="pointer-events-none absolute top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/95 shadow-md px-1.5 py-1 text-primary"
      style={{ left }}
      aria-hidden
    >
      <svg width="42" height="14" viewBox="0 0 42 14">
        <line
          x1="1"
          y1="7"
          x2="30"
          y2="7"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={dashed ? "3 4" : undefined}
        />
        <path d="M29 2 L41 7 L29 12 Z" fill="currentColor" />
      </svg>
    </div>
  );
}

function LearnShell() {
  const { trackId, setTrack, themeId, layoutMode, setLayoutMode } = useLearn();
  const isWide = useIsWide();
  const [tab, setTab] = useState<MobileTab>("stages");
  /** 연습화면2에서 미리보기 칸을 접을지 (새 창으로 보면 접어서 선생님·학생 반반) */
  const [previewOpen, setPreviewOpen] = useState(true);

  const theme = getTheme(themeId);
  const wide2 = layoutMode === "wide";

  return (
    // learn-root + 인라인 CSS 변수 = /learn 안에서만 테마가 갈린다.
    // Tailwind v4 유틸리티가 이 변수들을 참조하므로 className 수정 없이 색이 따라온다.
    <div
      // text-foreground 를 여기서 다시 잡는 이유:
      // body 의 text-foreground 는 전역 토큰으로 이미 계산돼 버려서, 명시적 색이 없는 글자는
      // 그 진회색을 상속한다 → 다크 테마에서 어두운 배경 위 어두운 글자가 된다.
      // 이 div 는 --color-foreground 를 덮어쓰므로 여기서 color 를 다시 걸면 하위가 테마색을 상속한다.
      className="learn-root h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground"
      data-dark={theme.dark ? "true" : "false"}
      style={themeToCssVars(theme) as React.CSSProperties}
    >
      {/* ── 상단: 로고 + (가운데) 언어 선택 — 한 줄로 붙여 아래 4칸을 더 키운다 ── */}
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

          {/* 로고 오른쪽 빈 가운데 자리에 「무엇을 배울까요?」 + 언어 탭 */}
          <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto">
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

          <div className="shrink-0 flex items-center gap-2">
            {/* 화면 보기 방식 — 연습화면1(4분할) / 연습화면2(가로 3칸) */}
            <div className="hidden lg:flex items-center rounded-lg border border-border overflow-hidden text-[12px] font-semibold">
              <button
                onClick={() => setLayoutMode("classic")}
                className={`px-2.5 py-1.5 transition ${
                  !wide2
                    ? "bg-primary text-white"
                    : "bg-white text-muted-foreground hover:bg-muted"
                }`}
              >
                연습화면1
              </button>
              <button
                onClick={() => setLayoutMode("wide")}
                className={`px-2.5 py-1.5 transition ${
                  wide2
                    ? "bg-primary text-white"
                    : "bg-white text-muted-foreground hover:bg-muted"
                }`}
              >
                연습화면2
              </button>
            </div>
            <ThemeSelect />
          </div>
        </div>
      </header>

      {/* ── 하단: 데스크톱은 화면1(4분할)/화면2(가로3칸), 모바일은 탭 ── */}
      {isWide === null ? (
        <div className="flex-1 grid place-items-center text-[13px] text-muted-foreground">
          화면 준비 중…
        </div>
      ) : isWide && wide2 ? (
        /* 연습화면2 — 로고 밑 가로 목차 + [선생님 3칸][학생 3칸][미리보기(접힘 가능)] */
        <div className="flex-1 min-h-0 flex flex-col">
          <StagesStrip />
          <div className="relative flex-1 min-h-0 flex gap-px bg-border">
            <section className="flex-1 basis-0 min-w-[360px] min-h-0">
              <PaneTeacher wide />
            </section>
            <section className="flex-1 basis-0 min-w-[360px] min-h-0">
              <PaneStudent wide />
            </section>
            {previewOpen ? (
              <section className="w-[22%] min-w-[240px] min-h-0 relative">
                <PanePreview />
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="absolute top-1.5 left-1.5 z-30 flex items-center gap-1 text-[11px] bg-white/90 border border-border rounded px-1.5 py-1 text-muted-foreground hover:text-foreground shadow-sm"
                  title="미리보기 칸을 접고 선생님·학생을 넓게"
                >
                  <PanelRightClose className="w-3.5 h-3.5" aria-hidden />
                  접기
                </button>
              </section>
            ) : (
              <button
                onClick={() => setPreviewOpen(true)}
                className="shrink-0 w-7 grid place-items-center bg-white hover:bg-muted text-muted-foreground border-l border-border"
                title="미리보기 칸 다시 열기"
              >
                <PanelLeftOpen className="w-4 h-4" aria-hidden />
              </button>
            )}
          </div>
        </div>
      ) : isWide ? (
        <div className="relative flex-1 min-h-0 flex gap-px bg-border">
          <section className="w-[17%] min-w-[210px] min-h-0">
            <PaneStages />
          </section>
          {/* 2·3칸은 flex-1 + basis-0 으로 남는 폭을 정확히 반씩 —
              선생(시연)과 학생(실습)이 같은 뼈대·같은 폭이어야 눈이 좌우를 바로 대조한다 */}
          <section className="flex-1 basis-0 min-w-[280px] min-h-0">
            <PaneTeacher />
          </section>
          <section className="flex-1 basis-0 min-w-[280px] min-h-0">
            <PaneStudent />
          </section>
          <section className="w-[21%] min-w-[250px] min-h-0">
            <PanePreview />
          </section>

          {/* 진행 흐름: 선생님 →(점선) 따라 만들기 →(실선) 미리보기 */}
          <FlowArrow left="48%" dashed />
          <FlowArrow left="79%" />
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
