"use client";

import { useEffect, useRef, useState } from "react";
import {
  SandpackProvider,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";

/** 첫 번들링에 보통 1~3초. 그동안 우리 안내 화면을 덮어 둔다. */
const FIRST_BUILD_MS = 2600;

/**
 * SandpackProvider 는 files prop 을 처음 한 번만 읽는다.
 * 학생이 코드를 고칠 때마다 다시 마운트하면 매번 통째로 번들링돼 느리므로,
 * 명령형 API(addFile/updateFile/deleteFile)로 바뀐 파일만 밀어 넣는다.
 */
function FileSync({ files }: { files: Record<string, string> }) {
  const { sandpack } = useSandpack();
  const sandpackRef = useRef(sandpack);
  sandpackRef.current = sandpack;
  /** 우리가 넣었던 경로들 — 템플릿 기본 파일(package.json 등)을 지우지 않으려고 따로 기억 */
  const ownedRef = useRef<Set<string>>(new Set(Object.keys(files)));

  useEffect(() => {
    const sp = sandpackRef.current;
    const current = sp.files;
    const changed: Record<string, string> = {};

    Object.entries(files).forEach(([path, code]) => {
      if (current[path] === undefined) {
        sp.addFile(path, code);
      } else if (current[path].code !== code) {
        changed[path] = code;
      }
      ownedRef.current.add(path);
    });

    if (Object.keys(changed).length > 0) {
      sp.updateFile(changed);
    }

    // 학생이 지운 파일 정리 (우리가 넣었던 것만)
    ownedRef.current.forEach((path) => {
      if (files[path] === undefined && current[path] !== undefined) {
        sp.deleteFile(path);
        ownedRef.current.delete(path);
      }
    });
  }, [files]);

  return null;
}

/**
 * 학생 코드를 실제로 실행해서 보여주는 미리보기.
 * 브라우저 안에서 번들링(여러 파일을 하나로 묶어 실행 가능한 형태로 만드는 일)까지 돌아간다.
 *
 * Sandpack 자체 로딩 오버레이는 번들링이 끝나도 안 걷히는 경우가 있어
 * (앱은 그 아래에서 이미 돌고 있는데 흰 화면만 보인다) globals.css 에서 감추고
 * 아래 자체 오버레이로 대체했다.
 */
export default function SandboxPreview({
  files,
  template = "react",
  dependencies,
}: {
  files: Record<string, string>;
  template?: "react" | "vanilla" | "vue" | "angular" | "static";
  dependencies?: Record<string, string>;
}) {
  const [booting, setBooting] = useState(true);
  /** 첫 마운트 때의 파일 — 이후 변경은 FileSync 가 맡는다 */
  const initialFiles = useRef(files);

  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), FIRST_BUILD_MS);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="learn-preview relative h-full min-h-0">
      <SandpackProvider
        template={template}
        files={initialFiles.current}
        customSetup={dependencies ? { dependencies } : undefined}
        options={{
          // 기본값 lazy 는 화면에 들어올 때까지 기다린다. 4분할에서는 바로 띄우는 게 낫다.
          initMode: "immediate",
          autorun: true,
          recompileMode: "delayed",
          recompileDelay: 400,
        }}
      >
        <FileSync files={files} />
        <SandpackPreview
          showOpenInCodeSandbox={false}
          showRefreshButton
          showSandpackErrorOverlay
          style={{ height: "100%", minHeight: 0 }}
        />
      </SandpackProvider>

      {booting && (
        <div className="absolute inset-0 grid place-items-center bg-white/95 pointer-events-none">
          <div className="text-center px-6">
            <div className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-primary-200 border-t-primary animate-spin" />
            <p className="text-[13px] font-semibold text-primary-800">
              만든 걸 실행하는 중…
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              처음 한 번만 조금 걸려요
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
