import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * 문의 작성자가 관리자 답변을 읽었을 때 호출.
 * POST /api/inquiries/mark-read  Body: { inquiryId }
 * 본인 문의이고 답변이 있으며 아직 읽지 않았다면 replyReadAt을 기록한다.
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const userId = decoded.uid;

    const { inquiryId } = await request.json();
    if (!inquiryId) {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    const ref = adminDb.collection("inquiries").doc(inquiryId);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "존재하지 않는 문의입니다." }, { status: 404 });
    }
    const d = snap.data()!;
    if (d.userId !== userId) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }
    // 답변이 있고 아직 안 읽은 경우에만 기록
    if (d.adminReply && !d.replyReadAt) {
      await ref.update({ replyReadAt: FieldValue.serverTimestamp() });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("mark-read error:", error);
    return NextResponse.json({ error: "처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
