import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { DEFAULT_WIREFRAMES } from "@/data/grade-2-practical";

/**
 * 2급 실기 와이어프레임 목록 (활성) 조회.
 * 신규 컬렉션(wireframes)은 Firestore 규칙을 우회하기 위해 서버(Admin SDK)로 조회한다.
 * DB가 비어 있으면 기본 5종(A~E)을 반환한다.
 */
export async function GET() {
  try {
    const snap = await adminDb.collection("wireframes").get();
    if (snap.empty) {
      return NextResponse.json({ wireframes: DEFAULT_WIREFRAMES });
    }
    const wireframes = snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          code: data.code ?? "",
          name: data.name ?? "",
          desc: data.desc ?? "",
          blocks: Array.isArray(data.blocks) ? data.blocks : [],
          order: typeof data.order === "number" ? data.order : 0,
          isActive: data.isActive !== false,
        };
      })
      .filter((w) => w.isActive && w.blocks.length > 0)
      .sort((a, b) => a.order - b.order || a.code.localeCompare(b.code));

    // 활성 와이어프레임이 하나도 없으면 기본값으로 폴백
    return NextResponse.json({ wireframes: wireframes.length > 0 ? wireframes : DEFAULT_WIREFRAMES });
  } catch (error) {
    console.error("wireframes GET error:", error);
    return NextResponse.json({ wireframes: DEFAULT_WIREFRAMES });
  }
}
