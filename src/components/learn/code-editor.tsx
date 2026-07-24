"use client";

import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { EditorView } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import { getTheme } from "@/data/learn/themes";
import { useLearn } from "./learn-store";

/** 파일 확장자로 문법 강조 언어를 고른다 */
function extensionsFor(path: string) {
  if (path.endsWith(".css")) return [css()];
  if (path.endsWith(".html")) return [html()];
  return [javascript({ jsx: true })];
}

/**
 * 학생이 직접 코드를 치는 에디터 (CodeMirror 6).
 * 초등학생 기준이라 글자 크기를 키우고 줄 간격을 넉넉히 준다.
 */
const BIG_TEXT = EditorView.theme({
  "&": { fontSize: "14px", height: "100%" },
  ".cm-scroller": {
    fontFamily:
      "'D2Coding', 'Consolas', 'Menlo', 'Monaco', ui-monospace, monospace",
    lineHeight: "1.7",
  },
  ".cm-content": { padding: "10px 0" },
  ".cm-gutters": { background: "transparent", border: "none" },
});

export default function CodeEditor({
  path,
  value,
  onChange,
  readOnly = false,
}: {
  path: string;
  value: string;
  onChange?: (next: string) => void;
  readOnly?: boolean;
}) {
  const { themeId } = useLearn();
  const isDark = getTheme(themeId).dark;

  const extensions = useMemo(
    () => [
      ...extensionsFor(path),
      BIG_TEXT,
      EditorView.lineWrapping,
      // 다크 테마에서는 문법 색까지 어두운 배경용으로 바꿔야 글자가 읽힌다
      ...(isDark ? [oneDark] : []),
    ],
    [path, isDark]
  );

  return (
    <CodeMirror
      value={value}
      height="100%"
      className="learn-editor h-full"
      style={{ height: "100%" }}
      extensions={extensions}
      editable={!readOnly}
      readOnly={readOnly}
      onChange={onChange}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLine: !readOnly,
        highlightActiveLineGutter: !readOnly,
        autocompletion: false,
        searchKeymap: false,
      }}
    />
  );
}
