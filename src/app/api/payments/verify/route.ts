import { NextResponse } from "next/server";
import { verifyPayment } from "@/lib/payment";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { paymentId, txId, type, targetId, userId } = await request.json();

    if (!paymentId || !userId) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // PortOne API로 결제 검증
    const isValid = await verifyPayment(paymentId);
    if (!isValid) {
      return NextResponse.json(
        { error: "결제 검증에 실패했습니다." },
        { status: 400 }
      );
    }

    // 결제 정보 저장
    const payment = await db.payment.create({
      data: {
        userId,
        type: type as "COURSE" | "EXAM" | "CERTIFICATE",
        amount: 0, // 실제로는 PortOne에서 가져온 금액
        status: "COMPLETED",
        pgTransactionId: txId,
        pgProvider: "TOSSPAYMENTS",
      },
    });

    // 타입별 후처리
    if (type === "COURSE" && targetId) {
      await db.enrollment.create({
        data: {
          userId,
          courseId: targetId,
          paymentId: payment.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "결제 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
