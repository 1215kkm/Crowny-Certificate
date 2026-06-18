import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { z } from "zod";

/**
 * 내정보 조회/수정 (본인). 클라이언트 쓰기 규칙을 우회하고,
 * 이메일 변경은 Firebase Auth(Admin SDK)에서 처리한다.
 *   GET  /api/my/profile        → { name, email, phone, birthDate, address }
 *   PUT  /api/my/profile  Body  → 위 필드 수정
 */

async function requireUid(request: Request): Promise<string> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) throw new Error("UNAUTHORIZED");
  const decoded = await adminAuth.verifyIdToken(authHeader.split("Bearer ")[1]);
  return decoded.uid;
}

export async function GET(request: Request) {
  try {
    const uid = await requireUid(request);
    const snap = await adminDb.collection("users").doc(uid).get();
    const d = snap.data() || {};
    return NextResponse.json({
      name: d.name ?? "",
      email: d.email ?? "",
      phone: d.phone ?? "",
      birthDate: d.birthDate ?? "",
      address: d.address ?? "",
    });
  } catch (e) {
    if ((e as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    console.error("profile GET error:", e);
    return NextResponse.json({ error: "조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}

const updateSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  birthDate: z.string().min(1, "생년월일을 입력해주세요."),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export async function PUT(request: Request) {
  try {
    const uid = await requireUid(request);
    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { name, email, birthDate, phone, address } = parsed.data;

    // 현재 Auth 정보와 비교해 변경분만 반영
    const authUser = await adminAuth.getUser(uid);
    const authUpdate: { email?: string; displayName?: string } = {};
    if (email && email !== authUser.email) authUpdate.email = email;
    if (name && name !== authUser.displayName) authUpdate.displayName = name;
    if (Object.keys(authUpdate).length > 0) {
      await adminAuth.updateUser(uid, authUpdate);
    }

    await adminDb.collection("users").doc(uid).set(
      {
        name,
        email,
        birthDate,
        phone: phone || null,
        address: address || null,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    const err = e as { message?: string; code?: string };
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    if (err.code === "auth/email-already-exists") {
      return NextResponse.json({ error: "이미 사용 중인 이메일입니다." }, { status: 400 });
    }
    if (err.code === "auth/invalid-email") {
      return NextResponse.json({ error: "올바른 이메일 형식이 아닙니다." }, { status: 400 });
    }
    console.error("profile PUT error:", e);
    return NextResponse.json({ error: "저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}
