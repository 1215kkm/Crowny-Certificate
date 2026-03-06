import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    // 인증 확인
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // 관리자 역할 확인
    const userDoc = await adminDb.collection("users").doc(userId).get();
    if (!userDoc.exists || userDoc.data()?.role !== "ADMIN") {
      return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
    }

    const { submissionId, examId, grades, feedback } = await request.json();

    if (!submissionId || !examId || !grades) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    // 제출 정보 확인
    const submissionDoc = await adminDb.collection("examSubmissions").doc(submissionId).get();
    if (!submissionDoc.exists) {
      return NextResponse.json({ error: "존재하지 않는 제출입니다." }, { status: 404 });
    }

    // 자격증 타입에서 합격 기준 점수 조회
    const examDoc = await adminDb.collection("exams").doc(examId).get();
    if (!examDoc.exists) {
      return NextResponse.json({ error: "존재하지 않는 시험입니다." }, { status: 404 });
    }
    const examData = examDoc.data()!;
    const certTypeDoc = await adminDb.collection("certificateTypes").doc(examData.certificateTypeId).get();
    const passingScore = certTypeDoc.exists ? (certTypeDoc.data()!.passingScore ?? 70) : 70;

    // 총점 계산
    const questionsSnapshot = await adminDb
      .collection("exams")
      .doc(examId)
      .collection("questions")
      .get();

    let totalPoints = 0;
    questionsSnapshot.docs.forEach((doc) => {
      totalPoints += doc.data().points || 0;
    });

    // 개별 답안 점수 업데이트
    const batch = adminDb.batch();
    let earnedPoints = 0;

    for (const [questionId, grade] of Object.entries(grades)) {
      const { points } = grade as { points: number };
      earnedPoints += points;

      const answerRef = adminDb
        .collection("examSubmissions")
        .doc(submissionId)
        .collection("answers")
        .doc(questionId);

      const answerDoc = await answerRef.get();
      if (answerDoc.exists) {
        batch.update(answerRef, {
          points,
          isCorrect: points > 0,
        });
      }
    }

    // 합격/불합격 판정
    const scorePercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = scorePercentage >= passingScore;

    // submission 업데이트
    const submissionRef = adminDb.collection("examSubmissions").doc(submissionId);
    batch.update(submissionRef, {
      status: "GRADED",
      score: earnedPoints,
      totalPoints,
      passed,
      gradedAt: new Date(),
      gradedBy: userId,
      feedback: feedback || null,
    });

    await batch.commit();

    return NextResponse.json({
      score: earnedPoints,
      totalPoints,
      scorePercentage,
      passed,
      passingScore,
    });
  } catch (error) {
    console.error("Grading error:", error);
    return NextResponse.json(
      { error: "채점 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
