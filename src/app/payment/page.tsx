"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "course";
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handlePayment = async () => {
    if (!agreed) {
      alert("결제 약관에 동의해주세요.");
      return;
    }
    setLoading(true);

    // 실제 구현 시 PortOne SDK 호출
    // const response = await PortOne.requestPayment({
    //   storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
    //   orderName: paymentInfo.title,
    //   totalAmount: paymentInfo.price,
    //   pgProvider: 'PG_PROVIDER_TOSSPAYMENTS',
    //   payMethod: paymentMethod === 'card' ? 'CARD' : 'TRANSFER',
    // });

    alert(
      `결제 시뮬레이션: ${paymentInfo.title} - ${paymentInfo.price.toLocaleString()}원\n\n실제 서비스에서는 PortOne 결제창이 열립니다.`
    );
    setLoading(false);
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

      {/* 결제 수단 */}
      <div className="border border-border rounded-xl p-6 mb-6">
        <h2 className="font-bold mb-4">결제 수단</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "card", label: "신용/체크카드" },
            { id: "transfer", label: "계좌이체" },
            { id: "kakaopay", label: "카카오페이" },
            { id: "tosspay", label: "토스페이" },
          ].map((method) => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`p-3 rounded-lg border text-sm font-medium transition ${
                paymentMethod === method.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>
      </div>

      {/* 약관 동의 */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 text-primary"
          />
          <span className="text-sm">
            결제 약관 및 환불 정책에 동의합니다.
          </span>
        </label>
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
        disabled={loading || !agreed}
        className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-dark transition disabled:opacity-50"
      >
        {loading
          ? "결제 처리 중..."
          : `${paymentInfo.price.toLocaleString()}원 결제하기`}
      </button>
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
