"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Target,
  HelpCircle,
  ListChecks,
  MapPin,
  ArrowRightCircle,
  CheckCircle2,
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
  result: { icon: CheckCircle2, label: "결과", color: "text-success" },
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
  advanceSignal,
  onAllRevealed,
  /** 설명 문단들 맨 끝에 붙일 것 (예: 준비물 안내 카드) */
  trailing,
  /** 좁은 칸(연습화면2)용 — 버튼 작게 한 줄, 남은 수·안내문 숨김 */
  compact = false,
}: {
  paragraphs: Paragraph[];
  active?: boolean;
  resetKey?: string;
  /**
   * 바깥에서 NEXT 를 대신 눌러 주는 숫자.
   * 1 늘어날 때마다 단락 하나가 열린다. (오른쪽 칸에서 명령어를 한 줄 치면
   * 왼쪽 설명도 한 줄 따라 나오게 하려고 쓴다)
   * 값이 처음 들어올 때 · 단락 세트가 바뀔 때는 기준만 잡고 열지는 않는다.
   */
  advanceSignal?: number;
  onAllRevealed?: () => void;
  trailing?: React.ReactNode;
  compact?: boolean;
}) {
  const [revealed, setRevealed] = useState(0); // 완전히 열린 단락 수
  const [typing, setTyping] = useState<{ index: number; chars: number } | null>(
    null
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  /** 단락별 DOM — 방금 나온 단락으로 스크롤하려고 붙잡아 둔다 */
  const paraRefs = useRef<(HTMLDivElement | null)[]>([]);
  /** 바깥 신호의 직전 값 — undefined 면 "아직 기준을 못 잡음" */
  const signalRef = useRef<number | undefined>(undefined);
  /** 아직 열어 주지 못한 단락 수 (바깥 신호가 앞질러 왔을 때) */
  const [pending, setPending] = useState(0);

  /* 단락 세트가 바뀌면 초기화 */
  useEffect(() => {
    setRevealed(0);
    setTyping(null);
    setPending(0);
    signalRef.current = undefined;
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

  /**
   * 바깥에서 NEXT 를 눌러 주는 신호 — 오른쪽 칸에서 명령어 한 줄을 쳤을 때.
   *
   * 바로 advance() 를 부르지 않고 「빚」으로 쌓아 둔다. 앞 단락이 아직 타이핑 중일 때
   * advance() 를 부르면 그 단락을 마무리해 버려서 한 단락이 그냥 사라지기 때문.
   */
  useEffect(() => {
    if (advanceSignal === undefined) return;
    if (signalRef.current === undefined) {
      // 저장된 진도를 불러온 첫 값. 기준만 잡고 열지는 않는다.
      signalRef.current = advanceSignal;
      return;
    }
    const diff = advanceSignal - signalRef.current;
    signalRef.current = advanceSignal;
    if (diff > 0) setPending((p) => p + diff);
  }, [advanceSignal]);

  /* 쌓인 빚을 한 단락씩 갚는다 — 타이핑이 끝날 때마다 다음 단락이 열린다 */
  useEffect(() => {
    if (pending <= 0 || typing) return;
    if (revealed >= paragraphs.length) {
      setPending(0);
      return;
    }
    setPending((p) => p - 1);
    advance();
  }, [pending, typing, revealed, paragraphs.length, advance]);

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

  /* 방금 나온 단락을 화면에 맞춰 스크롤한다.
     컨테이너 맨 아래(scrollHeight)로 가면 아직 안 열린 연한 단락들 끝으로 튀어서
     방금 타이핑된 단락이 위로 밀려난다 → 그래서 "지금 활성 단락"만 보이게 한다.
     아직 아무것도 안 열었을 때는 맨 위 그대로. */
  useEffect(() => {
    if (revealed === 0 && !typing) return;
    // 지금 보여줄 단락 = 타이핑 중이면 그 단락, 아니면 방금 열린 마지막 단락
    const activeIndex = typing ? typing.index : revealed - 1;
    const el = paraRefs.current[activeIndex];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
        // 버튼·링크·셀렉트에 포커스가 있을 때는 그쪽이 키를 써야 한다.
        // (예: 테마 셀렉트에 Tab 으로 가서 Enter → 설명이 넘어가 버리면 안 됨)
        if (
          tag === "BUTTON" ||
          tag === "A" ||
          tag === "SELECT" ||
          target.closest('[data-keeps-keys="true"]')
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
              ref={(node) => {
                paraRefs.current[i] = node;
              }}
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
                  className={`learn-para-label flex items-center gap-1.5 mb-1 text-[13px] font-bold ${meta.color}`}
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

        {/* 설명 맨 끝에 붙는 것 — 준비물 안내 등 */}
        {trailing}
      </div>

      <div
        className={`shrink-0 border-t border-border flex items-center ${
          compact ? "px-2 py-1.5 gap-1.5" : "bg-muted/40 px-3 py-2 gap-2"
        }`}
      >
        <button
          onClick={advance}
          disabled={allDone}
          className={`flex items-center gap-1 bg-primary text-white rounded-md font-semibold disabled:opacity-40 disabled:cursor-default hover:bg-primary-dark transition whitespace-nowrap ${
            compact ? "px-2.5 py-1 text-[12px]" : "px-4 py-2 text-sm"
          }`}
        >
          {allDone ? "설명 끝" : "NEXT"}
          {!allDone && (
            <ChevronRight
              className={compact ? "w-3.5 h-3.5" : "w-4 h-4"}
              aria-hidden
            />
          )}
        </button>

        <button
          onClick={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
            setTyping(null);
            setPending(0);
            setRevealed(paragraphs.length);
          }}
          disabled={allDone}
          className={`flex items-center gap-1 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-default whitespace-nowrap ${
            compact ? "px-1.5 py-1 text-[12px]" : "px-2 py-2 text-sm"
          }`}
        >
          <FastForward
            className={compact ? "w-3.5 h-3.5" : "w-4 h-4"}
            aria-hidden
          />
          {compact ? "다 보기" : "한 번에 다 보기"}
        </button>

        {!compact && (
          <span className="ml-auto text-[13px] text-muted-foreground tabular-nums">
            {Math.min(revealed + (typing ? 1 : 0), paragraphs.length)} /{" "}
            {paragraphs.length}
          </span>
        )}
      </div>

      {!allDone && !compact && (
        <p className="shrink-0 px-3 pb-2 text-[12px] text-muted-foreground">
          아무 키나 누르거나 화면을 눌러도 다음 설명이 나와요.
        </p>
      )}
    </div>
  );
}
