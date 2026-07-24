"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ClipboardPaste, RotateCcw, CheckCircle2, ArrowRight } from "lucide-react";

/** 이만큼만 맞으면 다음 단계로 넘어갈 수 있다 (0~1) */
export const PASS_RATIO = 0.7;

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

    /**
     * 위치로 1:1 비교하면 글자 하나만 더 치거나 빠뜨려도 그 뒤가 통째로 밀려
     * 전부 틀린 것으로 잡힌다. (예: "서버:" 를 "서버는" 이라고 치면 뒤가 다 어긋남)
     * 그래서 **순서만 맞으면 인정하는 방식**(최장 공통 부분수열, LCS)으로 맞춘다.
     * 중간을 건너뛰거나 군더더기를 더 쳐도, 옮겨 적은 글자는 옮겨 적은 것으로 센다.
     * 대소문자도 구분하지 않는다 (VERCEL 과 Vercel 은 같은 것).
     */
    const t = tm.map((c) => c.ch.toLowerCase());
    const v = vm.map((c) => c.ch.toLowerCase());
    const n = t.length;
    const m = v.length;

    // dp[i][j] = t[i..] 와 v[j..] 의 최장 공통 부분수열 길이
    const dp: Uint16Array[] = Array.from(
      { length: n + 1 },
      () => new Uint16Array(m + 1)
    );
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] =
          t[i] === v[j]
            ? dp[i + 1][j + 1] + 1
            : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }

    // 되짚어 가며 "학생이 실제로 옮겨 적은" target 글자를 표시
    const matched = new Array<boolean>(n).fill(false);
    let i = 0;
    let j = 0;
    while (i < n && j < m) {
      if (t[i] === v[j]) {
        matched[i] = true;
        i++;
        j++;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        i++;
      } else {
        j++;
      }
    }

    const correct = dp[0][0];
    /** 학생이 훑고 지나간 마지막 지점 — 그 앞은 빨갛게, 뒤는 아직 안 온 것으로 */
    let lastMatchedK = -1;
    for (let k = n - 1; k >= 0; k--) {
      if (matched[k]) {
        lastMatchedK = k;
        break;
      }
    }

    const stateAt = new Map<number, "ok" | "bad" | "todo">();
    tm.forEach((c, k) => {
      stateAt.set(
        c.i,
        matched[k] ? "ok" : k < lastMatchedK ? "bad" : "todo"
      );
    });

    // 띄어쓰기·기호는 "여기까지 왔으면" 통과 처리 — 지나온 자리는 진하게 보인다
    const lastPassedIndex = lastMatchedK < 0 ? -1 : tm[lastMatchedK].i;

    const chars = Array.from(target).map((ch, idx) => {
      const s = stateAt.get(idx);
      if (s) return { ch, state: s };
      return {
        ch,
        state: idx <= lastPassedIndex ? ("ok" as const) : ("todo" as const),
      };
    });

    const percent =
      tm.length === 0 ? 100 : Math.round((correct / tm.length) * 100);

    // 끝까지 정확히 옮겨 적는 게 목적이 아니라 손으로 한 번 따라가 보는 게 목적이라
    // 70% 만 맞아도 다음으로 넘어갈 수 있게 한다.
    const done = tm.length === 0 || correct / tm.length >= PASS_RATIO;

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
          띄어쓰기랑 . , ( ) 같은 기호는 달라도 괜찮아요 · {Math.round(PASS_RATIO * 100)}%만
          치면 넘어갈 수 있어요
        </span>
        {practice.done ? (
          <span className="ml-auto flex items-center gap-1 text-[12px] font-semibold text-success tabular-nums">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
            {practice.percent}% 통과!
          </span>
        ) : (
          <span className="ml-auto text-[12px] text-muted-foreground tabular-nums">
            {practice.percent}% / {Math.round(PASS_RATIO * 100)}%
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
            {practice.done
              ? nextLabel
              : `${Math.round(PASS_RATIO * 100)}%까지 치면 넘어가요`}
            <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
