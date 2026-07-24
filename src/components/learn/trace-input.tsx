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

  /**
   * 글자별 상태 + 완료 판정.
   *
   * 띄어쓰기와 특수문자(마침표·쉼표·괄호·따옴표 등)는 **틀려도 넘어간다**.
   * 초등학생이 「.」 하나, 띄어쓰기 한 칸 때문에 빨간 줄을 보고 막히면 안 되기 때문.
   * 그래서 양쪽에서 그런 글자를 걷어낸 「뜻이 있는 글자」끼리만 맞춰 본다.
   */
  const { chars, done, percent } = useMemo(() => {
    const skippable = (ch: string) => /[\s\p{P}\p{S}]/u.test(ch);

    /** 뜻이 있는 글자만 뽑되, 원래 위치를 기억해 둔다 */
    const meaningful = (s: string) =>
      Array.from(s)
        .map((ch, i) => ({ ch, i }))
        .filter((c) => !skippable(c.ch));

    const tm = meaningful(target);
    const vm = meaningful(value);

    /** target 의 뜻글자 위치 → 상태 */
    const stateAt = new Map<number, "ok" | "bad" | "todo">();
    tm.forEach((t, k) => {
      const typed = vm[k];
      stateAt.set(t.i, !typed ? "todo" : typed.ch === t.ch ? "ok" : "bad");
    });

    // 띄어쓰기·기호는 "여기까지 왔으면" 통과 처리 — 지나온 자리는 진하게 보인다
    const lastPassedIndex =
      vm.length === 0 ? -1 : tm[Math.min(vm.length, tm.length) - 1]?.i ?? -1;

    const chars = Array.from(target).map((ch, i) => {
      const s = stateAt.get(i);
      if (s) return { ch, state: s };
      return { ch, state: i <= lastPassedIndex ? ("ok" as const) : ("todo" as const) };
    });

    const done = tm.length > 0 && tm.length === vm.length &&
      tm.every((t, k) => vm[k].ch === t.ch);

    const percent =
      tm.length === 0
        ? 100
        : Math.round((Math.min(vm.length, tm.length) / tm.length) * 100);

    return { chars, done, percent };
  }, [target, value]);

  useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [done, onComplete]);

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
      <div className="shrink-0 px-3 pt-2 pb-1 flex items-center gap-2 flex-wrap">
        <span className="text-[12px] font-bold text-primary-800">
          내가 치는 곳
        </span>
        <span className="text-[11px] text-muted-foreground">
          띄어쓰기랑 . , ( ) 같은 기호는 달라도 괜찮아요
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
