"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  ChevronLeft,
  ChevronRight,
  FilePlus2,
  FilePenLine,
  FolderPlus,
  GraduationCap,
  Rocket,
  Target,
} from "lucide-react";
import { useLearn } from "./learn-store";
import { TypingParagraphs } from "./typing-paragraphs";
import { PaneFrame, SectionLabel } from "./pane-frame";
import {
  buildStepParagraphs,
  baseName,
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
  const { course, stage, stepIndex, setStepIndex, toggleStepDone, doneSteps } =
    useLearn();
  const [answerFile, setAnswerFile] = useState<string | null>(null);

  if (!course) return null;

  const stageContent = course.stages.find((s) => s.id === stage);

  /* ── 6단계: 따라하기 ─────────────────────────────── */
  if (stage === "build") {
    const step = course.buildSteps[stepIndex];
    if (!step) return null;

    const files = teacherFilesUpTo(course, stepIndex);
    const folders = teacherFoldersUpTo(course, stepIndex);
    const shownFile =
      answerFile && files[answerFile] !== undefined
        ? answerFile
        : step.files[0]?.path ?? Object.keys(files)[0];
    const tree = groupByFolder(Object.keys(files), folders);
    const isDone = doneSteps.includes(step.id);

    return (
      <PaneFrame
        header={
          <>
            <GraduationCap className="w-4 h-4 text-primary-800 shrink-0" aria-hidden />
            <span className="text-[14px] font-bold text-primary-900 truncate">
              {step.title}
            </span>
            <span className="ml-auto flex items-center gap-1 shrink-0">
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
                className="p-1.5 rounded-md hover:bg-white/70 disabled:opacity-30 disabled:cursor-default"
                aria-label="다음 스텝"
              >
                <ChevronRight className="w-4 h-4" aria-hidden />
              </button>
            </span>
          </>
        }
        topLeft={
          <TypingParagraphs
            paragraphs={buildStepParagraphs(step)}
            active={active}
            resetKey={`${course.id}-${step.id}`}
          />
        }
        topRight={
          <>
            <div className="text-[12px] font-bold text-primary-800 px-1 pb-1.5">
              이번에 제가 만드는 것
            </div>

            {step.createFolders?.map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 rounded-lg bg-white border border-primary-200 px-2.5 py-2 mb-1.5"
              >
                <FolderPlus className="w-4 h-4 text-primary shrink-0" aria-hidden />
                <span className="text-[13px] font-semibold truncate">
                  {f.replace(/^\//, "")} 폴더
                </span>
                <span className="ml-auto text-[10px] bg-primary-100 text-primary-800 px-1.5 py-0.5 rounded shrink-0">
                  새 폴더
                </span>
              </div>
            ))}

            {step.files.map((f) => (
              <button
                key={f.path}
                onClick={() => setAnswerFile(f.path)}
                className={`w-full text-left flex items-start gap-2 rounded-lg border px-2.5 py-2 mb-1.5 transition ${
                  shownFile === f.path
                    ? "bg-white border-primary"
                    : "bg-white border-primary-200 hover:border-primary-400"
                }`}
              >
                {f.action === "create" ? (
                  <FilePlus2 className="w-4 h-4 text-success shrink-0 mt-0.5" aria-hidden />
                ) : (
                  <FilePenLine className="w-4 h-4 text-accent-dark shrink-0 mt-0.5" aria-hidden />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold truncate">
                    {baseName(f.path)}
                  </span>
                  <span className="block text-[11px] text-muted-foreground truncate">
                    {f.path}
                  </span>
                  {f.hint && (
                    <span className="block mt-1 text-[12px] text-primary-700 leading-snug break-keep">
                      💡 {f.hint}
                    </span>
                  )}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                    f.action === "create"
                      ? "bg-success/15 text-success"
                      : "bg-accent/15 text-accent-dark"
                  }`}
                >
                  {f.action === "create" ? "새로" : "고치기"}
                </span>
              </button>
            ))}

            <button
              onClick={() => toggleStepDone(step.id)}
              className={`mt-1 w-full rounded-lg py-2 text-[13px] font-semibold transition ${
                isDone
                  ? "bg-success text-white"
                  : "bg-white border border-primary-200 text-primary-800 hover:border-primary"
              }`}
            >
              {isDone ? "✓ 이 스텝 완료" : "이 스텝 다 했어요"}
            </button>
          </>
        }
        bottom={
          <>
            <div className="shrink-0 flex items-center gap-1 px-2 py-1.5 border-b border-border overflow-x-auto">
              <span className="text-[11px] font-bold text-primary-800 px-1 shrink-0">
                내 파일
              </span>
              {tree.map(({ files: fs }) =>
                fs.map((p) => (
                  <button
                    key={p}
                    onClick={() => setAnswerFile(p)}
                    title={p}
                    className={`shrink-0 px-2 py-1 rounded text-[12px] transition ${
                      shownFile === p
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {baseName(p)}
                  </button>
                ))
              )}
            </div>
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
