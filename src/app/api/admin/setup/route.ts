import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

/**
 * 관리자 설정 API
 * POST /api/admin/setup
 * Body: { email: string, secretKey?: string }
 *
 * 권한 부여 규칙:
 * - SUPER_ADMIN_EMAILS 에 있으면 SUPER_ADMIN (관리자 + 시험 응시 등 모든 권한)
 * - ADMIN_EMAILS 에 있으면 ADMIN
 * - 위 지정 이메일은 기존 관리자 존재 여부와 무관하게 항상 설정 가능
 * - 그 외 이메일은: ADMIN_SETUP_KEY 가 있으면 키 검증, 없으면 기존 관리자가
 *   없을 때만 허용
 */

// 슈퍼관리자 — 관리자 권한 + 시험 응시 등 모든 권한
const SUPER_ADMIN_EMAILS = ["rute20002@gmail.com"];
// 일반 관리자
const ADMIN_EMAILS = ["1215kkm@naver.com"];

export async function POST(request: Request) {
  try {
    const { email, secretKey } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "이메일을 입력해주세요." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const isSuperAdminEmail = SUPER_ADMIN_EMAILS.includes(normalizedEmail);
    const isAdminEmail = ADMIN_EMAILS.includes(normalizedEmail);
    const isDesignated = isSuperAdminEmail || isAdminEmail;

    // 지정되지 않은 이메일만 보안 게이트 적용
    if (!isDesignated) {
      const setupKey = process.env.ADMIN_SETUP_KEY;
      if (setupKey) {
        if (secretKey !== setupKey) {
          return NextResponse.json(
            { error: "인증 키가 올바르지 않습니다." },
            { status: 403 }
          );
        }
      } else {
        // 키가 없으면 기존 관리자가 없는 경우에만 허용
        const [existingAdmins, existingSuperAdmins] = await Promise.all([
          adminDb.collection("users").where("role", "==", "ADMIN").limit(1).get(),
          adminDb.collection("users").where("role", "==", "SUPER_ADMIN").limit(1).get(),
        ]);
        if (!existingAdmins.empty || !existingSuperAdmins.empty) {
          return NextResponse.json(
            { error: "이미 관리자가 존재합니다. ADMIN_SETUP_KEY 환경변수를 설정해주세요." },
            { status: 403 }
          );
        }
      }
    }

    // Firebase Auth에서 이메일로 사용자 찾기
    const userRecord = await adminAuth.getUserByEmail(email);

    const assignedRole = isSuperAdminEmail ? "SUPER_ADMIN" : "ADMIN";

    // Firestore users 문서 확인 및 업데이트
    const userRef = adminDb.collection("users").doc(userRecord.uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      await userRef.update({
        role: assignedRole,
        updatedAt: new Date(),
      });
    } else {
      // users 문서가 없는 경우 (Google 로그인으로 가입한 경우 등)
      await userRef.set({
        email: userRecord.email,
        name: userRecord.displayName || email.split("@")[0],
        phone: null,
        address: null,
        role: assignedRole,
        image: userRecord.photoURL || null,
        emailVerified: userRecord.emailVerified ? new Date() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({
      message: `${email} 계정이 ${
        assignedRole === "SUPER_ADMIN" ? "슈퍼관리자" : "관리자"
      }로 설정되었습니다.`,
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
