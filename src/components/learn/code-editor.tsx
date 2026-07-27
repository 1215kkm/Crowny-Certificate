"use client";

import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { EditorView, keymap, Decoration } from "@codemirror/view";
import type { DecorationSet } from "@codemirror/view";
import { Prec, StateField } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { getTheme } from "@/data/learn/themes";
import { useLearn } from "./learn-store";

/** 지정한 줄(0-index)에 클릭 가능 표시(연한 배경+손가락 커서) 클래스를 붙인다 */
function clickableLines(lines: number[]) {
  const build = (state: { doc: { lines: number; line: (n: number) => { from: number } } }) => {
    const ranges = lines
      .filter((ln) => ln + 1 <= state.doc.lines)
      .sort((a, b) => a - b)
      .map((ln) =>
        Decoration.line({ class: "learn-clickable-line" }).range(
          state.doc.line(ln + 1).from
        )
      );
    return Decoration.set(ranges, true);
  };
  return StateField.define<DecorationSet>({
    create: (state) => build(state),
    update: (value, tr) => (tr.docChanged ? build(tr.state) : value),
    provide: (f) => EditorView.decorations.from(f),
  });
}

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

/**
 * 태그 + Tab 확장 키맵을 만든다.
 * div.page → <div className="page"></div>, .page → <div className="page"></div>,
 * ul#list → <ul id="list"></ul>, h1 → <h1></h1>. (JSX 는 className, HTML 은 class)
 */
function buildEmmet(useClassName: boolean) {
  const CLASS_ATTR = useClassName ? "className" : "class";
  return Prec.highest(
    keymap.of([
      {
        key: "Tab",
        run(view) {
          const { state } = view;
          const sel = state.selection.main;
          const indent = () => {
            view.dispatch(state.replaceSelection("  "));
            return true;
          };
          if (!sel.empty) return false; // 선택 영역이 있으면 기본 동작

          const line = state.doc.lineAt(sel.head);
          const before = line.text.slice(0, sel.head - line.from);
          // 커서 앞의 축약 토큰 (태그·클래스·아이디 조합)
          const m = before.match(/[A-Za-z0-9._#-]+$/);
          if (!m) return indent();
          const abbr = m[0];
          const startCol = before.length - abbr.length;
          // 이미 < 로 태그를 손으로 쓰는 중이면 펼치지 않는다
          if (startCol > 0 && before[startCol - 1] === "<") return indent();

          const tagMatch = abbr.match(/^[A-Za-z][A-Za-z0-9]*/);
          const hasTag = !!tagMatch;
          const tag = hasTag ? tagMatch![0] : "div";
          const rest = hasTag ? abbr.slice(tagMatch![0].length) : abbr;
          const classes = [...rest.matchAll(/\.([A-Za-z0-9_-]+)/g)].map(
            (x) => x[1]
          );
          const idMatch = rest.match(/#([A-Za-z0-9_-]+)/);
          const id = idMatch ? idMatch[1] : "";

          const known =
            HTML_TAGS.has(tag.toLowerCase()) || VOID_TAGS.has(tag.toLowerCase());
          // 태그를 직접 썼는데 아는 태그가 아니면(return, todo.id 등) 손대지 않는다
          if (hasTag && !known) return indent();
          // 태그 없이 . 이나 # 만 쳤는데 클래스·아이디가 없으면 펼칠 게 없다
          if (!hasTag && classes.length === 0 && !id) return indent();

          let attrs = "";
          if (classes.length) attrs += ` ${CLASS_ATTR}="${classes.join(" ")}"`;
          if (id) attrs += ` id="${id}"`;

          const isVoid = VOID_TAGS.has(tag.toLowerCase());
          const from = sel.head - abbr.length;
          let insert: string;
          let anchor: number;
          if (isVoid) {
            insert = `<${tag}${attrs} />`;
            anchor = from + insert.length - 3; // ' />' 앞
          } else {
            const open = `<${tag}${attrs}>`;
            insert = `${open}</${tag}>`;
            anchor = from + open.length; // 여는 태그 뒤 (내용 자리)
          }
          view.dispatch({
            changes: { from, to: sel.head, insert },
            selection: { anchor },
            userEvent: "input.complete",
            scrollIntoView: true,
          });
          return true;
        },
      },
    ])
  );
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
  onCreateEditor,
  highlightLines,
}: {
  path: string;
  value: string;
  onChange?: (next: string) => void;
  readOnly?: boolean;
  /** CodeMirror 인스턴스를 바깥에 넘겨준다 (설명 말풍선 위치 계산용) */
  onCreateEditor?: (view: EditorView) => void;
  /** 이 줄들(0-index)에 클릭 가능 표시(연한 배경+손가락 커서) */
  highlightLines?: number[];
}) {
  const { themeId } = useLearn();
  const isDark = getTheme(themeId).dark;
  const highlightKey = highlightLines?.join(",") ?? "";

  const extensions = useMemo(
    () => [
      ...extensionsFor(path),
      BIG_TEXT,
      EditorView.lineWrapping,
      // Emmet(태그·클래스 + Tab)은 직접 치는 코드 파일에서만. CSS·읽기전용 제외.
      // JSX(.js)는 className, HTML 은 class 로 펼친다.
      ...(!readOnly && !path.endsWith(".css")
        ? [buildEmmet(!path.endsWith(".html"))]
        : []),
      ...(highlightLines && highlightLines.length
        ? [clickableLines(highlightLines)]
        : []),
      // 다크 테마에서는 문법 색까지 어두운 배경용으로 바꿔야 글자가 읽힌다
      ...(isDark ? [oneDark] : []),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [path, isDark, readOnly, highlightKey]
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
      onCreateEditor={(view) => onCreateEditor?.(view)}
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
