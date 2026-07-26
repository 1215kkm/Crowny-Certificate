"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { EditorView } from "@codemirror/view";
import CodeEditor from "./code-editor";

/** 줄 단위 비교 기준 — 공백·따옴표 종류·세미콜론 차이는 무시 (codeMatches 와 같은 기준) */
function norm(l: string) {
  return l.replace(/['`]/g, '"').replace(/;/g, "").replace(/\s+/g, "");
}

/**
 * 내 코드(mine) 를 그대로 보여 주고, 선생 정답(answer) 과 다른 곳을 줄번호 옆 +/− 로 표시.
 *  extras       = 내 코드에만 있는(다른) 줄  → −
 *  missingBefore= 선생님 코드엔 있는데 내가 빠뜨린 줄이 이 줄 앞에 있음 → +
 */
function computeDiff(mine: string, answer: string) {
  const b = mine.replace(/\r\n/g, "\n").split("\n");
  const a = answer.replace(/\r\n/g, "\n").split("\n");
  const nb = b.map(norm);
  const na = a.map(norm);
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] =
        na[i] === nb[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);

  const extras: number[] = [];
  const missingBefore: Record<number, number> = {};
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (na[i] === nb[j]) {
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      missingBefore[j] = (missingBefore[j] ?? 0) + 1;
      i++;
    } else {
      extras.push(j);
      j++;
    }
  }
  while (j < n) extras.push(j++);
  while (i < m) {
    missingBefore[n] = (missingBefore[n] ?? 0) + 1;
    i++;
  }
  const changed = extras.length + Object.keys(missingBefore).length > 0;
  return { extras, missingBefore, changed, lineCount: n };
}

export default function CodeDiff({
  mine,
  answer,
  path,
}: {
  mine: string;
  answer: string;
  path?: string;
  otherTodo?: string[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [ready, setReady] = useState(0);

  const { extras, missingBefore, changed } = useMemo(
    () => computeDiff(mine, answer),
    [mine, answer]
  );

  const [marks, setMarks] = useState<
    { top: number; height: number; type: "extra" | "missing"; count?: number }[]
  >([]);

  const recompute = useCallback(() => {
    const view = viewRef.current;
    const cont = containerRef.current;
    if (!view || !cont) return;
    const cRect = cont.getBoundingClientRect();
    const rowOf = (lineIdx: number) => {
      try {
        const line = view.state.doc.line(
          Math.min(lineIdx + 1, view.state.doc.lines)
        );
        const co = view.coordsAtPos(line.from);
        if (!co) return null;
        return { top: co.top - cRect.top, height: co.bottom - co.top };
      } catch {
        return null;
      }
    };
    const out: typeof marks = [];
    extras.forEach((ln) => {
      const r = rowOf(ln);
      if (r && r.top > -30 && r.top < cRect.height)
        out.push({ top: r.top, height: r.height, type: "extra" });
    });
    Object.entries(missingBefore).forEach(([lnStr, count]) => {
      const ln = Number(lnStr);
      const r = rowOf(ln);
      if (r && r.top > -30 && r.top < cRect.height + 20)
        out.push({
          top: (ln >= view.state.doc.lines ? r.top + r.height : r.top) - 1,
          height: r.height,
          type: "missing",
          count,
        });
    });
    setMarks(out);
  }, [extras, missingBefore]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    recompute();
    const r1 = requestAnimationFrame(recompute);
    const t1 = window.setTimeout(recompute, 120);
    const scroller = view.scrollDOM;
    scroller.addEventListener("scroll", recompute);
    window.addEventListener("resize", recompute);
    return () => {
      cancelAnimationFrame(r1);
      window.clearTimeout(t1);
      scroller.removeEventListener("scroll", recompute);
      window.removeEventListener("resize", recompute);
    };
  }, [recompute, ready]);

  return (
    <div ref={containerRef} className="relative h-full min-h-0 overflow-hidden">
      <CodeEditor
        key={path}
        path={path ?? "/x.js"}
        value={mine}
        readOnly
        onCreateEditor={(v) => {
          viewRef.current = v;
          setReady((n) => n + 1);
        }}
      />

      {/* 줄번호 옆 +/− 표시 */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {marks.map((mk, k) =>
          mk.type === "extra" ? (
            <div key={k} style={{ top: mk.top }} className="absolute left-0">
              <span
                className="inline-flex items-center justify-center rounded bg-danger text-white text-[11px] font-bold leading-none w-4"
                style={{ height: mk.height }}
                title="내 코드에만 있는(다른) 줄"
              >
                −
              </span>
            </div>
          ) : (
            <div
              key={k}
              style={{ top: mk.top }}
              className="absolute left-0 right-0"
            >
              <span
                className="absolute left-0 -translate-y-1/2 inline-flex items-center justify-center rounded-full bg-success text-white text-[11px] font-bold leading-none w-4 h-4"
                title={`선생님 코드엔 있는데 빠진 줄 ${mk.count ?? 1}개`}
              >
                +
              </span>
              <span className="absolute left-4 right-0 top-0 h-[2px] bg-success/60" />
            </div>
          )
        )}
      </div>

      {/* 똑같을 때 — 우측 상단에 크게 */}
      {!changed && (
        <div className="pointer-events-none absolute top-3 right-3 z-20 rounded-xl bg-success text-white text-[15px] font-bold px-4 py-2 shadow-lg">
          선생님 코드와 똑같아요! 🎉
        </div>
      )}
    </div>
  );
}
