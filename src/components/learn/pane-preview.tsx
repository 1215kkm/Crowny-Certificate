"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ExternalLink, Monitor, Smartphone } from "lucide-react";
import { useLearn } from "./learn-store";

const SandboxPreview = dynamic(() => import("./sandbox-preview"), {
  ssr: false,
  loading: () => (
    <div className="h-full grid place-items-center text-[13px] text-muted-foreground">
      실행 준비 중…
    </div>
  ),
});

/** 코드를 칠 때마다 다시 빌드하면 느려서, 잠깐 멈췄을 때만 반영한다 */
const DEBOUNCE_MS = 600;

/**
 * 4번칸 — 내 코드가 실제로 돌아가는 미리보기.
 * 「새 창으로 열기」를 누르면 /learn/preview 가 열리고, 코드를 고칠 때마다 같이 바뀐다.
 */
export function PanePreview() {
  const { files, course } = useLearn();
  const [debounced, setDebounced] = useState(files);
  const [phone, setPhone] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(files), DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [files]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      {/* 2·3번칸 머리줄(h-11)과 같은 높이 — 네 칸의 가로줄이 맞아야 덜 어지럽다 */}
      <div className="shrink-0 h-11 px-3 border-b border-border flex items-center gap-2">
        <span className="text-[14px] font-bold">미리보기</span>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setPhone(false)}
            className={`p-1.5 rounded transition ${
              !phone ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
            }`}
            aria-label="넓게 보기"
            title="넓게 보기"
          >
            <Monitor className="w-4 h-4" aria-hidden />
          </button>
          <button
            onClick={() => setPhone(true)}
            className={`p-1.5 rounded transition ${
              phone ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
            }`}
            aria-label="폰 크기로 보기"
            title="폰 크기로 보기"
          >
            <Smartphone className="w-4 h-4" aria-hidden />
          </button>

          <a
            href="/learn/preview"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 flex items-center gap-1 bg-gradient-brand text-white px-2.5 py-1.5 rounded-md text-[12px] font-semibold hover:opacity-90 transition"
          >
            새 창
            <ExternalLink className="w-3.5 h-3.5" aria-hidden />
          </a>
        </div>
      </div>

      {/* 아직 프로젝트를 안 만들었으면 실행할 게 없다 — 빈 Sandpack 을 띄우면
          템플릿 기본 화면이 나와서 "내가 안 만들었는데 왜 뜨지?" 로 헷갈린다 */}
      {Object.keys(debounced).length === 0 ? (
        <div className="flex-1 min-h-0 grid place-items-center px-6 text-center">
          <div>
            <p className="text-[14px] font-semibold">아직 만든 게 없어요</p>
            <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed break-keep">
              「내 차례」 칸에서 명령어를 실행해
              <br />
              프로젝트를 먼저 만들어 주세요.
            </p>
          </div>
        </div>
      ) : (
      <div className="flex-1 min-h-0 bg-muted/40 grid place-items-center overflow-hidden">
        <div
          className={
            phone
              ? "w-[320px] max-w-full h-full max-h-[640px] my-2 rounded-2xl border-4 border-foreground/80 overflow-hidden bg-white"
              : "w-full h-full"
          }
        >
          <SandboxPreview
            files={debounced}
            template={course?.template ?? "react"}
            dependencies={course?.dependencies}
          />
        </div>
      </div>
      )}
    </div>
  );
}
