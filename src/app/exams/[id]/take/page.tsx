"use client";

import { useState, useEffect, useCallback } from "react";

// 데모 시험 문제
const DEMO_QUESTIONS = [
  {
    id: "1",
    type: "MULTIPLE_CHOICE",
    content: "다음 중 대규모 언어 모델(LLM)의 특징으로 올바르지 않은 것은?",
    options: [
      "자연어를 이해하고 생성할 수 있다",
      "학습된 데이터를 기반으로 응답한다",
      "실시간 인터넷 검색이 항상 가능하다",
      "프롬프트에 따라 다양한 형식의 출력이 가능하다",
    ],
    points: 5,
  },
  {
    id: "2",
    type: "MULTIPLE_CHOICE",
    content: "프롬프트 엔지니어링에서 'Few-shot' 기법이란?",
    options: [
      "AI에게 매우 짧은 프롬프트를 주는 것",
      "예시를 몇 개 포함하여 원하는 형식을 안내하는 것",
      "프롬프트를 여러 번 반복하는 것",
      "AI의 온도 설정을 낮추는 것",
    ],
    points: 5,
  },
  {
    id: "3",
    type: "MULTIPLE_CHOICE",
    content: "AI 이미지 생성 도구가 아닌 것은?",
    options: ["Midjourney", "DALL-E", "Stable Diffusion", "GitHub Copilot"],
    points: 5,
  },
  {
    id: "4",
    type: "MULTIPLE_CHOICE",
    content:
      "ChatGPT에서 시스템 프롬프트(System Prompt)의 역할은?",
    options: [
      "사용자의 입력을 차단하는 것",
      "AI의 행동 방식과 역할을 설정하는 것",
      "대화 내용을 저장하는 것",
      "AI의 학습 데이터를 업데이트하는 것",
    ],
    points: 5,
  },
  {
    id: "5",
    type: "MULTIPLE_CHOICE",
    content:
      "AI를 활용한 코드 작성 시 가장 중요한 점은?",
    options: [
      "AI가 생성한 코드를 그대로 사용한다",
      "생성된 코드를 검토하고 테스트한 후 사용한다",
      "가능한 한 긴 프롬프트를 작성한다",
      "하나의 AI 도구만 사용한다",
    ],
    points: 5,
  },
];

export default function ExamTakePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60분 (초)
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // 정답 (데모)
  const correctAnswers: Record<string, number> = {
    "1": 2,
    "2": 1,
    "3": 3,
    "4": 1,
    "5": 1,
  };

  useEffect(() => {
    if (isSubmitted) return;
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted]);

  const handleAnswer = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = useCallback(() => {
    let totalScore = 0;
    DEMO_QUESTIONS.forEach((q) => {
      if (answers[q.id] === correctAnswers[q.id]) {
        totalScore += q.points;
      }
    });
    setScore(totalScore);
    setIsSubmitted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const totalPoints = DEMO_QUESTIONS.reduce((sum, q) => sum + q.points, 0);
  const question = DEMO_QUESTIONS[currentQuestion];
  const passed = score !== null && score >= totalPoints * 0.7;

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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 타이머 & 진행 상황 */}
      <div className="flex items-center justify-between mb-6 bg-muted rounded-xl p-4">
        <div className="text-sm">
          <span className="font-medium">
            문제 {currentQuestion + 1} / {DEMO_QUESTIONS.length}
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
      <div className="flex gap-2 mb-6">
        {DEMO_QUESTIONS.map((q, idx) => (
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
          <span className="text-xs text-muted-foreground">객관식</span>
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
        {currentQuestion === DEMO_QUESTIONS.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition"
          >
            시험 제출하기
          </button>
        ) : (
          <button
            onClick={() =>
              setCurrentQuestion(
                Math.min(DEMO_QUESTIONS.length - 1, currentQuestion + 1)
              )
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
