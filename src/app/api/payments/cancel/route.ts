import { NextResponse } from "next/server";
import { cancelPayment } from "@/lib/toss-payments";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    await adminAuth.verifyIdToken(token);

    const { paymentId, cancelReason, cancelAmount } = await request.json();

    if (!paymentId || !cancelReason) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // Firestore에서 결제 정보 조회
    const paymentDoc = await adminDb.collection("payments").doc(paymentId).get();
    if (!paymentDoc.exists) {
      return NextResponse.json(
        { error: "결제 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const paymentData = paymentDoc.data();
    if (!paymentData?.tossPaymentKey) {
      return NextResponse.json(
        { error: "토스 결제 키를 찾을 수 없습니다." },
        { status: 400 }
      );
    }

    // 토스페이먼츠 결제 취소
    await cancelPayment(paymentData.tossPaymentKey, cancelReason, cancelAmount);

    // Firestore 상태 업데이트
    await adminDb.collection("payments").doc(paymentId).update({
      status: "REFUNDED",
      refundedAt: new Date(),
      refundReason: cancelReason,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Payment cancel error:", error);
    const message = error instanceof Error ? error.message : "결제 취소 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
