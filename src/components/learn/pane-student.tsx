"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  CheckCircle2,
  ClipboardPaste,
  ChevronRight,
  Circle,
  Copy,
  Download,
  ExternalLink,
  GitCompare,
  FolderPlus,
  FilePlus2,
  PenLine,
  Hammer,
  Rocket,
  Sparkles,
  TerminalSquare,
  X,
} from "lucide-react";
import { useLearn } from "./learn-store";
import { PaneFrame, SectionLabel } from "./pane-frame";
import { StudentNotes } from "./student-notes";
import { useTracePractice, TraceTarget, TraceBox } from "./trace-input";
import { FileTreeBox, OpenFileBar, StepFileFlow } from "./pane-boxes";
import { CommandList, ScaffoldTerminal } from "./scaffold-terminal";
import {
  baseName,
  codeMatches,
  dirName,
  groupByFolder,
  teacherFilesUpTo,
} from "./learn-utils";
import { downloadZip } from "./zip";
import CodeDiff from "./code-diff";

const CodeEditor = dynamic(() => import("./code-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-full grid place-items-center text-[13px] text-muted-foreground">
      에디터 불러오는 중…
    </div>
  ),
});

/**
 * 3번칸 — 학생(실습).
 *
 * 2번칸(선생)과 **똑같은 뼈대**(PaneFrame)를 쓴다. 같은 자리에 같은 성격의 것이 온다.
 *   상단 왼쪽  : 선생은 설명   → 학생은 메모장
 *   상단 오른쪽: 선생은 만드는 것 → 학생은 내 폴더 / 따라 칠 문장
 *   아래 큰 칸 : 선생은 정답 코드 → 학생은 내가 치는 에디터
 */
export function PaneStudent({ wide = false }: { wide?: boolean } = {}) {
  const {
    course,
    stage,
    stepIndex,
    setStepIndex,
    files,
    folders,
    activeFile,
    setActiveFile,
    writeFile,
    createFile,
    createFolder,
    deleteFile,
    markTraced,
    doneSteps,
    toggleStepDone,
    scaffoldLines,
    runScaffoldLine,
    resetScaffold,
    doneDeploy,
    toggleDeployDone,
    goNextStage,
  } = useLearn();

  const [copied, setCopied] = useState(false);
  /** 명령어 스텝에서 아래 큰 칸에 터미널을 보여줄지 */
  const [showTerminal, setShowTerminal] = useState(true);
  /** 방금 생긴 파일 — 「내 폴더」에서 잠깐 반짝인다 */
  const [flash, setFlash] = useState<string[]>([]);
  const flashTimer = useRef<number | null>(null);
  /** 명령어 한 줄을 칠 때마다 「내 폴더」 옆에 뜨는 설명 말풍선 */
  const [bubble, setBubble] = useState<string | null>(null);
  const bubbleTimer = useRef<number | null>(null);
  /** 「내 폴더」 상자 — 말풍선을 그 왼쪽에 fixed 로 붙이려고 위치를 잰다 */
  const folderWrapRef = useRef<HTMLDivElement>(null);
  const [bubblePos, setBubblePos] = useState<{ top: number; left: number } | null>(
    null
  );
  /** 방금 만든/고른 폴더 — 「내 폴더」에서 선택 표시로 강조 (파일 만들 곳이 헷갈리지 않게) */
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>(
    undefined
  );
  /** 비교 모드 — 켜면 편집창 대신 선생님 코드와의 차이(diff)를 보여준다 */
  const [compare, setCompare] = useState(false);
  /** 다음 버튼을 눌렀는데 아직 미완성일 때 — 값이 올라갈 때마다 안 된 것을 흔든다 */
  const [shakeN, setShakeN] = useState(0);

  /* 스텝이 바뀌면 아래 칸은 다시 터미널부터, 말풍선·폴더 선택·비교도 초기화 */
  useEffect(() => {
    setShowTerminal(true);
    setBubble(null);
    setSelectedFolder(undefined);
    setCompare(false);
  }, [stepIndex]);

  useEffect(
    () => () => {
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
      if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current);
    },
    []
  );

  /* 말풍선을 「내 폴더」 왼쪽에 두려고 폴더 상자의 화면 위치를 잰다.
     topRight 은 overflow 상자라 안에 그리면 잘려서, fixed 로 바깥에 그린다. */
  useEffect(() => {
    if (!bubble) {
      setBubblePos(null);
      return;
    }
    const measure = () => {
      const el = folderWrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setBubblePos({ top: r.top + 6, left: r.left });
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [bubble]);

  const step = course && stage === "build" ? course.buildSteps[stepIndex] : undefined;
  const answers = useMemo(
    () => (course && stage === "build" ? teacherFilesUpTo(course, stepIndex) : {}),
    [course, stage, stepIndex]
  );

  const stageContent = course?.stages.find((s) => s.id === stage);
  const isTraceStage = stage !== "build" && stage !== "deploy";

  /* 따라치기 상태는 훅으로 빼서 상단 오른쪽 / 아래 칸에 나눠 쓴다.
     진행률은 「다음 진행하기」를 눌러야 채워진다(아래 onNext). 타이핑 70% 만으로
     자동으로 차면 "아직 안 눌렀는데 왜 다 찼지?" 로 헷갈린다. */
  const practice = useTracePractice(
    isTraceStage ? stageContent?.practiceText ?? "" : "",
    `${course?.id ?? "x"}-${stage}`,
    () => {
      // 따라 칠 문장이 없는 읽기 전용 단계만 방문 즉시 완료로 친다
      if (isTraceStage && !stageContent?.practiceText) markTraced(stage);
    }
  );

  if (!course) return null;

  const noteKey = course.id;

  /* ── 1~5단계: 따라 치기 ─────────────────────────── */
  if (isTraceStage) {
    return (
      <PaneFrame
        wide={wide}
        header={
          <>
            <PenLine className="w-4 h-4 text-primary-800 shrink-0" aria-hidden />
            <span className="text-[14px] font-bold text-primary-900 truncate">
              내 차례 — 따라 쓰기
            </span>
          </>
        }
        topLeft={<StudentNotes storageKey={noteKey} />}
        topRight={
          stageContent?.practiceText ? (
            <TraceTarget practice={practice} label={stageContent.practiceLabel} />
          ) : (
            <div className="rounded-lg bg-white border border-primary-200 px-3 py-4 text-center">
              <p className="text-[13px] text-muted-foreground leading-relaxed break-keep">
                이 단계는 읽기만 하면 돼요.
              </p>
            </div>
          )
        }
        bottom={
          stageContent?.practiceText ? (
            <TraceBox
              practice={practice}
              /* 여기서 완료 표시 — 버튼을 눌러야 진행률이 찬다 */
              onNext={() => {
                markTraced(stage);
                goNextStage();
              }}
            />
          ) : (
            <div className="h-full grid place-items-center px-6 text-center">
              <p className="text-[13px] text-muted-foreground break-keep">
                다음 단계로 넘어가세요.
              </p>
            </div>
          )
        }
      />
    );
  }

  /* ── 7단계: 배포 체크리스트 ──────────────────────── */
  if (stage === "deploy") {
    return (
      <PaneFrame
        wide={wide}
        header={
          <>
            <Rocket className="w-4 h-4 text-primary-800 shrink-0" aria-hidden />
            <span className="text-[14px] font-bold text-primary-900 truncate">
              내 차례 — 배포하기
            </span>
            <button
              onClick={() => downloadZip(files, "my-todo-app.zip")}
              className="ml-auto shrink-0 flex items-center gap-1.5 bg-primary text-white px-2.5 py-1.5 rounded-md text-[12px] font-semibold hover:bg-primary-dark transition"
            >
              <Download className="w-3.5 h-3.5" aria-hidden />
              코드 내려받기
            </button>
          </>
        }
        topLeft={<StudentNotes storageKey={noteKey} />}
        topRight={
          <div className="rounded-lg bg-white border border-primary-200 px-3 py-2.5">
            <div className="text-[12px] font-bold text-primary-800">진행 상황</div>
            <p className="mt-1.5 text-[13px] leading-relaxed break-keep">
              {doneDeploy.length} / {course.deploySteps.length} 단계 완료
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-primary-100 overflow-hidden">
              <div
                className="h-full bg-gradient-brand transition-all duration-500"
                style={{
                  width: `${
                    course.deploySteps.length === 0
                      ? 0
                      : Math.round(
                          (doneDeploy.length / course.deploySteps.length) * 100
                        )
                  }%`,
                }}
              />
            </div>
            <p className="mt-2 pt-2 border-t border-border text-[12px] text-muted-foreground leading-relaxed break-keep">
              아래 카드를 위에서부터 하나씩 눌러 가며 따라 하세요.
            </p>
          </div>
        }
        bottom={
          <>
            <SectionLabel>따라서 해 보기</SectionLabel>
            <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 space-y-2.5">
              {course.deploySteps.map((d) => {
                const done = doneDeploy.includes(d.id);
                return (
                  <div
                    key={d.id}
                    className={`rounded-xl border px-3 py-3 ${
                      done ? "border-success bg-success/5" : "border-border bg-white"
                    }`}
                  >
                    <button
                      onClick={() => toggleDeployDone(d.id)}
                      className="flex items-start gap-2 w-full text-left"
                    >
                      {done ? (
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" aria-hidden />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" aria-hidden />
                      )}
                      <span className="text-[14px] font-bold break-keep">
                        {d.title}
                      </span>
                    </button>

                    <p className="mt-1.5 ml-7 text-[13px] text-muted-foreground leading-relaxed break-keep">
                      {d.why}
                    </p>

                    <ol className="mt-2 ml-7 space-y-1.5 list-decimal list-inside">
                      {d.actions.map((a, i) => (
                        <li key={i} className="text-[13px] leading-relaxed break-keep">
                          {a}
                        </li>
                      ))}
                    </ol>

                    {d.command && (
                      <div className="mt-2 ml-7">
                        <pre className="rounded-lg bg-foreground text-white text-[12px] leading-relaxed p-2.5 overflow-x-auto font-mono">
                          {d.command}
                        </pre>
                        <button
                          onClick={() => navigator.clipboard?.writeText(d.command!)}
                          className="mt-1 flex items-center gap-1 text-[12px] text-primary hover:underline"
                        >
                          <Copy className="w-3 h-3" aria-hidden />
                          명령어 복사
                        </button>
                      </div>
                    )}

                    {d.link && (
                      <a
                        href={d.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 ml-7 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline"
                      >
                        {d.link.label}
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        }
      />
    );
  }

  /* ── 6단계: 폴더 만들고 코드 치기 ────────────────── */
  const expectedFiles = step?.files.map((f) => f.path) ?? [];
  const expectedFolders = step?.createFolders ?? [];
  const tree = groupByFolder(Object.keys(files), folders);

  /** 「내 폴더」의 폴더 줄 ＋파일 버튼 — 그 폴더 안에 바로 파일을 만든다.
     전체 경로를 손으로 치지 않아도 돼서 "이 파일이 어디 들어가지?" 헷갈림이 없다. */
  const addFileToFolder = (folder: string) => {
    const suggested = expectedFiles.find(
      (p) => dirName(p) === folder && files[p] === undefined
    );
    const label = folder ? folder.replace(/^\//, "") : "src";
    const name = window.prompt(
      `「${label}」 폴더 안에 만들 파일 이름을 적어 주세요 (예: AboutPage.js)`,
      suggested ? baseName(suggested) : ""
    );
    if (!name?.trim()) return;
    const clean = name.trim().replace(/^\/+/, "");
    createFile(`${folder}/${clean}`.replace(/\/{2,}/g, "/"));
    setSelectedFolder(folder);
  };
  const current =
    files[activeFile] !== undefined ? activeFile : Object.keys(files)[0] ?? "";
  const answer = answers[current];

  /* 파일 설명은 말풍선으로 — 이름에 마우스를 올리거나 💬 를 누르면 뜬다 */
  const hints = Object.fromEntries(
    (step?.files ?? []).filter((f) => f.hint).map((f) => [f.path, f.hint!])
  );
  const oks = Object.keys(files).filter(
    (p) => answers[p] !== undefined && codeMatches(files[p] ?? "", answers[p])
  );

  const linesDone = step ? scaffoldLines[step.id] ?? 0 : 0;
  const termOpen = !!step?.scaffold && showTerminal;
  const stepDone = !!step && doneSteps.includes(step.id);

  /* 「다 했어요 다음 진행하기」 — 완료 표시 + 다음 스텝(마지막이면 배포 단계)으로 */
  const isLastStep = !!step && stepIndex >= course.buildSteps.length - 1;
  const finishStep = () => {
    if (!step) return;
    if (!stepDone) toggleStepDone(step.id);
    if (!isLastStep) setStepIndex(stepIndex + 1);
    else goNextStage();
  };
  const finishLabel = isLastStep ? "다 했어요! 배포로 가기" : "다 했어요 다음 진행하기";
  /* 버튼은 늘 눌리지만(활성), 다 안 됐으면 넘어가는 대신 안 된 것을 흔들어 짚어 준다 */
  const handleFinish = () => {
    if (stepReady) {
      finishStep();
    } else {
      setShakeN((n) => n + 1); // StepFileFlow·안내 칩을 흔든다
      if (step?.scaffold) setShowTerminal(true); // 설치 스텝은 터미널로 데려간다
    }
  };
  /* 설치 스텝은 네 줄을 다 치면, 코드 스텝은 학생 코드가 정답과 같아지면 완료. */
  const scaffoldAllDone =
    !!step?.scaffold && linesDone >= step.scaffold.lines.length;
  const codeReady =
    !!step &&
    !step.scaffold &&
    step.files.length > 0 &&
    step.files.every(
      (f) =>
        answers[f.path] !== undefined &&
        codeMatches(files[f.path] ?? "", answers[f.path])
    );
  const stepReady = !!step && (step.scaffold ? scaffoldAllDone : codeReady);

  /* 따라해야 하는 개수 / 지금까지 한 개수 — 버튼에 1/4 식으로 보여 준다.
     설치 스텝은 명령어 줄 수, 코드 스텝은 파일 수 기준. */
  const stepTotal = step
    ? step.scaffold
      ? step.scaffold.lines.length
      : step.files.length
    : 0;
  const stepDoneCount = step
    ? step.scaffold
      ? Math.min(linesDone, step.scaffold.lines.length)
      : step.files.filter(
          (f) =>
            answers[f.path] !== undefined &&
            codeMatches(files[f.path] ?? "", answers[f.path])
        ).length
    : 0;

  /* 아직 정답과 다른 파일들 — 여러 파일 스텝에서 "어느 파일이 안 됐는지" 짚어 준다.
     (styles.css 처럼 한 파일만 빼먹으면 버튼이 안 켜지던 문제 안내) */
  const unfinishedFiles =
    step && !step.scaffold
      ? step.files
          .map((f) => f.path)
          .filter(
            (p) =>
              answers[p] === undefined ||
              !codeMatches(files[p] ?? "", answers[p])
          )
      : [];

  /**
   * 명령어 한 줄을 다 쳤을 때 — **그 줄이 만드는 것만** 생긴다.
   * 파일이 생기면 「내 폴더」에서 잠깐 반짝여서 "이 줄이 이걸 만들었구나"가 보인다.
   */
  function runLine(i: number) {
    if (!step?.scaffold) return;
    const line = step.scaffold.lines[i];
    const creates = (line.creates ?? []).map((p) => ({
      path: p,
      code: step.files.find((f) => f.path === p)?.code ?? "",
    }));
    runScaffoldLine(step.id, i, creates);
    if (creates.length > 0) {
      setFlash(creates.map((c) => c.path));
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
      flashTimer.current = window.setTimeout(() => setFlash([]), 1800);
    }
    /* 이 줄이 무슨 일을 했는지 「내 폴더」 위에 말풍선으로 짚어 준다 */
    if (line.bubble) {
      setBubble(line.bubble);
      if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current);
      bubbleTimer.current = window.setTimeout(() => setBubble(null), 6000);
    }
  }

  return (
    <PaneFrame
      bottomBias
      wide={wide}
      header={
        <>
          <Hammer className="w-4 h-4 text-primary-800 shrink-0" aria-hidden />
          <span className="text-[14px] font-bold text-primary-900 truncate">
            내 차례 — 따라 만들기
          </span>
          <span className="ml-auto shrink-0 flex items-center gap-1">
            <button
              onClick={() => {
                const name = window.prompt(
                  "만들 폴더 이름을 적어 주세요 (예: pages)",
                  expectedFolders[0]?.replace(/^\//, "") ?? ""
                );
                if (name?.trim()) {
                  const path = `/${name.trim().replace(/^\/+/, "")}`;
                  createFolder(path);
                  setSelectedFolder(path); // 방금 만든 폴더를 선택 표시로
                }
              }}
              className="flex items-center gap-1 text-[12px] bg-muted text-foreground px-2 py-1 rounded hover:bg-border transition"
            >
              <FolderPlus className="w-3.5 h-3.5" aria-hidden />
              폴더
            </button>
            <button
              onClick={() => {
                const name = window.prompt(
                  "만들 파일 경로를 적어 주세요 (예: /pages/AboutPage.js)",
                  expectedFiles.find((p) => files[p] === undefined) ?? "/"
                );
                if (name?.trim()) {
                  const path = name.trim().startsWith("/")
                    ? name.trim()
                    : `/${name.trim()}`;
                  createFile(path);
                }
              }}
              className="flex items-center gap-1 text-[12px] bg-muted text-foreground px-2 py-1 rounded hover:bg-border transition"
            >
              <FilePlus2 className="w-3.5 h-3.5" aria-hidden />
              파일
            </button>
          </span>
        </>
      }
      topLeft={<StudentNotes storageKey={noteKey} />}
      topRight={
        /* 선생 칸(2번)과 **같은 순서·같은 크기**로 쌓는다.
           위 = 이번에 만들 것 / 아래 = 내 폴더 / 맨 아래 = 이 스텝 완료 */
        <>
          {step?.scaffold ? (
            <CommandList lines={step.scaffold.lines} doneCount={linesDone} />
          ) : (
            <StepFileFlow
              folders={expectedFolders}
              createdFolders={folders}
              files={step?.files ?? []}
              matched={(p) =>
                answers[p] !== undefined &&
                codeMatches(files[p] ?? "", answers[p])
              }
              current={current}
              onPick={(p) => {
                if (files[p] === undefined) createFile(p);
                else setActiveFile(p);
                setShowTerminal(false);
                setCompare(false);
              }}
              shakeSignal={shakeN}
            />
          )}

          {/* 「내 폴더」 — 말풍선은 이 상자를 재서 왼쪽에 fixed 로 띄운다(파일을 안 가리게) */}
          <div ref={folderWrapRef} className="flex-1 min-h-0 flex flex-col">
            <FileTreeBox
              tree={tree}
              /* 터미널이 열려 있을 땐 아래 칸에 파일이 열린 게 아니므로 아무것도 선택 표시하지 않는다 */
              current={termOpen ? "" : current}
              /* 파일을 누르면 터미널을 접고 그 파일을 아래 칸에 연다 */
              onPick={(p) => {
                setActiveFile(p);
                setShowTerminal(false);
              }}
              hints={hints}
              oks={oks}
              flash={flash}
              onDelete={deleteFile}
              onAddFileToFolder={addFileToFolder}
              selectedFolder={selectedFolder}
              emptyText="아직 파일이 없어요. 아래 터미널에 명령어를 한 줄씩 쳐 보세요."
            />
          </div>

          {/* 방금 친 명령어 설명 — 「내 폴더」 왼쪽에서 오른쪽 뾰족 꼬리로 폴더를 가리킨다 */}
          {bubble && bubblePos && (
            <div
              className="learn-nudge fixed z-50 w-[220px] max-w-[70vw] rounded-xl bg-success text-white pl-3 pr-7 py-2 shadow-xl"
              style={{
                top: bubblePos.top,
                left: Math.max(8, bubblePos.left - 230),
              }}
            >
              <div className="flex items-start gap-1.5">
                <Sparkles className="w-4 h-4 shrink-0 mt-[1px]" aria-hidden />
                <p className="text-[12px] font-semibold leading-snug break-keep">
                  {bubble}
                </p>
              </div>
              {/* 오른쪽 뾰족 꼬리 — 「내 폴더」를 가리킨다 */}
              <span
                className="absolute top-4 -right-[6px] w-[12px] h-[12px] rotate-45 bg-success"
                aria-hidden
              />
              <button
                onClick={() => {
                  setBubble(null);
                  if (bubbleTimer.current)
                    window.clearTimeout(bubbleTimer.current);
                }}
                className="absolute top-1 right-1 p-0.5 rounded hover:bg-white/25 transition"
                aria-label="말풍선 닫기"
              >
                <X className="w-3.5 h-3.5" aria-hidden />
              </button>
            </div>
          )}

        </>
      }
      bottom={
        /* 상단 바(터미널 버튼 포함)를 터미널 위에도 계속 보여 준다.
           파일명은 파일을 골랐을 때만, 터미널 버튼·「학생 코드」 배지는 언제나. */
        <>
          <OpenFileBar path={termOpen ? "" : current}>
            {/* 비교 모드일 때 파일명 오른쪽에 범례 */}
            {compare && !termOpen && (
              <span className="shrink-0 flex items-center gap-2 text-[11px] text-muted-foreground mr-1">
                <span className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 grid place-items-center rounded bg-danger text-white text-[10px] font-bold leading-none">
                    −
                  </span>
                  다른 줄
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 grid place-items-center rounded-full bg-success text-white text-[10px] font-bold leading-none">
                    +
                  </span>
                  빠진 줄
                </span>
              </span>
            )}

            {/* 터미널 ↔ 학생 코드 를 탭처럼 — 지금 보고 있는 쪽이 켜진 색, 다른 쪽은 연한 회색 */}
            {step?.scaffold && (
              <button
                onClick={() => setShowTerminal(true)}
                className={`shrink-0 flex items-center gap-1 text-[12px] px-2 py-1 rounded transition ${
                  termOpen
                    ? "bg-[#1b1725] text-white"
                    : "bg-muted text-muted-foreground hover:bg-border"
                }`}
              >
                <TerminalSquare className="w-3.5 h-3.5" aria-hidden />
                터미널
              </button>
            )}

            {/* 비교 — 학생 코드 왼쪽 옆. 켜면 선생님 코드와 다른/빠진 줄을 색으로 */}
            {!step?.scaffold && answer !== undefined && (
              <button
                onClick={() => {
                  setShowTerminal(false);
                  setCompare((c) => !c);
                }}
                className={`shrink-0 flex items-center gap-1 text-[12px] px-2 py-1 rounded transition ${
                  compare && !termOpen
                    ? "bg-accent text-white"
                    : "bg-muted text-muted-foreground hover:bg-border"
                }`}
                title="선생님 코드와 뭐가 다른지 비교해요"
              >
                <GitCompare className="w-3.5 h-3.5" aria-hidden />
                비교
              </button>
            )}

            {/* 선생 칸의 「선생님 코드」와 대칭 — 파일을 편집할 때 켜진다 */}
            <button
              onClick={() => {
                setShowTerminal(false);
                setCompare(false);
              }}
              className={`shrink-0 flex items-center gap-1 text-[12px] px-2 py-1 rounded transition ${
                !termOpen && !compare
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              학생 코드
            </button>

            {/* 붙여넣기·복사는 코드 스텝에서 항상 (비교 중에도 현재 파일 기준으로 동작) */}
            {!step?.scaffold && answer !== undefined && (
              <button
                onClick={() => writeFile(current, answer)}
                className="shrink-0 flex items-center gap-1 text-[12px] bg-muted px-2 py-1 rounded hover:bg-border transition"
                title="이번 스텝의 정답 코드를 그대로 넣어요"
              >
                <ClipboardPaste className="w-3.5 h-3.5" aria-hidden />
                붙여넣기
              </button>
            )}

            {!step?.scaffold && (
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(files[current] ?? "");
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1200);
                }}
                className="shrink-0 flex items-center gap-1 text-[12px] text-muted-foreground px-1.5 py-1 rounded hover:bg-muted transition"
              >
                <Copy className="w-3.5 h-3.5" aria-hidden />
                {copied ? "복사됨" : "복사"}
              </button>
            )}
          </OpenFileBar>

          <div className="flex-1 min-h-0">
            {termOpen ? (
              <ScaffoldTerminal
                lines={step!.scaffold!.lines}
                doneCount={linesDone}
                note={step!.scaffold!.note}
                onRun={runLine}
                onReset={() => resetScaffold(step!.id)}
              />
            ) : compare && current ? (
              <CodeDiff
                mine={files[current] ?? ""}
                answer={answers[current] ?? ""}
                path={current}
              />
            ) : current ? (
              <CodeEditor
                key={current}
                path={current}
                value={files[current] ?? ""}
                onChange={(next) => writeFile(current, next)}
              />
            ) : (
              <div className="h-full grid place-items-center text-[13px] text-muted-foreground">
                위에서 파일을 만들거나 골라 주세요.
              </div>
            )}
          </div>

          {/* 다음 진행 버튼 — 늘 눌리고, 번호 배지로 진행 개수(1/4)를 보여 준다.
              다 안 됐는데 누르면 넘어가는 대신 아직 안 된 파일을 흔들어 짚어 준다.
              왼쪽엔 아직 정답과 다른 파일 목록(누르면 열림). */}
          {step && (
            <div className="shrink-0 border-t border-border px-2 py-2 flex items-center gap-2 bg-white">
              {!stepReady && !step.scaffold && unfinishedFiles.length > 0 && (
                <div
                  key={shakeN}
                  className={`flex-1 min-w-0 flex items-center gap-1.5 text-[16px] overflow-x-auto ${
                    shakeN > 0 ? "learn-shake" : ""
                  }`}
                >
                  <span className="shrink-0 text-muted-foreground">
                    아직 정답과 달라요:
                  </span>
                  {unfinishedFiles.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setActiveFile(p);
                        setShowTerminal(false);
                        setCompare(false);
                      }}
                      className="shrink-0 px-1.5 py-0.5 rounded bg-danger/10 text-danger font-medium hover:bg-danger/20 transition"
                      title="이 파일을 열어 고치기"
                    >
                      {baseName(p)}
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={handleFinish}
                className={`ml-auto shrink-0 flex items-center gap-1.5 pl-1.5 pr-3 py-1.5 rounded-md text-[12px] font-semibold text-white transition ${
                  stepReady ? "bg-success hover:opacity-90" : "bg-success/60 hover:bg-success/80"
                }`}
              >
                {stepTotal > 0 && (
                  <span className="rounded bg-white/25 px-1.5 py-0.5 text-[11px] tabular-nums">
                    {stepDoneCount}/{stepTotal}
                  </span>
                )}
                {finishLabel}
                <ChevronRight className="w-4 h-4" aria-hidden />
              </button>
            </div>
          )}
        </>
      }
    />
  );
}
