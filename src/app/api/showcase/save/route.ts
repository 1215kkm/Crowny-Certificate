import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

/**
 * 합격작 등록/수정/삭제 (본인만)
 * POST /api/showcase/save
 * Body: { id?, action?: "delete", grade, title, url, screenshotUrl, description, authorAge, authorBackground, isPublished }
 * 등록은 해당 실기 합격(passed=true)자만 가능.
 */
const GRADE_COLLECTION: Record<string, string> = {
  GRADE_2: "practicalSubmissions",
  GRADE_1: "appSubmissions",
  SPECIAL: "specialSubmissions",
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

    const b = await request.json();

    // 삭제
    if (b.action === "delete" && b.id) {
      const ref = adminDb.collection("showcases").doc(b.id);
      const doc = await ref.get();
      if (!doc.exists || doc.data()?.userId !== userId) {
        return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
      }
      await ref.delete();
      return NextResponse.json({ ok: true });
    }

    const { id, grade, title, url } = b;
    if (!grade || !GRADE_COLLECTION[grade]) {
      return NextResponse.json({ error: "등급이 올바르지 않습니다." }, { status: 400 });
    }
    if (!title?.trim() || !url?.trim()) {
      return NextResponse.json({ error: "제목과 주소(URL)는 필수입니다." }, { status: 400 });
    }

    // 합격 자격 확인
    const passSnap = await adminDb
      .collection(GRADE_COLLECTION[grade])
      .where("userId", "==", userId)
      .where("passed", "==", true)
      .limit(1)
      .get();
    if (passSnap.empty) {
      return NextResponse.json({ error: "해당 등급 실기 합격자만 등록할 수 있습니다." }, { status: 403 });
    }

    const userDoc = await adminDb.collection("users").doc(userId).get();
    const userName = userDoc.data()?.name || decoded.name || "합격자";
    const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

    const payload = {
      grade,
      title: str(title),
      url: str(url),
      screenshotUrl: str(b.screenshotUrl) || null,
      description: str(b.description),
      authorAge: str(b.authorAge) || null,
      authorBackground: str(b.authorBackground) || null,
      isPublished: !!b.isPublished,
      updatedAt: Timestamp.now(),
    };

    if (id) {
      const ref = adminDb.collection("showcases").doc(id);
      const doc = await ref.get();
      if (!doc.exists || doc.data()?.userId !== userId) {
        return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
      }
      await ref.update(payload);
      return NextResponse.json({ id });
    } else {
      const ref = await adminDb.collection("showcases").add({
        userId,
        userName,
        ...payload,
        createdAt: Timestamp.now(),
      });
      return NextResponse.json({ id: ref.id });
    }
  } catch (error) {
    console.error("Showcase save error:", error);
    return NextResponse.json({ error: "저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}
