"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  CheckCircle2,
  ClipboardPaste,
  Circle,
  Copy,
  Download,
  ExternalLink,
  FolderPlus,
  FilePlus2,
  PenLine,
  Hammer,
  Rocket,
  TerminalSquare,
} from "lucide-react";
import { useLearn } from "./learn-store";
import { PaneFrame, SectionLabel } from "./pane-frame";
import { StudentNotes } from "./student-notes";
import { useTracePractice, TraceTarget, TraceBox } from "./trace-input";
import { FileTreeBox, OpenFileBar, TargetChips } from "./pane-boxes";
import { CommandList, ScaffoldTerminal } from "./scaffold-terminal";
import { codeMatches, groupByFolder, teacherFilesUpTo } from "./learn-utils";
import { downloadZip } from "./zip";

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
export function PaneStudent() {
  const {
    course,
    stage,
    stepIndex,
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

  /* 스텝이 바뀌면 아래 칸은 다시 터미널부터 */
  useEffect(() => {
    setShowTerminal(true);
  }, [stepIndex]);

  useEffect(
    () => () => {
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
    },
    []
  );

  const step = course && stage === "build" ? course.buildSteps[stepIndex] : undefined;
  const answers = useMemo(
    () => (course && stage === "build" ? teacherFilesUpTo(course, stepIndex) : {}),
    [course, stage, stepIndex]
  );

  const stageContent = course?.stages.find((s) => s.id === stage);
  const isTraceStage = stage !== "build" && stage !== "deploy";

  /* 따라치기 상태는 훅으로 빼서 상단 오른쪽 / 아래 칸에 나눠 쓴다 */
  const practice = useTracePractice(
    isTraceStage ? stageContent?.practiceText ?? "" : "",
    `${course?.id ?? "x"}-${stage}`,
    () => {
      if (isTraceStage) markTraced(stage);
    }
  );

  if (!course) return null;

  const noteKey = course.id;

  /* ── 1~5단계: 따라 치기 ─────────────────────────── */
  if (isTraceStage) {
    return (
      <PaneFrame
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
            <TraceBox practice={practice} onNext={goNextStage} />
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
  const current =
    files[activeFile] !== undefined ? activeFile : Object.keys(files)[0] ?? "";
  const answer = answers[current];
  const matched = answer !== undefined && codeMatches(files[current] ?? "", answer);

  /* 파일 설명은 말풍선으로 — 이름에 마우스를 올리거나 💬 를 누르면 뜬다 */
  const hints = Object.fromEntries(
    (step?.files ?? []).filter((f) => f.hint).map((f) => [f.path, f.hint!])
  );
  const badges = Object.fromEntries(
    (step?.files ?? []).map((f) => [
      f.path,
      f.action === "create" ? "새로" : "고치기",
    ])
  );
  const oks = Object.keys(files).filter(
    (p) => answers[p] !== undefined && codeMatches(files[p] ?? "", answers[p])
  );

  const linesDone = step ? scaffoldLines[step.id] ?? 0 : 0;
  const termOpen = !!step?.scaffold && showTerminal;
  const stepDone = !!step && doneSteps.includes(step.id);

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
  }

  return (
    <PaneFrame
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
                if (name?.trim())
                  createFolder(`/${name.trim().replace(/^\/+/, "")}`);
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
            <TargetChips
              title="이번에 만들 것"
              folders={expectedFolders}
              files={expectedFiles}
              doneFolders={folders}
              doneFiles={Object.keys(files)}
              onPickFile={createFile}
            />
          )}

          <FileTreeBox
            tree={tree}
            current={current}
            /* 파일을 누르면 터미널을 접고 그 파일을 아래 칸에 연다 */
            onPick={(p) => {
              setActiveFile(p);
              setShowTerminal(false);
            }}
            hints={hints}
            badges={badges}
            oks={oks}
            flash={flash}
            onDelete={deleteFile}
            emptyText="아직 파일이 없어요. 아래 터미널에 명령어를 한 줄씩 쳐 보세요."
          />

          <button
            onClick={() => step && toggleStepDone(step.id)}
            className={`shrink-0 h-9 rounded-lg flex items-center justify-center gap-1.5 text-[12px] font-semibold transition ${
              stepDone
                ? "bg-success text-white"
                : "bg-white border border-primary-200 text-primary-800 hover:border-primary"
            }`}
          >
            {stepDone ? (
              <>
                <CheckCircle2 className="w-4 h-4" aria-hidden />이 스텝 완료
              </>
            ) : (
              "이 스텝 다 했어요"
            )}
          </button>
        </>
      }
      bottom={
        termOpen ? (
          <ScaffoldTerminal
            lines={step!.scaffold!.lines}
            doneCount={linesDone}
            note={step!.scaffold!.note}
            onRun={runLine}
            onReset={() => resetScaffold(step!.id)}
            onFinish={() => setShowTerminal(false)}
          />
        ) : (
          <>
            <OpenFileBar path={current}>
              {step?.scaffold && (
                <button
                  onClick={() => setShowTerminal(true)}
                  className="shrink-0 flex items-center gap-1 text-[12px] text-muted-foreground px-1.5 py-1 rounded hover:bg-muted transition"
                >
                  <TerminalSquare className="w-3.5 h-3.5" aria-hidden />
                  터미널
                </button>
              )}

              {matched && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-success shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
                  정답과 같아요
                </span>
              )}

              {answer !== undefined && (
                <button
                  onClick={() => writeFile(current, answer)}
                  className="shrink-0 flex items-center gap-1 text-[12px] bg-muted px-2 py-1 rounded hover:bg-border transition"
                  title="이번 스텝의 정답 코드를 그대로 넣어요"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" aria-hidden />
                  붙여넣기
                </button>
              )}

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
            </OpenFileBar>

            <div className="flex-1 min-h-0">
              {current ? (
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
          </>
        )
      }
    />
  );
}
