"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardPaste,
  CornerDownLeft,
  FilePlus2,
  RotateCcw,
  TerminalSquare,
} from "lucide-react";
import type { ScaffoldLine } from "@/data/learn";
import { baseName } from "./learn-utils";

/** 출력이 한 줄씩 뜨는 간격 — 읽을 수 있게, 지루하지 않게 */
const OUT_MS = 420;
/** 마지막 출력이 뜨고 파일이 생기기까지 */
const CREATE_MS = 500;

/** 띄어쓰기 여러 칸·대소문자는 봐준다. 명령어라 글자 자체는 맞아야 한다. */
function norm(s: string) {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

export function commandMatches(typed: string, target: string) {
  return norm(typed) === norm(target);
}

/** 친 만큼 색을 입힌다 — 맞으면 흰색, 틀리면 빨강, 아직이면 흐리게 */
function charStates(typed: string, target: string) {
  const out = Array.from(target).map((ch, i) => {
    const c = typed[i];
    if (c === undefined) return { ch, state: "todo" as const };
    return {
      ch,
      state:
        c.toLowerCase() === ch.toLowerCase() ? ("ok" as const) : ("bad" as const),
    };
  });
  // target 보다 더 친 글자도 보여 줘야 "왜 안 넘어가지?" 가 안 생긴다
  Array.from(typed)
    .slice(target.length)
    .forEach((ch) => out.push({ ch, state: "bad" as const }));
  return out;
}

/* ── 상단 오른쪽: 칠 명령어 목록 ─────────────────────── */

/**
 * 「이 네 줄을 위에서부터 한 줄씩 친다」를 눈으로 보여주는 목록.
 * 선생 칸·학생 칸이 **같은 값(doneCount)** 을 보므로 두 칸의 높이도 같다.
 */
export function CommandList({
  lines,
  doneCount,
}: {
  lines: ScaffoldLine[];
  doneCount: number;
}) {
  return (
    <div className="shrink-0 rounded-lg bg-white border border-primary-200 px-2 py-1.5">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary-800 mb-1">
        <TerminalSquare className="w-3.5 h-3.5" aria-hidden />
        한 줄씩 칠 명령어
        <span className="ml-auto tabular-nums text-primary">
          {Math.min(doneCount, lines.length)}/{lines.length}
        </span>
      </div>

      {/* 한 줄씩만 — 긴 명령어 전체는 아래 터미널에서 읽는다 */}
      <ol>
        {lines.map((l, i) => {
          const done = i < doneCount;
          const now = i === doneCount;
          return (
            <li
              key={i}
              title={l.text}
              className={`flex items-center gap-1 rounded px-1 py-[3px] ${
                now ? "bg-primary-50" : ""
              }`}
            >
              {done ? (
                <CheckCircle2
                  className="w-3 h-3 shrink-0 text-success"
                  aria-hidden
                />
              ) : now ? (
                <ChevronRight
                  className="w-3 h-3 shrink-0 text-primary animate-pulse"
                  aria-hidden
                />
              ) : (
                <Circle
                  className="w-3 h-3 shrink-0 text-muted-foreground/40"
                  aria-hidden
                />
              )}
              <code
                className={`font-mono text-[10.5px] leading-tight truncate ${
                  done
                    ? "text-muted-foreground"
                    : now
                      ? "text-primary-900 font-semibold"
                      : "text-muted-foreground/50"
                }`}
              >
                {l.text}
              </code>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ── 아래 큰 칸: 진짜 터미널처럼 ─────────────────────── */

export function ScaffoldTerminal({
  lines,
  doneCount,
  note,
  /** 학생이 한 줄을 다 치고 엔터를 눌렀을 때 — 파일을 만든다 */
  onRun,
  onReset,
  /** 선생 칸은 학생이 친 만큼 따라 보여주기만 한다 */
  readOnly = false,
  /** 다 친 뒤 「파일 열어 보기」로 넘어가기 */
  onFinish,
}: {
  lines: ScaffoldLine[];
  doneCount: number;
  /** 터미널 아래 한 줄 안내 */
  note?: string;
  onRun?: (index: number) => void;
  onReset?: () => void;
  readOnly?: boolean;
  onFinish?: () => void;
}) {
  const [typed, setTyped] = useState("");
  /** 실행 중인 줄과 지금까지 뜬 출력 줄 수 */
  const [run, setRun] = useState<{ i: number; shown: number } | null>(null);
  const [warn, setWarn] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /** 효과 안에서 최신 콜백을 쓰되, 콜백이 바뀌어도 타이머가 다시 안 돌게 */
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  const allDone = doneCount >= lines.length;
  const index = Math.min(doneCount, lines.length - 1);
  const line = lines[index];

  /* 스텝이 바뀌거나 되돌리면 치던 것도 지운다 */
  useEffect(() => {
    setTyped("");
    setRun(null);
    setWarn(false);
  }, [lines, doneCount]);

  /* 출력이 한 줄씩 뜨고 → 마지막에 파일이 생긴다 */
  useEffect(() => {
    if (!run) return;
    const target = lines[run.i];
    if (!target) return;

    if (run.shown < target.output.length) {
      const t = window.setTimeout(
        () => setRun((r) => (r ? { ...r, shown: r.shown + 1 } : r)),
        OUT_MS
      );
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => {
      onRunRef.current?.(run.i);
      setRun(null);
    }, CREATE_MS);
    return () => window.clearTimeout(t);
  }, [run, lines]);

  /* 새 줄이 뜨면 아래로 따라간다 */
  useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [run, doneCount, typed]);

  const submit = () => {
    if (run || !line) return;
    if (!commandMatches(typed, line.text)) {
      setWarn(true);
      return;
    }
    setWarn(false);
    setRun({ i: index, shown: 0 });
  };

  const chars = line ? charStates(typed, line.text) : [];

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* 터미널 화면 */}
      <div
        ref={logRef}
        className="flex-1 min-h-0 overflow-y-auto bg-[#1b1725] px-3 py-2.5 font-mono text-[12px] leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-1.5 text-white/40 text-[11px] mb-1.5">
          <TerminalSquare className="w-3.5 h-3.5" aria-hidden />
          터미널 — my-todo-app
        </div>

        {/* 지금까지 친 줄들 */}
        {lines.slice(0, doneCount).map((l, i) => (
          <TerminalEntry key={i} line={l} shown={l.output.length} finished />
        ))}

        {/* 지금 돌아가는 줄 */}
        {run && (
          <TerminalEntry
            line={lines[run.i]}
            shown={run.shown}
            finished={false}
          />
        )}

        {/* 아직 안 친 줄 — 선생 칸은 여기까지만 보여준다 */}
        {!run && !allDone && line && (
          <div className="mt-1.5">
            {/* 이 줄이 무슨 뜻인지 — 치기 전에 여기서 읽는다 */}
            <p className="text-[11px] text-white/45 leading-snug break-keep font-sans mb-1">
              # {index + 1}번째 줄 ({index + 1}/{lines.length}) — {line.does}
            </p>
            <div className="flex items-start gap-1.5">
              <span className="text-success shrink-0">$</span>
              <span className="break-all">
                {readOnly ? (
                  <>
                    <span className="text-[#d2b48c]">{line.text}</span>
                    <span className="inline-block w-[7px] h-[13px] align-[-2px] ml-0.5 bg-white/60 animate-pulse" />
                  </>
                ) : (
                  chars.map((c, i) => (
                    <span
                      key={i}
                      className={
                        c.state === "ok"
                          ? "text-white"
                          : c.state === "bad"
                            ? "bg-danger/40 text-white rounded-[2px]"
                            : "text-[#d2b48c]"
                      }
                    >
                      {c.ch}
                    </span>
                  ))
                )}
              </span>
            </div>
            {readOnly && (
              <p className="mt-1 text-[11px] text-white/40 break-keep font-sans">
                오른쪽 「내 차례」 칸에서 이 줄을 치면 여기도 같이 넘어가요.
              </p>
            )}
          </div>
        )}

        {allDone && (
          <div className="mt-2 flex items-center gap-1.5 text-success text-[12px]">
            <CheckCircle2 className="w-4 h-4" aria-hidden />
            네 줄 다 쳤어요. 앱이 켜졌습니다.
          </div>
        )}
      </div>

      {/* 치는 칸 — 학생 칸에만. 선생 칸은 다 친 뒤 「코드 보기」 버튼만 나온다 */}
      {(!readOnly || (allDone && onFinish)) && (
        <div className="shrink-0 border-t border-border">
          {!readOnly && !allDone && line && (
            <div
              className={`mx-2 mt-2 flex items-center gap-1.5 rounded-lg border px-2 py-1.5 transition ${
                warn ? "border-danger bg-danger/5" : "border-primary-200 bg-muted/40"
              }`}
            >
              <span className="font-mono text-[13px] text-success shrink-0">$</span>
              <input
                ref={inputRef}
                value={typed}
                onChange={(e) => {
                  setTyped(e.target.value);
                  setWarn(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submit();
                  }
                }}
                disabled={!!run}
                spellCheck={false}
                autoComplete="off"
                placeholder="위 검은화면(터미널창)의 연한갈색글자를 그대로 쳐보세요"
                className="flex-1 min-w-0 bg-transparent outline-none font-mono text-[12px]"
              />
              <button
                onClick={() => {
                  setTyped(line.text);
                  setWarn(false);
                  inputRef.current?.focus();
                }}
                title="치기 어려우면 눌러서 그대로 넣기"
                className="shrink-0 flex items-center gap-1 px-1.5 py-1 rounded text-[12px] text-muted-foreground hover:bg-muted transition"
              >
                <ClipboardPaste className="w-3.5 h-3.5" aria-hidden />
                붙여넣기
              </button>
              <button
                onClick={submit}
                disabled={!!run}
                className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded text-[12px] font-semibold transition ${
                  commandMatches(typed, line.text)
                    ? "bg-gradient-brand text-white hover:opacity-90"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <CornerDownLeft className="w-3.5 h-3.5" aria-hidden />
                엔터
              </button>
            </div>
          )}

          {/* 아래 한 줄 — 상황에 따라 딱 하나만 나온다 (칸이 좁아서) */}
          <div className="px-3 py-1.5 flex items-start gap-2">
            <p className="flex-1 text-[11px] leading-snug break-keep">
              {warn ? (
                <span className="text-danger">
                  아직 글자가 달라요. 검은 화면에서 <b>빨간 글자</b>를 고쳐 보세요.
                </span>
              ) : (
                <span className="text-muted-foreground">
                  {allDone
                    ? readOnly
                      ? "명령어가 만든 파일들입니다. 위 「내 폴더」에서 눌러 보세요."
                      : "파일이 다 생겼어요. 위 「내 폴더」에서 파일을 눌러 열어 보세요."
                    : note}
                </span>
              )}
            </p>

            {!readOnly && doneCount > 0 && onReset && !allDone && (
              <button
                onClick={onReset}
                className="shrink-0 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition"
              >
                <RotateCcw className="w-3 h-3" aria-hidden />
                다시 치기
              </button>
            )}

            {allDone && onFinish && (
              <button
                onClick={onFinish}
                className="shrink-0 flex items-center gap-1.5 bg-gradient-brand text-white px-3 py-1.5 rounded-md text-[12px] font-semibold hover:opacity-90 transition"
              >
                {readOnly ? "선생님 코드 보기" : "생긴 파일 열어 보기"}
                <ChevronRight className="w-3.5 h-3.5" aria-hidden />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** 명령어 한 줄 + 그 줄의 출력 + 그 줄이 만든 파일 */
function TerminalEntry({
  line,
  shown,
  finished,
}: {
  line: ScaffoldLine;
  shown: number;
  finished: boolean;
}) {
  const outDone = shown >= line.output.length;

  return (
    <div className="mt-1.5">
      <div className="flex items-start gap-1.5">
        <span className="text-success shrink-0">$</span>
        <span className="text-white break-all">{line.text}</span>
      </div>

      {line.output.slice(0, shown).map((o, i) => (
        <div
          key={i}
          className="learn-out-in pl-3 text-white/60 text-[11.5px] break-keep"
        >
          {o}
        </div>
      ))}

      {/* 설치는 진행 막대, 실행은 초록 불 — 뭐가 일어나는지 눈에 보이게 */}
      {line.effect === "install" && shown > 0 && (
        <div className="ml-3 mt-1 h-1.5 w-[70%] rounded-full bg-white/15 overflow-hidden">
          <div
            className={`h-full rounded-full bg-success transition-all duration-[1200ms] ease-out`}
            style={{ width: outDone ? "100%" : "35%" }}
          />
        </div>
      )}
      {line.effect === "serve" && outDone && (
        <div className="ml-3 mt-1 flex items-center gap-1.5 text-[11.5px] text-success">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden />
          앱이 켜진 채로 돌아가는 중
        </div>
      )}

      {/* 이 줄 때문에 생긴 파일 */}
      {outDone && line.creates && line.creates.length > 0 && (
        <div className="ml-3 mt-1.5 flex flex-wrap gap-1">
          {line.creates.map((p, i) => (
            <span
              key={p}
              className="learn-chip-in flex items-center gap-1 rounded bg-success/20 text-success px-1.5 py-0.5 text-[11px]"
              style={{ animationDelay: `${i * 160}ms` }}
            >
              <FilePlus2 className="w-3 h-3" aria-hidden />
              {baseName(p)} 생김
            </span>
          ))}
        </div>
      )}

      {outDone && !line.creates?.length && finished && (
        <div className="ml-3 mt-1 text-[11px] text-white/35">
          (이 줄은 파일을 만들지 않아요)
        </div>
      )}
    </div>
  );
}
