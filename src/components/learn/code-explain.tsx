"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MessageSquare } from "lucide-react";
import type { EditorView } from "@codemirror/view";
import CodeEditor from "./code-editor";

/**
 * 「코드 설명 보기」 — 진짜 선생님 코드(CodeMirror) 위에 absolute 로 말풍선을 얹는다.
 * 코드 모습은 그대로. 말풍선은 겹치면 아래로 밀고, 연결선(뾰족)으로 어느 줄인지 가리킨다.
 *  - 처음엔 모두 표시, 말풍선이나 코드 줄을 누르면 그 줄만 (다시 누르면 전체)
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
    return `이 파일을 밖에서 쓸 수 있게 내보내는 부품 ${m[1]} 이에요. (export default) 여는 { 부터 짝 } 까지가 함수의 몸통.`;
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

const BUBBLE_STYLE: Record<Note["kind"], string> = {
  screen: "bg-primary-50 border-primary/50 text-primary-900",
  map: "bg-accent/10 border-accent/50 text-accent-dark",
  note: "bg-white border-primary-200 text-foreground",
};
const LINE_COLOR: Record<Note["kind"], string> = {
  screen: "bg-primary",
  map: "bg-accent",
  note: "bg-primary-300",
};

export default function CodeExplain({
  code,
  path,
}: {
  code: string;
  path?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const bubbleRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [ready, setReady] = useState(0);

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
  const [rawTops, setRawTops] = useState<Record<number, number>>({});
  const [heights, setHeights] = useState<Record<number, number>>({});
  const [width, setWidth] = useState(0);
  const [regionBars, setRegionBars] = useState<
    { top: number; height: number; kind: "screen" | "map"; depth: number }[]
  >([]);

  const recompute = useCallback(() => {
    const view = viewRef.current;
    const cont = containerRef.current;
    if (!view || !cont) return;
    const cRect = cont.getBoundingClientRect();
    setWidth(cRect.width);
    const topOf = (lineIdx: number, useBottom = false) => {
      try {
        const co = view.coordsAtPos(view.state.doc.line(lineIdx + 1).from);
        if (!co) return null;
        return (useBottom ? co.bottom : co.top) - cRect.top;
      } catch {
        return null;
      }
    };
    const tops: Record<number, number> = {};
    noteList.forEach((n) => {
      const t = topOf(n.line);
      if (t !== null && t > -60 && t < cRect.height) tops[n.line] = t;
    });
    setRawTops(tops);
    const bars: typeof regionBars = [];
    regions.forEach((r) => {
      const a = topOf(r.from);
      const b = topOf(r.to, true);
      if (a !== null && b !== null && b > a)
        bars.push({ top: a, height: b - a, kind: r.kind, depth: r.depth });
    });
    setRegionBars(bars);
  }, [noteList, regions]);

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

  /* 코드 줄을 클릭하면 그 줄 말풍선을 토글한다 */
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const noteLines = new Set(noteList.map((n) => n.line));
    const onClick = (e: MouseEvent) => {
      const pos = view.posAtCoords({ x: e.clientX, y: e.clientY });
      if (pos == null) return;
      const line = view.state.doc.lineAt(pos).number - 1;
      if (noteLines.has(line)) setFocused((f) => (f === line ? null : line));
    };
    view.dom.addEventListener("click", onClick);
    return () => view.dom.removeEventListener("click", onClick);
  }, [noteList, ready]);

  const visible = useMemo(
    () =>
      focused === null ? noteList : noteList.filter((n) => n.line === focused),
    [focused, noteList]
  );

  /* 겹치지 않게 아래로 밀어 최종 위치를 정한다 */
  const tops = useMemo(() => {
    const res: Record<number, number> = {};
    let prevBottom = -Infinity;
    [...visible]
      .filter((n) => rawTops[n.line] !== undefined)
      .sort((a, b) => rawTops[a.line] - rawTops[b.line])
      .forEach((n) => {
        const raw = rawTops[n.line];
        const h = heights[n.line] ?? 42;
        const top = Math.max(raw, prevBottom + 4);
        res[n.line] = top;
        prevBottom = top + h;
      });
    return res;
  }, [visible, rawTops, heights]);

  /* 렌더된 말풍선 높이를 재서 다음 계산에 쓴다 */
  useLayoutEffect(() => {
    let changed = false;
    const next = { ...heights };
    visible.forEach((n) => {
      const el = bubbleRefs.current[n.line];
      if (el) {
        const h = el.offsetHeight;
        if (Math.abs((heights[n.line] ?? 0) - h) > 1) {
          next[n.line] = h;
          changed = true;
        }
      }
    });
    if (changed) setHeights(next);
  }); // 매 렌더 후 측정

  const leftX = Math.round(width * 0.4);
  const bubbleW = Math.max(120, width - leftX - 8);

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-0 overflow-hidden"
    >
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

      {/* return( )/map( ) 범위 세로선 */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {regionBars.map((b, k) => (
          <div
            key={k}
            className={`absolute w-[2px] rounded ${
              b.kind === "screen" ? "bg-primary" : "bg-accent"
            }`}
            style={{ top: b.top, height: b.height, left: 4 + b.depth * 5 }}
          />
        ))}
      </div>

      {/* 말풍선 + 연결선 */}
      {width > 0 && (
        <div className="pointer-events-none absolute inset-0 z-20">
          {visible.map((n) => {
            const raw = rawTops[n.line];
            const top = tops[n.line];
            if (raw === undefined || top === undefined) return null;
            const connTop = raw + 8;
            const connH = Math.max(2, top + 10 - connTop);
            return (
              <div key={n.line}>
                {/* 연결선: 코드 줄 → 말풍선 (뾰족) */}
                <div
                  className={`absolute rounded-full ${LINE_COLOR[n.kind]}`}
                  style={{ left: leftX - 1, top: connTop, width: 2, height: connH }}
                />
                <div
                  className={`absolute w-1.5 h-1.5 rounded-full ${LINE_COLOR[n.kind]}`}
                  style={{ left: leftX - 3, top: raw + 5 }}
                />
                <button
                  ref={(el) => {
                    bubbleRefs.current[n.line] = el;
                  }}
                  onClick={() =>
                    setFocused((f) => (f === n.line ? null : n.line))
                  }
                  style={{ left: leftX, top, width: bubbleW }}
                  className={`pointer-events-auto absolute text-left rounded-lg border px-2 py-1 text-[11.5px] leading-snug break-keep font-sans shadow-md hover:brightness-95 transition ${
                    BUBBLE_STYLE[n.kind]
                  }`}
                >
                  {/* 왼쪽 뾰족 꼬리 */}
                  <span
                    className="absolute -left-[5px] top-2 w-[9px] h-[9px] rotate-45 border-l border-b bg-inherit border-inherit"
                    aria-hidden
                  />
                  <span className="flex items-start gap-1">
                    <MessageSquare className="w-3 h-3 mt-[2px] shrink-0" />
                    {n.text}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
