"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { getIdToken } from "@/lib/firebase-auth";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const type = searchParams.get("type") || "COURSE";
    const targetId = searchParams.get("targetId");

    if (!paymentKey || !orderId || !amount) {
      setStatus("error");
      setError("결제 정보가 올바르지 않습니다.");
      return;
    }

    if (!user) return;

    const confirmPayment = async () => {
      try {
        const idToken = await getIdToken();
        const res = await fetch("/api/payments/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
            type,
            targetId,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "결제 승인에 실패했습니다.");
        }

        setStatus("success");
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "결제 처리 중 오류가 발생했습니다.");
      }
    };

    confirmPayment();
  }, [searchParams, user, router]);

  if (status === "loading") {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <h1 className="text-xl font-bold mb-2">결제 승인 중...</h1>
        <p className="text-muted-foreground">잠시만 기다려주세요.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-xl font-bold mb-2">결제 실패</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link href="/payment" className="bg-primary text-white px-6 py-3 rounded-lg font-medium">
          다시 시도
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-xl font-bold mb-2">결제 완료</h1>
      <p className="text-muted-foreground mb-6">결제가 성공적으로 완료되었습니다.</p>
      <Link href="/mypage" className="bg-primary text-white px-6 py-3 rounded-lg font-medium">
        마이페이지로 이동
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-24 text-center">로딩 중...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
