import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

/**
 * 사용자 환불/취소 요청 API
 * POST /api/my/refunds
 * Body: { paymentId, reason, kind: "REFUND" | "CANCEL_BEFORE_EXAM", agreed: true }
 *
 * 실제 토스 환불은 나중에 관리자 페이지에서 처리한다. 여기서는 요청만 기록한다.
 * (결제 doc에 refundStatus=REQUESTED로 표시)
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const userId = decoded.uid;

    const { paymentId, reason, kind, agreed } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ error: "결제 정보가 필요합니다." }, { status: 400 });
    }
    if (!agreed) {
      return NextResponse.json({ error: "환불 약정에 동의해야 신청할 수 있습니다." }, { status: 400 });
    }

    const ref = adminDb.collection("payments").doc(paymentId);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "결제 내역을 찾을 수 없습니다." }, { status: 404 });
    }
    const p = snap.data()!;

    // 본인 결제만 요청 가능
    if (p.userId !== userId) {
      return NextResponse.json({ error: "본인의 결제만 환불 신청할 수 있습니다." }, { status: 403 });
    }
    // 완료된 결제만 환불 가능
    if (p.status !== "COMPLETED") {
      return NextResponse.json({ error: "환불 가능한 상태의 결제가 아닙니다." }, { status: 400 });
    }
    // 이미 처리중/처리된 요청은 중복 불가
    if (p.refundStatus === "REQUESTED" || p.refundStatus === "APPROVED") {
      return NextResponse.json({ error: "이미 환불 요청이 접수되었습니다." }, { status: 400 });
    }

    const refundKind = kind === "CANCEL_BEFORE_EXAM" ? "CANCEL_BEFORE_EXAM" : "REFUND";

    // 시험 응시 전 취소: 이미 응시(제출) 기록이 있으면 막는다
    if (refundKind === "CANCEL_BEFORE_EXAM" && p.type === "EXAM" && p.targetId) {
      const subs = await adminDb
        .collection("examSubmissions")
        .where("userId", "==", userId)
        .where("examId", "==", p.targetId)
        .limit(1)
        .get();
      if (!subs.empty) {
        return NextResponse.json(
          { error: "이미 응시한 시험은 응시 전 취소가 불가합니다. 일반 환불 요청을 이용해주세요." },
          { status: 400 }
        );
      }
    }

    await ref.update({
      refundStatus: "REQUESTED",
      refundKind,
      refundReason: typeof reason === "string" ? reason.slice(0, 500) : null,
      refundRequestedAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Refund request error:", error);
    return NextResponse.json({ error: "환불 요청 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
