"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  PREVIEW_CHANNEL,
  PREVIEW_STORAGE_KEY,
} from "@/components/learn/learn-store";

const SandboxPreview = dynamic(
  () => import("@/components/learn/sandbox-preview"),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen grid place-items-center text-sm text-muted-foreground">
        실행 준비 중…
      </div>
    ),
  }
);

/**
 * 「새 창으로 열기」 전용 미리보기 화면.
 * 원래 창에서 코드를 고치면 BroadcastChannel 로 새 파일을 받아 바로 다시 그린다.
 */
export default function LearnPreviewPage() {
  const [files, setFiles] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    /* 처음 열릴 때 — 저장돼 있는 파일로 시작 */
    try {
      const raw = window.localStorage.getItem(PREVIEW_STORAGE_KEY);
      if (raw) setFiles(JSON.parse(raw));
    } catch {
      /* 무시 */
    }

    /* 원래 창에서 코드를 고치면 실시간으로 받아온다 */
    if (typeof BroadcastChannel === "undefined") return;
    const ch = new BroadcastChannel(PREVIEW_CHANNEL);
    ch.onmessage = (e) => {
      if (e.data?.type === "files") setFiles(e.data.files);
    };
    return () => ch.close();
  }, []);

  if (!files || Object.keys(files).length === 0) {
    return (
      <div className="h-screen grid place-items-center px-6 text-center">
        <div>
          <p className="text-base font-semibold">아직 보여줄 코드가 없어요.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            학습 창으로 돌아가 코드를 먼저 만들어 주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen">
      <SandboxPreview files={files} />
    </div>
  );
}
