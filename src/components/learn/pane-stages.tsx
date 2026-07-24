"use client";

import {
  BookOpen,
  Check,
  ChevronRight,
  Lock,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { TRACKS, STAGE_ORDER, type StageId } from "@/data/learn";
import { useLearn, useProgress } from "./learn-store";

/**
 * 1번칸 — 주제 선택 + 학습 목차(7단계).
 * 주제를 누르면 바로 아래에 그 주제의 목차가 펼쳐진다.
 */
export function PaneStages({ onPick }: { onPick?: () => void }) {
  const {
    trackId,
    courseId,
    course,
    stage,
    setCourse,
    setStage,
    tracedStages,
    doneSteps,
    doneDeploy,
    resetCourse,
  } = useLearn();
  const { percent } = useProgress();

  const track = TRACKS.find((t) => t.id === trackId);

  function stageDone(id: StageId): boolean {
    if (id === "build") {
      return (
        !!course && course.buildSteps.length > 0 &&
        doneSteps.length >= course.buildSteps.length
      );
    }
    if (id === "deploy") {
      return (
        !!course && course.deploySteps.length > 0 &&
        doneDeploy.length >= course.deploySteps.length
      );
    }
    return tracedStages.includes(id);
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      {/* 주제 선택 */}
      <div className="shrink-0 px-3 pt-3 pb-2 border-b border-border">
        <div className="flex items-center gap-1.5 text-[13px] font-bold text-muted-foreground mb-2">
          <Sparkles className="w-4 h-4 text-primary" aria-hidden />
          주제 고르기
        </div>

        {!track?.ready || track.courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-3 py-6 text-center">
            <Lock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" aria-hidden />
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {track?.label} 주제는 준비 중이에요.
              <br />
              지금은 <b className="text-primary">React</b> 를 골라 주세요.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {track.courses.map((c) => {
              const on = c.id === courseId;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setCourse(c.id);
                    onPick?.();
                  }}
                  className={`w-full text-left rounded-xl border px-3 py-2.5 transition ${
                    on
                      ? "border-primary bg-primary-50"
                      : "border-border hover:border-primary-300 hover:bg-primary-50/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[15px] font-bold leading-snug break-keep ${
                        on ? "text-primary-800" : "text-foreground"
                      }`}
                    >
                      {c.title}
                    </span>
                    {on && (
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden />
                    )}
                  </div>
                  <p className="mt-1 text-[13px] text-muted-foreground leading-snug break-keep">
                    {c.subtitle}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] bg-primary-100 text-primary-800 px-1.5 py-0.5 rounded">
                      {c.level}
                    </span>
                    <span className="text-[11px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                      {c.duration}
                    </span>
                    <span className="text-[11px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                      {c.pages.length}페이지
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 학습 목차 */}
      {course && (
        <>
          <div className="shrink-0 px-3 pt-3 pb-1.5 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-primary" aria-hidden />
            <span className="text-[13px] font-bold text-muted-foreground">
              학습 목차
            </span>
            <span className="ml-auto text-[12px] font-semibold text-primary tabular-nums">
              {percent}%
            </span>
          </div>

          <div className="shrink-0 mx-3 mb-2 h-1.5 rounded-full bg-primary-100 overflow-hidden">
            <div
              className="h-full bg-gradient-brand transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 space-y-1.5">
            {STAGE_ORDER.map((id) => {
              const s = course.stages.find((x) => x.id === id);
              if (!s) return null;
              const on = stage === id;
              const finished = stageDone(id);

              return (
                <button
                  key={id}
                  onClick={() => {
                    setStage(id);
                    onPick?.();
                  }}
                  className={`w-full text-left rounded-lg border px-2.5 py-2 transition flex gap-2.5 items-start ${
                    on
                      ? "border-primary bg-primary-50"
                      : "border-transparent hover:bg-muted"
                  }`}
                >
                  <span
                    className={`shrink-0 w-6 h-6 rounded-full grid place-items-center text-[12px] font-bold ${
                      finished
                        ? "bg-success text-white"
                        : on
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {finished ? <Check className="w-3.5 h-3.5" aria-hidden /> : s.no}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`text-[14px] font-bold break-keep ${
                          on ? "text-primary-800" : "text-foreground"
                        }`}
                      >
                        {s.title}
                      </span>
                      {s.tier === "pro" && (
                        <span className="text-[10px] bg-accent text-white px-1 py-0.5 rounded">
                          유료
                        </span>
                      )}
                    </span>
                    <span className="block mt-0.5 text-[12px] text-muted-foreground leading-snug break-keep">
                      {s.summary}
                    </span>
                    {id === "build" && (
                      <span className="block mt-1 text-[11px] text-primary font-medium tabular-nums">
                        {doneSteps.length} / {course.buildSteps.length} 스텝
                      </span>
                    )}
                    {id === "deploy" && (
                      <span className="block mt-1 text-[11px] text-primary font-medium tabular-nums">
                        {doneDeploy.length} / {course.deploySteps.length} 스텝
                      </span>
                    )}
                  </span>

                  {on && (
                    <ChevronRight className="w-4 h-4 shrink-0 text-primary mt-0.5" aria-hidden />
                  )}
                </button>
              );
            })}

            <button
              onClick={() => {
                if (
                  window.confirm(
                    "처음부터 다시 시작할까요? 지금까지 친 코드는 사라져요."
                  )
                ) {
                  resetCourse();
                }
              }}
              className="mt-3 w-full flex items-center justify-center gap-1.5 text-[13px] text-muted-foreground hover:text-danger py-2 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden />
              처음부터 다시
            </button>
          </div>
        </>
      )}
    </div>
  );
}
