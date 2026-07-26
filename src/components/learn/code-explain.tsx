"use client";

import { useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";

/**
 * 「코드 설명 보기」 — 코드는 그대로 두고 오른쪽에 **말풍선**으로 설명을 붙인다.
 *
 *  - 규칙 기반이라 스텝마다 손으로 안 쓰고 모든 코드에 자동 적용
 *  - 처음엔 말풍선을 모두 보여 주고, 하나를 누르면 그것만 남기고 나머진 접는다 (다시 누르면 전체)
 *  - return ( ... ) / map( ... ) 은 왼쪽 세로선으로 범위를 묶어 준다
 */

/** 문자열·괄호 안을 세며 open 에 짝이 되는 close 가 있는 줄을 찾는다 */
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

/** 한 줄이 무슨 뜻인지 — 알아본 패턴만 풀이한다 (없으면 null) */
function lineNote(line: string): string | null {
  const t = line.trim();
  let m: RegExpMatchArray | null;

  if ((m = t.match(/^import\s*\{([^}]+)\}\s*from\s*["']([^"']+)["']/)))
    return `${m[2]} 에서 ${m[1].trim()} 기능을 불러와요.`;
  if ((m = t.match(/^import\s+(\w+)\s+from\s*["']([^"']+)["']/)))
    return `${m[1]} 를 ${m[2]} 에서 불러와요. (import = 불러오기)`;
  if ((m = t.match(/export\s+default\s+function\s+(\w+)/)))
    return `이 파일을 밖에서 쓸 수 있게 내보내는 부품 ${m[1]} 이에요. (export default = 내보내기) 여는 { 부터 짝이 되는 } 까지가 이 함수의 몸통이에요.`;
  if ((m = t.match(/const\s*\[(\w+),\s*(\w+)\]\s*=\s*useState\(([^)]*)\)/)))
    return `${m[1]} = 지금 값, ${m[2]} = 값을 바꾸는 함수예요. 처음 값은 ${
      m[3].trim() || "빈 값"
    }. (useState = 기억하기)`;
  if ((m = t.match(/^function\s+(\w+)\s*\(([^)]*)\)/)))
    return `${m[1]} 이라는 동작(함수)이에요${
      m[2].trim() ? `. 괄호 안 ${m[2].trim()} 는 밖에서 받는 값` : ""
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

type Note = { text: string; kind: "screen" | "map" | "note" };

export default function CodeExplain({ code }: { code: string; path?: string }) {
  const { lines, regions, notes } = useMemo(() => {
    const ls = code.replace(/\r\n/g, "\n").split("\n");
    const rs = findRegions(ls);
    const ns: (Note | null)[] = ls.map((line, i) => {
      const start = rs.find((r) => r.from === i);
      if (start)
        return {
          kind: start.kind,
          text:
            start.kind === "screen"
              ? "이 괄호 ( ) 안이 전부 화면이에요 — 태그·스타일이 여기 들어가요."
              : "여기 ( ) 안이 목록 하나하나가 될 화면이에요.",
        };
      const n = lineNote(line);
      return n ? { kind: "note", text: n } : null;
    });
    return { lines: ls, regions: rs, notes: ns };
  }, [code]);

  /** null = 말풍선 모두 보기, 숫자 = 그 줄만 보기 */
  const [focused, setFocused] = useState<number | null>(null);

  const bubbleStyle: Record<Note["kind"], string> = {
    screen: "bg-primary-50 border-primary/50 text-primary-900",
    map: "bg-accent/10 border-accent/50 text-accent-dark",
    note: "bg-white border-primary-200 text-foreground",
  };

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
          {focused === null
            ? "말풍선을 누르면 그것만 봐요"
            : "다시 누르면 전체 설명"}
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-auto py-1 font-mono text-[12.5px] leading-[1.7]">
        {lines.map((line, i) => {
          const here = regions.filter((r) => i >= r.from && i <= r.to);
          const note = notes[i];
          const showBubble = !!note && (focused === null || focused === i);
          const showMarker = !!note && focused !== null && focused !== i;

          return (
            <div key={i} className="flex items-stretch gap-1 px-2">
              {/* 왼쪽 범위 세로선 (return=보라, map=분홍) */}
              <div className="flex shrink-0">
                {[0, 1].map((d) => {
                  const reg = here.find((r) => r.depth === d);
                  return (
                    <div
                      key={d}
                      className="w-1.5 flex justify-center items-stretch"
                    >
                      {reg && (
                        <div
                          className={`w-[2px] ${
                            reg.kind === "screen" ? "bg-primary" : "bg-accent"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <span className="w-6 shrink-0 text-right text-muted-foreground/40 tabular-nums select-none self-start">
                {i + 1}
              </span>

              <pre className="flex-1 min-w-0 m-0 whitespace-pre-wrap break-all self-start text-foreground">
                {line || " "}
              </pre>

              {/* 오른쪽 말풍선 (또는 접힌 상태의 작은 💬) */}
              {note && (
                <div className="w-[46%] shrink-0 self-start">
                  {showBubble && (
                    <button
                      onClick={() =>
                        setFocused((f) => (f === i ? null : i))
                      }
                      className={`relative w-full text-left rounded-lg border px-2 py-1 text-[11.5px] leading-snug break-keep font-sans shadow-sm hover:brightness-95 transition ${
                        bubbleStyle[note.kind]
                      }`}
                    >
                      <span className="absolute -left-[5px] top-2.5 w-[9px] h-[9px] rotate-45 border-l border-b bg-inherit border-inherit" />
                      <span className="flex items-start gap-1">
                        <MessageSquare className="w-3 h-3 mt-[2px] shrink-0" />
                        {note.text}
                      </span>
                    </button>
                  )}
                  {showMarker && (
                    <button
                      onClick={() => setFocused(i)}
                      className="w-6 h-6 grid place-items-center rounded-full bg-muted text-muted-foreground hover:bg-primary-100 hover:text-primary transition"
                      title="이 줄 설명 보기"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
