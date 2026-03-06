import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
  phone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = result.data;

    // Firebase Auth에 사용자 생성
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // Firestore에 사용자 프로필 저장
    await adminDb.collection("users").doc(userRecord.uid).set({
      email,
      name,
      phone: phone || null,
      address: null,
      role: "STUDENT",
      image: null,
      emailVerified: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "회원가입이 완료되었습니다.", userId: userRecord.uid },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const firebaseError = error as { code?: string };
    if (firebaseError.code === "auth/email-already-exists") {
      return NextResponse.json(
        { error: "이미 등록된 이메일입니다." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
