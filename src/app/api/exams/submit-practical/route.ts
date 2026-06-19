import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

/**
 * 2급 실기(랜딩페이지) 제출 API
 * POST /api/exams/submit-practical
 * Body: { examId, themeId, wireframeId, hero, icons, products, band, shareLink }
 *
 * 이미지는 클라이언트가 Storage에 업로드한 download URL을 전달한다.
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

    const body = await request.json();
    const {
      examId,
      themeId,
      wireframeId,
      wireframeName,
      wireframeCode,
      zipUrl,
      zipName,
      screenshotUrl,
      repoUrl,
      liveUrl,
      aiUsages,
      shareLink,
    } = body;

    if (!examId || !themeId || !wireframeId) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    // AI 사용 내역 정리(최대 20개)
    const usages = Array.isArray(aiUsages)
      ? aiUsages
          .slice(0, 20)
          .map((u: { content?: unknown; link?: unknown }) => ({
            content: typeof u?.content === "string" ? u.content.slice(0, 2000) : "",
            link: typeof u?.link === "string" ? u.link.slice(0, 1000) : "",
          }))
          .filter((u) => u.content || u.link)
      : [];

    const examDoc = await adminDb.collection("exams").doc(examId).get();
    if (!examDoc.exists) {
      return NextResponse.json({ error: "존재하지 않는 시험입니다." }, { status: 404 });
    }
    const certificateTypeId = examDoc.data()?.certificateTypeId ?? "";

    // 사용자 이름
    const userDoc = await adminDb.collection("users").doc(userId).get();
    const userName = userDoc.data()?.name || decoded.name || decoded.email || "응시자";

    // 발표일 = 제출일 + 15일, 13:00 KST (= 04:00 UTC)
    const kstNow = new Date(Date.now() + 9 * 3600 * 1000);
    kstNow.setUTCDate(kstNow.getUTCDate() + 15);
    const announce = new Date(
      Date.UTC(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate(), 4, 0, 0)
    );

    const now = Timestamp.now();
    const ref = await adminDb.collection("practicalSubmissions").add({
      userId,
      userName,
      examId,
      certificateTypeId,
      themeId,
      wireframeId,
      wireframeName: wireframeName || null,
      wireframeCode: wireframeCode || null,
      zipUrl: zipUrl || null,
      zipName: zipName || null,
      screenshotUrl: screenshotUrl || null,
      repoUrl: repoUrl || null,
      liveUrl: liveUrl || null,
      aiUsages: usages,
      shareLink: shareLink || null,
      status: "SUBMITTED",
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
    console.error("Practical submit error:", error);
    return NextResponse.json(
      { error: "실기 제출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
