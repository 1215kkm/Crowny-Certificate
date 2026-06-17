import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { GRADE_3_QUESTIONS } from "@/data/grade-3-questions";

/**
 * 시험 문제 시드 API
 * POST /api/admin/seed-questions
 * Body: { examId: string }
 *
 * 관리자 인증 필요. 지정된 시험의 questions 서브컬렉션에 문제를 일괄 등록합니다.
 */
export async function POST(request: Request) {
  try {
    // 인증 확인
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // 관리자 역할 확인
    const userDoc = await adminDb.collection("users").doc(userId).get();
    if (!userDoc.exists || userDoc.data()?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    const { examId } = await request.json();

    if (!examId) {
      return NextResponse.json(
        { error: "examId가 필요합니다." },
        { status: 400 }
      );
    }

    // 시험 존재 여부 확인
    const examDoc = await adminDb.collection("exams").doc(examId).get();
    if (!examDoc.exists) {
      return NextResponse.json(
        { error: "존재하지 않는 시험입니다." },
        { status: 404 }
      );
    }

    // 기존 문제 존재 여부 확인
    const existingQuestions = await adminDb
      .collection("exams")
      .doc(examId)
      .collection("questions")
      .limit(1)
      .get();

    if (!existingQuestions.empty) {
      return NextResponse.json(
        {
          error:
            "이미 문제가 등록된 시험입니다. 기존 문제를 삭제한 후 다시 시도해주세요.",
        },
        { status: 409 }
      );
    }

    // Firestore 배치 쓰기 (500개 제한이 있으므로 40개는 한 배치로 처리 가능)
    const batch = adminDb.batch();
    const questionsRef = adminDb
      .collection("exams")
      .doc(examId)
      .collection("questions");

    const now = new Date();

    for (const question of GRADE_3_QUESTIONS) {
      const docRef = questionsRef.doc();
      batch.set(docRef, {
        examId,
        type: question.type,
        content: question.content,
        options: question.options,
        correctAnswer: question.correctAnswer,
        points: question.points,
        order: question.order,
        explanation: question.explanation,
        createdAt: now,
      });
    }

    await batch.commit();

    return NextResponse.json({
      message: `${GRADE_3_QUESTIONS.length}개의 문제가 성공적으로 등록되었습니다.`,
      questionCount: GRADE_3_QUESTIONS.length,
      totalPoints: GRADE_3_QUESTIONS.reduce((sum, q) => sum + q.points, 0),
    });
  } catch (error) {
    console.error("Seed questions error:", error);
    return NextResponse.json(
      { error: "문제 등록 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
