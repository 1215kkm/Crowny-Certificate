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

    const { examId, answers, questionIds } = await request.json();

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

    let earnedPoints = 0;

    type QInfo = {
      correctAnswer: string | null;
      points: number;
      content: string;
      options: string[];
      type: string;
      explanation: string | null;
    };
    const questionMap: Record<string, QInfo> = {};
    questionsSnapshot.docs.forEach((doc) => {
      const q = doc.data();
      questionMap[doc.id] = {
        correctAnswer: q.correctAnswer ?? null,
        points: q.points || 0,
        content: q.content ?? "",
        options: Array.isArray(q.options) ? q.options : [],
        type: q.type ?? "MULTIPLE_CHOICE",
        explanation: q.explanation ?? null,
      };
    });

    // 채점 대상 = 실제 출제된 문항(questionIds). 미전달 시 제출된 문항으로 폴백.
    const gradedIds: string[] =
      Array.isArray(questionIds) && questionIds.length > 0
        ? questionIds.filter((id: string) => questionMap[id])
        : Object.keys(answers).filter((id) => questionMap[id]);

    // 채점 + 문항별 리뷰(정답/해설) 생성. 미답변 문항은 오답 처리.
    const answerResults: Record<string, { answer: string; isCorrect: boolean | null; points: number }> = {};
    const review: Array<{
      questionId: string;
      content: string;
      options: string[];
      type: string;
      points: number;
      userAnswer: number | null;
      correctAnswer: number | null;
      isCorrect: boolean;
      explanation: string | null;
    }> = [];
    let totalPoints = 0;

    for (const questionId of gradedIds) {
      const question = questionMap[questionId];
      totalPoints += question.points;

      const rawAnswer = (answers as Record<string, unknown>)[questionId];
      const answered = rawAnswer !== undefined && rawAnswer !== null && rawAnswer !== "";
      const isCorrect =
        answered && question.correctAnswer !== null
          ? String(rawAnswer) === String(question.correctAnswer)
          : false;

      if (isCorrect) {
        earnedPoints += question.points;
      }

      answerResults[questionId] = {
        answer: answered ? String(rawAnswer) : "",
        isCorrect,
        points: isCorrect ? question.points : 0,
      };

      review.push({
        questionId,
        content: question.content,
        options: question.options,
        type: question.type,
        points: question.points,
        userAnswer: answered ? Number(rawAnswer) : null,
        correctAnswer:
          question.correctAnswer !== null ? Number(question.correctAnswer) : null,
        isCorrect,
        explanation: question.explanation,
      });
    }

    // 합격/불합격 판정 (제출된 문항 총점 기준 환산)
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
      review,
    });
  } catch (error) {
    console.error("Exam submission error:", error);
    return NextResponse.json(
      { error: "시험 제출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
