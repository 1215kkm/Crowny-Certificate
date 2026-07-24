"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Palette } from "lucide-react";
import { LEARN_THEMES, getTheme } from "@/data/learn/themes";
import { useLearn } from "./learn-store";

/**
 * 상단바 테마 셀렉트.
 *
 * 기본 <select> 대신 직접 만든 드롭다운 — 각 테마의 색을 **점 세 개로 미리** 보여줘야
 * 이름만 보고 고르는 것보다 훨씬 빨리 고른다 (초등학생도 쓰는 화면).
 */
export function ThemeSelect() {
  const { themeId, setThemeId } = useLearn();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const current = getTheme(themeId);

  /* 바깥 누르면 닫기 */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    // data-keeps-keys: 설명 타이핑의 전역 키 핸들러가 이 안의 키를 가로채지 않게 한다
    <div ref={boxRef} data-keeps-keys="true" className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border hover:border-primary transition text-[12px] font-semibold"
        aria-haspopup="listbox"
        aria-expanded={open}
        title="화면 테마 바꾸기"
      >
        <Palette className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden />
        <Swatch theme={current} />
        <span className="hidden md:inline max-w-[92px] truncate">
          {current.name}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-1 z-50 w-[248px] max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-white shadow-lg py-1"
        >
          <div className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground">
            화면 테마 고르기
          </div>
          {LEARN_THEMES.map((t) => {
            const on = t.id === themeId;
            return (
              <button
                key={t.id}
                role="option"
                aria-selected={on}
                onClick={() => {
                  setThemeId(t.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left transition ${
                  on ? "bg-primary-50" : "hover:bg-muted"
                }`}
              >
                <Swatch theme={t} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold truncate">
                    {t.name}
                  </span>
                  <span className="block text-[11px] text-muted-foreground truncate">
                    {t.tagline}
                  </span>
                </span>
                {on && (
                  <Check className="w-4 h-4 shrink-0 text-primary" aria-hidden />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** 테마 색 미리보기 — 메인/서브/작업면 세 점 */
function Swatch({ theme }: { theme: (typeof LEARN_THEMES)[number] }) {
  const c = theme.colors;
  return (
    <span className="flex items-center shrink-0" aria-hidden>
      <span
        className="w-3 h-3 rounded-full border border-black/10"
        style={{ background: c.primary }}
      />
      <span
        className="w-3 h-3 rounded-full border border-black/10 -ml-1"
        style={{ background: c.secondary }}
      />
      <span
        className="w-3 h-3 rounded-full border border-black/10 -ml-1"
        style={{ background: c.workface }}
      />
    </span>
  );
}
