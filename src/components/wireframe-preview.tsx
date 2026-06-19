"use client";

import { WIREFRAME_BLOCK_LABELS, type WireframeBlock } from "@/data/grade-2-practical";

/**
 * 와이어프레임을 회색 블록 레이아웃(그레이아웃)으로 시각화한다.
 * 응시자가 이 레이아웃 구조에 맞춰 결과물을 제작하도록 안내하는 가이드.
 */
function Block({ block }: { block: WireframeBlock }) {
  const label = block.label?.trim() || WIREFRAME_BLOCK_LABELS[block.type] || block.type;
  const box = "bg-gray-200 border border-gray-300 rounded flex items-center justify-center text-[11px] text-gray-500";

  switch (block.type) {
    case "hero":
      return <div className={`${box} h-24`}>{label}</div>;
    case "band":
      return <div className={`${box} h-8`}>{label}</div>;
    case "icons":
      return (
        <div>
          <div className="text-[11px] text-gray-400 mb-1">{label}</div>
          <div className="grid grid-cols-6 gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 border border-gray-300 rounded" />
            ))}
          </div>
        </div>
      );
    case "products":
      return (
        <div>
          <div className="text-[11px] text-gray-400 mb-1">{label}</div>
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-200 border border-gray-300 rounded" />
            ))}
          </div>
        </div>
      );
    case "text":
      return (
        <div className="space-y-1.5">
          <div className="h-2.5 bg-gray-200 rounded w-3/4" />
          <div className="h-2.5 bg-gray-200 rounded w-full" />
          <div className="h-2.5 bg-gray-200 rounded w-5/6" />
        </div>
      );
    case "image":
      return <div className={`${box} h-20`}>{label}</div>;
    case "footer":
      return <div className={`${box} h-10`}>{label}</div>;
    default:
      return <div className={`${box} h-12`}>{label}</div>;
  }
}

export default function WireframePreview({
  blocks,
  className = "",
}: {
  blocks: WireframeBlock[];
  className?: string;
}) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-3 space-y-2 ${className}`}>
      {blocks.length === 0 ? (
        <div className="text-center text-xs text-gray-400 py-6">블록이 없습니다.</div>
      ) : (
        blocks.map((b, i) => <Block key={i} block={b} />)
      )}
    </div>
  );
}
