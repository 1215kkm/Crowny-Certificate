"use client";

import { Fragment, useMemo } from "react";
import { MessageSquare } from "lucide-react";

/**
 * 「코드 설명 보기」 — 선생님 코드에 자동으로 설명을 붙여 준다.
 *
 * 규칙 기반이라 스텝마다 손으로 안 쓰고 모든 코드에 자동 적용된다.
 *  - 줄 설명: import / export / useState / 함수 / map / onClick 등을 알아보고 한 줄 풀이
 *  - 범위 표시: return ( ... ) 와 map( ... ) 을 왼쪽 세로선으로 묶어 "이 괄호 안이 화면"임을 보여줌
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

/** return( ) 과 map( ) 범위를 찾는다. return=바깥(depth0), map=안쪽(depth1) */
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
    return `이 파일을 밖에서 쓸 수 있게 내보내는 부품 ${m[1]} 이에요. (export default = 내보내기) 여는 중괄호 { 부터 짝이 되는 } 까지가 이 함수의 몸통이에요.`;
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

export default function CodeExplain({ code }: { code: string; path?: string }) {
  const { lines, regions, notes } = useMemo(() => {
    const ls = code.replace(/\r\n/g, "\n").split("\n");
    return {
      lines: ls,
      regions: findRegions(ls),
      notes: ls.map((l) => lineNote(l)),
    };
  }, [code]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="shrink-0 flex items-center gap-3 px-3 py-1.5 border-b border-border text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-[2px] h-3 bg-primary inline-block" /> return( ) — 화면
        </span>
        <span className="flex items-center gap-1">
          <span className="w-[2px] h-3 bg-accent inline-block" /> map( ) — 목록
        </span>
        <span className="ml-auto flex items-center gap-1">
          <MessageSquare className="w-3 h-3" /> 줄 설명
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-auto py-1">
        {lines.map((line, i) => {
          const here = regions.filter((r) => i >= r.from && i <= r.to);
          const startLabels = regions
            .filter((r) => r.from === i)
            .map((r) =>
              r.kind === "screen"
                ? "이 괄호 ( ) 안이 전부 화면이에요 — 태그·스타일이 여기 들어가요."
                : "여기 ( ) 안이 목록 하나하나가 될 화면이에요."
            );
          const note = notes[i];

          return (
            <Fragment key={i}>
              <div className="flex items-stretch gap-1 px-2 font-mono text-[12.5px] leading-[1.7]">
                {/* 왼쪽 범위 세로선 (return=보라, map=분홍) */}
                <div className="flex shrink-0">
                  {[0, 1].map((d) => {
                    const reg = here.find((r) => r.depth === d);
                    return (
                      <div key={d} className="w-1.5 flex justify-center">
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
                <pre className="flex-1 m-0 whitespace-pre-wrap break-all self-start text-foreground">
                  {line || " "}
                </pre>
              </div>

              {/* 범위 라벨 + 줄 설명 — 코드 아래 들여써서 보여 준다 */}
              {startLabels.map((lb, k) => (
                <div
                  key={`lb-${k}`}
                  className="ml-8 mr-2 my-0.5 rounded px-2 py-1 text-[11.5px] leading-snug break-keep bg-primary-50 text-primary-800 border-l-2 border-primary"
                >
                  {lb}
                </div>
              ))}
              {note && (
                <div className="ml-8 mr-2 my-0.5 flex items-start gap-1 rounded px-2 py-1 text-[11.5px] leading-snug break-keep bg-muted/60 text-foreground">
                  <MessageSquare className="w-3 h-3 mt-[2px] shrink-0 text-primary" />
                  {note}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
