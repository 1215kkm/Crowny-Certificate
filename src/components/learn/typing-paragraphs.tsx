"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Target,
  HelpCircle,
  ListChecks,
  MapPin,
  ArrowRightCircle,
  Lightbulb,
  ChevronRight,
  FastForward,
} from "lucide-react";
import type { Paragraph } from "@/data/learn";

const KIND_META: Record<
  NonNullable<Paragraph["kind"]>,
  { icon: typeof Target; label: string; color: string }
> = {
  goal: { icon: Target, label: "목표", color: "text-primary" },
  why: { icon: HelpCircle, label: "왜", color: "text-secondary" },
  what: { icon: ListChecks, label: "할 일", color: "text-primary-700" },
  where: { icon: MapPin, label: "어디에", color: "text-accent-dark" },
  next: { icon: ArrowRightCircle, label: "다음", color: "text-info" },
  tip: { icon: Lightbulb, label: "꿀팁", color: "text-accent-dark" },
};

const TYPE_SPEED_MS = 18;

/**
 * 설명 단락을 「은은하게 깔아 두고 → 한 단락씩 타이핑」으로 여는 컴포넌트.
 *
 * - 아직 안 연 단락은 아주 연하게(opacity 8~14%) 미리 보인다. 분량이 가늠돼서 덜 지루하다.
 * - 키보드 아무 키나 누르거나 NEXT 를 누르면 다음 단락이 타이핑된다.
 * - 타이핑 중에 한 번 더 누르면 그 단락은 즉시 전부 보인다.
 */
export function TypingParagraphs({
  paragraphs,
  /** 이 영역이 키보드 입력을 받아도 되는 상태인가 (모바일 탭 전환용) */
  active = true,
  /** 단락 키가 바뀌면 처음부터 다시 */
  resetKey,
  onAllRevealed,
}: {
  paragraphs: Paragraph[];
  active?: boolean;
  resetKey?: string;
  onAllRevealed?: () => void;
}) {
  const [revealed, setRevealed] = useState(0); // 완전히 열린 단락 수
  const [typing, setTyping] = useState<{ index: number; chars: number } | null>(
    null
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* 단락 세트가 바뀌면 초기화 */
  useEffect(() => {
    setRevealed(0);
    setTyping(null);
    if (timerRef.current) clearInterval(timerRef.current);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [resetKey]);

  const finishTyping = useCallback((index: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setTyping(null);
    setRevealed(index + 1);
  }, []);

  const advance = useCallback(() => {
    // 타이핑 중이면 즉시 완성
    if (typing) {
      finishTyping(typing.index);
      return;
    }
    if (revealed >= paragraphs.length) return;

    const index = revealed;
    const full = paragraphs[index].text;
    setTyping({ index, chars: 0 });

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTyping((prev) => {
        if (!prev || prev.index !== index) return prev;
        const nextChars = prev.chars + 1;
        if (nextChars >= full.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setRevealed(index + 1);
          return null;
        }
        return { index, chars: nextChars };
      });
    }, TYPE_SPEED_MS);
  }, [typing, revealed, paragraphs, finishTyping]);

  /* 언마운트 정리 */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /* 다 열리면 알림 */
  useEffect(() => {
    if (revealed >= paragraphs.length && paragraphs.length > 0) {
      onAllRevealed?.();
    }
  }, [revealed, paragraphs.length, onAllRevealed]);

  /* 열릴 때마다 아래로 따라 내려감.
     아직 아무것도 안 열었을 때는 맨 위에 있어야 첫 단락부터 보인다. */
  useEffect(() => {
    if (revealed === 0 && !typing) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [revealed, typing]);

  /* 키보드 아무 키나 → 다음 단락 */
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      // 입력 중일 때는 방해하지 않는다
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          target.isContentEditable ||
          target.closest(".cm-editor")
        ) {
          return;
        }
      }
      // 조합키·탭은 화면 조작용이므로 통과
      if (e.metaKey || e.ctrlKey || e.altKey || e.key === "Tab") return;
      e.preventDefault();
      advance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, advance]);

  const allDone = revealed >= paragraphs.length && !typing;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3"
        onClick={advance}
        role="presentation"
      >
        {paragraphs.map((p, i) => {
          const meta = p.kind ? KIND_META[p.kind] : null;
          const Icon = meta?.icon;
          const isTyping = typing?.index === i;
          const isOpen = i < revealed;
          const shown = isTyping
            ? p.text.slice(0, typing.chars)
            : isOpen
              ? p.text
              : p.text;

          return (
            <div
              key={i}
              className={
                isOpen || isTyping
                  ? "transition-opacity duration-300"
                  : "transition-opacity duration-300 select-none"
              }
              style={{
                opacity: isOpen || isTyping ? 1 : i === revealed ? 0.16 : 0.08,
              }}
            >
              {meta && Icon && (
                <div
                  className={`flex items-center gap-1.5 mb-1 text-[13px] font-bold ${meta.color}`}
                >
                  <Icon className="w-4 h-4" aria-hidden />
                  {meta.label}
                </div>
              )}
              <p className="text-[15px] leading-[1.85] text-foreground whitespace-pre-wrap break-keep">
                {shown}
                {isTyping && (
                  <span className="inline-block w-[2px] h-[1.1em] align-[-0.15em] ml-0.5 bg-primary animate-pulse" />
                )}
              </p>
            </div>
          );
        })}
      </div>

      <div className="shrink-0 border-t border-border bg-muted/40 px-3 py-2 flex items-center gap-2">
        <button
          onClick={advance}
          disabled={allDone}
          className="flex items-center gap-1 bg-primary text-white px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-40 disabled:cursor-default hover:bg-primary-dark transition"
        >
          {allDone ? "설명 끝" : "NEXT"}
          {!allDone && <ChevronRight className="w-4 h-4" aria-hidden />}
        </button>

        <button
          onClick={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
            setTyping(null);
            setRevealed(paragraphs.length);
          }}
          disabled={allDone}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-default px-2 py-2"
        >
          <FastForward className="w-4 h-4" aria-hidden />
          한 번에 다 보기
        </button>

        <span className="ml-auto text-[13px] text-muted-foreground tabular-nums">
          {Math.min(revealed + (typing ? 1 : 0), paragraphs.length)} /{" "}
          {paragraphs.length}
        </span>
      </div>

      {!allDone && (
        <p className="shrink-0 px-3 pb-2 text-[12px] text-muted-foreground">
          아무 키나 누르거나 화면을 눌러도 다음 설명이 나와요.
        </p>
      )}
    </div>
  );
}
