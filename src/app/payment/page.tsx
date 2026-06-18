"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { v4 as uuidv4 } from "uuid";
import { getDocument, type ExamDoc, type CertificateTypeDoc } from "@/lib/firestore";

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
  // 시험 목록은 id로, 일부 흐름은 targetId로 넘기므로 둘 다 허용
  const targetId = searchParams.get("id") || searchParams.get("targetId") || "";
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [infoLoading, setInfoLoading] = useState(true);
  const widgetsRef = useRef<ReturnType<ReturnType<NonNullable<Window["TossPayments"]>>["widgets"]> | null>(null);
  // 실제 가격은 관리자가 설정한 자격증 종류에서 불러온다 (하드코딩 X)
  const [paymentInfo, setPaymentInfo] = useState<{ title: string; subtitle: string; price: number; takeHref?: string }>({
    title: "결제", subtitle: "", price: 0,
  });

  // 결제 정보(제목·금액)를 Firestore에서 동적으로 로드
  useEffect(() => {
    let active = true;
    async function load() {
      setInfoLoading(true);
      try {
        if (type === "exam" && targetId) {
          const exam = await getDocument<ExamDoc>("exams", targetId);
          if (exam) {
            const ct = await getDocument<CertificateTypeDoc>("certificateTypes", exam.certificateTypeId);
            if (active) setPaymentInfo({
              title: ct?.name ?? "시험 응시",
              subtitle: `${exam.title} 응시`,
              price: ct?.price ?? 0,
              takeHref: `/exams/${targetId}/take`,
            });
            return;
          }
        }
        if (type === "certificate" && targetId) {
          const ct = await getDocument<CertificateTypeDoc>("certificateTypes", targetId);
          if (ct && active) { setPaymentInfo({ title: ct.name, subtitle: "인증서 발급", price: ct.certPrice ?? 0 }); return; }
        }
        if (type === "course" && targetId) {
          const ct = await getDocument<CertificateTypeDoc>("certificateTypes", targetId);
          if (ct && active) { setPaymentInfo({ title: ct.name, subtitle: "강의 수강", price: ct.coursePrice ?? 0 }); return; }
        }
        if (active) setPaymentInfo({ title: "결제", subtitle: "", price: 0 });
      } catch {
        if (active) setPaymentInfo({ title: "결제", subtitle: "", price: 0 });
      } finally {
        if (active) setInfoLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [type, targetId]);

  useEffect(() => {
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
    // 무료(0원)이거나 정보 로딩 중이면 결제 위젯을 띄우지 않는다
    if (!clientKey || !user || infoLoading || paymentInfo.price <= 0) return;

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
  }, [user, paymentInfo.price, infoLoading]);

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

  if (infoLoading) {
    return <div className="max-w-xl mx-auto px-4 py-12 text-center text-muted-foreground">결제 정보를 불러오는 중...</div>;
  }

  // 무료(0원) 시험은 결제 없이 바로 응시
  if (paymentInfo.price <= 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-2">{paymentInfo.title}</h1>
        <p className="text-muted-foreground mb-6">{paymentInfo.subtitle}</p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <div className="text-2xl font-bold text-green-600 mb-1">무료</div>
          <div className="text-sm text-muted-foreground">결제 없이 바로 응시할 수 있습니다.</div>
        </div>
        {paymentInfo.takeHref ? (
          <Link href={paymentInfo.takeHref} className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition inline-block">
            응시하러 가기
          </Link>
        ) : (
          <Link href="/exams" className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition inline-block">
            시험 목록으로
          </Link>
        )}
        {!user && <p className="text-center text-sm text-red-500 mt-4">먼저 로그인해주세요.</p>}
      </div>
    );
  }

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
