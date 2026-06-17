import { getFirebaseAuth } from "./firebase";

/**
 * 관리자 전용 Firestore 쓰기 헬퍼.
 * 클라이언트 SDK 직접 쓰기는 Firestore 보안 규칙에 막히므로,
 * 서버(/api/admin/db)의 Admin SDK를 통해 쓰기를 수행한다.
 */

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getFirebaseAuth().currentUser?.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token ?? ""}`,
  };
}

async function call(body: unknown): Promise<Record<string, unknown>> {
  const res = await fetch("/api/admin/db", {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "요청에 실패했습니다.");
  }
  return data;
}

/** 컬렉션에 문서 생성. path는 컬렉션 경로(홀수 길이). 생성된 문서 id 반환. */
export async function adminCreate(
  path: string[],
  data: Record<string, unknown>
): Promise<string> {
  const result = await call({ op: "create", path, data });
  return result.id as string;
}

/** 문서 수정. path는 문서 경로(짝수 길이). */
export async function adminUpdate(
  path: string[],
  data: Record<string, unknown>
): Promise<void> {
  await call({ op: "update", path, data });
}

/** 문서 삭제. path는 문서 경로(짝수 길이). */
export async function adminDelete(path: string[]): Promise<void> {
  await call({ op: "delete", path });
}

/** 컬렉션 목록 조회(서버 Admin SDK). Timestamp는 ISO 문자열로 반환됨. */
export async function adminList<T = Record<string, unknown>>(
  path: string[],
  orderByField?: string,
  orderDir: "asc" | "desc" = "desc"
): Promise<(T & { id: string })[]> {
  const result = await call({ op: "list", path, orderByField, orderDir });
  return (result.docs as (T & { id: string })[]) || [];
}
