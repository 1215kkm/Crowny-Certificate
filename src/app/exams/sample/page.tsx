"use client";

/**
 * 로그인 없이 체험하는 샘플 시험 페이지
 * - 로그인/결제/Firebase 없이 완전히 클라이언트에서 동작
 * - 로컬 GRADE_3_QUESTIONS 데이터에서 10문항을 랜덤 출제
 * - 제출 즉시 채점 + 해설 제공 (체험용이므로 부정행위 차단은 적용하지 않음)
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle2,
  XCircle,
  RotateCcw,
  LogIn,
} from "lucide-react";
import { GRADE_3_QUESTIONS, type GradeQuestion } from "@/data/grade-3-questions";

const SAMPLE_COUNT = 10; // 체험용 출제 문항 수
const SAMPLE_MINUTES = 15; // 체험용 제한 시간(분)

function pickQuestions(): GradeQuestion[] {
  const shuffled = [...GRADE_3_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(SAMPLE_COUNT, GRADE_3_QUESTIONS.length));
}

export default function SampleExamPage() {
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [questions, setQuestions] = useState<GradeQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(SAMPLE_MINUTES * 60);

  // 최초 진입 시 문제 세트 준비
  useEffect(() => {
    setQuestions(pickQuestions());
  }, []);

  const totalPoints = useMemo(
    () => questions.reduce((sum, q) => sum + q.points, 0),
    [questions]
  );

  const { earned, correctCount } = useMemo(() => {
    let e = 0;
    let c = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] !== undefined && String(answers[idx]) === q.correctAnswer) {
        e += q.points;
        c += 1;
      }
    });
    return { earned: e, correctCount: c };
  }, [answers, questions]);

  const scorePercent =
    totalPoints > 0 ? Math.round((earned / totalPoints) * 100) : 0;
  const passed = scorePercent >= 70;

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // 타이머
  useEffect(() => {
    if (!started || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, submitted, handleSubmit]);

  const restart = () => {
    setQuestions(pickQuestions());
    setAnswers({});
    setCurrent(0);
    setTimeLeft(SAMPLE_MINUTES * 60);
    setSubmitted(false);
    setStarted(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(answers).length;

  // ── 시작 전 안내 화면 ──────────────────────────────
  if (!started && !submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white border border-border rounded-2xl p-8 text-center shadow-sm">
          <div className="bg-gradient-brand w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full mb-4">
            로그인 없이 체험 가능
          </span>
          <h1 className="text-2xl font-bold mb-2">AI 자격증 3급 샘플 시험</h1>
          <p className="text-muted-foreground mb-8">
            실제 시험이 어떻게 진행되는지 미리 체험해보세요.
            <br />
            회원가입이나 결제 없이 바로 응시할 수 있습니다.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-2">
            <h3 className="font-bold text-lg mb-3">📋 체험 시험 안내</h3>
            <p>• 문제 수: <strong>{SAMPLE_COUNT}문항</strong> (전체 40문항 중 랜덤)</p>
            <p>• 제한 시간: <strong>{SAMPLE_MINUTES}분</strong></p>
            <p>• 합격 기준: <strong>70점 이상</strong></p>
            <p>• 제출 즉시 <strong>채점 결과와 해설</strong>을 확인할 수 있습니다.</p>
            <p className="text-muted-foreground pt-2 text-sm">
              ※ 체험 시험은 실제 자격증 발급과 무관하며 기록되지 않습니다.
            </p>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="bg-gradient-brand text-white px-10 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-md w-full sm:w-auto"
          >
            샘플 시험 시작하기
          </button>
          <div className="mt-4">
            <Link
              href="/exams"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              ← 시험 목록으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── 결과 화면 ─────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div
            className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold ${
              passed ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {passed ? "합격" : "불합격"}
          </div>
          <h1 className="text-3xl font-bold mb-2">체험 시험 결과</h1>
          <p className="text-muted-foreground">
            {passed
              ? "축하합니다! 합격 기준을 넘었습니다."
              : "아쉽지만 합격 기준에 미치지 못했습니다."}
          </p>
        </div>

        <div className="bg-muted rounded-xl p-6 mb-6 text-center">
          <div className="text-4xl font-bold text-primary mb-1">
            {earned} / {totalPoints}점
          </div>
          <div className="text-muted-foreground">
            정답 {correctCount} / {questions.length}문항 · {scorePercent}점 (100점 환산)
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            합격 기준: 70점 이상
          </div>
        </div>

        {/* 문항별 해설 */}
        <h2 className="text-xl font-bold mb-4">문항별 해설</h2>
        <div className="space-y-4 mb-8">
          {questions.map((q, idx) => {
            const userAnswer = answers[idx];
            const correctIdx = Number(q.correctAnswer);
            const isCorrect = userAnswer === correctIdx;
            return (
              <div
                key={idx}
                className="bg-white border border-border rounded-xl p-5"
              >
                <div className="flex items-start gap-2 mb-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <span className="font-bold">
                    Q{idx + 1}. {q.content}
                  </span>
                </div>
                <div className="space-y-2 mb-3 ml-7">
                  {q.options.map((opt, oIdx) => {
                    const isUser = userAnswer === oIdx;
                    const isAnswer = correctIdx === oIdx;
                    return (
                      <div
                        key={oIdx}
                        className={`text-sm px-3 py-2 rounded-lg border ${
                          isAnswer
                            ? "border-green-400 bg-green-50 text-green-800 font-medium"
                            : isUser
                              ? "border-red-300 bg-red-50 text-red-700"
                              : "border-gray-100 text-muted-foreground"
                        }`}
                      >
                        {oIdx + 1}. {opt}
                        {isAnswer && " ✓ 정답"}
                        {isUser && !isAnswer && " ← 내 답"}
                      </div>
                    );
                  })}
                  {userAnswer === undefined && (
                    <div className="text-sm text-muted-foreground">
                      (미응답)
                    </div>
                  )}
                </div>
                <div className="ml-7 text-sm bg-blue-50 text-blue-900 rounded-lg p-3">
                  💡 {q.explanation}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={restart}
            className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition"
          >
            <RotateCcw className="w-4 h-4" />
            다시 체험하기
          </button>
          <Link
            href="/auth/register"
            className="flex items-center justify-center gap-2 border border-border px-8 py-3 rounded-lg font-medium hover:bg-muted transition"
          >
            <LogIn className="w-4 h-4" />
            회원가입하고 실제 시험 응시
          </Link>
        </div>
      </div>
    );
  }

  // ── 시험 진행 화면 ─────────────────────────────────
  const question = questions[current];
  if (!question) return null;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 상단 바 */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-bold">AI 자격증 3급 샘플 시험</span>
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                체험
              </span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg ${
                timeLeft < 60
                  ? "bg-red-50 text-red-600 animate-pulse"
                  : "bg-gray-100 text-foreground"
              }`}
            >
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-muted-foreground whitespace-nowrap text-sm">
              {answeredCount} / {questions.length} 답변
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_240px] gap-6">
          {/* 메인 문제 */}
          <div>
            <div className="bg-white border border-border rounded-2xl p-6 mb-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary text-white text-sm px-3 py-1 rounded-lg font-bold">
                  Q{current + 1}
                </span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded font-medium text-sm">
                  {question.points}점
                </span>
                <span className="text-muted-foreground text-sm">객관식</span>
              </div>
              <h2 className="text-lg font-bold mb-6 leading-relaxed">
                {question.content}
              </h2>
              <div className="space-y-3">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [current]: idx }))
                    }
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      answers[current] === idx
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-100 hover:border-primary/30 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mr-3 font-bold text-sm ${
                        answers[current] === idx
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* 네비게이션 */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrent(Math.max(0, current - 1))}
                disabled={current === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-white transition disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
                이전
              </button>
              {current === questions.length - 1 ? (
                <button
                  onClick={() => {
                    if (
                      answeredCount < questions.length &&
                      !confirm(
                        `아직 ${questions.length - answeredCount}문제를 풀지 않았습니다. 제출하시겠습니까?`
                      )
                    ) {
                      return;
                    }
                    handleSubmit();
                  }}
                  className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition"
                >
                  <Send className="w-4 h-4" />
                  제출하고 채점
                </button>
              ) : (
                <button
                  onClick={() =>
                    setCurrent(Math.min(questions.length - 1, current + 1))
                  }
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition"
                >
                  다음
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 사이드바 */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl border border-border p-4 shadow-sm sticky top-4">
              <h3 className="font-bold mb-3">문제 목록</h3>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {questions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`w-10 h-10 rounded-lg font-medium transition ${
                      idx === current
                        ? "bg-primary text-white shadow-md"
                        : answers[idx] !== undefined
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <div className="space-y-2 text-muted-foreground border-t border-border pt-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-green-100 border border-green-300" />
                  답변 완료 ({answeredCount})
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-gray-50 border border-gray-200" />
                  미답변 ({questions.length - answeredCount})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 모바일 문제 번호 */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-3 z-40">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-9 h-9 rounded-lg font-medium shrink-0 transition ${
                  idx === current
                    ? "bg-primary text-white"
                    : answers[idx] !== undefined
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
