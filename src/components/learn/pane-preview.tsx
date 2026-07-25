"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ExternalLink, Monitor, Power, Smartphone, Sparkles } from "lucide-react";
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
/** 앱이 처음 켜졌을 때 "방금 뭘 했길래 이게 뜨는지"를 한 번만 설명한다 */
const INTRO_KEY = "learn-preview-intro-seen";

export function PanePreview() {
  const { files, course, scaffoldLines } = useLearn();
  const [debounced, setDebounced] = useState(files);
  /** 기본은 모바일(폰) 크기 — 만드는 앱이 폰용이라 처음부터 폰으로 본다 */
  const [phone, setPhone] = useState(true);
  /** null = 아직 확인 전(깜빡임 방지), false = 설명 보여줄 차례, true = 봤음 */
  const [introSeen, setIntroSeen] = useState<boolean | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(files), DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [files]);

  useEffect(() => {
    try {
      setIntroSeen(localStorage.getItem(INTRO_KEY) === "1");
    } catch {
      setIntroSeen(true);
    }
  }, []);

  const dismissIntro = () => {
    setIntroSeen(true);
    try {
      localStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* 저장 못 해도 이번 세션에선 다시 안 뜬다 */
    }
  };

  const hasFiles = Object.keys(debounced).length > 0;

  /**
   * 이 코스가 `npm run dev`(serve) 를 가르치는가, 그리고 학생이 그 줄을 쳤는가.
   * 진짜 개발처럼 — dev 를 켜기 전엔 미리보기가 안 뜬다.
   */
  const { teachesServe, serverStarted } = useMemo(() => {
    let teaches = false;
    let started = false;
    for (const step of course?.buildSteps ?? []) {
      const idx =
        step.scaffold?.lines.findIndex((l) => l.effect === "serve") ?? -1;
      if (idx < 0) continue;
      teaches = true;
      if ((scaffoldLines[step.id] ?? 0) > idx) started = true;
    }
    return { teachesServe: teaches, serverStarted: started };
  }, [course, scaffoldLines]);

  /* serve 를 가르치는 코스는 dev 를 켜야, 아니면 파일만 있으면 앱이 켜진 것 */
  const appOn = hasFiles && (!teachesServe || serverStarted);
  /** 앱이 켜졌는데 아직 설명을 안 봤으면, 실행 화면 대신 설명부터 */
  const showIntro = appOn && introSeen === false;

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
      {!hasFiles ? (
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
      ) : teachesServe && !serverStarted ? (
        /* 파일은 생겼지만 아직 `npm run dev` 를 안 쳤다 — 진짜 개발처럼 앱이 꺼진 상태 */
        <div className="flex-1 min-h-0 grid place-items-center px-6 text-center">
          <div className="max-w-[280px]">
            <div className="w-12 h-12 mx-auto rounded-full bg-muted grid place-items-center">
              <Power className="w-6 h-6 text-muted-foreground" aria-hidden />
            </div>
            <p className="mt-3 text-[14px] font-semibold">앱을 아직 안 켰어요</p>
            <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed break-keep">
              파일은 다 생겼어요. 이제 터미널에서 마지막 명령어{" "}
              <b className="text-foreground font-mono">npm run dev</b> 를 치면, 여기에
              앱 화면이 켜져요.
            </p>
          </div>
        </div>
      ) : showIntro ? (
        /* 실행 화면을 보여주기 전에 "방금 뭘 했길래 이게 뜨는지" 부터 설명한다 */
        <div className="flex-1 min-h-0 grid place-items-center px-5 text-center overflow-y-auto">
          <div className="max-w-[300px] py-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary-100 grid place-items-center">
              <Sparkles className="w-6 h-6 text-primary" aria-hidden />
            </div>
            <p className="mt-3 text-[15px] font-bold text-primary-900">
              앱이 켜졌어요! 🎉
            </p>
            <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed break-keep">
              방금 터미널에서
            </p>
            <ul className="mt-1.5 text-[13px] text-left leading-relaxed break-keep space-y-1 mx-auto w-fit">
              <li>
                · <b className="text-foreground">npm create vite</b> 로 앱의 뼈대를
                만들고
              </li>
              <li>
                · <b className="text-foreground">npm run dev</b> 로 전원을 켰어요.
              </li>
            </ul>
            <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed break-keep">
              그래서 오른쪽에 앱이 <b className="text-foreground">진짜로 돌아가기</b>{" "}
              시작했어요. 아직 우리 코드를 안 짰으니, 도구가 미리 넣어 둔{" "}
              <b className="text-foreground">기본 화면</b>이 보일 거예요. 다음
              단계에서 이걸 우리 앱으로 바꿔요!
            </p>
            <button
              onClick={dismissIntro}
              className="mt-4 inline-flex items-center gap-1.5 bg-gradient-brand text-white px-4 py-2 rounded-lg text-[13px] font-semibold hover:opacity-90 transition"
            >
              실행된 화면 보기
              <span aria-hidden>→</span>
            </button>
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
