"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  MessageSquare,
  Rocket,
  Target,
  TerminalSquare,
} from "lucide-react";
import { useLearn } from "./learn-store";
import { TypingParagraphs } from "./typing-paragraphs";
import { PaneFrame, SectionLabel } from "./pane-frame";
import { FileTreeBox, OpenFileBar, PrereqCard, TargetChips } from "./pane-boxes";
import { CommandList, ScaffoldTerminal } from "./scaffold-terminal";
import {
  buildStepParagraphs,
  codeMatches,
  groupByFolder,
  teacherFilesUpTo,
  teacherFoldersUpTo,
} from "./learn-utils";

const CodeEditor = dynamic(() => import("./code-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-full grid place-items-center text-[13px] text-muted-foreground">
      에디터 불러오는 중…
    </div>
  ),
});
const CodeExplain = dynamic(() => import("./code-explain"), { ssr: false });

/**
 * 2번칸 — 선생(시연).
 *
 * 3번칸(학생)과 똑같은 뼈대(PaneFrame)를 쓴다.
 *   머리줄 / 상단 왼쪽 = 설명 / 상단 오른쪽 = 내가 만드는 것 / 아래 = 내 코드
 */
export function PaneTeacher({
  active = true,
  wide = false,
}: {
  active?: boolean;
  wide?: boolean;
}) {
  const {
    course,
    stage,
    stepIndex,
    scaffoldLines,
    setStepIndex,
    files: studentFiles,
  } = useLearn();
  const [answerFile, setAnswerFile] = useState<string | null>(null);
  /** 명령어 스텝에서 아래 큰 칸에 터미널을 보여줄지 (다 치면 코드로 바뀐다) */
  const [showTerminal, setShowTerminal] = useState(true);
  /** 코드 설명 보기 — 켜면 정답 코드에 자동 설명·괄호 범위를 붙여 보여준다 */
  const [explain, setExplain] = useState(false);

  /* 스텝이 바뀌면 아래 칸은 다시 터미널부터 */
  useEffect(() => {
    setShowTerminal(true);
    setAnswerFile(null);
    setExplain(false);
  }, [stepIndex]);

  if (!course) return null;

  const stageContent = course.stages.find((s) => s.id === stage);

  /* ── 6단계: 따라하기 ─────────────────────────────── */
  if (stage === "build") {
    const step = course.buildSteps[stepIndex];
    if (!step) return null;

    /** 학생이 지금까지 친 명령어 줄 수 — 선생 칸도 딱 그만큼만 보여준다 */
    const linesDone = scaffoldLines[step.id] ?? 0;

    /* 명령어 스텝에서는 **친 줄이 만든 파일만** 보여준다.
       미리 다 펼쳐 두면 "이 줄이 이걸 만들었구나" 가 선생 칸에서 먼저 까발려진다. */
    const allFiles = teacherFilesUpTo(course, stepIndex);
    const files = step.scaffold
      ? Object.fromEntries(
          step.scaffold.lines
            .slice(0, linesDone)
            .flatMap((l) => l.creates ?? [])
            .filter((p) => allFiles[p] !== undefined)
            .map((p) => [p, allFiles[p]])
        )
      : allFiles;

    const folders = teacherFoldersUpTo(course, stepIndex);
    const shownFile =
      answerFile && files[answerFile] !== undefined
        ? answerFile
        : /* 아직 안 생긴 파일을 열면 빈 편집기가 나온다 — 있는 것 중에서 고른다 */
          step.files.find((f) => files[f.path] !== undefined)?.path ??
          Object.keys(files)[0];
    const tree = groupByFolder(Object.keys(files), folders);

    /* 파일 설명은 카드가 아니라 말풍선으로 — 파일 이름 옆 💬 를 누르거나
       이름에 마우스를 올리면 뜬다. 목록이 짧아져서 「내 폴더」가 학생 칸과 같은 자리에 온다. */
    const hints = Object.fromEntries(
      step.files.filter((f) => f.hint).map((f) => [f.path, f.hint!])
    );

    const termOpen = !!step.scaffold && showTerminal;

    /* 스텝이 끝났나 — 명령어 스텝은 네 줄을 다 치면, 코드 스텝은 학생 코드가 정답과 같아지면 */
    const scaffoldAllDone = step.scaffold
      ? linesDone >= step.scaffold.lines.length
      : false;
    const codeReady =
      !step.scaffold &&
      step.files.length > 0 &&
      step.files.every((f) => {
        const ans = allFiles[f.path];
        return ans !== undefined && codeMatches(studentFiles[f.path] ?? "", ans);
      });
    const stepReady = step.scaffold ? scaffoldAllDone : codeReady;

    const isLastStep = stepIndex >= course.buildSteps.length - 1;

    /* 스텝을 끝냈고 다음 스텝이 남아 있으면, 「다음」 화살표를 눌러야 넘어간다.
       그걸 모르고 멈추는 사람이 많아서 화살표를 깜빡이고 말풍선으로 짚어 준다. */
    const nudgeNext = stepReady && !isLastStep;

    return (
      <PaneFrame
        bottomBias
        wide={wide}
        header={
          <>
            <GraduationCap className="w-4 h-4 text-primary-800 shrink-0" aria-hidden />
            <span className="text-[14px] font-bold text-primary-900 truncate">
              {step.title}
            </span>
            <span className="relative ml-auto flex items-center gap-1 shrink-0">
              <button
                onClick={() => setStepIndex(stepIndex - 1)}
                disabled={stepIndex === 0}
                className="p-1.5 rounded-md hover:bg-white/70 disabled:opacity-30 disabled:cursor-default"
                aria-label="이전 스텝"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden />
              </button>
              <span className="text-[12px] text-primary-800 tabular-nums px-1">
                {stepIndex + 1}/{course.buildSteps.length}
              </span>
              <button
                onClick={() => setStepIndex(stepIndex + 1)}
                disabled={stepIndex >= course.buildSteps.length - 1}
                className={`p-1.5 rounded-md hover:bg-white/70 disabled:opacity-30 disabled:cursor-default ${
                  nudgeNext
                    ? "bg-primary text-white animate-pulse ring-2 ring-primary/40"
                    : ""
                }`}
                aria-label="다음 스텝"
              >
                <ChevronRight className="w-4 h-4" aria-hidden />
              </button>

              {/* 다 한 스텝에서만 — 「여기 눌러 다음으로」 를 깜빡여 짚어 준다 */}
              {nudgeNext && (
                <span
                  className="learn-nudge absolute top-full right-0 mt-2 z-20 whitespace-nowrap rounded-lg bg-success text-white text-[12px] font-bold px-2.5 py-1.5 shadow-lg"
                  role="status"
                >
                  <span
                    className="absolute -top-[5px] right-3 w-[9px] h-[9px] rotate-45 bg-success"
                    aria-hidden
                  />
                  다음 스텝 눌러요 👆
                </span>
              )}
            </span>
          </>
        }
        topLeft={
          <TypingParagraphs
            paragraphs={buildStepParagraphs(step)}
            active={active}
            compact={wide}
            resetKey={`${course.id}-${step.id}`}
            /* 오른쪽에서 명령어를 한 줄 칠 때마다 설명도 한 단락씩 열린다 */
            advanceSignal={step.scaffold ? linesDone : undefined}
            /* 설치 스텝이면 설명 맨 끝에 「준비물」 안내를 붙인다 (초록 상자엔 넣지 않음) */
            trailing={
              step.prereq && !wide ? (
                <PrereqCard prereq={step.prereq} />
              ) : undefined
            }
          />
        }
        topRight={
          /* 학생 칸(3번)과 **같은 순서·같은 크기**로 쌓는다.
             위 = 이번에 만드는 것 / 아래 = 내 폴더 / 맨 아래 = 이 스텝 상태 */
          <>
            {step.scaffold ? (
              <CommandList lines={step.scaffold.lines} doneCount={linesDone} />
            ) : (
              <TargetChips
                title="이번에 제가 만드는 것"
                folders={step.createFolders ?? []}
                files={step.files.map((f) => f.path)}
                doneFolders={step.createFolders ?? []}
                doneFiles={step.files.map((f) => f.path)}
              />
            )}

            <FileTreeBox
              tree={tree}
              /* 터미널이 열려 있을 땐 아래 칸에 파일이 열린 게 아니므로 선택 표시하지 않는다 */
              current={termOpen ? "" : shownFile}
              /* 파일을 누르면 터미널을 접고 그 파일의 정답 코드를 아래 칸에 연다 */
              onPick={(p) => {
                setAnswerFile(p);
                setShowTerminal(false);
              }}
              hints={hints}
              emptyText="명령어를 치면 여기에 파일이 생깁니다."
            />
          </>
        }
        bottom={
          /* 상단 바(터미널 버튼 포함)를 터미널 위에도 계속 보여 준다 — 학생 칸과 같은 뼈대 */
          <>
            <OpenFileBar path={termOpen ? "" : (shownFile ?? "")}>
              {/* 터미널 ↔ 선생님 코드 를 탭처럼 — 지금 보고 있는 쪽이 켜진 색 */}
              {step.scaffold && (
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
              <button
                onClick={() => {
                  setShowTerminal(false);
                  setExplain(false);
                }}
                className={`shrink-0 flex items-center gap-1 text-[12px] px-2 py-1 rounded transition ${
                  !termOpen && !explain
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-border"
                }`}
              >
                선생님 코드
              </button>

              {/* 코드 설명 보기 — 선생님 코드 옆. 켜면 자동 설명·괄호 범위 표시 */}
              <button
                onClick={() => {
                  setShowTerminal(false);
                  setExplain((v) => !v);
                }}
                className={`shrink-0 flex items-center gap-1 text-[12px] px-2 py-1 rounded transition ${
                  explain && !termOpen
                    ? "bg-accent text-white"
                    : "bg-muted text-muted-foreground hover:bg-border"
                }`}
                title="코드에 설명과 괄호 범위를 붙여서 보여줘요"
              >
                <MessageSquare className="w-3.5 h-3.5" aria-hidden />
                설명 보기
              </button>
            </OpenFileBar>
            <div className="flex-1 min-h-0">
              {termOpen ? (
                <ScaffoldTerminal
                  lines={step.scaffold!.lines}
                  doneCount={linesDone}
                  readOnly
                />
              ) : explain && shownFile ? (
                <CodeExplain
                  key={shownFile}
                  code={files[shownFile] ?? ""}
                  path={shownFile}
                />
              ) : shownFile ? (
                <CodeEditor
                  key={shownFile}
                  path={shownFile}
                  value={files[shownFile] ?? ""}
                  readOnly
                />
              ) : null}
            </div>
          </>
        }
      />
    );
  }

  /* ── 1~5 · 7단계 ─────────────────────────────────── */
  if (!stageContent) return null;

  const isDeploy = stage === "deploy";

  return (
    <PaneFrame
      wide={wide}
      header={
        <>
          {isDeploy ? (
            <Rocket className="w-4 h-4 text-primary-800 shrink-0" aria-hidden />
          ) : (
            <GraduationCap className="w-4 h-4 text-primary-800 shrink-0" aria-hidden />
          )}
          <span className="text-[14px] font-bold text-primary-900 truncate">
            {stageContent.no}. {stageContent.title}
          </span>
        </>
      }
      topLeft={
        <TypingParagraphs
          paragraphs={stageContent.paragraphs}
          active={active}
          compact={wide}
          resetKey={`${course.id}-${stageContent.id}`}
        />
      }
      topRight={
        <div className="rounded-lg bg-white border border-primary-200 px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-primary-800">
            <Target className="w-3.5 h-3.5" aria-hidden />이 단계의 목표
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed break-keep">
            {stageContent.goal}
          </p>
          <p className="mt-2 pt-2 border-t border-border text-[12px] text-muted-foreground leading-relaxed break-keep">
            {stageContent.summary}
          </p>
        </div>
      }
      bottom={
        stageContent.cards ? (
          <>
            <SectionLabel>비교해 보기</SectionLabel>
            <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 space-y-2">
              {stageContent.cards.map((c, i) => (
                <div
                  key={i}
                  className={`rounded-xl border px-3 py-2.5 ${
                    c.picked
                      ? "border-primary bg-primary-50"
                      : "border-border bg-white"
                  }`}
                >
                  <div
                    className={`text-[14px] font-bold break-keep ${
                      c.picked ? "text-primary-800" : "text-foreground"
                    }`}
                  >
                    {c.title}
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed break-keep">
                    {c.body}
                  </p>
                  {c.note && (
                    <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground break-keep border-l-2 border-border pl-2">
                      {c.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <DecisionSummary />
        )
      }
    />
  );
}

/**
 * 비교표가 없는 단계의 아래 칸을 채우는 「지금까지 정한 것」 요약판.
 *
 * 1~5단계에서 따라 친 문장들이 여기 쌓인다. 6단계 따라하기로 넘어갈 때
 * "내가 뭘 만들기로 했더라?" 를 다시 안 올라가 보고도 확인할 수 있다.
 */
function DecisionSummary() {
  const { course, stage, tracedStages, setStage } = useLearn();
  if (!course) return null;

  const decided = course.stages.filter(
    (s) => s.no <= 5 && s.practiceText
  );

  return (
    <>
      <SectionLabel>지금까지 정한 것</SectionLabel>
      <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 space-y-2">
        {decided.map((s) => {
          const done = tracedStages.includes(s.id);
          const isCurrent = s.id === stage;
          return (
            <button
              key={s.id}
              onClick={() => setStage(s.id)}
              className={`w-full text-left rounded-xl border px-3 py-2.5 transition ${
                isCurrent
                  ? "border-primary bg-primary-50"
                  : done
                    ? "border-success/40 bg-success/5 hover:border-success"
                    : "border-border bg-white hover:border-primary-300"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-5 h-5 shrink-0 rounded-full grid place-items-center text-[11px] font-bold ${
                    done
                      ? "bg-success text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.no}
                </span>
                <span className="text-[13px] font-bold break-keep">
                  {s.title}
                </span>
              </div>
              <p
                className={`mt-1.5 text-[13px] leading-relaxed break-keep whitespace-pre-wrap ${
                  done ? "text-foreground" : "text-muted-foreground/50"
                }`}
              >
                {done ? s.practiceText : "아직 안 정했어요"}
              </p>
            </button>
          );
        })}
      </div>
    </>
  );
}
