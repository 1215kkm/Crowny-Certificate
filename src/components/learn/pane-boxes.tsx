"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  FilePlus2,
  Folder,
  Info,
  MessageSquare,
  Trash2,
} from "lucide-react";
import type { BuildStep } from "@/data/learn";
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
  oks = [],
  flash = [],
  onDelete,
  onAddFileToFolder,
  selectedFolder,
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
  /** 정답과 같아진 파일 */
  oks?: string[];
  /** 방금 생긴 파일 — 잠깐 초록으로 반짝인다 */
  flash?: string[];
  /** 학생 칸에서만 — 파일 지우기 */
  onDelete?: (path: string) => void;
  /** 학생 칸에서만 — 이 폴더 안에 파일 만들기 (folder="" 는 루트) */
  onAddFileToFolder?: (folder: string) => void;
  /** 방금 만든/고른 폴더 — 헤더를 선택 표시로 강조 (folder="" 는 src) */
  selectedFolder?: string;
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
  const root = tree.find((t) => t.folder === "");
  const subFolders = tree.filter((t) => t.folder !== "");

  /** 파일 한 줄 — 루트·하위 폴더에서 같은 모양으로 쓴다 (indent 만 다름) */
  const fileRow = (p: string, indent: string) => {
    const hint = hints[p];
    const on = current === p;
    return (
      <div
        key={p}
        className={`group flex items-center gap-1 rounded px-2 py-1 ${indent} cursor-pointer transition ${
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
                show(e.currentTarget.parentElement as HTMLElement, p, hint);
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

        {oks.includes(p) && (
          <CheckCircle2
            className={`w-3.5 h-3.5 shrink-0 ${on ? "text-white" : "text-success"}`}
            aria-hidden
          />
        )}

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`${baseName(p)} 파일을 지울까요?`)) onDelete(p);
            }}
            className="opacity-0 group-hover:opacity-60 hover:!opacity-100 shrink-0"
            aria-label={`${baseName(p)} 삭제`}
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden />
          </button>
        )}
      </div>
    );
  };

  /** 폴더 헤더 한 줄 — 방금 만든/고른 폴더면 선택 표시로 강조 */
  const folderHeader = (folder: string, label: string, indent: string) => (
    <div
      className={`flex items-center gap-1 px-1.5 py-1 ${indent} text-[12px] font-semibold rounded ${
        selectedFolder === folder
          ? "bg-primary-50 text-primary-800 ring-1 ring-primary-200"
          : "text-muted-foreground"
      }`}
    >
      <Folder className="w-3.5 h-3.5" aria-hidden />
      {label}
      {onAddFileToFolder && (
        <button
          onClick={() => onAddFileToFolder(folder)}
          className="ml-auto flex items-center gap-0.5 text-[11px] font-medium text-primary hover:text-primary-dark px-1.5 py-0.5 rounded hover:bg-primary-100 transition"
          title="이 폴더 안에 파일 만들기"
        >
          <FilePlus2 className="w-3 h-3" aria-hidden />
          파일
        </button>
      )}
    </div>
  );

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
          <div className="mb-1">
            {/* 루트 = src. 나머지 폴더는 src 안으로 들여써서 실제 구조(src/components)를 그대로 보여준다 */}
            {folderHeader("", "src", "")}
            {root?.files.map((p) => fileRow(p, "ml-4"))}
            {subFolders.map(({ folder, files: fs }) => (
              <div key={folder}>
                {folderHeader(folder, folder.replace(/^\//, ""), "ml-4")}
                {fs.map((p) => fileRow(p, "ml-8"))}
              </div>
            ))}
          </div>
        )}
      </div>

      {tip && <HintBubble tip={tip} />}
    </div>
  );
}

/* ── 준비물 안내 (설치 스텝 맨 앞) ─────────────────── */

/**
 * "아무것도 설치 안 해도 된다"는 안심 문구 + 진짜 컴퓨터에서 하려는
 * 사람을 위한 접이식 안내. 겁줘서 이탈시키지 않으려고 기본은 접어 둔다.
 */
export function PrereqCard({
  prereq,
}: {
  prereq: NonNullable<BuildStep["prereq"]>;
}) {
  return (
    <div className="shrink-0 rounded-lg border border-primary-200 bg-primary-50/60 px-2.5 py-2">
      <div className="flex items-start gap-1.5">
        <Info className="w-4 h-4 shrink-0 mt-[1px] text-primary" aria-hidden />
        <p className="text-[12px] leading-snug text-primary-900 break-keep">
          {prereq.reassure}
        </p>
      </div>

      <details className="group mt-1.5">
        <summary className="flex items-center gap-1 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-[12px] font-semibold text-primary select-none">
          <ChevronRight
            className="w-3.5 h-3.5 shrink-0 transition-transform group-open:rotate-90"
            aria-hidden
          />
          {prereq.moreTitle}
        </summary>
        <ul className="mt-1.5 space-y-1.5 pl-1">
          {prereq.more.map((m, i) => (
            <li key={i} className="text-[12px] leading-snug break-keep">
              <b className="text-foreground">{m.label}</b>{" "}
              <span className="text-muted-foreground">{m.body}</span>
            </li>
          ))}
        </ul>
      </details>
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

/* ── 이 스텝 순서 (학생 칸) ─────────────────────────── */

/**
 * 이 스텝에서 만들/고칠 것을 **순서대로** 보여 준다.
 * 폴더 → 파일 순, 각 파일은 완료(✓)·다음(← 지금)이 한눈에 보여
 * "App.js 다음엔 styles.css 구나" 하는 흐름이 잡힌다.
 */
export function StepFileFlow({
  folders = [],
  createdFolders = [],
  files,
  matched,
  current,
  onPick,
}: {
  folders?: string[];
  createdFolders?: string[];
  files: { path: string; action: "create" | "edit" }[];
  /** 이 파일이 정답과 같은가 */
  matched: (path: string) => boolean;
  current?: string;
  onPick: (path: string) => void;
}) {
  const firstUndone = files.find((f) => !matched(f.path))?.path;
  return (
    <div className="shrink-0 rounded-lg bg-white border border-primary-200 px-2.5 py-2">
      <div className="text-[11px] font-bold text-primary-800 mb-1">
        이 스텝 순서
      </div>

      {folders.map((fo) => {
        const made = createdFolders.includes(fo);
        return (
          <div
            key={fo}
            className="flex items-center gap-1.5 px-1.5 py-1 text-[12px]"
          >
            <span
              className={`shrink-0 w-4 h-4 rounded-full grid place-items-center text-[10px] font-bold ${
                made ? "bg-success text-white" : "bg-primary text-white"
              }`}
            >
              {made ? "✓" : "📁"}
            </span>
            <span
              className={
                made ? "text-muted-foreground line-through" : "font-medium"
              }
            >
              {fo.replace(/^\//, "")} 폴더 만들기
            </span>
          </div>
        );
      })}

      <ol>
        {files.map((f, i) => {
          const done = matched(f.path);
          const isNext = f.path === firstUndone;
          const on = current === f.path;
          return (
            <li key={f.path}>
              <button
                onClick={() => onPick(f.path)}
                className={`w-full flex items-center gap-1.5 text-left px-1.5 py-1 rounded transition ${
                  on ? "bg-primary-50" : "hover:bg-muted"
                }`}
              >
                <span
                  className={`shrink-0 w-4 h-4 rounded-full grid place-items-center text-[10px] font-bold ${
                    done
                      ? "bg-success text-white"
                      : isNext
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={`flex-1 truncate text-[12px] ${
                    done ? "text-muted-foreground line-through" : "font-medium"
                  }`}
                >
                  {baseName(f.path)}
                </span>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {f.action === "create" ? "새로" : "고치기"}
                </span>
                {isNext && (
                  <span className="shrink-0 text-[10px] font-bold text-primary">
                    ← 지금
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
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
