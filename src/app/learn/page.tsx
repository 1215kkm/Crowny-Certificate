"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ListChecks,
  GraduationCap,
  Code2,
  Play,
  PanelRightClose,
  PanelLeftOpen,
  RotateCcw,
  X,
  GripVertical,
} from "lucide-react";
import { TRACKS } from "@/data/learn";
import { getTheme, themeToCssVars } from "@/data/learn/themes";
import { LearnProvider, useLearn, useProgress } from "@/components/learn/learn-store";
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
  const {
    trackId,
    setTrack,
    themeId,
    layoutMode,
    resetCourse,
    stage,
    course,
    scaffoldLines,
  } = useLearn();
  const isWide = useIsWide();
  const { percent } = useProgress();
  const [tab, setTab] = useState<MobileTab>("stages");
  /** 연습화면2에서 미리보기 칸을 펼칠지 — 처음엔 숨김(선생님·학생 넓게) */
  const [previewOpen, setPreviewOpen] = useState(false);
  /** 떠다니는(드래그·크기조절) 미리보기 창을 띄울지 */
  const [floatOpen, setFloatOpen] = useState(false);

  /* npm run dev(serve) 를 친 순간 떠다니는 미리보기를 저절로 띄운다 (한 번만) */
  const serverStarted = useMemo(() => {
    for (const s of course?.buildSteps ?? []) {
      const idx = s.scaffold?.lines.findIndex((l) => l.effect === "serve") ?? -1;
      if (idx >= 0 && (scaffoldLines[s.id] ?? 0) > idx) return true;
    }
    return false;
  }, [course, scaffoldLines]);
  const autoOpenedRef = useRef(false);
  useEffect(() => {
    if (serverStarted && !autoOpenedRef.current) {
      autoOpenedRef.current = true;
      setFloatOpen(true);
    }
  }, [serverStarted]);

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
            <ThemeSelect />
            {/* 학습 목차 진행률 */}
            <span className="hidden sm:flex items-center gap-1.5">
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
          </div>
        </div>
      </header>

      {/* ── 하단: 데스크톱은 화면1(4분할)/화면2(가로3칸), 모바일은 탭 ── */}
      {isWide === null ? (
        <div className="flex-1 grid place-items-center text-[13px] text-muted-foreground">
          화면 준비 중…
        </div>
      ) : isWide && wide2 ? (
        /* 연습화면2 — 로고 밑 가로 목차(+미리보기 토글) + [선생님][학생][미리보기(옵션)] */
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="shrink-0 flex items-center bg-[#1b1725] border-b border-black/40">
            <div className="flex-1 min-w-0">
              <StagesStrip />
            </div>
            {/* 처음부터 다시 */}
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "처음부터 다시 시작할까요? 지금까지 친 코드는 사라져요."
                  )
                )
                  resetCourse();
              }}
              className="shrink-0 ml-1 flex items-center gap-1 rounded-md border border-white/20 bg-white/10 text-white/80 px-2.5 py-1.5 text-[12px] font-semibold hover:bg-white/20 transition"
              title="처음부터 다시 시작"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden />
              처음부터 다시
            </button>
            {/* 떠다니는 미리보기 창 열기 (삼각형) */}
            <button
              onClick={() => setFloatOpen((v) => !v)}
              className={`shrink-0 ml-2 grid place-items-center rounded-md border w-8 h-8 transition ${
                floatOpen
                  ? "bg-accent text-white border-accent"
                  : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
              }`}
              title="크기조절·이동 가능한 미리보기 창 띄우기"
            >
              <Play className="w-4 h-4" aria-hidden />
            </button>
            {/* 미리보기 토글 — 따라하기 단계에선 눈에 띄게 + 튕김 */}
            <button
              onClick={() => setPreviewOpen((v) => !v)}
              className={`shrink-0 mx-2 flex items-center gap-1 rounded-md border px-3 py-1.5 text-[12px] font-bold transition ${
                previewOpen
                  ? "bg-primary text-white border-primary"
                  : stage === "build"
                    ? "bg-[#ffb020] text-black border-[#ffb020] learn-bounce5"
                    : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
              }`}
              title={
                previewOpen
                  ? "미리보기 접기 (선생님·학생 넓게)"
                  : "미리보기 펼치기"
              }
            >
              {previewOpen ? (
                <PanelRightClose className="w-4 h-4" aria-hidden />
              ) : (
                <PanelLeftOpen className="w-4 h-4" aria-hidden />
              )}
              미리보기
            </button>
          </div>
          <div className="relative flex-1 min-h-0 flex gap-px bg-border">
            <section className="flex-1 basis-0 min-w-[360px] min-h-0">
              <PaneTeacher wide />
            </section>
            <section className="flex-1 basis-0 min-w-[360px] min-h-0">
              <PaneStudent wide />
            </section>
            {previewOpen && (
              <section className="w-[24%] min-w-[240px] min-h-0">
                <PanePreview />
              </section>
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

      {/* 떠다니는 미리보기 창 — 드래그로 옮기고 모서리로 크기 조절 */}
      {floatOpen && <FloatingPreview onClose={() => setFloatOpen(false)} />}
    </div>
  );
}

/** 떠다니는 미리보기 창 — 처음 9:16(폰 비율), 끌어서 이동 · 모서리로 크기조절.
 *  줄이면 창만 잘리지 않고 안의 화면이 통째로 같이 축소된다(scale). */
const FP_BASE_W = 300; // 9:16 기준 내부 폭
const FP_BASE_H = 533; // 300 * 16/9

function FloatingPreview({ onClose }: { onClose: () => void }) {
  const [pos, setPos] = useState({ x: 180, y: 90 });
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [bodySize, setBodySize] = useState({ w: FP_BASE_W, h: FP_BASE_H });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragRef.current) return;
      setPos({
        x: Math.max(0, e.clientX - dragRef.current.dx),
        y: Math.max(0, e.clientY - dragRef.current.dy),
      });
    };
    const up = () => {
      dragRef.current = null;
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  /* 창(본문) 크기가 바뀌면 그 크기에 맞춰 내부 화면을 통째로 축소/확대 */
  useEffect(() => {
    const el = bodyRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      setBodySize({ w, h });
      setScale(Math.min(w / FP_BASE_W, h / FP_BASE_H) || 1);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      className="fixed z-50 w-[300px] h-[565px] min-w-[160px] min-h-[300px] resize overflow-hidden rounded-xl border-2 border-primary shadow-2xl bg-white flex flex-col"
      style={{ top: pos.y, left: pos.x }}
    >
      <div
        className="shrink-0 h-8 flex items-center gap-1.5 px-2 bg-primary text-white cursor-move select-none"
        onMouseDown={(e) =>
          (dragRef.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y })
        }
      >
        <GripVertical className="w-4 h-4 shrink-0" aria-hidden />
        <span className="text-[12px] font-bold truncate">
          미리보기 — 끌어서 이동 · 모서리로 크기조절
        </span>
        <button
          onClick={onClose}
          className="ml-auto shrink-0 p-0.5 rounded hover:bg-white/20"
          aria-label="닫기"
        >
          <X className="w-4 h-4" aria-hidden />
        </button>
      </div>
      <div ref={bodyRef} className="relative flex-1 min-h-0 overflow-hidden bg-white">
        <div
          style={{
            position: "absolute",
            width: FP_BASE_W,
            height: FP_BASE_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            left: Math.max(0, (bodySize.w - FP_BASE_W * scale) / 2),
            top: Math.max(0, (bodySize.h - FP_BASE_H * scale) / 2),
          }}
        >
          <PanePreview fill />
        </div>
      </div>
    </div>
  );
}
