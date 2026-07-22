"use client";

import { useState } from "react";
import type { CertExample } from "@/lib/firestore";

/**
 * 합격 예시 1건의 상세/미리보기.
 * - htmlContent(HTML·React 결과물 코드)가 있으면 sandbox iframe으로 앱 안에서 바로 렌더링
 * - 없으면 캡쳐 이미지, 그것도 없으면 링크만 노출
 * - url(실물 주소)이 있으면 새 창으로 여는 버튼을 함께 제공
 */
export function ExampleDetail({ example }: { example: CertExample }) {
  // htmlContent가 있으면 미리보기(iframe)와 코드 보기를 토글할 수 있게 한다.
  const [showCode, setShowCode] = useState(false);
  const hasHtml = !!example.htmlContent?.trim();

  return (
    <div>
      {hasHtml ? (
        <div className="rounded-xl overflow-hidden border border-border mb-4">
          <div className="flex items-center justify-between bg-muted px-3 py-1.5 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">
              {showCode ? "코드" : "미리보기 (앱 내부 렌더링)"}
            </span>
            <button
              onClick={() => setShowCode((v) => !v)}
              className="text-xs text-primary hover:underline"
            >
              {showCode ? "미리보기 보기" : "코드 보기"}
            </button>
          </div>
          {showCode ? (
            <pre className="max-h-[50vh] overflow-auto bg-gray-900 text-gray-100 text-xs p-3 leading-relaxed">
              <code>{example.htmlContent}</code>
            </pre>
          ) : (
            <iframe
              // sandbox: 스크립트는 허용하되 same-origin은 막아 앱 세션을 보호한다.
              sandbox="allow-scripts allow-popups allow-forms"
              srcDoc={example.htmlContent}
              title={example.title}
              className="w-full h-[50vh] bg-white"
            />
          )}
        </div>
      ) : example.imageUrl ? (
        <div className="rounded-xl overflow-hidden border border-border mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={example.imageUrl} alt={example.title} className="w-full object-contain max-h-[50vh]" />
        </div>
      ) : null}

      <h4 className="text-lg font-bold mb-1">{example.title}</h4>
      {example.description && (
        <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">{example.description}</p>
      )}
      {example.url && (
        <a
          href={example.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition"
        >
          작업물 실물 보러가기 ↗
        </a>
      )}
    </div>
  );
}

/**
 * 합격 예시 목록(썸네일 그리드). 클릭 시 onSelect로 상세를 연다.
 */
export function ExampleGrid({
  examples,
  onSelect,
}: {
  examples: CertExample[];
  onSelect: (ex: CertExample) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {examples.map((ex, i) => (
        <button
          key={i}
          onClick={() => onSelect(ex)}
          className="text-left border border-border rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition"
        >
          <div className="h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
            {ex.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ex.imageUrl} alt={ex.title} className="w-full h-full object-cover" />
            ) : ex.htmlContent?.trim() ? (
              <span className="text-primary text-xs font-medium">🔎 미리보기</span>
            ) : (
              <span className="text-gray-400 text-sm">미리보기 없음</span>
            )}
          </div>
          <div className="p-3">
            <div className="font-medium text-sm truncate">{ex.title}</div>
            {ex.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ex.description}</p>}
          </div>
        </button>
      ))}
    </div>
  );
}
