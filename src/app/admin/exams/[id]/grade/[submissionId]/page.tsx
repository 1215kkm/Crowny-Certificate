"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  getDocument,
  questionsCollection,
  answersCollection,
  type ExamDoc,
  type ExamSubmissionDoc,
  type ExamQuestionDoc,
  type SubmissionAnswerDoc,
} from "@/lib/firestore";
import { getDocs, query, orderBy } from "firebase/firestore";
import { getIdToken } from "@/lib/firebase-auth";

interface QuestionWithAnswer {
  questionId: string;
  content: string;
  type: string;
  options: string[];
  correctAnswer: string | null;
  maxPoints: number;
  order: number;
  explanation: string | null;
  studentAnswer: string;
  awardedPoints: number;
}

export default function GradingPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;
  const submissionId = params.submissionId as string;

  const [exam, setExam] = useState<(ExamDoc & { id: string }) | null>(null);
  const [submission, setSubmission] = useState<
    (ExamSubmissionDoc & { id: string }) | null
  >(null);
  const [items, setItems] = useState<QuestionWithAnswer[]>([]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading || !isAdmin) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const [examDoc, subDoc] = await Promise.all([
          getDocument<ExamDoc>("exams", examId),
          getDocument<ExamSubmissionDoc>("examSubmissions", submissionId),
        ]);
        setExam(examDoc);
        setSubmission(subDoc);
        setFeedback(subDoc?.feedback || "");

        // 문항 로드
        const questionsSnap = await getDocs(
          query(questionsCollection(examId), orderBy("order"))
        );
        const questions: (ExamQuestionDoc & { docId: string })[] =
          questionsSnap.docs.map((d) => ({
            docId: d.id,
            ...(d.data() as ExamQuestionDoc),
          }));

        // 학생 답안 로드
        const answersSnap = await getDocs(answersCollection(submissionId));
        const answerMap: Record<string, SubmissionAnswerDoc> = {};
        answersSnap.docs.forEach((d) => {
          answerMap[d.id] = d.data() as SubmissionAnswerDoc;
        });

        setItems(
          questions.map((q) => {
            const ans = answerMap[q.docId];
            return {
              questionId: q.docId,
              content: q.content,
              type: q.type,
              options: q.options,
              correctAnswer: q.correctAnswer,
              maxPoints: q.points,
              order: q.order,
              explanation: q.explanation,
              studentAnswer: ans?.answer || "(미답변)",
              awardedPoints: ans?.points ?? 0,
            };
          })
        );
      } catch (error) {
        console.error("채점 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isAdmin, authLoading, examId, submissionId]);

  const updatePoints = (questionId: string, points: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.questionId === questionId
          ? { ...item, awardedPoints: Math.min(points, item.maxPoints) }
          : item
      )
    );
  };

  const totalAwarded = items.reduce((sum, i) => sum + i.awardedPoints, 0);
  const totalMax = items.reduce((sum, i) => sum + i.maxPoints, 0);

  const handleSubmitGrade = async () => {
    if (!confirm("채점을 완료하시겠습니까?")) return;
    setSubmitting(true);

    try {
      const token = await getIdToken();
      const grades: Record<string, { points: number }> = {};
      items.forEach((item) => {
        grades[item.questionId] = { points: item.awardedPoints };
      });

      const res = await fetch("/api/exams/grade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          submissionId,
          examId,
          grades,
          feedback,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "채점 실패");
      }

      const result = await res.json();
      alert(
        `채점 완료! 점수: ${result.score}/${result.totalPoints} (${result.scorePercentage}%) - ${result.passed ? "합격" : "불합격"}`
      );
      router.push("/admin/exams");
    } catch (error) {
      console.error("채점 제출 실패:", error);
      alert(
        error instanceof Error ? error.message : "채점 제출에 실패했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdmin && !authLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">접근 권한이 없습니다</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  const TYPE_LABELS: Record<string, string> = {
    MULTIPLE_CHOICE: "객관식",
    SHORT_ANSWER: "단답형",
    ESSAY: "서술형",
    FILE_UPLOAD: "파일",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/admin/exams"
          className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block"
        >
          &larr; 시험 관리
        </Link>
        <h1 className="text-2xl font-bold">채점</h1>
        {exam && (
          <p className="text-muted-foreground">시험: {exam.title}</p>
        )}
        {submission && (
          <p className="text-sm text-muted-foreground">
            응시자: {submission.userId.substring(0, 12)}...
          </p>
        )}
      </div>

      {/* 점수 요약 */}
      <div className="bg-card border border-border rounded-xl p-4 mb-6 flex items-center justify-between">
        <div>
          <span className="text-sm text-muted-foreground">현재 점수: </span>
          <span className="text-xl font-bold text-primary">
            {totalAwarded}
          </span>
          <span className="text-muted-foreground"> / {totalMax}</span>
          <span className="text-sm text-muted-foreground ml-2">
            ({totalMax > 0 ? Math.round((totalAwarded / totalMax) * 100) : 0}
            %)
          </span>
        </div>
      </div>

      {/* 문항별 채점 */}
      <div className="space-y-6">
        {items.map((item, idx) => (
          <div
            key={item.questionId}
            className="border border-border rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded">
                  {item.order || idx + 1}번
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {TYPE_LABELS[item.type] || item.type}
                </span>
                <span className="text-xs text-muted-foreground">
                  최대 {item.maxPoints}점
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">배점:</label>
                <input
                  type="number"
                  min={0}
                  max={item.maxPoints}
                  value={item.awardedPoints}
                  onChange={(e) =>
                    updatePoints(item.questionId, Number(e.target.value))
                  }
                  className="w-20 px-2 py-1 border border-border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">
                  / {item.maxPoints}
                </span>
              </div>
            </div>

            <p className="font-medium mb-3">{item.content}</p>

            {/* 객관식 보기 */}
            {item.type === "MULTIPLE_CHOICE" && item.options.length > 0 && (
              <div className="ml-4 mb-3 space-y-1">
                {item.options.map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    className={`text-sm ${
                      item.correctAnswer === String(optIdx + 1)
                        ? "text-green-600 font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {optIdx + 1}. {opt}
                    {item.correctAnswer === String(optIdx + 1) && " (정답)"}
                  </div>
                ))}
              </div>
            )}

            {/* 학생 답변 */}
            <div className="bg-blue-50 rounded-lg p-3 mb-2">
              <span className="text-sm font-medium text-blue-700">
                학생 답변:{" "}
              </span>
              <span className="text-sm">{item.studentAnswer}</span>
            </div>

            {item.correctAnswer && item.type !== "MULTIPLE_CHOICE" && (
              <div className="bg-green-50 rounded-lg p-3">
                <span className="text-sm font-medium text-green-700">
                  정답:{" "}
                </span>
                <span className="text-sm">{item.correctAnswer}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 종합 피드백 */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">
          종합 피드백 (응시자에게 표시됨)
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="합격/불합격 사유, 개선 사항 등을 입력하세요"
        />
      </div>

      {/* 제출 */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSubmitGrade}
          disabled={submitting}
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition disabled:opacity-50"
        >
          {submitting ? "채점 중..." : "채점 완료"}
        </button>
        <Link
          href="/admin/exams"
          className="border border-border px-6 py-3 rounded-lg font-medium hover:bg-muted transition"
        >
          취소
        </Link>
      </div>
    </div>
  );
}
