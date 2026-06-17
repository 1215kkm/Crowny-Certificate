"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import {
  Shield,
  AlertTriangle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";

interface Question {
  id: string;
  type: string;
  content: string;
  options: string[];
  points: number;
}

interface ReviewItem {
  questionId: string;
  content: string;
  options: string[];
  type: string;
  points: number;
  userAnswer: number | null;
  correctAnswer: number | null;
  isCorrect: boolean;
  explanation: string | null;
}

function useExamProtection(isActive: boolean) {
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) return;

    function addViolation() {
      setViolations((v) => v + 1);
      setShowWarning(true);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = setTimeout(() => setShowWarning(false), 3000);
    }

    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      addViolation();
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      addViolation();
    };

    const preventKeyboard = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && e.key === "p") ||
        (e.ctrlKey && e.key === "c") ||
        (e.ctrlKey && e.key === "s") ||
        (e.ctrlKey && e.key === "a") ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "u") ||
        e.key === "F12" ||
        (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5"))
      ) {
        e.preventDefault();
        addViolation();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation();
      }
    };

    const preventDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // 화면 녹화 감지 (Screen Capture / getDisplayMedia)
    let originalGetDisplayMedia: typeof navigator.mediaDevices.getDisplayMedia | null = null;
    if (navigator.mediaDevices?.getDisplayMedia) {
      originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = async function () {
        addViolation();
        setIsRecording(true);
        throw new Error("시험 중에는 화면 녹화가 허용되지 않습니다.");
      };
    }

    // Permissions API로 화면 캡처 상태 감지
    async function checkScreenCapture() {
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "display-capture" as PermissionName,
        });
        if (permissionStatus.state === "granted") {
          setIsRecording(true);
          addViolation();
        }
        permissionStatus.addEventListener("change", () => {
          if (permissionStatus.state === "granted") {
            setIsRecording(true);
            addViolation();
          }
        });
      } catch {
        // display-capture permission query not supported
      }
    }
    checkScreenCapture();

    // beforeunload 경고
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("keydown", preventKeyboard);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("dragstart", preventDragStart);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", preventKeyboard);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("dragstart", preventDragStart);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (originalGetDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
      }
    };
  }, [isActive]);

  return { violations, showWarning, isRecording };
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
  const [review, setReview] = useState<ReviewItem[]>([]);
  const [showOnlyWrong, setShowOnlyWrong] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  const { violations, showWarning, isRecording } = useExamProtection(examStarted && !isSubmitted);

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

        const qSnap = await getDocs(
          query(questionsCollection(examId), orderBy("order"))
        );
        const allQuestions: Question[] = qSnap.docs.map((d) => {
          const data = d.data() as ExamQuestionDoc;
          return {
            id: d.id,
            type: data.type,
            content: data.content,
            options: data.options || [],
            points: data.points,
          };
        });

        // 출제 문항 수(questionCount)만큼 랜덤 선택. 부족하면 전체 출제.
        // questionCount가 0/미설정이면 등록된 전체 문항을 출제한다.
        const count =
          examData.questionCount > 0
            ? Math.min(examData.questionCount, allQuestions.length)
            : allQuestions.length;
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        const qs = shuffled.slice(0, count);

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
        body: JSON.stringify({
          examId,
          answers,
          violations,
          questionIds: questions.map((q) => q.id),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setScore(data.score);
        setTotalPoints(data.totalPoints);
        setPassed(data.passed);
        setReview(Array.isArray(data.review) ? data.review : []);
        setIsSubmitted(true);
      } else {
        alert(data.error || "제출에 실패했습니다.");
      }
    } catch {
      alert("제출 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }, [examId, answers, user, isSubmitted, submitting, violations, questions]);

  useEffect(() => {
    if (isSubmitted || loading || !exam || !examStarted) return;
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
  }, [isSubmitted, loading, exam, handleSubmit, examStarted]);

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
        <p className="text-muted-foreground mb-4">
          시험 정보가 없거나 문제가 등록되지 않았습니다.
        </p>
        <a href="/exams" className="text-primary hover:underline">
          시험 목록으로 돌아가기
        </a>
      </div>
    );
  }

  // 시험 시작 전 안내 화면
  if (!examStarted && !isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white border border-border rounded-2xl p-8 text-center shadow-sm">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{exam.title}</h1>
          <p className="text-muted-foreground mb-8">
            시험을 시작하기 전에 아래 유의사항을 확인해주세요.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-3">
            <h3 className="font-bold text-lg mb-4">📋 시험 유의사항</h3>
            <div className="space-y-2">
              <p>• 시험 시간: <strong>{exam.duration}분</strong> (시간 초과 시 자동 제출)</p>
              <p>• 문제 수: <strong>{questions.length}문항</strong></p>
              <p>• 합격 기준: <strong>70점 이상</strong></p>
            </div>
            <hr className="my-4" />
            <div className="space-y-2 text-red-600">
              <p className="font-bold">⚠️ 부정행위 방지 안내</p>
              <p>• 시험 중 <strong>화면 캡처, 복사, 우클릭이 차단</strong>됩니다.</p>
              <p>• 시험 중 <strong>화면 녹화가 감지되면 위반으로 기록</strong>됩니다.</p>
              <p>• 시험 중 <strong>다른 탭/창으로 이동하면 위반으로 기록</strong>됩니다.</p>
              <p>• 위반 횟수가 시험 결과에 함께 기록됩니다.</p>
              <p>• 시험 시작 후 <strong>새로고침 시 진행 상황이 초기화</strong>됩니다.</p>
            </div>
          </div>

          <button
            onClick={() => setExamStarted(true)}
            className="bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-md"
          >
            시험 시작하기
          </button>
        </div>
      </div>
    );
  }

  // 시험 결과 화면
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
        <div className="bg-muted rounded-xl p-6 mb-6">
          <div className="text-4xl font-bold text-primary mb-2">
            {score} / {totalPoints}점
          </div>
          <div className="text-muted-foreground">
            합격 기준: {Math.ceil(totalPoints * 0.7)}점 이상
          </div>
        </div>
        {violations > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-orange-700">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">
                부정행위 의심 기록: {violations}회
              </span>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {passed ? (
            <a
              href="/certificates"
              className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition inline-block"
            >
              인증서 발급 신청하기
            </a>
          ) : (
            <a
              href="/exams"
              className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition inline-block"
            >
              시험 다시 신청하기
            </a>
          )}
          <a
            href="/mypage"
            className="border border-border px-8 py-3 rounded-lg font-medium hover:bg-muted transition inline-block"
          >
            마이페이지
          </a>
        </div>

        {/* 오답 / 해설 리뷰 */}
        {review.length > 0 && (
          <div className="mt-12 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-xl font-bold">
                문제 리뷰{" "}
                <span className="text-base font-normal text-muted-foreground">
                  (정답 {review.filter((r) => r.isCorrect).length} / 오답{" "}
                  {review.filter((r) => !r.isCorrect).length})
                </span>
              </h2>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyWrong}
                  onChange={(e) => setShowOnlyWrong(e.target.checked)}
                />
                틀린 문제만 보기
              </label>
            </div>

            {(showOnlyWrong ? review.filter((r) => !r.isCorrect) : review).length === 0 ? (
              <div className="border border-border rounded-xl p-6 text-center text-muted-foreground">
                틀린 문제가 없습니다. 축하합니다! 🎉
              </div>
            ) : (
              <div className="space-y-4">
                {(showOnlyWrong ? review.filter((r) => !r.isCorrect) : review).map(
                  (item) => (
                    <div
                      key={item.questionId}
                      className={`border rounded-xl p-5 ${
                        item.isCorrect
                          ? "border-green-200 bg-green-50/40"
                          : "border-red-200 bg-red-50/40"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium ${
                            item.isCorrect
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.isCorrect ? "정답" : item.userAnswer === null ? "미답변" : "오답"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.points}점
                        </span>
                      </div>
                      <p className="font-bold mb-3">{item.content}</p>
                      <div className="space-y-2">
                        {item.options.map((opt, optIdx) => {
                          const isCorrectOpt = item.correctAnswer === optIdx;
                          const isUserOpt = item.userAnswer === optIdx;
                          return (
                            <div
                              key={optIdx}
                              className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 border ${
                                isCorrectOpt
                                  ? "border-green-400 bg-green-50 text-green-800"
                                  : isUserOpt
                                    ? "border-red-400 bg-red-50 text-red-800"
                                    : "border-transparent text-muted-foreground"
                              }`}
                            >
                              <span className="font-bold w-5">{optIdx + 1}</span>
                              <span className="flex-1">{opt}</span>
                              {isCorrectOpt && (
                                <span className="text-xs font-medium text-green-700">
                                  정답
                                </span>
                              )}
                              {isUserOpt && !isCorrectOpt && (
                                <span className="text-xs font-medium text-red-700">
                                  내 선택
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {item.userAnswer === null && (
                        <p className="text-xs text-red-600 mt-2">
                          답을 선택하지 않은 문항입니다.
                        </p>
                      )}
                      {item.explanation && (
                        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                          <span className="font-bold text-blue-800">💡 해설 </span>
                          <span className="text-blue-700">{item.explanation}</span>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const question = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  return (
    <div
      className="min-h-screen bg-gray-50 exam-protected"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* 부정행위 경고 오버레이 */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl animate-bounce">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-600 mb-2">
              ⚠️ 부정행위 감지
            </h2>
            <p className="text-muted-foreground">
              화면 캡처, 복사, 탭 이동 등의 행위가 감지되었습니다.
              <br />
              위반 횟수가 시험 결과에 기록됩니다.
            </p>
            <p className="mt-3 font-bold text-red-500">
              누적 위반: {violations}회
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 상단 바: 타이머 + 진행 상황 */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-bold">{exam.title}</span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg ${
                timeLeft < 300
                  ? "bg-red-50 text-red-600 animate-pulse"
                  : timeLeft < 600
                    ? "bg-orange-50 text-orange-600"
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
            <span className="text-muted-foreground whitespace-nowrap">
              {answeredCount} / {questions.length} 답변
            </span>
          </div>
        </div>

        {/* 녹화 감지 경고 */}
        {isRecording && (
          <div className="bg-red-500 text-white rounded-xl p-4 mb-4 flex items-center gap-3 animate-pulse">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-bold">🔴 화면 녹화가 감지되었습니다</p>
              <p>녹화를 즉시 중단해주세요. 녹화 상태는 시험 결과에 기록됩니다.</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_240px] gap-6">
          {/* 메인 문제 영역 */}
          <div>
            <div className="bg-white border border-border rounded-2xl p-6 mb-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary text-white text-sm px-3 py-1 rounded-lg font-bold">
                  Q{currentQuestion + 1}
                </span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                  {question.points}점
                </span>
                <span className="text-muted-foreground">
                  {question.type === "MULTIPLE_CHOICE" ? "객관식" : question.type}
                </span>
              </div>
              <h2 className="text-lg font-bold mb-6 leading-relaxed">
                {question.content}
              </h2>
              <div className="space-y-3">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(question.id, idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      answers[question.id] === idx
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-100 hover:border-primary/30 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mr-3 font-bold text-sm ${
                        answers[question.id] === idx
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

            {/* 네비게이션 버튼 */}
            <div className="flex justify-between">
              <button
                onClick={() =>
                  setCurrentQuestion(Math.max(0, currentQuestion - 1))
                }
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-white transition disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
                이전 문제
              </button>
              {currentQuestion === questions.length - 1 ? (
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
                  disabled={submitting}
                  className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "제출 중..." : "시험 제출하기"}
                </button>
              ) : (
                <button
                  onClick={() =>
                    setCurrentQuestion(
                      Math.min(questions.length - 1, currentQuestion + 1)
                    )
                  }
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition"
                >
                  다음 문제
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 사이드바: 문제 번호 네비게이션 */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl border border-border p-4 shadow-sm sticky top-4">
              <h3 className="font-bold mb-3">문제 목록</h3>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`w-10 h-10 rounded-lg font-medium transition ${
                      idx === currentQuestion
                        ? "bg-primary text-white shadow-md"
                        : answers[q.id] !== undefined
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <div className="space-y-2 text-muted-foreground border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-green-100 border border-green-300" />
                  답변 완료 ({answeredCount})
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-gray-50" />
                  미답변 ({questions.length - answeredCount})
                </div>
              </div>
              {violations > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span>위반 {violations}회</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 모바일용 문제 번호 (하단 고정) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-3 z-40">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-9 h-9 rounded-lg font-medium shrink-0 transition ${
                  idx === currentQuestion
                    ? "bg-primary text-white"
                    : answers[q.id] !== undefined
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
