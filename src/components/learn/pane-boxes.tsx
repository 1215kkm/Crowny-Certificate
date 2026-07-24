"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Folder, MessageSquare, Trash2 } from "lucide-react";
import { baseName } from "./learn-utils";

/**
 * 2번칸(선생)과 3번칸(학생)이 **똑같이** 쓰는 작은 상자들.
 *
 * 「내 폴더」가 좌·우 같은 자리·같은 크기로 있어야 눈이 두 화면을 바로 대조한다.
 * 그래서 트리 상자를 두 번 만들지 않고 여기 한 번만 만들어 양쪽에서 쓴다.
 */

/* ── 말풍선 ─────────────────────────────────────────── */

interface Tip {
  path: string;
  text: string;
  x: number;
  y: number;
}

/**
 * 파일 설명 말풍선.
 *
 * position: fixed 로 띄운다 — 트리 상자가 스크롤(overflow) 상자라
 * 안쪽에 그리면 잘려서 안 보인다.
 */
function HintBubble({ tip }: { tip: Tip }) {
  return (
    <div
      className="fixed z-50 pointer-events-none w-[230px] rounded-xl border border-primary-300 bg-white shadow-lg px-3 py-2"
      style={{ left: tip.x, top: tip.y }}
      role="tooltip"
    >
      {/* 말풍선 꼬리 */}
      <span
        className="absolute -top-[6px] left-4 w-[10px] h-[10px] rotate-45 bg-white border-l border-t border-primary-300"
        aria-hidden
      />
      <p className="text-[12px] leading-relaxed text-foreground break-keep">
        {tip.text}
      </p>
    </div>
  );
}

/* ── 내 폴더 ────────────────────────────────────────── */

export function FileTreeBox({
  title = "내 폴더",
  tree,
  current,
  onPick,
  hints = {},
  badges = {},
  oks = [],
  flash = [],
  onDelete,
  emptyText = "아직 파일이 없어요.",
  right,
  /** 두 칸에서 같은 크기가 되도록 기본값을 박아 둔다 */
  className = "flex-1 min-h-[120px]",
}: {
  title?: string;
  /** groupByFolder() 결과 */
  tree: { folder: string; files: string[] }[];
  /** 지금 아래 큰 칸에 열려 있는 파일 */
  current?: string;
  onPick: (path: string) => void;
  /** 파일별 말풍선 설명 — 파일 이름에 마우스를 올리면 뜬다 */
  hints?: Record<string, string>;
  /** 파일별 뱃지 (새로 / 고치기) */
  badges?: Record<string, string>;
  /** 정답과 같아진 파일 */
  oks?: string[];
  /** 방금 생긴 파일 — 잠깐 초록으로 반짝인다 */
  flash?: string[];
  /** 학생 칸에서만 — 파일 지우기 */
  onDelete?: (path: string) => void;
  emptyText?: string;
  /** 제목줄 오른쪽에 붙일 것 (파일 개수 등) */
  right?: React.ReactNode;
  className?: string;
}) {
  const [tip, setTip] = useState<Tip | null>(null);
  /** 손가락으로 쓰는 화면 — 말풍선 아이콘을 눌러 고정한다 */
  const [pinned, setPinned] = useState<string | null>(null);

  const show = useCallback((el: HTMLElement, path: string, text: string) => {
    const r = el.getBoundingClientRect();
    setTip({
      path,
      text,
      x: Math.min(Math.max(8, r.left), window.innerWidth - 238),
      y: r.bottom + 8,
    });
  }, []);

  /* 스크롤하면 말풍선만 남아 떠다니므로 닫는다 */
  useEffect(() => {
    if (!tip) return;
    const close = () => {
      setTip(null);
      setPinned(null);
    };
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [tip]);

  const isEmpty = tree.every((t) => t.files.length === 0);

  return (
    <div
      className={`flex flex-col rounded-lg bg-white border border-primary-200 overflow-hidden ${className}`}
    >
      <div className="shrink-0 flex items-center gap-1.5 px-2.5 pt-1.5 pb-1">
        <span className="text-[11px] font-bold text-primary-800">{title}</span>
        {right}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-1.5 pb-1.5">
        {isEmpty ? (
          <p className="px-2 py-3 text-[12px] text-muted-foreground leading-relaxed break-keep">
            {emptyText}
          </p>
        ) : (
          tree.map(({ folder, files: fs }) => (
            <div key={folder || "root"} className="mb-1">
              <div className="flex items-center gap-1 px-1.5 py-1 text-[12px] font-semibold text-muted-foreground">
                <Folder className="w-3.5 h-3.5" aria-hidden />
                {folder ? folder.replace(/^\//, "") : "src"}
              </div>

              {fs.map((p) => {
                const hint = hints[p];
                const on = current === p;
                return (
                  <div
                    key={p}
                    className={`group flex items-center gap-1 rounded px-2 py-1 ml-3 cursor-pointer transition ${
                      on ? "bg-primary text-white" : "hover:bg-muted"
                    } ${flash.includes(p) ? "learn-file-pop" : ""}`}
                    onClick={() => onPick(p)}
                  >
                    <span
                      className="text-[13px] truncate flex-1"
                      onMouseEnter={(e) =>
                        hint && show(e.currentTarget.parentElement!, p, hint)
                      }
                      onMouseLeave={() => {
                        if (pinned !== p) setTip(null);
                      }}
                    >
                      {baseName(p)}
                    </span>

                    {hint && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (pinned === p) {
                            setPinned(null);
                            setTip(null);
                          } else {
                            setPinned(p);
                            show(
                              e.currentTarget.parentElement as HTMLElement,
                              p,
                              hint
                            );
                          }
                        }}
                        className={`shrink-0 transition ${
                          on
                            ? "text-white/90"
                            : pinned === p
                              ? "text-primary"
                              : "text-primary-400 hover:text-primary"
                        }`}
                        aria-label={`${baseName(p)} 설명 보기`}
                        title="설명 보기"
                      >
                        <MessageSquare className="w-3.5 h-3.5" aria-hidden />
                      </button>
                    )}

                    {badges[p] && (
                      <span
                        className={`shrink-0 text-[10px] px-1 py-0.5 rounded ${
                          on
                            ? "bg-white/25 text-white"
                            : badges[p] === "새로"
                              ? "bg-success/15 text-success"
                              : "bg-accent/15 text-accent-dark"
                        }`}
                      >
                        {badges[p]}
                      </span>
                    )}

                    {oks.includes(p) && (
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 ${
                          on ? "text-white" : "text-success"
                        }`}
                        aria-hidden
                      />
                    )}

                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`${baseName(p)} 파일을 지울까요?`))
                            onDelete(p);
                        }}
                        className="opacity-0 group-hover:opacity-60 hover:!opacity-100 shrink-0"
                        aria-label={`${baseName(p)} 삭제`}
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {tip && <HintBubble tip={tip} />}
    </div>
  );
}

/* ── 이번에 만들 것 ─────────────────────────────────── */

/**
 * 명령어로 만드는 스텝이 아닐 때 「내 폴더」 위에 오는 상자.
 * 선생 칸과 학생 칸이 같은 높이가 되도록 생김새를 하나로 맞춘다.
 */
export function TargetChips({
  title,
  folders,
  files,
  doneFolders = [],
  doneFiles = [],
  onPickFile,
}: {
  title: string;
  folders: string[];
  files: string[];
  doneFolders?: string[];
  doneFiles?: string[];
  /** 학생 칸에서만 — 누르면 그 파일이 생긴다 */
  onPickFile?: (path: string) => void;
}) {
  return (
    <div className="shrink-0 rounded-lg bg-white border border-primary-200 px-2.5 py-2">
      <div className="text-[11px] font-bold text-primary-800 mb-1">{title}</div>
      <div className="flex flex-wrap gap-1">
        {folders.map((f) => (
          <span
            key={f}
            className={`text-[11px] px-1.5 py-0.5 rounded ${
              doneFolders.includes(f)
                ? "bg-success/15 text-success"
                : "bg-primary-50 text-primary-800 border border-primary-200"
            }`}
          >
            📁 {f.replace(/^\//, "")}
          </span>
        ))}
        {files.map((p) =>
          onPickFile ? (
            <button
              key={p}
              onClick={() => onPickFile(p)}
              className={`text-[11px] px-1.5 py-0.5 rounded transition ${
                doneFiles.includes(p)
                  ? "bg-success/15 text-success"
                  : "bg-primary-50 text-primary-800 border border-primary-200 hover:bg-primary-100"
              }`}
            >
              📄 {baseName(p)}
            </button>
          ) : (
            <span
              key={p}
              className={`text-[11px] px-1.5 py-0.5 rounded ${
                doneFiles.includes(p)
                  ? "bg-success/15 text-success"
                  : "bg-primary-50 text-primary-800 border border-primary-200"
              }`}
            >
              📄 {baseName(p)}
            </span>
          )
        )}
      </div>
    </div>
  );
}

/**
 * 아래 큰 칸의 머리줄 — 열린 파일 이름 하나만 보여준다.
 * 선생 칸도 파일 탭 대신 이걸 써서 학생 칸과 같은 모양이 된다.
 */
export function OpenFileBar({
  path,
  children,
}: {
  path: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="shrink-0 flex items-center gap-1.5 px-2 py-1.5 border-b border-border h-9">
      <span
        className="text-[12px] font-semibold truncate flex-1"
        title={path || undefined}
      >
        {path || "파일을 골라 주세요"}
      </span>
      {children}
    </div>
  );
}
