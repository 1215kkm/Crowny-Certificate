"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";
import type { EditorView } from "@codemirror/view";
import CodeEditor from "./code-editor";

/**
 * 「코드 설명 보기」 — 진짜 선생님 코드(CodeMirror) 는 그대로 두고,
 * 그 위에 **absolute 로 말풍선**을 얹는다. 그래서 말풍선을 켜고 꺼도 코드 모습이 안 바뀐다.
 *
 *  - 규칙 기반 자동 설명 (import/export/useState/함수/map/onClick 등)
 *  - 처음엔 말풍선 모두 표시, 하나 누르면 그것만 남기고 나머진 숨김 (다시 누르면 전체)
 *  - return( ) / map( ) 은 왼쪽 세로선으로 범위를 묶어 준다
 */

function matchBracket(
  lines: string[],
  startLine: number,
  startCol: number,
  open: string,
  close: string
): number {
  let depth = 0;
  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i];
    let str: string | null = null;
    for (let c = i === startLine ? startCol : 0; c < line.length; c++) {
      const ch = line[c];
      if (str) {
        if (ch === str && line[c - 1] !== "\\") str = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") str = ch;
      else if (ch === open) depth++;
      else if (ch === close) {
        depth--;
        if (depth === 0) return i;
      }
    }
  }
  return -1;
}

type Region = { from: number; to: number; depth: number; kind: "screen" | "map" };

function findRegions(lines: string[]): Region[] {
  const regions: Region[] = [];
  lines.forEach((line, i) => {
    const rIdx = line.search(/\breturn\s*\(/);
    if (rIdx >= 0) {
      const col = line.indexOf("(", rIdx);
      const end = matchBracket(lines, i, col, "(", ")");
      if (end > i) regions.push({ from: i, to: end, depth: 0, kind: "screen" });
    }
    const mIdx = line.indexOf(".map(");
    if (mIdx >= 0) {
      const col = line.indexOf("(", mIdx + 4);
      const end = matchBracket(lines, i, col, "(", ")");
      if (end > i) regions.push({ from: i, to: end, depth: 1, kind: "map" });
    }
  });
  return regions;
}

function lineNote(line: string): string | null {
  const t = line.trim();
  let m: RegExpMatchArray | null;
  if ((m = t.match(/^import\s*\{([^}]+)\}\s*from\s*["']([^"']+)["']/)))
    return `${m[2]} 에서 ${m[1].trim()} 기능을 불러와요.`;
  if ((m = t.match(/^import\s+(\w+)\s+from\s*["']([^"']+)["']/)))
    return `${m[1]} 를 ${m[2]} 에서 불러와요. (import = 불러오기)`;
  if ((m = t.match(/export\s+default\s+function\s+(\w+)/)))
    return `이 파일을 밖에서 쓸 수 있게 내보내는 부품 ${m[1]} 이에요. (export default) 여는 { 부터 짝 } 까지가 이 함수의 몸통.`;
  if ((m = t.match(/const\s*\[(\w+),\s*(\w+)\]\s*=\s*useState\(([^)]*)\)/)))
    return `${m[1]} = 지금 값, ${m[2]} = 값을 바꾸는 함수. 처음 값은 ${
      m[3].trim() || "빈 값"
    }. (useState = 기억하기)`;
  if ((m = t.match(/^function\s+(\w+)\s*\(([^)]*)\)/)))
    return `${m[1]} 이라는 동작(함수)${
      m[2].trim() ? `. 괄호 안 ${m[2].trim()} 는 받는 값` : ""
    }.`;
  if ((m = t.match(/const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/)))
    return `${m[1]} 이라는 동작(함수)을 만들어요.`;
  if (/\.map\(/.test(t)) return "목록을 하나씩 돌면서 화면을 만들어요. (map)";
  if (/\.filter\(/.test(t)) return "조건에 맞는 것만 남겨요. (filter)";
  if (/onClick=/.test(t)) return "누르면 실행할 동작이에요.";
  if (/onChange=/.test(t)) return "내용이 바뀔 때마다 실행할 동작이에요.";
  if (/onKeyDown=/.test(t)) return "키를 눌렀을 때 실행할 동작이에요.";
  return null;
}

type Note = { line: number; text: string; kind: "screen" | "map" | "note" };

export default function CodeExplain({
  code,
  path,
}: {
  code: string;
  path?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [ready, setReady] = useState(0); // recompute 트리거

  const { noteList, regions } = useMemo(() => {
    const ls = code.replace(/\r\n/g, "\n").split("\n");
    const rs = findRegions(ls);
    const list: Note[] = [];
    ls.forEach((line, i) => {
      const start = rs.find((r) => r.from === i);
      if (start) {
        list.push({
          line: i,
          kind: start.kind,
          text:
            start.kind === "screen"
              ? "이 괄호 ( ) 안이 전부 화면이에요 — 태그·스타일이 여기 들어가요."
              : "여기 ( ) 안이 목록 하나하나가 될 화면이에요.",
        });
      } else {
        const n = lineNote(line);
        if (n) list.push({ line: i, kind: "note", text: n });
      }
    });
    return { noteList: list, regions: rs };
  }, [code]);

  const [focused, setFocused] = useState<number | null>(null);
  const [bubbleTops, setBubbleTops] = useState<Record<number, number>>({});
  const [regionBars, setRegionBars] = useState<
    { top: number; height: number; kind: "screen" | "map"; depth: number }[]
  >([]);

  const recompute = useCallback(() => {
    const view = viewRef.current;
    const cont = containerRef.current;
    if (!view || !cont) return;
    const cRect = cont.getBoundingClientRect();
    const topOf = (lineIdx: number, useBottom = false) => {
      try {
        const pos = view.state.doc.line(lineIdx + 1).from;
        const co = view.coordsAtPos(pos);
        if (!co) return null;
        return (useBottom ? co.bottom : co.top) - cRect.top;
      } catch {
        return null;
      }
    };

    const tops: Record<number, number> = {};
    noteList.forEach((n) => {
      const t = topOf(n.line);
      if (t !== null && t > -40 && t < cRect.height) tops[n.line] = t;
    });
    setBubbleTops(tops);

    const bars: {
      top: number;
      height: number;
      kind: "screen" | "map";
      depth: number;
    }[] = [];
    regions.forEach((r) => {
      const a = topOf(r.from);
      const b = topOf(r.to, true);
      if (a !== null && b !== null && b > a)
        bars.push({ top: a, height: b - a, kind: r.kind, depth: r.depth });
    });
    setRegionBars(bars);
  }, [noteList, regions]);

  /* 코드가 그려진 뒤 위치를 잰다. 스크롤·리사이즈 때마다 다시 잰다. */
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

  const bubbleStyle: Record<Note["kind"], string> = {
    screen: "bg-primary-50 border-primary/50 text-primary-900",
    map: "bg-accent/10 border-accent/50 text-accent-dark",
    note: "bg-white border-primary-200 text-foreground",
  };

  const visible =
    focused === null ? noteList : noteList.filter((n) => n.line === focused);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="shrink-0 flex items-center gap-3 px-3 py-1.5 border-b border-border text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-[2px] h-3 bg-primary inline-block" /> return( ) 화면
        </span>
        <span className="flex items-center gap-1">
          <span className="w-[2px] h-3 bg-accent inline-block" /> map( ) 목록
        </span>
        <span className="ml-auto">
          {focused === null ? "말풍선을 누르면 그것만 봐요" : "다시 누르면 전체"}
        </span>
      </div>

      {/* 코드는 그대로, 그 위에 말풍선을 absolute 로 얹는다 */}
      <div ref={containerRef} className="relative flex-1 min-h-0 overflow-hidden">
        <CodeEditor
          key={path}
          path={path ?? "/x.js"}
          value={code}
          readOnly
          onCreateEditor={(v) => {
            viewRef.current = v;
            setReady((n) => n + 1);
          }}
        />

        {/* 범위 세로선 (return=보라, map=분홍) */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {regionBars.map((b, k) => (
            <div
              key={k}
              className={`absolute w-[2px] rounded ${
                b.kind === "screen" ? "bg-primary" : "bg-accent"
              }`}
              style={{
                top: b.top,
                height: b.height,
                left: 4 + b.depth * 5,
              }}
            />
          ))}
        </div>

        {/* 말풍선 */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {visible.map((n) =>
            bubbleTops[n.line] === undefined ? null : (
              <button
                key={n.line}
                onClick={() =>
                  setFocused((f) => (f === n.line ? null : n.line))
                }
                style={{ top: bubbleTops[n.line] }}
                className={`pointer-events-auto absolute right-2 max-w-[62%] text-left rounded-lg border px-2 py-1 text-[11.5px] leading-snug break-keep font-sans shadow-md hover:z-30 hover:brightness-95 transition ${
                  bubbleStyle[n.kind]
                }`}
              >
                <span className="flex items-start gap-1">
                  <MessageSquare className="w-3 h-3 mt-[2px] shrink-0" />
                  {n.text}
                </span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
