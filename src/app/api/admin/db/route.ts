import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

/**
 * 관리자 전용 Firestore 쓰기 프록시 API
 * POST /api/admin/db
 * Body: { op: "create"|"update"|"delete", path: string[], data?: object }
 *
 * 클라이언트 SDK 쓰기가 Firestore 보안 규칙에 막히는 문제를 우회하기 위해,
 * 관리자 인증을 거친 뒤 Admin SDK로 쓰기를 수행한다 (보안 규칙 무시).
 *
 * path 규칙:
 *  - create: 컬렉션 경로(홀수 길이) 예) ["certificateTypes"], ["exams","<id>","questions"]
 *  - update/delete: 문서 경로(짝수 길이) 예) ["certificateTypes","<id>"], ["exams","<id>","questions","<qid>"]
 */

type FirestoreCol = ReturnType<typeof adminDb.collection>;
type FirestoreDoc = ReturnType<FirestoreCol["doc"]>;

function buildRef(path: string[]): FirestoreCol | FirestoreDoc {
  let ref: FirestoreCol | FirestoreDoc = adminDb.collection(path[0]);
  for (let i = 1; i < path.length; i++) {
    if (i % 2 === 1) {
      ref = (ref as FirestoreCol).doc(path[i]);
    } else {
      ref = (ref as FirestoreDoc).collection(path[i]);
    }
  }
  return ref;
}

// Firestore Timestamp 값을 ISO 문자열로 직렬화 (클라이언트 JSON 전송용)
function serializeTimestamps(data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v && typeof (v as { toDate?: unknown }).toDate === "function") {
      out[k] = (v as { toDate: () => Date }).toDate().toISOString();
    } else if (v && typeof v === "object" && typeof (v as { _seconds?: number })._seconds === "number") {
      out[k] = new Date((v as { _seconds: number })._seconds * 1000).toISOString();
    } else {
      out[k] = v;
    }
  }
  return out;
}

function isValidPath(path: unknown): path is string[] {
  return (
    Array.isArray(path) &&
    path.length > 0 &&
    path.every((p) => typeof p === "string" && p.length > 0)
  );
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const userDoc = await adminDb.collection("users").doc(userId).get();
    const userRole = userDoc.data()?.role;
    if (!userDoc.exists || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { op, path, data } = body as {
      op?: string;
      path?: unknown;
      data?: Record<string, unknown>;
    };

    if (!isValidPath(path)) {
      return NextResponse.json({ error: "잘못된 경로입니다." }, { status: 400 });
    }

    // 클라이언트가 보낸 createdAt/updatedAt(직렬화된 Timestamp)는 무시하고 서버에서 설정
    const cleanData: Record<string, unknown> = { ...(data ?? {}) };
    delete cleanData.createdAt;
    delete cleanData.updatedAt;
    // "__SERVER_TIMESTAMP__" 값은 서버 시각 Timestamp로 치환 (예: issuedAt)
    for (const key of Object.keys(cleanData)) {
      if (cleanData[key] === "__SERVER_TIMESTAMP__") {
        cleanData[key] = Timestamp.now();
      }
    }

    if (op === "create") {
      if (path.length % 2 !== 1) {
        return NextResponse.json(
          { error: "create는 컬렉션 경로(홀수 길이)여야 합니다." },
          { status: 400 }
        );
      }
      const now = Timestamp.now();
      const colRef = buildRef(path) as FirestoreCol;
      const docRef = await colRef.add({
        ...cleanData,
        createdAt: now,
        updatedAt: now,
      });
      return NextResponse.json({ id: docRef.id });
    }

    if (op === "update") {
      if (path.length % 2 !== 0) {
        return NextResponse.json(
          { error: "update는 문서 경로(짝수 길이)여야 합니다." },
          { status: 400 }
        );
      }
      const docRef = buildRef(path) as FirestoreDoc;
      await docRef.update({ ...cleanData, updatedAt: Timestamp.now() });
      return NextResponse.json({ ok: true });
    }

    if (op === "delete") {
      if (path.length % 2 !== 0) {
        return NextResponse.json(
          { error: "delete는 문서 경로(짝수 길이)여야 합니다." },
          { status: 400 }
        );
      }
      const docRef = buildRef(path) as FirestoreDoc;
      await docRef.delete();
      return NextResponse.json({ ok: true });
    }

    if (op === "list") {
      if (path.length % 2 !== 1) {
        return NextResponse.json(
          { error: "list는 컬렉션 경로(홀수 길이)여야 합니다." },
          { status: 400 }
        );
      }
      const colRef = buildRef(path) as FirestoreCol;
      const { orderByField, orderDir } = body as { orderByField?: string; orderDir?: string };
      const queryRef = orderByField
        ? colRef.orderBy(orderByField, orderDir === "asc" ? "asc" : "desc")
        : colRef;
      const snap = await queryRef.get();
      const docs = snap.docs.map((d) => ({ id: d.id, ...serializeTimestamps(d.data()) }));
      return NextResponse.json({ docs });
    }

    return NextResponse.json({ error: "알 수 없는 op입니다." }, { status: 400 });
  } catch (error) {
    console.error("Admin db proxy error:", error);
    return NextResponse.json(
      { error: "처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
