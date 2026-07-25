"use client";

import { useMemo } from "react";

/** 줄 단위 비교 — 공백·따옴표 종류·세미콜론 차이는 무시 (codeMatches 와 같은 기준) */
function normLine(l: string) {
  return l.replace(/['`]/g, '"').replace(/;/g, "").replace(/\s+/g, "");
}

type Row = { type: "same" | "missing" | "extra"; text: string };

/**
 * 학생 코드(mine)와 선생 정답(answer)을 줄 단위로 맞춰 본다.
 * 최장 공통 부분수열(LCS)로 정렬해서, 줄이 밀려도 "어디가 다른지"를 제대로 잡는다.
 *   missing = 정답엔 있는데 내 코드엔 없음 (빠진 줄)
 *   extra   = 내 코드에만 있음 (다른/필요 없는 줄)
 */
function diffLines(mine: string, answer: string): Row[] {
  const a = answer.split("\n").filter((l) => normLine(l) !== "");
  const b = mine.split("\n").filter((l) => normLine(l) !== "");
  const na = a.map(normLine);
  const nb = b.map(normLine);
  const m = a.length;
  const n = b.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] =
        na[i] === nb[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const rows: Row[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (na[i] === nb[j]) {
      rows.push({ type: "same", text: b[j] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      rows.push({ type: "missing", text: a[i] });
      i++;
    } else {
      rows.push({ type: "extra", text: b[j] });
      j++;
    }
  }
  while (i < m) rows.push({ type: "missing", text: a[i++] });
  while (j < n) rows.push({ type: "extra", text: b[j++] });
  return rows;
}

/** 학생 코드 ↔ 선생님 코드 비교 뷰 — 다른 줄·빠진 줄을 색으로 표시 */
export default function CodeDiff({
  mine,
  answer,
}: {
  mine: string;
  answer: string;
}) {
  const rows = useMemo(() => diffLines(mine, answer), [mine, answer]);
  const diffs = rows.filter((r) => r.type !== "same").length;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="shrink-0 flex items-center gap-3 px-3 py-1.5 border-b border-border text-[11px]">
        {diffs === 0 ? (
          <span className="font-semibold text-success">
            선생님 코드와 똑같아요! 🎉
          </span>
        ) : (
          <>
            <span className="flex items-center gap-1 text-danger">
              <span className="w-2.5 h-2.5 rounded-sm bg-danger/25 border border-danger/40" />
              다른 줄 (내 코드에만)
            </span>
            <span className="flex items-center gap-1 text-success">
              <span className="w-2.5 h-2.5 rounded-sm bg-success/25 border border-success/40" />
              빠진 줄 (선생님 코드엔 있어요)
            </span>
          </>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-auto font-mono text-[13px] leading-[1.7] py-1">
        {rows.map((r, k) => (
          <div
            key={k}
            className={`flex items-start gap-2 px-3 whitespace-pre-wrap break-all ${
              r.type === "extra"
                ? "bg-danger/10"
                : r.type === "missing"
                  ? "bg-success/10"
                  : ""
            }`}
          >
            <span
              className={`shrink-0 w-4 text-center select-none ${
                r.type === "extra"
                  ? "text-danger"
                  : r.type === "missing"
                    ? "text-success"
                    : "text-muted-foreground/30"
              }`}
            >
              {r.type === "extra" ? "≠" : r.type === "missing" ? "+" : ""}
            </span>
            <span
              className={
                r.type === "extra"
                  ? "text-danger"
                  : r.type === "missing"
                    ? "text-success"
                    : "text-foreground"
              }
            >
              {r.text || " "}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
