import { NextResponse } from "next/server";
import { confirmPayment } from "@/lib/toss-payments";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    // 인증 확인
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { paymentKey, orderId, amount, type, targetId } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 토스페이먼츠 결제 승인
    const tossResult = await confirmPayment({ paymentKey, orderId, amount });

    // 결제 대상의 표시용 상품명 조회 (환불·취소·재시험 UI에서 사용)
    const payType = type || "COURSE";
    let itemName: string | null = null;
    try {
      if (payType === "EXAM" && targetId) {
        const ex = await adminDb.collection("exams").doc(targetId).get();
        itemName = ex.exists ? (ex.data()?.title ?? null) : null;
      } else if (payType === "COURSE" && targetId) {
        const c = await adminDb.collection("courses").doc(targetId).get();
        itemName = c.exists ? (c.data()?.title ?? null) : null;
      } else if (payType === "CERTIFICATE" && targetId) {
        const ct = await adminDb.collection("certificateTypes").doc(targetId).get();
        itemName = ct.exists ? (ct.data()?.name ?? null) : null;
      }
    } catch {
      itemName = null;
    }

    // Firestore에 결제 정보 저장
    const paymentRef = await adminDb.collection("payments").add({
      userId,
      type: payType,
      amount: tossResult.totalAmount,
      method: tossResult.method || null,
      status: "COMPLETED",
      tossOrderId: tossResult.orderId,
      tossPaymentKey: tossResult.paymentKey,
      receiptUrl: tossResult.receipt?.url || null,
      refundedAt: null,
      refundReason: null,
      targetId: targetId || null,
      itemName,
      refundStatus: "NONE",
      refundKind: null,
      refundRequestedAt: null,
      adminRefundNote: null,
      retakeGranted: false,
      retakeReason: null,
      retakeGrantedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 타입별 후처리
    if (type === "COURSE" && targetId) {
      await adminDb.collection("enrollments").add({
        userId,
        courseId: targetId,
        progress: 0,
        completedAt: null,
        paymentId: paymentRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      paymentId: paymentRef.id,
    });
  } catch (error: unknown) {
    console.error("Payment confirmation error:", error);
    const message = error instanceof Error ? error.message : "결제 처리 중 오류가 발생했습니다.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
