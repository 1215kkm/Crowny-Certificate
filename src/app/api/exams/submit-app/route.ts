import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

/**
 * 1급 실기(앱 제작·배포) 제출 API
 * POST /api/exams/submit-app
 * Body: { examId, themeId, appUrl, repoUrl, description, shareLink }
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

    const { examId, themeId, appUrl, repoUrl, description, shareLink } = await request.json();

    if (!examId || !themeId || !appUrl?.trim()) {
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

    const now = Timestamp.now();
    const ref = await adminDb.collection("appSubmissions").add({
      userId,
      userName,
      examId,
      certificateTypeId,
      themeId,
      appUrl: String(appUrl).trim(),
      repoUrl: repoUrl?.trim() || null,
      description: description?.trim() || "",
      shareLink: shareLink?.trim() || null,
      status: "SUBMITTED",
      scores: null,
      score: null,
      passed: null,
      feedback: null,
      submittedAt: now,
      gradedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ id: ref.id });
  } catch (error) {
    console.error("App submit error:", error);
    return NextResponse.json(
      { error: "앱 제출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
