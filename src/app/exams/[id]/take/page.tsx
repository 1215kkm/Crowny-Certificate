"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import {
  getDocument,
  getDocs,
  query,
  orderBy,
  questionsCollection,
  type ExamDoc,
  type ExamQuestionDoc,
} from "@/lib/firestore";

interface Question {
  id: string;
  type: string;
  content: string;
  options: string[];
  points: number;
}

export default function ExamTakePage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [exam, setExam] = useState<(ExamDoc & { id: string }) | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [passed, setPassed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }

    async function fetchExam() {
      try {
        const examData = await getDocument<ExamDoc>("exams", examId);
        if (!examData) {
          setLoading(false);
          return;
        }
        setExam(examData);
        setTimeLeft(examData.duration * 60);

        // 문제 로드 (correctAnswer 제외 — 클라이언트에 노출하지 않음)
        const qSnap = await getDocs(
          query(questionsCollection(examId), orderBy("order"))
        );
        const qs: Question[] = qSnap.docs.map((d) => {
          const data = d.data() as ExamQuestionDoc;
          return {
            id: d.id,
            type: data.type,
            content: data.content,
            options: data.options || [],
            points: data.points,
          };
        });
        setQuestions(qs);
        setTotalPoints(qs.reduce((sum, q) => sum + q.points, 0));
      } catch (error) {
        console.error("시험 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchExam();
  }, [examId, user, authLoading, router]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitted || submitting || !user) return;
    setSubmitting(true);

    try {
      const { getFirebaseAuth } = await import("@/lib/firebase");
      const token = await getFirebaseAuth().currentUser?.getIdToken();

      const res = await fetch("/api/exams/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ examId, answers }),
      });

      const data = await res.json();
      if (res.ok) {
        setScore(data.score);
        setTotalPoints(data.totalPoints);
        setPassed(data.passed);
        setIsSubmitted(true);
      } else {
        alert(data.error || "제출에 실패했습니다.");
      }
    } catch {
      alert("제출 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }, [examId, answers, user, isSubmitted, submitting]);

  useEffect(() => {
    if (isSubmitted || loading || !exam) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, loading, exam, handleSubmit]);

  const handleAnswer = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">시험을 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-4">시험 정보가 없거나 문제가 등록되지 않았습니다.</p>
        <a href="/exams" className="text-primary hover:underline">시험 목록으로 돌아가기</a>
      </div>
    );
  }

  if (isSubmitted && score !== null) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div
          className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold ${
            passed ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {passed ? "합격" : "불합격"}
        </div>
        <h1 className="text-3xl font-bold mb-2">시험 결과</h1>
        <p className="text-muted-foreground mb-8">
          {passed
            ? "축하합니다! 시험에 합격하셨습니다."
            : "아쉽지만 불합격입니다. 다시 도전해보세요."}
        </p>
        <div className="bg-muted rounded-xl p-6 mb-8">
          <div className="text-4xl font-bold text-primary mb-2">
            {score} / {totalPoints}점
          </div>
          <div className="text-sm text-muted-foreground">
            합격 기준: {Math.ceil(totalPoints * 0.7)}점 이상
          </div>
        </div>
        {passed && (
          <a
            href="/certificates"
            className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition inline-block"
          >
            인증서 발급 신청하기
          </a>
        )}
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 타이머 & 진행 상황 */}
      <div className="flex items-center justify-between mb-6 bg-muted rounded-xl p-4">
        <div className="text-sm">
          <span className="font-medium">
            문제 {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        <div
          className={`text-lg font-mono font-bold ${
            timeLeft < 300 ? "text-red-500" : "text-foreground"
          }`}
        >
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* 문제 번호 네비게이션 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestion(idx)}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
              idx === currentQuestion
                ? "bg-primary text-white"
                : answers[q.id] !== undefined
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* 문제 */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded font-medium">
            {question.points}점
          </span>
          <span className="text-xs text-muted-foreground">
            {question.type === "MULTIPLE_CHOICE" ? "객관식" : question.type}
          </span>
        </div>
        <h2 className="text-lg font-bold mb-6">{question.content}</h2>
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(question.id, idx)}
              className={`w-full text-left p-4 rounded-lg border transition ${
                answers[question.id] === idx
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <span className="font-medium mr-3">
                {String.fromCharCode(9312 + idx)}
              </span>
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-2 rounded-lg border border-border hover:bg-muted transition disabled:opacity-30"
        >
          이전 문제
        </button>
        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50"
          >
            {submitting ? "제출 중..." : "시험 제출하기"}
          </button>
        ) : (
          <button
            onClick={() =>
              setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))
            }
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition"
          >
            다음 문제
          </button>
        )}
      </div>
    </div>
  );
}
