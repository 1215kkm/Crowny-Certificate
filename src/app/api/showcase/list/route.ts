import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

/**
 * 공개 합격작 갤러리 목록 (비로그인 포함 누구나)
 * GET /api/showcase/list?grade=GRADE_2
 * 공개(isPublished=true)된 항목만 반환. 신규 컬렉션 읽기를 서버(Admin SDK)로 처리.
 */
function serialize(data: FirebaseFirestore.DocumentData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v && typeof (v as { toDate?: unknown }).toDate === "function") {
      out[k] = (v as { toDate: () => Date }).toDate().toISOString();
    } else {
      out[k] = v;
    }
  }
  return out;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get("grade");

    let q = adminDb.collection("showcases").where("isPublished", "==", true);
    if (grade && ["GRADE_2", "GRADE_1", "SPECIAL"].includes(grade)) {
      q = q.where("grade", "==", grade);
    }
    const snap = await q.get();
    // 개인정보 최소화: 공개 목록엔 작성자 식별자(userId)는 제외
    const items = snap.docs
      .filter((d) => !d.data().hiddenByAdmin) // 관리자가 숨긴 항목 제외
      .map((d) => {
        const data = serialize(d.data());
        delete (data as Record<string, unknown>).userId;
        return { id: d.id, ...data };
      })
      // 최신순 (서버 정렬: createdAt 내림차순)
      .sort((a, b) => String((b as { createdAt?: string }).createdAt ?? "").localeCompare(String((a as { createdAt?: string }).createdAt ?? "")));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Showcase list error:", error);
    return NextResponse.json({ error: "목록 조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}
