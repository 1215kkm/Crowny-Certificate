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
import { baseName } from "./learn-utils";

/**
 * 「코드 설명 보기」 — 진짜 선생님 코드(CodeMirror) 위에 absolute 로 얹는다.
 *  - 말풍선 설명(import/export/useState/함수/map/onClick 등)
 *  - 코드 블록 범위 세로선: return( )=보라, map( )=분홍, <태그>…</태그>=파랑
 *  - 말풍선은 겹치면 아래로 밀고, 연결선(뾰족)으로 어느 줄인지 가리킴
 *  - 모두 표시 → 말풍선·코드 줄을 누르면 그 줄만 (다시 누르면 전체)
 */

type Kind = "screen" | "map" | "element";
type Region = { from: number; to: number; kind: Kind };

/** 문자열·괄호 안을 세며 open 의 짝 close 가 있는 줄을 찾는다 */
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

/** return( ) 과 map( ) 범위 */
function findParenRegions(lines: string[]): Region[] {
  const out: Region[] = [];
  lines.forEach((line, i) => {
    const rIdx = line.search(/\breturn\s*\(/);
    if (rIdx >= 0) {
      const end = matchBracket(lines, i, line.indexOf("(", rIdx), "(", ")");
      if (end > i) out.push({ from: i, to: end, kind: "screen" });
    }
    const mIdx = line.indexOf(".map(");
    if (mIdx >= 0) {
      const end = matchBracket(lines, i, line.indexOf("(", mIdx + 4), "(", ")");
      if (end > i) out.push({ from: i, to: end, kind: "map" });
    }
  });
  return out;
}

/**
 * 여러 줄 JSX 태그 범위 (<div>…</div> 등).
 * 문자열·{ } 식은 건너뛰며 스캔해서 onChange={(e) => ...} 의 > 에 안 속는다.
 */
function findJsxRegions(code: string): Region[] {
  const out: Region[] = [];
  const stack: { name: string; line: number }[] = [];
  const n = code.length;
  let i = 0;
  let line = 0;
  while (i < n) {
    const ch = code[i];
    if (ch === "\n") {
      line++;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      const q = ch;
      i++;
      while (i < n && !(code[i] === q && code[i - 1] !== "\\")) {
        if (code[i] === "\n") line++;
        i++;
      }
      i++;
      continue;
    }
    if (ch === "<") {
      const rest = code.slice(i);
      const close = /^<\/([A-Za-z][\w.]*)\s*>/.exec(rest);
      if (close) {
        const name = close[1];
        for (let s = stack.length - 1; s >= 0; s--) {
          if (stack[s].name === name) {
            const open = stack[s];
            stack.length = s;
            if (line > open.line)
              out.push({ from: open.line, to: line, kind: "element" });
            break;
          }
        }
        i += close[0].length;
        continue;
      }
      const openM = /^<([A-Za-z][\w.]*)/.exec(rest);
      if (openM) {
        const name = openM[1];
        const startLine = line;
        let j = i + openM[0].length;
        let brace = 0;
        let selfClose = false;
        while (j < n) {
          const c = code[j];
          if (c === "\n") line++;
          else if (c === '"' || c === "'" || c === "`") {
            const q = c;
            j++;
            while (j < n && !(code[j] === q && code[j - 1] !== "\\")) {
              if (code[j] === "\n") line++;
              j++;
            }
          } else if (c === "{") brace++;
          else if (c === "}") brace--;
          else if (brace === 0) {
            if (c === "/" && code[j + 1] === ">") {
              selfClose = true;
              j += 2;
              break;
            }
            if (c === ">") {
              j++;
              break;
            }
          }
          j++;
        }
        if (!selfClose) stack.push({ name, line: startLine });
        i = j;
        continue;
      }
    }
    i++;
  }
  return out;
}

function whereFrom(src: string): string {
  return src.startsWith(".") ? `${src} 파일` : `${src} 라는 도구 모음`;
}

function lineNote(line: string, fileName: string): string | null {
  const t = line.trim();
  let m: RegExpMatchArray | null;
  if ((m = t.match(/^import\s*\{([^}]+)\}\s*from\s*["']([^"']+)["']/)))
    return `지금 이 파일(${fileName})로 ${m[1].trim()} 기능을 불러와요. ${m[1].trim()} 는 ${whereFrom(
      m[2]
    )} 안에 들어 있어요. (import = 불러오기)`;
  if ((m = t.match(/^import\s+(\w+)\s+from\s*["']([^"']+)["']/)))
    return `지금 이 파일(${fileName})로 ${m[1]} 를 불러와요. ${m[1]} 는 ${whereFrom(
      m[2]
    )}에 있어요. (import = 불러오기)`;
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
const RANGE_COLOR: Record<Kind, string> = {
  screen: "bg-primary",
  map: "bg-accent",
  element: "bg-[#3b82f6]",
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

  const { lines, noteList, regions } = useMemo(() => {
    const fileName = path ? baseName(path) : "이 파일";
    const ls = code.replace(/\r\n/g, "\n").split("\n");
    const rs = [...findParenRegions(ls), ...findJsxRegions(code)];
    const list: Note[] = [];
    ls.forEach((line, i) => {
      const start = rs.find((r) => r.from === i && r.kind !== "element");
      if (start) {
        list.push({
          line: i,
          kind: start.kind === "map" ? "map" : "screen",
          text:
            start.kind === "screen"
              ? "이 괄호 ( ) 안이 전부 화면이에요 — 태그·스타일이 여기 들어가요."
              : "여기 ( ) 안이 목록 하나하나가 될 화면이에요.",
        });
      } else {
        const n = lineNote(line, fileName);
        if (n) list.push({ line: i, kind: "note", text: n });
      }
    });
    return { lines: ls, noteList: list, regions: rs };
  }, [code, path]);

  const [focused, setFocused] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [rawTops, setRawTops] = useState<Record<number, number>>({});
  const [heights, setHeights] = useState<Record<number, number>>({});
  const [width, setWidth] = useState(0);
  const [lineH, setLineH] = useState(20);
  const [bars, setBars] = useState<
    { from: number; top: number; height: number; left: number; kind: Kind }[]
  >([]);

  const recompute = useCallback(() => {
    const view = viewRef.current;
    const cont = containerRef.current;
    if (!view || !cont) return;
    const cRect = cont.getBoundingClientRect();
    setWidth(cRect.width);

    const yx = (lineIdx: number, col: number, useBottom = false) => {
      try {
        const from = view.state.doc.line(lineIdx + 1).from;
        const co = view.coordsAtPos(from + col);
        if (!co) return null;
        return {
          y: (useBottom ? co.bottom : co.top) - cRect.top,
          x: co.left - cRect.left,
        };
      } catch {
        return null;
      }
    };

    try {
      const c1 = view.coordsAtPos(view.state.doc.line(1).from);
      if (c1) setLineH(Math.max(14, c1.bottom - c1.top));
    } catch {
      /* 무시 */
    }

    const tops: Record<number, number> = {};
    noteList.forEach((n) => {
      const p = yx(n.line, 0);
      if (p && p.y > -60 && p.y < cRect.height) tops[n.line] = p.y;
    });
    setRawTops(tops);

    const b: typeof bars = [];
    regions.forEach((r) => {
      const indent = lines[r.from].length - lines[r.from].trimStart().length;
      const a = yx(r.from, indent);
      const e = yx(r.to, 0, true);
      if (a && e && e.y > a.y)
        b.push({
          from: r.from,
          top: a.y,
          height: e.y - a.y,
          left: Math.max(2, a.x - 6),
          kind: r.kind,
        });
    });
    setBars(b);
  }, [noteList, regions, lines]);

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

  /* 코드 줄을 클릭하면 그 줄 말풍선을 토글 */
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const noteLines = new Set(noteList.map((n) => n.line));
    const onClick = (e: MouseEvent) => {
      const pos = view.posAtCoords({ x: e.clientX, y: e.clientY });
      if (pos == null) return;
      const l = view.state.doc.lineAt(pos).number - 1;
      if (noteLines.has(l)) setFocused((f) => (f === l ? null : l));
    };
    view.dom.addEventListener("click", onClick);
    return () => view.dom.removeEventListener("click", onClick);
  }, [noteList, ready]);

  const visible = useMemo(
    () =>
      focused === null ? noteList : noteList.filter((n) => n.line === focused),
    [focused, noteList]
  );

  /* 말풍선에 마우스를 올리면 그 코드가 어디부터 어디까지인지 — 범위면 블록 전체, 아니면 한 줄 */
  const hoverRange = useMemo(() => {
    if (hovered === null) return null;
    const note = noteList.find((n) => n.line === hovered);
    if (!note) return null;
    if (note.kind !== "note") {
      const bar = bars.find((b) => b.from === hovered);
      if (bar) return { top: bar.top, height: bar.height };
    }
    const t = rawTops[hovered];
    if (t === undefined) return null;
    return { top: t, height: lineH };
  }, [hovered, noteList, bars, rawTops, lineH]);

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
  });

  const leftX = Math.round(width * 0.4);
  const bubbleW = Math.max(120, width - leftX - 8);

  return (
    <div ref={containerRef} className="relative h-full min-h-0 overflow-hidden">
      <CodeEditor
        key={path}
        path={path ?? "/x.js"}
        value={code}
        readOnly
        highlightLines={noteList.map((n) => n.line)}
        onCreateEditor={(v) => {
          viewRef.current = v;
          setReady((n) => n + 1);
        }}
      />

      {/* 말풍선에 마우스 올리면 해당 코드 범위를 강조 */}
      {hoverRange && (
        <div
          className="pointer-events-none absolute left-0 right-0 z-[5] rounded bg-primary/15 ring-1 ring-primary/40"
          style={{ top: hoverRange.top, height: hoverRange.height }}
        />
      )}

      {/* 코드 블록 범위 세로선 */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {bars.map((b, k) => (
          <div
            key={k}
            className={`absolute w-[2px] rounded ${RANGE_COLOR[b.kind]}`}
            style={{ top: b.top, height: b.height, left: b.left }}
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
                <div
                  className={`absolute rounded-full ${
                    n.kind === "map" ? "bg-accent" : n.kind === "screen" ? "bg-primary" : "bg-primary-300"
                  }`}
                  style={{ left: leftX - 1, top: connTop, width: 2, height: connH }}
                />
                <div
                  className={`absolute w-1.5 h-1.5 rounded-full ${
                    n.kind === "map" ? "bg-accent" : n.kind === "screen" ? "bg-primary" : "bg-primary-300"
                  }`}
                  style={{ left: leftX - 3, top: raw + 5 }}
                />
                <button
                  ref={(el) => {
                    bubbleRefs.current[n.line] = el;
                  }}
                  onClick={() =>
                    setFocused((f) => (f === n.line ? null : n.line))
                  }
                  onMouseEnter={() => setHovered(n.line)}
                  onMouseLeave={() => setHovered((h) => (h === n.line ? null : h))}
                  style={{ left: leftX, top, width: bubbleW }}
                  className={`pointer-events-auto absolute text-left rounded-lg border px-2 py-1 text-[11.5px] leading-snug break-keep font-sans shadow-md hover:brightness-95 transition ${
                    BUBBLE_STYLE[n.kind]
                  }`}
                >
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
