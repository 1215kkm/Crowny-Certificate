"use client";

import { useEffect, useRef, useState } from "react";
import { NotebookPen, Check } from "lucide-react";

/**
 * 3번칸 상단 왼쪽 — 학생 메모장.
 *
 * 2번칸의 같은 자리에는 선생 설명이 있다. 그 설명을 보면서
 * 「아 이건 기억해야지」 싶은 걸 바로 옆(=오른쪽 칸 같은 자리)에 적는 구조.
 * 로그인 없이 쓰므로 브라우저에만 저장한다.
 */
export function StudentNotes({ storageKey }: { storageKey: string }) {
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const key = `kaiat-note-${storageKey}`;

  useEffect(() => {
    try {
      setValue(window.localStorage.getItem(key) ?? "");
    } catch {
      setValue("");
    }
  }, [key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      return;
    }
    if (value === "") return;
    setSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 1200);
  }, [value, key]);

  useEffect(() => {
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="shrink-0 px-3 pt-2 pb-1.5 flex items-center gap-1.5">
        <NotebookPen className="w-4 h-4 text-secondary" aria-hidden />
        <span className="text-[12px] font-bold text-primary-800">내 메모장</span>
        {saved && (
          <span className="ml-auto flex items-center gap-1 text-[11px] text-success">
            <Check className="w-3 h-3" aria-hidden />
            저장됨
          </span>
        )}
      </div>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
        placeholder={
          "왼쪽 설명을 보면서 기억할 것을 적어 보세요.\n\n예)\n- export default = 밖에서 쓰게 내보내기\n- 파일 이름 첫 글자는 대문자\n- 헷갈린 것: props 가 뭐지?"
        }
        className="flex-1 min-h-0 w-full resize-none px-3 pb-3 text-[14px] leading-[1.8] outline-none placeholder:text-muted-foreground/60 break-keep bg-transparent"
      />
    </div>
  );
}
