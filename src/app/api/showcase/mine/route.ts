import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

/**
 * 내 합격작 + 등록 가능 등급 조회
 * POST /api/showcase/mine  (Authorization: Bearer)
 * 등록 가능 등급 = 해당 실기에 합격(passed=true)한 등급.
 */
function serialize(data: FirebaseFirestore.DocumentData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v && typeof (v as { toDate?: unknown }).toDate === "function") {
      out[k] = (v as { toDate: () => Date }).toDate().toISOString();
    } else out[k] = v;
  }
  return out;
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const userId = decoded.uid;

    const [practicalSnap, appSnap, specialSnap, mineSnap] = await Promise.all([
      adminDb.collection("practicalSubmissions").where("userId", "==", userId).where("passed", "==", true).limit(1).get(),
      adminDb.collection("appSubmissions").where("userId", "==", userId).where("passed", "==", true).limit(1).get(),
      adminDb.collection("specialSubmissions").where("userId", "==", userId).where("passed", "==", true).limit(1).get(),
      adminDb.collection("showcases").where("userId", "==", userId).get(),
    ]);

    const eligibleGrades: string[] = [];
    if (!practicalSnap.empty) eligibleGrades.push("GRADE_2");
    if (!appSnap.empty) eligibleGrades.push("GRADE_1");
    if (!specialSnap.empty) eligibleGrades.push("SPECIAL");

    const mine = mineSnap.docs.map((d) => ({ id: d.id, ...serialize(d.data()) }));

    return NextResponse.json({ eligibleGrades, mine });
  } catch (error) {
    console.error("Showcase mine error:", error);
    return NextResponse.json({ error: "조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}
