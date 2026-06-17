import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

/**
 * 특급 실기(AI 제품 전주기 챌린지) 제출 API
 * POST /api/exams/submit-special
 * 발표일(announceAt) = 제출일 + 15일, 오후 1시(KST).
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

    const b = await request.json();
    const { examId, topicMode, topicTitle, problemId, appUrl } = b;

    if (!examId || !topicTitle?.trim() || !appUrl?.trim()) {
      return NextResponse.json(
        { error: "주제와 배포 URL은 필수입니다." },
        { status: 400 }
      );
    }

    const examDoc = await adminDb.collection("exams").doc(examId).get();
    if (!examDoc.exists) {
      return NextResponse.json({ error: "존재하지 않는 시험입니다." }, { status: 404 });
    }
    const certificateTypeId = examDoc.data()?.certificateTypeId ?? "";

    const userDoc = await adminDb.collection("users").doc(userId).get();
    const userName = userDoc.data()?.name || decoded.name || decoded.email || "응시자";

    // 발표일 = 제출일 + 15일, 13:00 KST (= 04:00 UTC)
    const kstNow = new Date(Date.now() + 9 * 3600 * 1000);
    kstNow.setUTCDate(kstNow.getUTCDate() + 15);
    const announce = new Date(
      Date.UTC(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate(), 4, 0, 0)
    );

    const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
    const now = Timestamp.now();
    const ref = await adminDb.collection("specialSubmissions").add({
      userId,
      userName,
      examId,
      certificateTypeId,
      topicMode: topicMode === "POOL" ? "POOL" : "FREE",
      topicTitle: str(topicTitle),
      problemId: problemId || null,
      marketResearch: str(b.marketResearch),
      planning: str(b.planning),
      design: str(b.design),
      build: str(b.build),
      debugFix: str(b.debugFix),
      completion: str(b.completion),
      appUrl: str(appUrl),
      promotion: str(b.promotion),
      promotionResponse: str(b.promotionResponse),
      demoLink: str(b.demoLink) || null,
      repoUrl: str(b.repoUrl) || null,
      shareLink: str(b.shareLink) || null,
      timedOut: !!b.timedOut,
      status: "SUBMITTED",
      scores: null,
      score: null,
      passed: null,
      feedback: null,
      submittedAt: now,
      announceAt: Timestamp.fromDate(announce),
      gradedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ id: ref.id, announceAt: announce.toISOString() });
  } catch (error) {
    console.error("Special submit error:", error);
    return NextResponse.json({ error: "제출 중 오류가 발생했습니다." }, { status: 500 });
  }
}
