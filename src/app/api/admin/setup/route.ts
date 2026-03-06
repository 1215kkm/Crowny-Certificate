import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

/**
 * 관리자 설정 API
 * POST /api/admin/setup
 * Body: { email: string, secretKey: string }
 *
 * 환경변수 ADMIN_SETUP_KEY가 설정되어 있으면 secretKey와 비교합니다.
 * 설정되어 있지 않으면 기존 ADMIN이 없는 경우에만 허용합니다.
 */
export async function POST(request: Request) {
  try {
    const { email, secretKey } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "이메일을 입력해주세요." }, { status: 400 });
    }

    // 보안 체크: ADMIN_SETUP_KEY가 있으면 키 검증
    const setupKey = process.env.ADMIN_SETUP_KEY;
    if (setupKey) {
      if (secretKey !== setupKey) {
        return NextResponse.json({ error: "인증 키가 올바르지 않습니다." }, { status: 403 });
      }
    } else {
      // 키가 없으면 기존 ADMIN이 없는 경우에만 허용
      const existingAdmins = await adminDb
        .collection("users")
        .where("role", "==", "ADMIN")
        .limit(1)
        .get();

      if (!existingAdmins.empty) {
        return NextResponse.json(
          { error: "이미 관리자가 존재합니다. ADMIN_SETUP_KEY 환경변수를 설정해주세요." },
          { status: 403 }
        );
      }
    }

    // Firebase Auth에서 이메일로 사용자 찾기
    const userRecord = await adminAuth.getUserByEmail(email);

    // Firestore users 문서 확인 및 업데이트
    const userRef = adminDb.collection("users").doc(userRecord.uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      await userRef.update({
        role: "ADMIN",
        updatedAt: new Date(),
      });
    } else {
      // users 문서가 없는 경우 (Google 로그인으로 가입한 경우 등)
      await userRef.set({
        email: userRecord.email,
        name: userRecord.displayName || email.split("@")[0],
        phone: null,
        address: null,
        role: "ADMIN",
        image: userRecord.photoURL || null,
        emailVerified: userRecord.emailVerified ? new Date() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({
      message: `${email} 계정이 관리자로 설정되었습니다.`,
      uid: userRecord.uid,
    });
  } catch (error: unknown) {
    console.error("Admin setup error:", error);
    const fbError = error as { code?: string };
    if (fbError.code === "auth/user-not-found") {
      return NextResponse.json(
        { error: "해당 이메일로 등록된 사용자를 찾을 수 없습니다. 먼저 회원가입해주세요." },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
