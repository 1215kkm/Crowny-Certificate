"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Rocket,
  Target,
  TerminalSquare,
} from "lucide-react";
import { useLearn } from "./learn-store";
import { TypingParagraphs } from "./typing-paragraphs";
import { PaneFrame, SectionLabel } from "./pane-frame";
import { FileTreeBox, OpenFileBar, TargetChips } from "./pane-boxes";
import { CommandList, ScaffoldTerminal } from "./scaffold-terminal";
import {
  buildStepParagraphs,
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

/**
 * 2번칸 — 선생(시연).
 *
 * 3번칸(학생)과 똑같은 뼈대(PaneFrame)를 쓴다.
 *   머리줄 / 상단 왼쪽 = 설명 / 상단 오른쪽 = 내가 만드는 것 / 아래 = 내 코드
 */
export function PaneTeacher({ active = true }: { active?: boolean }) {
  const { course, stage, stepIndex, doneSteps, scaffoldLines, setStepIndex } =
    useLearn();
  const [answerFile, setAnswerFile] = useState<string | null>(null);
  /** 명령어 스텝에서 아래 큰 칸에 터미널을 보여줄지 (다 치면 코드로 바뀐다) */
  const [showTerminal, setShowTerminal] = useState(true);

  /* 스텝이 바뀌면 아래 칸은 다시 터미널부터 */
  useEffect(() => {
    setShowTerminal(true);
    setAnswerFile(null);
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
    const isDone = doneSteps.includes(step.id);

    /* 파일 설명은 카드가 아니라 말풍선으로 — 파일 이름 옆 💬 를 누르거나
       이름에 마우스를 올리면 뜬다. 목록이 짧아져서 「내 폴더」가 학생 칸과 같은 자리에 온다. */
    const hints = Object.fromEntries(
      step.files.filter((f) => f.hint).map((f) => [f.path, f.hint!])
    );

    const termOpen = !!step.scaffold && showTerminal;

    /* 이 스텝을 끝냈고 다음 스텝이 남아 있으면, 「다음」 화살표를 눌러야 넘어간다.
       그걸 모르고 멈추는 사람이 많아서 화살표를 깜빡이고 말풍선으로 짚어 준다. */
    const nudgeNext =
      isDone && stepIndex < course.buildSteps.length - 1;

    return (
      <PaneFrame
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
                  className="learn-nudge absolute top-full right-0 mt-2 z-20 whitespace-nowrap rounded-lg bg-primary text-white text-[12px] font-bold px-2.5 py-1.5 shadow-lg"
                  role="status"
                >
                  <span
                    className="absolute -top-[5px] right-3 w-[9px] h-[9px] rotate-45 bg-primary"
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
            resetKey={`${course.id}-${step.id}`}
            /* 오른쪽에서 명령어를 한 줄 칠 때마다 설명도 한 단락씩 열린다 */
            advanceSignal={step.scaffold ? linesDone : undefined}
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
              current={shownFile}
              /* 파일을 누르면 터미널을 접고 그 파일의 정답 코드를 아래 칸에 연다 */
              onPick={(p) => {
                setAnswerFile(p);
                setShowTerminal(false);
              }}
              hints={hints}
              emptyText="명령어를 치면 여기에 파일이 생깁니다."
            />

            <div
              className={`shrink-0 h-9 rounded-lg flex items-center justify-center gap-1.5 text-[12px] font-semibold ${
                isDone
                  ? "bg-success/10 text-success"
                  : "bg-white border border-primary-200 text-muted-foreground"
              }`}
            >
              {isDone ? (
                <>
                  <CheckCircle2 className="w-4 h-4" aria-hidden />이 스텝 완료
                </>
              ) : (
                "따라 한 뒤 오른쪽에서 체크하세요"
              )}
            </div>
          </>
        }
        bottom={
          termOpen ? (
            <ScaffoldTerminal
              lines={step.scaffold!.lines}
              doneCount={linesDone}
              readOnly
              onFinish={() => setShowTerminal(false)}
            />
          ) : (
            <>
              <OpenFileBar path={shownFile ?? ""}>
                {step.scaffold && (
                  <button
                    onClick={() => setShowTerminal(true)}
                    className="shrink-0 flex items-center gap-1 text-[12px] text-muted-foreground px-1.5 py-1 rounded hover:bg-muted transition"
                  >
                    <TerminalSquare className="w-3.5 h-3.5" aria-hidden />
                    터미널
                  </button>
                )}
                <span className="shrink-0 text-[11px] bg-primary-100 text-primary-800 px-1.5 py-0.5 rounded">
                  선생님 코드
                </span>
              </OpenFileBar>
              <div className="flex-1 min-h-0">
                {shownFile && (
                  <CodeEditor
                    key={shownFile}
                    path={shownFile}
                    value={files[shownFile] ?? ""}
                    readOnly
                  />
                )}
              </div>
            </>
          )
        }
      />
    );
  }

  /* ── 1~5 · 7단계 ─────────────────────────────────── */
  if (!stageContent) return null;

  const isDeploy = stage === "deploy";

  return (
    <PaneFrame
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
