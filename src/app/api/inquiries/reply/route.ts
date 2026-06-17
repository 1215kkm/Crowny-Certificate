import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

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

    // 관리자 역할 확인
    const userDoc = await adminDb.collection("users").doc(userId).get();
    if (!userDoc.exists || userDoc.data()?.role !== "ADMIN") {
      return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
    }

    const { inquiryId, reply } = await request.json();

    if (!inquiryId || !reply) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    // 문의 존재 확인
    const inquiryDoc = await adminDb.collection("inquiries").doc(inquiryId).get();
    if (!inquiryDoc.exists) {
      return NextResponse.json({ error: "존재하지 않는 문의입니다." }, { status: 404 });
    }

    // 답변 저장
    await adminDb.collection("inquiries").doc(inquiryId).update({
      adminReply: reply,
      adminRepliedAt: FieldValue.serverTimestamp(),
      status: "ANSWERED",
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiry reply error:", error);
    return NextResponse.json(
      { error: "답변 등록 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
