"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function FailContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const message = searchParams.get("message") || "결제에 실패했습니다.";

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-xl font-bold mb-2">결제 실패</h1>
      <p className="text-muted-foreground mb-2">{message}</p>
      {code && (
        <p className="text-sm text-muted-foreground mb-6">오류 코드: {code}</p>
      )}
      <div className="flex gap-3 justify-center">
        <Link
          href="/payment"
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium"
        >
          다시 시도
        </Link>
        <Link
          href="/"
          className="border border-border px-6 py-3 rounded-lg font-medium"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-24 text-center">로딩 중...</div>}>
      <FailContent />
    </Suspense>
  );
}
