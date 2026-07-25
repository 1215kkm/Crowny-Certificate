"use client";

import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { EditorView, keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { getTheme } from "@/data/learn/themes";
import { useLearn } from "./learn-store";

/** 파일 확장자로 문법 강조 언어를 고른다 */
function extensionsFor(path: string) {
  if (path.endsWith(".css")) return [css()];
  if (path.endsWith(".html")) return [html()];
  return [javascript({ jsx: true })];
}

/* ── 간단 Emmet — 태그 이름 + Tab → <태그></태그> ─────────────
 * 초보가 여는 태그·닫는 태그를 매번 손으로 치지 않게 해 준다.
 * `return` 같은 평범한 단어가 잘못 펼쳐지지 않도록, 실제로 쓰는 HTML 태그만 편다. */
const HTML_TAGS = new Set([
  "div", "span", "p", "a", "ul", "ol", "li", "button", "label", "form",
  "h1", "h2", "h3", "h4", "h5", "h6", "nav", "header", "footer", "section",
  "article", "main", "aside", "table", "thead", "tbody", "tr", "td", "th",
  "select", "option", "textarea", "strong", "em", "small", "pre", "code",
  "b", "i", "figure", "figcaption", "blockquote",
]);
/** 안에 내용이 없는 태그 — JSX 라 반드시 스스로 닫아야 한다 (<img />) */
const VOID_TAGS = new Set(["img", "input", "br", "hr", "area", "source", "col", "embed"]);

const emmetTab = Prec.highest(
  keymap.of([
    {
      key: "Tab",
      run(view) {
        const { state } = view;
        const sel = state.selection.main;
        if (!sel.empty) return false; // 선택 영역이 있으면 기본 동작에 맡긴다

        const line = state.doc.lineAt(sel.head);
        const before = line.text.slice(0, sel.head - line.from);
        const m = before.match(/([A-Za-z][A-Za-z0-9]*)$/);

        const doIndent = () => {
          view.dispatch(state.replaceSelection("  "));
          return true;
        };

        if (!m) return doIndent();
        const tag = m[1];
        if (!HTML_TAGS.has(tag.toLowerCase()) && !VOID_TAGS.has(tag.toLowerCase()))
          return doIndent();

        const start = sel.head - tag.length;
        // 이미 < 로 시작해 손으로 태그를 쓰는 중이면 펼치지 않는다
        if (start > 0 && state.doc.sliceString(start - 1, start) === "<")
          return doIndent();

        const isVoid = VOID_TAGS.has(tag.toLowerCase());
        const insert = isVoid ? `<${tag} />` : `<${tag}></${tag}>`;
        const anchor = isVoid ? start + 1 + tag.length : start + tag.length + 2;
        view.dispatch({
          changes: { from: start, to: sel.head, insert },
          selection: { anchor },
          userEvent: "input.complete",
          scrollIntoView: true,
        });
        return true;
      },
    },
  ])
);

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
      // Emmet(태그 + Tab)은 직접 치는 코드 파일에서만. CSS·읽기전용 제외
      ...(!readOnly && !path.endsWith(".css") ? [emmetTab] : []),
      // 다크 테마에서는 문법 색까지 어두운 배경용으로 바꿔야 글자가 읽힌다
      ...(isDark ? [oneDark] : []),
    ],
    [path, isDark, readOnly]
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
