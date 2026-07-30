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

    const {
      examId,
      answers,
      questionIds,
      /** false = 시간 내 임시 제출(수정 가능, 점수·정답 비공개), true = 최종 제출 */
      final,
      /** 첫 제출 때 남은 시간(초) — 서버가 수정 가능 기한을 못박는 데 쓴다 */
      remainingSec,
    } = await request.json();

    if (!examId || !answers || typeof answers !== "object") {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    // 예전 클라이언트(final 미전달)는 기존처럼 바로 최종 제출로 본다
    const wantFinal = final !== false;

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

    /* ── 제출 저장 ─────────────────────────────────────
     * 시간 내에는 같은 제출을 고쳐 쓴다(새 제출을 만들지 않는다).
     * status IN_PROGRESS = 제출했지만 수정 가능한 상태 (관리자 채점 목록엔 안 잡힌다)
     * status GRADED      = 최종 제출 (점수·정답 공개)
     * ────────────────────────────────────────────────── */
    const now = new Date();

    // 이 시험의 「수정 가능한 제출」이 이미 있으면 그걸 고쳐 쓴다
    const openSnap = await adminDb
      .collection("examSubmissions")
      .where("userId", "==", userId)
      .where("examId", "==", examId)
      .where("status", "==", "IN_PROGRESS")
      .limit(1)
      .get();
    const openDoc = openSnap.docs[0];

    // 이미 최종 제출한 시험은 다시 손대지 못하게 막는다
    if (!openDoc) {
      const doneSnap = await adminDb
        .collection("examSubmissions")
        .where("userId", "==", userId)
        .where("examId", "==", examId)
        .where("status", "==", "GRADED")
        .limit(1)
        .get();
      if (!doneSnap.empty) {
        return NextResponse.json(
          { error: "이미 최종 제출한 시험입니다." },
          { status: 409 }
        );
      }
    }

    /* 수정 가능 기한 — 첫 제출 때 못박고, 그다음부터는 서버가 가진 값만 믿는다.
       그래서 첫 제출 이후에는 클라이언트가 시간을 조작해도 늘릴 수 없다. */
    let editableUntil: Date;
    if (openDoc) {
      const raw = openDoc.data().editableUntil;
      editableUntil = raw?.toDate ? raw.toDate() : new Date(0);
    } else {
      const capSec = Math.max(0, (examData.duration ?? 0) * 60);
      const askedSec = Number.isFinite(remainingSec)
        ? Math.max(0, Math.floor(remainingSec))
        : 0;
      editableUntil = new Date(now.getTime() + Math.min(askedSec, capSec) * 1000);
    }

    // 기한이 지났으면 학생이 「임시 제출」을 눌러도 최종 제출로 확정한다
    const isFinal = wantFinal || now.getTime() >= editableUntil.getTime();

    const submissionRef = openDoc
      ? openDoc.ref
      : adminDb.collection("examSubmissions").doc();

    /* 최종 제출이 아니면 채점 결과를 **문서에도 남기지 않는다.**
       examSubmissions 는 학생이 읽을 수 있어서(마이페이지), 점수를 적어 두면
       거기서 점수를 엿보고 돌아와 답을 고칠 수 있게 된다. */
    await submissionRef.set(
      {
        userId,
        examId,
        status: isFinal ? "GRADED" : "IN_PROGRESS",
        score: isFinal ? earnedPoints : null,
        totalPoints: isFinal ? totalPoints : null,
        passed: isFinal ? passed : null,
        startedAt: openDoc ? openDoc.data().startedAt ?? now : now,
        submittedAt: now,
        gradedAt: isFinal ? now : null,
        gradedBy: isFinal ? "SYSTEM" : null,
        editableUntil,
        paymentId: null,
        feedback: null,
      },
      { merge: true }
    );

    // 개별 답안 저장 (고칠 때마다 덮어쓴다).
    // 임시 제출 동안은 정답 여부·점수를 비워 둔다 — 같은 이유로 엿보기를 막는다.
    const batch = adminDb.batch();
    for (const [questionId, result] of Object.entries(answerResults)) {
      const answerRef = submissionRef.collection("answers").doc(questionId);
      batch.set(answerRef, {
        submissionId: submissionRef.id,
        questionId,
        answer: result.answer,
        fileUrl: null,
        points: isFinal ? result.points : 0,
        isCorrect: isFinal ? result.isCorrect : null,
      });
    }
    await batch.commit();

    /* 최종 제출이 아니면 점수·정답·해설을 **응답에 담지 않는다.**
       (담아 보내면 개발자도구로 볼 수 있어서 고쳐 쓰는 의미가 없어진다) */
    if (!isFinal) {
      return NextResponse.json({
        submissionId: submissionRef.id,
        final: false,
        saved: true,
        editableUntil: editableUntil.toISOString(),
        answeredCount: Object.keys(answerResults).filter(
          (id) => answerResults[id].answer !== ""
        ).length,
      });
    }

    return NextResponse.json({
      submissionId: submissionRef.id,
      final: true,
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
