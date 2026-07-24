"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ClipboardPaste, RotateCcw, CheckCircle2, ArrowRight } from "lucide-react";

/**
 * 「따라 치기」 (1~5단계).
 *
 * 3번칸도 2번칸과 같은 뼈대(상단 좌·우 + 하단)를 쓰므로,
 * 따라 칠 문장(상단 오른쪽)과 내가 치는 칸(하단)이 서로 다른 자리에 놓인다.
 * 그래서 상태는 훅으로 빼고, 화면 조각 두 개를 따로 내보낸다.
 */
export function useTracePractice(
  target: string,
  storageKey: string,
  onComplete?: () => void
) {
  const [value, setValue] = useState("");
  const completedRef = useRef(false);
  const key = `kaiat-trace-${storageKey}`;

  useEffect(() => {
    completedRef.current = false;
    try {
      setValue(window.localStorage.getItem(key) ?? "");
    } catch {
      setValue("");
    }
  }, [key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* 용량 초과 등은 무시 — 학습이 끊기면 안 되니까 */
    }
  }, [value, key]);

  const done = value.trim() === target.trim();

  useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [done, onComplete]);

  /* 글자별 상태 — 맞으면 진하게, 틀리면 빨갛게, 아직이면 흐리게 */
  const chars = useMemo(
    () =>
      Array.from(target).map((ch, i) => {
        const typed = value[i];
        if (typed === undefined) return { ch, state: "todo" as const };
        if (typed === ch) return { ch, state: "ok" as const };
        return { ch, state: "bad" as const };
      }),
    [target, value]
  );

  const typedCount = Math.min(value.length, target.length);
  const percent =
    target.length === 0 ? 100 : Math.round((typedCount / target.length) * 100);

  return { value, setValue, chars, done, percent, target };
}

type Practice = ReturnType<typeof useTracePractice>;

/** 상단 오른쪽 — 따라 칠 문장 */
export function TraceTarget({
  practice,
  label,
}: {
  practice: Practice;
  label?: string;
}) {
  return (
    <div className="rounded-lg bg-white border border-primary-200 overflow-hidden">
      <div className="px-3 pt-2 pb-1.5 text-[12px] font-bold text-primary-800">
        {label ?? "이 문장을 따라 쳐 보세요"}
      </div>
      <pre className="px-3 pb-3 whitespace-pre-wrap break-keep font-sans text-[14px] leading-[1.9] m-0">
        {practice.chars.map((c, i) => (
          <span
            key={i}
            className={
              c.state === "ok"
                ? "text-primary-800 font-medium"
                : c.state === "bad"
                  ? "bg-danger/15 text-danger rounded-[2px]"
                  : "text-primary-900/25"
            }
          >
            {c.ch}
          </span>
        ))}
      </pre>
    </div>
  );
}

/** 하단 — 내가 치는 칸 */
export function TraceBox({
  practice,
  onNext,
  nextLabel = "다음 진행하기",
}: {
  practice: Practice;
  /** 다 치면 켜지는 다음 단계 버튼 */
  onNext?: () => void;
  nextLabel?: string;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="shrink-0 px-3 pt-2 pb-1 flex items-center gap-2">
        <span className="text-[12px] font-bold text-primary-800">
          내가 치는 곳
        </span>
        {practice.done ? (
          <span className="ml-auto flex items-center gap-1 text-[12px] font-semibold text-success">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
            완료!
          </span>
        ) : (
          <span className="ml-auto text-[12px] text-muted-foreground tabular-nums">
            {practice.percent}%
          </span>
        )}
      </div>

      <textarea
        ref={taRef}
        value={practice.value}
        onChange={(e) => practice.setValue(e.target.value)}
        spellCheck={false}
        placeholder="위 문장을 그대로 쳐 보세요"
        className="flex-1 min-h-0 w-full resize-none px-3 py-2 text-[14px] leading-[1.9] outline-none break-keep bg-transparent"
      />

      <div className="shrink-0 px-2 py-2 flex items-center gap-1.5 border-t border-border">
        <button
          onClick={() => {
            practice.setValue(practice.target);
            taRef.current?.focus();
          }}
          className="flex items-center gap-1.5 bg-muted text-foreground px-2.5 py-1.5 rounded-md text-[13px] font-medium hover:bg-border transition"
        >
          <ClipboardPaste className="w-3.5 h-3.5" aria-hidden />
          건너뛰고 붙여넣기
        </button>

        <button
          onClick={() => {
            practice.setValue("");
            taRef.current?.focus();
          }}
          className="flex items-center gap-1.5 text-muted-foreground px-2 py-1.5 rounded-md text-[13px] hover:text-foreground transition"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden />
          다시
        </button>

        {/* 맨 오른쪽 — 다 치면 켜진다.
            자리를 늘 잡아 두어야 "다 하면 여기로 간다"가 예측된다. */}
        {onNext && (
          <button
            onClick={onNext}
            disabled={!practice.done}
            className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-semibold transition ${
              practice.done
                ? "bg-gradient-brand text-white hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-default"
            }`}
          >
            {practice.done ? nextLabel : "다 치면 넘어가요"}
            <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
