"use client";

/**
 * 2번칸(선생)과 3번칸(학생)이 **똑같은 뼈대**를 쓰도록 하는 공용 프레임.
 *
 *   ┌─ 머리줄 (h-11 고정) ───────────────┐
 *   │ 상단 왼쪽 (flex-1) │ 상단 오른쪽 40% │  ← flex-[1.45]
 *   ├────────────────────────────────────┤
 *   │ 아래 큰 칸                          │  ← flex-1
 *   └────────────────────────────────────┘
 *
 * 두 칸의 머리줄 높이·가로 비율·세로 비율을 여기서 한 번만 정의하므로
 * 나란히 놓았을 때 줄이 정확히 맞는다.
 *
 * 색: 1번칸(목차)은 흰색, 작업하는 2·3번칸은 연보라 바탕으로 깔아
 * 「고르는 곳」과 「작업하는 곳」이 한눈에 갈린다.
 */
export function PaneFrame({
  header,
  topLeft,
  topRight,
  bottom,
}: {
  header: React.ReactNode;
  topLeft: React.ReactNode;
  topRight: React.ReactNode;
  bottom: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full min-h-0 bg-primary-100">
      <div className="shrink-0 h-11 flex items-center gap-2 px-3 bg-primary-200 border-b border-primary-300">
        {header}
      </div>

      <div className="flex-[1.45] min-h-0 flex flex-col lg:flex-row">
        <div className="flex-1 min-h-0 m-1.5 lg:mr-0 rounded-lg bg-white overflow-hidden flex flex-col">
          {topLeft}
        </div>
        {/* 세로 flex + gap — 2·3번칸이 같은 순서로 상자를 쌓으면
            「내 폴더」가 좌·우 같은 자리·같은 크기로 온다 */}
        <div className="lg:w-[40%] shrink-0 min-h-0 overflow-y-auto px-1.5 py-1.5 flex flex-col gap-1.5">
          {topRight}
        </div>
      </div>

      <div className="flex-1 min-h-0 mx-1.5 mb-1.5 rounded-lg bg-white overflow-hidden flex flex-col">
        {bottom}
      </div>
    </div>
  );
}

/** 프레임 안 작은 영역들의 제목줄 — 두 칸에서 같은 모양으로 쓴다 */
export function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`shrink-0 px-3 pt-2 pb-1.5 text-[12px] font-bold text-primary-800 ${className}`}
    >
      {children}
    </div>
  );
}
