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

    const { examId, answers } = await request.json();

    if (!examId || !answers || typeof answers !== "object") {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    // 시험 정보 조회
    const examDoc = await adminDb.collection("exams").doc(examId).get();
    if (!examDoc.exists) {
      return NextResponse.json({ error: "존재하지 않는 시험입니다." }, { status: 404 });
    }

    // 자격증 타입 조회 (합격 기준 점수)
    const examData = examDoc.data()!;
    const certTypeDoc = await adminDb.collection("certificateTypes").doc(examData.certificateTypeId).get();
    const passingScore = certTypeDoc.exists ? (certTypeDoc.data()!.passingScore ?? 70) : 70;

    // 문제 및 정답 조회
    const questionsSnapshot = await adminDb
      .collection("exams")
      .doc(examId)
      .collection("questions")
      .get();

    let totalPoints = 0;
    let earnedPoints = 0;

    const questionMap: Record<string, { correctAnswer: string | null; points: number }> = {};
    questionsSnapshot.docs.forEach((doc) => {
      const q = doc.data();
      totalPoints += q.points || 0;
      questionMap[doc.id] = {
        correctAnswer: q.correctAnswer ?? null,
        points: q.points || 0,
      };
    });

    // 채점
    const answerResults: Record<string, { answer: string; isCorrect: boolean | null; points: number }> = {};

    for (const [questionId, answer] of Object.entries(answers)) {
      const question = questionMap[questionId];
      if (!question) continue;

      const isCorrect = question.correctAnswer !== null
        ? String(answer) === String(question.correctAnswer)
        : null; // correctAnswer가 없으면 수동 채점 필요

      if (isCorrect) {
        earnedPoints += question.points;
      }

      answerResults[questionId] = {
        answer: String(answer),
        isCorrect,
        points: isCorrect ? question.points : 0,
      };
    }

    // 합격/불합격 판정 (100점 만점 기준 환산)
    const scorePercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = scorePercentage >= passingScore;

    // examSubmission 저장
    const submissionRef = await adminDb.collection("examSubmissions").add({
      userId,
      examId,
      status: "GRADED",
      score: earnedPoints,
      totalPoints,
      passed,
      startedAt: new Date(),
      submittedAt: new Date(),
      gradedAt: new Date(),
      gradedBy: "SYSTEM",
      paymentId: null,
      feedback: null,
    });

    // 개별 답안 저장
    const batch = adminDb.batch();
    for (const [questionId, result] of Object.entries(answerResults)) {
      const answerRef = adminDb
        .collection("examSubmissions")
        .doc(submissionRef.id)
        .collection("answers")
        .doc(questionId);

      batch.set(answerRef, {
        submissionId: submissionRef.id,
        questionId,
        answer: result.answer,
        fileUrl: null,
        points: result.points,
        isCorrect: result.isCorrect,
      });
    }
    await batch.commit();

    return NextResponse.json({
      submissionId: submissionRef.id,
      score: earnedPoints,
      totalPoints,
      scorePercentage,
      passed,
      passingScore,
    });
  } catch (error) {
    console.error("Exam submission error:", error);
    return NextResponse.json(
      { error: "시험 제출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
