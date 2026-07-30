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

    const { examId, themeId, appUrl, repoUrl, description, shareLink, screenshotUrl } = await request.json();

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

    /* 채점 전(SUBMITTED)이면 새 제출을 만들지 않고 기존 제출을 고쳐 쓴다.
       — 잘못 낸 URL·설명을 채점 시작 전까지 바로잡을 수 있게. */
    const openSnap = await adminDb
      .collection("appSubmissions")
      .where("userId", "==", userId)
      .where("examId", "==", examId)
      .where("status", "==", "SUBMITTED")
      .limit(1)
      .get();
    const openDoc = openSnap.docs[0];

    // 이미 채점이 끝난 제출은 손대지 못하게 막는다
    if (!openDoc) {
      const gradedSnap = await adminDb
        .collection("appSubmissions")
        .where("userId", "==", userId)
        .where("examId", "==", examId)
        .where("status", "==", "GRADED")
        .limit(1)
        .get();
      if (!gradedSnap.empty) {
        return NextResponse.json(
          { error: "이미 채점이 끝난 제출입니다. 수정할 수 없습니다." },
          { status: 409 }
        );
      }
    }

    const payload = {
      userId,
      userName,
      examId,
      certificateTypeId,
      themeId,
      appUrl: String(appUrl).trim(),
      repoUrl: repoUrl?.trim() || null,
      description: description?.trim() || "",
      shareLink: shareLink?.trim() || null,
      screenshotUrl: screenshotUrl || null,
      status: "SUBMITTED",
      scores: null,
      score: null,
      passed: null,
      feedback: null,
      submittedAt: now,
      gradedAt: null,
      updatedAt: now,
    };

    if (openDoc) {
      await openDoc.ref.set(payload, { merge: true });
      return NextResponse.json({ id: openDoc.id, updated: true });
    }

    const ref = await adminDb
      .collection("appSubmissions")
      .add({ ...payload, createdAt: now });
    return NextResponse.json({ id: ref.id, updated: false });
  } catch (error) {
    console.error("App submit error:", error);
    return NextResponse.json(
      { error: "앱 제출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
