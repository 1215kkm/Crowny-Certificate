"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "@/contexts/auth-context";
import { v4 as uuidv4 } from "uuid";

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => {
      widgets: (options: { customerKey: string }) => {
        setAmount: (amount: { currency: string; value: number }) => Promise<void>;
        renderPaymentMethods: (options: { selector: string; variantKey?: string }) => Promise<void>;
        renderAgreement: (options: { selector: string; variantKey?: string }) => Promise<void>;
        requestPayment: (options: {
          orderId: string;
          orderName: string;
          successUrl: string;
          failUrl: string;
        }) => Promise<void>;
      };
    };
  }
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "course";
  const targetId = searchParams.get("targetId") || "";
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const widgetsRef = useRef<ReturnType<ReturnType<NonNullable<Window["TossPayments"]>>["widgets"]> | null>(null);

  const paymentInfo = {
    course: {
      title: "AI 기초 활용 마스터 과정",
      subtitle: "3급 수강권",
      price: 59000,
    },
    exam: {
      title: "Crowny AI 활용 자격증 3급",
      subtitle: "2026년 4월 정기시험 응시",
      price: 30000,
    },
    certificate: {
      title: "인증서 발급",
      subtitle: "디지털 인증서 (이메일)",
      price: 10000,
    },
  }[type] || { title: "결제", subtitle: "", price: 0 };

  useEffect(() => {
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
    if (!clientKey || !user) return;

    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v2/standard";
    script.onload = async () => {
      if (!window.TossPayments) return;

      const tossPayments = window.TossPayments(clientKey);
      const widgets = tossPayments.widgets({ customerKey: user.uid });

      await widgets.setAmount({ currency: "KRW", value: paymentInfo.price });
      await widgets.renderPaymentMethods({ selector: "#payment-method" });
      await widgets.renderAgreement({ selector: "#agreement" });

      widgetsRef.current = widgets;
      setWidgetReady(true);
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [user, paymentInfo.price]);

  const handlePayment = async () => {
    if (!widgetsRef.current) return;
    setLoading(true);

    try {
      const orderId = `ORDER-${uuidv4().slice(0, 8).toUpperCase()}`;
      const origin = window.location.origin;

      await widgetsRef.current.requestPayment({
        orderId,
        orderName: paymentInfo.title,
        successUrl: `${origin}/payment/success?type=${type}&targetId=${targetId}`,
        failUrl: `${origin}/payment/fail`,
      });
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">결제하기</h1>

      {/* 주문 정보 */}
      <div className="border border-border rounded-xl p-6 mb-6">
        <h2 className="font-bold mb-4">주문 정보</h2>
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">{paymentInfo.title}</div>
            <div className="text-sm text-muted-foreground">
              {paymentInfo.subtitle}
            </div>
          </div>
          <div className="text-xl font-bold text-primary">
            {paymentInfo.price.toLocaleString()}원
          </div>
        </div>
      </div>

      {/* 토스페이먼츠 결제위젯 */}
      <div className="border border-border rounded-xl p-6 mb-6">
        <h2 className="font-bold mb-4">결제 수단</h2>
        <div id="payment-method" />
      </div>

      {/* 약관 동의 (토스페이먼츠 위젯) */}
      <div className="mb-6">
        <div id="agreement" />
      </div>

      {/* 결제 요약 */}
      <div className="bg-muted rounded-xl p-6 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-muted-foreground">상품 금액</span>
          <span>{paymentInfo.price.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-muted-foreground">할인</span>
          <span>0원</span>
        </div>
        <hr className="my-3 border-border" />
        <div className="flex justify-between font-bold text-lg">
          <span>총 결제 금액</span>
          <span className="text-primary">
            {paymentInfo.price.toLocaleString()}원
          </span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading || !widgetReady}
        className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-dark transition disabled:opacity-50"
      >
        {loading
          ? "결제 처리 중..."
          : `${paymentInfo.price.toLocaleString()}원 결제하기`}
      </button>

      {!user && (
        <p className="text-center text-sm text-red-500 mt-4">
          결제하려면 먼저 로그인해주세요.
        </p>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto px-4 py-12 text-center">
          로딩 중...
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
