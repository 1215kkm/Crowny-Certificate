import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { getThemeById } from "@/data/grade-2-practical";
import { getAppThemeById } from "@/data/grade-1-practical";

/**
 * 실기 제출물을 그대로 합격작으로 자동 등록(원클릭).
 * POST /api/showcase/register  Body: { type: "practical"|"app"|"special", submissionId }
 *
 * 시험 응시 때 입력한 내용(주소·스크린샷·설명 등)을 그대로 합격작으로 가져온다.
 * 같은 제출물(sourceSubmissionId)은 중복 등록하지 않고 갱신한다. 등록 즉시 공개.
 */
const TYPE_MAP: Record<string, { collection: string; grade: string }> = {
  practical: { collection: "practicalSubmissions", grade: "GRADE_2" },
  app: { collection: "appSubmissions", grade: "GRADE_1" },
  special: { collection: "specialSubmissions", grade: "SPECIAL" },
};

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const userId = decoded.uid;

    const { type, submissionId } = await request.json();
    const meta = TYPE_MAP[type];
    if (!meta || !submissionId) {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    const subRef = adminDb.collection(meta.collection).doc(submissionId);
    const subSnap = await subRef.get();
    if (!subSnap.exists) {
      return NextResponse.json({ error: "제출물을 찾을 수 없습니다." }, { status: 404 });
    }
    const s = subSnap.data()!;
    if (s.userId !== userId) {
      return NextResponse.json({ error: "본인의 제출물만 등록할 수 있습니다." }, { status: 403 });
    }
    if (s.passed !== true) {
      return NextResponse.json({ error: "합격한 실기만 합격작으로 등록할 수 있습니다." }, { status: 400 });
    }

    // 제출물 → 합격작 필드 매핑
    let title = "";
    let url = "";
    let description = "";
    const screenshotUrl: string | null = s.screenshotUrl || null;

    if (type === "practical") {
      const themeName = getThemeById(s.themeId)?.name ?? "랜딩페이지";
      title = `${themeName} 랜딩페이지`;
      url = s.liveUrl || s.appUrl || "";
      description = `${themeName} 주제로 제작한 AI 랜딩페이지입니다.${s.repoUrl ? `\nGitHub: ${s.repoUrl}` : ""}`;
    } else if (type === "app") {
      const themeName = getAppThemeById(s.themeId)?.name ?? "앱";
      title = themeName;
      url = s.appUrl || "";
      description = s.description?.trim() || `${themeName} 주제로 제작·배포한 앱입니다.`;
    } else {
      title = s.topicTitle || "특급 챌린지 작품";
      url = s.appUrl || "";
      description =
        s.completion?.trim() || s.planning?.trim() || s.marketResearch?.trim() || `${title} — AI 제품 전주기 챌린지 결과물입니다.`;
    }

    if (!url.trim()) {
      return NextResponse.json(
        { error: "제출물에 배포 URL이 없어 합격작으로 등록할 수 없습니다." },
        { status: 400 }
      );
    }

    const userDoc = await adminDb.collection("users").doc(userId).get();
    const userName = userDoc.data()?.name || decoded.name || "합격자";

    const now = Timestamp.now();
    const payload = {
      grade: meta.grade,
      title: title.slice(0, 200),
      url: url.trim(),
      screenshotUrl,
      description: description.slice(0, 2000),
      isPublished: true,
      sourceType: meta.collection,
      sourceSubmissionId: submissionId,
      updatedAt: now,
    };

    // 중복(같은 제출물) 등록 방지 → 있으면 갱신
    const existing = await adminDb
      .collection("showcases")
      .where("userId", "==", userId)
      .where("sourceSubmissionId", "==", submissionId)
      .limit(1)
      .get();

    if (!existing.empty) {
      const docRef = existing.docs[0].ref;
      await docRef.update(payload);
      return NextResponse.json({ id: docRef.id, updated: true });
    }

    const ref = await adminDb.collection("showcases").add({
      userId,
      userName,
      authorAge: null,
      authorBackground: null,
      ...payload,
      createdAt: now,
    });
    return NextResponse.json({ id: ref.id, created: true });
  } catch (error) {
    console.error("Showcase register error:", error);
    return NextResponse.json({ error: "합격작 등록 중 오류가 발생했습니다." }, { status: 500 });
  }
}
