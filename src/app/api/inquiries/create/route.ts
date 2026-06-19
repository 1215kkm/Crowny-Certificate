import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

/**
 * 사용자 문의 등록 API
 * POST /api/inquiries/create
 * Body: { category, title, content }
 *
 * 클라이언트 SDK 쓰기가 Firestore 보안 규칙에 막히므로,
 * 로그인 사용자 인증 후 Admin SDK로 문의를 저장한다.
 */

const VALID_CATEGORIES = ["EXAM", "CERTIFICATE", "PAYMENT", "COURSE", "ETC"];

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { category, title, content, imageUrl } = await request.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "제목과 내용을 입력해주세요." },
        { status: 400 }
      );
    }

    const safeCategory = VALID_CATEGORIES.includes(category) ? category : "ETC";

    // 사용자 정보 조회 (이름/이메일)
    const userDoc = await adminDb.collection("users").doc(userId).get();
    const userData = userDoc.data();
    const userName = userData?.name || decodedToken.name || "이름 미설정";
    const userEmail = userData?.email || decodedToken.email || "";

    const now = Timestamp.now();
    const ref = await adminDb.collection("inquiries").add({
      userId,
      userName,
      userEmail,
      category: safeCategory,
      title: String(title).trim(),
      content: String(content).trim(),
      imageUrl: typeof imageUrl === "string" && imageUrl ? imageUrl : null,
      status: "PENDING",
      adminReply: null,
      adminRepliedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ id: ref.id });
  } catch (error) {
    console.error("Inquiry create error:", error);
    return NextResponse.json(
      { error: "문의 등록 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
