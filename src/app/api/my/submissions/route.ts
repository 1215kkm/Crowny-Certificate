import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

/**
 * 내 실기 제출(2급 랜딩페이지 / 1급 앱) 조회 API
 * GET/POST /api/my/submissions  (Authorization: Bearer <idToken>)
 *
 * 클라이언트 SDK 읽기가 Firestore 규칙에 막히는 신규 컬렉션을 서버에서 조회한다.
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

async function handle(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const userId = decoded.uid;

    const [practicalSnap, appSnap] = await Promise.all([
      adminDb.collection("practicalSubmissions").where("userId", "==", userId).get(),
      adminDb.collection("appSubmissions").where("userId", "==", userId).get(),
    ]);

    const practical = practicalSnap.docs.map((d) => ({ id: d.id, ...serialize(d.data()) }));
    const app = appSnap.docs.map((d) => ({ id: d.id, ...serialize(d.data()) }));

    return NextResponse.json({ practical, app });
  } catch (error) {
    console.error("My submissions error:", error);
    return NextResponse.json({ error: "조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return handle(request);
}
export async function POST(request: Request) {
  return handle(request);
}
