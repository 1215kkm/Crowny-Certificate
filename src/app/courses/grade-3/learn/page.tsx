"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useContentProtection } from "@/hooks/use-content-protection";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  BookOpen,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Shield,
  AlertTriangle,
} from "lucide-react";

const PRACTICE_QUESTIONS = [
  {
    id: 1,
    content: "인공지능(AI)의 가장 정확한 정의는 무엇인가?",
    options: [
      "인간의 모든 능력을 완벽히 복제한 기계",
      "인간의 학습, 추론, 판단 등 지적 능력을 컴퓨터로 구현하는 기술",
      "데이터를 저장하고 검색하는 데이터베이스 시스템",
      "인터넷에 연결된 모든 스마트 기기",
    ],
    correctAnswer: 1,
    explanation:
      "인공지능(AI)은 인간의 학습, 추론, 판단, 자연어 이해 등 지적 능력을 컴퓨터 시스템으로 구현하는 기술 분야입니다.",
  },
  {
    id: 2,
    content: "ChatGPT의 핵심 강점으로 가장 적절한 것은?",
    options: [
      "긴 문서 분석에 특화되어 있다",
      "Google 워크스페이스와 연동된다",
      "범용성이 높아 거의 모든 텍스트 작업을 처리할 수 있다",
      "Microsoft 365와 통합되어 있다",
    ],
    correctAnswer: 2,
    explanation:
      "ChatGPT는 범용성이 가장 높은 AI 도구로, 글쓰기, 번역, 요약, 코딩, 데이터 분석까지 거의 모든 텍스트 작업을 처리할 수 있습니다.",
  },
  {
    id: 3,
    content: "Claude AI의 가장 큰 강점은 무엇인가?",
    options: [
      "이미지 생성 능력",
      "Google 생태계 연동",
      "긴 문서 처리 및 분석 능력",
      "실시간 웹 검색",
    ],
    correctAnswer: 2,
    explanation:
      "Claude는 최대 20만 토큰(한글 약 15만 자)의 긴 문서를 한 번에 처리할 수 있어, 계약서·논문·보고서 분석에 최적입니다.",
  },
  {
    id: 4,
    content: "프롬프트의 RTCE 구조에서 'C'가 의미하는 것은?",
    options: [
      "Creativity (창의성)",
      "Context (맥락)",
      "Code (코드)",
      "Completion (완성)",
    ],
    correctAnswer: 1,
    explanation:
      "RTCE 구조: Role(역할), Task(과제), Context(맥락), Expected Output(출력 형식). C는 배경 정보와 조건을 제공하는 Context입니다.",
  },
  {
    id: 5,
    content: "AI가 사실이 아닌 내용을 그럴듯하게 생성하는 현상을 무엇이라 하는가?",
    options: [
      "오버피팅(Overfitting)",
      "환각(Hallucination)",
      "바이어스(Bias)",
      "드리프트(Drift)",
    ],
    correctAnswer: 1,
    explanation:
      "AI 환각(Hallucination)은 AI가 사실이 아닌 정보를 확신에 찬 어조로 생성하는 현상입니다. 통계, 인용문, 날짜 등은 반드시 팩트체크가 필요합니다.",
  },
  {
    id: 6,
    content:
      "이미지 생성 AI 중 텍스트 렌더링과 구체적 지시사항 따르기에 강한 도구는?",
    options: ["Midjourney", "Stable Diffusion", "DALL-E", "Firefly"],
    correctAnswer: 2,
    explanation:
      "DALL-E는 텍스트 렌더링 능력과 지시사항 따르기 능력이 뛰어나, 구체적인 지시를 정확하게 따릅니다.",
  },
  {
    id: 7,
    content: "프롬프트 작성 핵심 원칙이 아닌 것은?",
    options: [
      "구체적으로 작성하라",
      "항상 영어로 작성하라",
      "예시를 제공하라",
      "반복하여 개선하라",
    ],
    correctAnswer: 1,
    explanation:
      "프롬프트는 영어뿐 아니라 한국어로도 효과적으로 작성할 수 있습니다. 핵심 원칙은 구체성, 단계별 분리, 예시 제공, 제약 조건 명시, 반복 개선입니다.",
  },
  {
    id: 8,
    content: "Google Gemini의 핵심 강점은?",
    options: [
      "코드 실행 및 데이터 분석",
      "긴 문서 처리",
      "Google 워크스페이스 연동과 멀티모달",
      "이미지 생성 품질",
    ],
    correctAnswer: 2,
    explanation:
      "Gemini는 Gmail, Docs, Sheets, Slides 등 Google 워크스페이스와 연동되며, 텍스트·이미지·음성·영상을 모두 처리하는 멀티모달 능력이 강점입니다.",
  },
  {
    id: 9,
    content: "AI 활용 시 개인정보 보호를 위해 해야 할 것은?",
    options: [
      "모든 데이터를 AI에 입력하여 분석한다",
      "민감한 정보는 비식별화 후 입력한다",
      "AI의 답변은 항상 정확하므로 검증이 불필요하다",
      "무료 AI 도구만 사용한다",
    ],
    correctAnswer: 1,
    explanation:
      "고객 개인정보나 회사 기밀은 AI에 직접 입력하면 학습 데이터로 사용될 수 있으므로, 반드시 비식별화 후 입력해야 합니다.",
  },
  {
    id: 10,
    content: "Microsoft Copilot의 핵심 특징은?",
    options: [
      "오픈소스 무료 도구이다",
      "이미지 생성 전문 AI이다",
      "Microsoft 365 앱에 AI를 통합한 것이다",
      "자율주행 전문 AI이다",
    ],
    correctAnswer: 2,
    explanation:
      "Copilot은 Word, Excel, PowerPoint, Outlook, Teams 등 Microsoft 365 앱에 AI를 통합하여 기존 업무 환경에서 바로 활용할 수 있습니다.",
  },
];

export default function Grade3LearnPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // 콘텐츠 보호 — 복사/캡쳐/녹화/드래그/키보드/우클릭 차단 (탭 전환은 학습이라 허용)
  const { showWarning, isRecording } = useContentProtection(true, {
    blockVisibilityChange: false,
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [activeTab, setActiveTab] = useState<"lecture" | "theory" | "quiz">("lecture");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  // BGM 파일 로드 가능 여부 — 파일이 없으면(onError) 컨트롤 자체를 숨긴다.
  const [bgmAvailable, setBgmAvailable] = useState(true);

  // 강의 iframe 로드 상태
  const [lectureLoading, setLectureLoading] = useState(true);
  const [lectureError, setLectureError] = useState(false);
  const [lectureReloadKey, setLectureReloadKey] = useState(0);

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState(PRACTICE_QUESTIONS);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  const shuffleQuiz = useCallback(() => {
    const shuffled = [...PRACTICE_QUESTIONS].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizFinished(false);
    setQuizStarted(true);
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current || !bgmAvailable) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      // play() 가 성공한 뒤에만 "재생 중" 상태로 전환. 실패하면 켜진 채로 깨지지 않음.
      audioRef.current
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => {
          setIsMusicPlaying(false);
          setBgmAvailable(false);
        });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  // 퀴즈 효과음 — 별도 음원 파일 없이 Web Audio API로 합성 (정답/오답/다음/완료)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioCtx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return null;
      audioCtxRef.current = new Ctx();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback(
    (
      ctx: AudioContext,
      freq: number,
      startOffset: number,
      duration: number,
      type: OscillatorType = "sine",
      gain = 0.18
    ) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      const t0 = ctx.currentTime + startOffset;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(gain, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + duration + 0.03);
    },
    []
  );

  const playEffect = useCallback(
    (kind: "correct" | "wrong" | "next" | "finish") => {
      const ctx = getAudioCtx();
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();
      if (kind === "correct") {
        // 밝은 상승 아르페지오 (C5 → E5 → G5)
        playTone(ctx, 523.25, 0, 0.13, "sine", 0.18);
        playTone(ctx, 659.25, 0.1, 0.13, "sine", 0.18);
        playTone(ctx, 783.99, 0.2, 0.24, "sine", 0.2);
      } else if (kind === "wrong") {
        // 낮게 하강하는 둔탁한 음
        playTone(ctx, 311.13, 0, 0.18, "sawtooth", 0.12);
        playTone(ctx, 196.0, 0.16, 0.3, "sawtooth", 0.12);
      } else if (kind === "next") {
        // 짧고 부드러운 블립
        playTone(ctx, 587.33, 0, 0.09, "triangle", 0.14);
      } else if (kind === "finish") {
        // 완료 팡파레 (C5 E5 G5 C6)
        playTone(ctx, 523.25, 0, 0.16, "sine", 0.18);
        playTone(ctx, 659.25, 0.14, 0.16, "sine", 0.18);
        playTone(ctx, 783.99, 0.28, 0.16, "sine", 0.18);
        playTone(ctx, 1046.5, 0.42, 0.4, "sine", 0.2);
      }
    },
    [getAudioCtx, playTone]
  );

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    if (idx === shuffledQuestions[currentQ].correctAnswer) {
      setScore((s) => s + 1);
      playEffect("correct");
    } else {
      playEffect("wrong");
    }
  };

  const nextQuestion = () => {
    if (currentQ >= shuffledQuestions.length - 1) {
      setQuizFinished(true);
      playEffect("finish");
    } else {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      playEffect("next");
    }
  };

  // 키보드 차단은 useContentProtection 훅에서 처리 (Ctrl+C/A/F/S/P, PrintScreen, F12, DevTools 등)

  // iframe 내부(강의 HTML)는 별도 문서라 부모 보호가 안 닿는다.
  // same-origin + allow-same-origin 이므로 로드 후 내부 문서에 보호를 직접 주입한다.
  const protectIframe = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // 선택/복사/인쇄 차단 CSS 주입
      const style = doc.createElement("style");
      style.textContent = `
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
        }
        ::selection { background: transparent !important; }
        ::-moz-selection { background: transparent !important; }
        img { -webkit-user-drag: none; user-drag: none; pointer-events: none; }
        @media print { html, body { display: none !important; } }
      `;
      (doc.head || doc.documentElement).appendChild(style);

      // 이벤트 차단
      const block = (e: Event) => e.preventDefault();
      const blockKeys = (e: KeyboardEvent) => {
        const k = e.key.toLowerCase();
        if (
          e.key === "PrintScreen" ||
          (e.ctrlKey && ["c", "a", "s", "p", "u", "f"].includes(k)) ||
          (e.metaKey && ["c", "a", "s", "p"].includes(k)) ||
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(k)) ||
          (e.metaKey && e.shiftKey && ["3", "4", "5"].includes(e.key))
        ) {
          e.preventDefault();
        }
      };
      doc.addEventListener("copy", block);
      doc.addEventListener("cut", block);
      doc.addEventListener("contextmenu", block);
      doc.addEventListener("selectstart", block);
      doc.addEventListener("dragstart", block);
      doc.addEventListener("keydown", blockKeys);
    } catch {
      // contentDocument 접근 불가(예외) — 무시
    }
  }, []);

  // BGM 파일 선제 확인 — 파일이 없으면 사용자가 버튼을 누르기 전에 컨트롤을 숨긴다.
  useEffect(() => {
    let cancelled = false;
    fetch("/audio/study-bgm.mp3", { method: "HEAD" })
      .then((res) => {
        if (!cancelled && !res.ok) setBgmAvailable(false);
      })
      .catch(() => {
        if (!cancelled) setBgmAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (authLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto" />
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 content-protected"
    >
      {/* 녹화 감지 배너 */}
      {isRecording && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-red-600 text-white text-center py-2 text-sm font-bold animate-pulse flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" />
          화면 녹화가 감지되었습니다. 콘텐츠가 보호됩니다.
        </div>
      )}

      {/* 복사/캡쳐 시도 경고 오버레이 */}
      {showWarning && (
        <div className="fixed inset-0 z-[55] bg-black/60 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl p-6 shadow-xl flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-lg">콘텐츠 보호</p>
              <p className="text-muted-foreground">복사, 캡쳐, 녹화가 제한됩니다.</p>
            </div>
          </div>
        </div>
      )}

      {/* 배경음악 — 파일(/public/audio/study-bgm.mp3) 이 없으면 onError 로 컨트롤 숨김.
          나중에 파일이 들어오면 코드 수정 없이 자동 동작. */}
      <audio
        ref={audioRef}
        loop
        preload="none"
        src="/audio/study-bgm.mp3"
        onError={() => {
          setBgmAvailable(false);
          setIsMusicPlaying(false);
        }}
      />

      {/* 상단 컨트롤 바 */}
      <div className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-lg hidden sm:block">
              3급 AI 기초 활용
            </h1>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("lecture")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-medium transition ${
                  activeTab === "lecture"
                    ? "bg-white shadow-sm text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                강의
              </button>
              <button
                onClick={() => setActiveTab("theory")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-medium transition ${
                  activeTab === "theory"
                    ? "bg-white shadow-sm text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                이론 보충
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-medium transition ${
                  activeTab === "quiz"
                    ? "bg-white shadow-sm text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ClipboardCheck className="w-4 h-4" />
                예제시험
              </button>
            </div>
          </div>

          {/* 음악 컨트롤 — BGM 파일이 있을 때만 렌더 (파일 없으면 onError/실패로 숨김) */}
          {bgmAvailable && (
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMusic}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:bg-gray-50 transition"
                title={isMusicPlaying ? "음악 일시정지" : "배경음악 재생"}
              >
                {isMusicPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span className="hidden sm:inline text-sm">BGM</span>
              </button>
              <button
                onClick={toggleMute}
                className="p-2 rounded-lg border border-border hover:bg-gray-50 transition"
                title={isMuted ? "음소거 해제" : "음소거"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 hidden sm:block"
                aria-label="배경음악 볼륨"
              />
            </div>
          )}
        </div>
      </div>

      {/* 강의 탭 */}
      {activeTab === "lecture" && (
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <div
            className="relative bg-white rounded-2xl shadow-sm border border-border overflow-hidden"
            style={{ height: "calc(100vh - 140px)" }}
          >
            {/* 로딩 스켈레톤 — onLoad 전까지 표시 */}
            {lectureLoading && !lectureError && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white">
                <div className="w-full max-w-2xl px-8 animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-64 bg-gray-200 rounded-xl" />
                </div>
                <p className="text-sm text-muted-foreground">강의를 불러오는 중…</p>
              </div>
            )}

            {/* 에러 상태 — 로드 실패 시 새로고침 outline 버튼 */}
            {lectureError && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white px-6 text-center">
                <p className="text-lg font-bold text-foreground">
                  강의를 불러오지 못했습니다.
                </p>
                <p className="text-sm text-muted-foreground">
                  네트워크 상태를 확인한 뒤 다시 시도해 주세요.
                </p>
                <button
                  onClick={() => {
                    setLectureError(false);
                    setLectureLoading(true);
                    setLectureReloadKey((k) => k + 1);
                  }}
                  className="mt-2 inline-flex items-center gap-2 border border-primary text-primary px-5 py-2.5 rounded-lg font-medium hover:bg-primary/5 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  새로고침
                </button>
              </div>
            )}

            <iframe
              key={lectureReloadKey}
              ref={iframeRef}
              src="/courses/grade-3-lecture.html"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              title="3급 강의"
              onLoad={() => {
                setLectureLoading(false);
                protectIframe();
              }}
              onError={() => {
                setLectureLoading(false);
                setLectureError(true);
              }}
            />
          </div>
        </div>
      )}

      {/* 이론 보충 탭 — 강의 영상에서 다루지 않은 시험 출제 핵심 이론 */}
      {activeTab === "theory" && (
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">이론 보충</h2>
            <p className="text-muted-foreground">
              강의 영상에서 깊이 다루지 않지만 시험에 출제되는 핵심 이론입니다. 시험 전 꼭 확인하세요.
            </p>
          </div>

          {[
            {
              group: "AI 기초 이론",
              items: [
                {
                  term: "인공지능(AI) · 머신러닝(ML) · 딥러닝(DL)의 관계",
                  desc: "AI가 가장 넓은 개념이고, 그 안에 머신러닝, 머신러닝 안에 딥러닝이 포함됩니다. (포함 관계: AI ⊃ ML ⊃ DL)",
                },
                {
                  term: "머신러닝(Machine Learning)",
                  desc: "사람이 규칙을 일일이 프로그래밍하지 않고, 데이터로부터 패턴을 학습하여 스스로 성능을 향상시키는 AI의 한 분야입니다.",
                },
                {
                  term: "딥러닝(Deep Learning)",
                  desc: "여러 층의 인공신경망(Artificial Neural Network)을 사용해 데이터의 복잡한 패턴을 학습하는 머신러닝의 하위 분야입니다.",
                },
                {
                  term: "지도 학습(Supervised Learning)",
                  desc: "입력 데이터와 정답(레이블)이 쌍으로 주어진 데이터셋으로 모델을 훈련시키는 방법입니다. (정답 없는 군집화는 비지도 학습)",
                },
                {
                  term: "대규모 언어 모델(LLM)",
                  desc: "방대한 텍스트 데이터를 학습하여 자연어를 이해하고 문맥에 맞는 텍스트를 생성하는 대규모 AI 모델입니다. (예: GPT, Claude, Gemini)",
                },
                {
                  term: "자연어 처리(NLP)",
                  desc: "사람의 언어를 컴퓨터가 이해·처리하는 기술로 챗봇, 번역, 요약, 감정 분석 등에 활용됩니다.",
                },
              ],
            },
            {
              group: "프롬프트 고급 기법",
              items: [
                {
                  term: "제로샷(Zero-shot) 프롬프팅",
                  desc: "예시를 제공하지 않고 바로 질문이나 지시를 내리는 방식으로, AI의 기존 학습 지식에 의존합니다.",
                },
                {
                  term: "퓨샷(Few-shot) 프롬프팅",
                  desc: "몇 가지 예시를 함께 제공하여 원하는 답변의 형식·스타일·패턴을 AI가 더 잘 이해하도록 유도하는 방식입니다.",
                },
                {
                  term: "사고의 연쇄(Chain-of-Thought, CoT)",
                  desc: "'단계별로 생각해보세요'처럼 AI가 추론 과정을 명시적으로 거치도록 유도해 복잡한 문제의 정확도를 높이는 기법입니다.",
                },
              ],
            },
            {
              group: "AI 윤리 보충",
              items: [
                {
                  term: "AI 편향(Bias)",
                  desc: "학습 데이터에 존재하는 편향이 AI 결과에 그대로 반영될 수 있으며, 성별·인종·나이 등에 대한 불공정한 결과로 이어질 수 있습니다. 최신 모델에서도 완전히 제거되지 않았습니다.",
                },
              ],
            },
          ].map((section) => (
            <div key={section.group} className="mb-8">
              <h3 className="text-lg font-bold mb-3 text-primary">{section.group}</h3>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.term}
                    className="bg-white border border-border rounded-xl p-5"
                  >
                    <div className="font-bold mb-1">{item.term}</div>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            💡 이 내용은 강의 영상의 도구·프롬프트(RTCE)·AI 윤리 내용과 함께 학습하면 3급 시험 전 범위를 커버합니다.
          </div>
        </div>
      )}

      {/* 예제시험 탭 */}
      {activeTab === "quiz" && (
        <div className="max-w-3xl mx-auto px-4 py-8">
          {!quizStarted ? (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ClipboardCheck className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">예제 시험</h2>
              <p className="text-muted-foreground mb-6">
                강의 내용을 바탕으로 한 연습 문제 {PRACTICE_QUESTIONS.length}
                문항입니다.
                <br />
                실제 시험과 유사한 형태로, 학습 내용을 점검해보세요.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-8 inline-block text-left">
                <p>
                  • 문항 수: <strong>{PRACTICE_QUESTIONS.length}문항</strong>
                </p>
                <p>• 시간 제한: 없음 (연습용)</p>
                <p>• 즉시 정답 및 해설 확인 가능</p>
              </div>
              <br />
              <button
                onClick={shuffleQuiz}
                className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition"
              >
                시험 시작하기
              </button>
            </div>
          ) : quizFinished ? (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center">
              <div
                className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold ${
                  score >= 7 ? "bg-green-500" : "bg-orange-500"
                }`}
              >
                <Trophy className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">결과</h2>
              <div className="text-4xl font-bold text-primary my-4">
                {score} / {shuffledQuestions.length}
              </div>
              <p className="text-muted-foreground mb-8">
                {score >= 7
                  ? "잘 하셨습니다! 실제 시험에 도전해보세요."
                  : "강의를 다시 복습한 후 재도전해보세요."}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={shuffleQuiz}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  다시 풀기
                </button>
                <button
                  onClick={() => setActiveTab("lecture")}
                  className="flex items-center gap-2 border border-border px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  <BookOpen className="w-4 h-4" />
                  강의 복습
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* 진행 바 */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentQ + 1) / shuffledQuestions.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-muted-foreground font-medium whitespace-nowrap">
                  {currentQ + 1} / {shuffledQuestions.length}
                </span>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-lg font-bold">
                    Q{currentQ + 1}
                  </span>
                  <span className="text-muted-foreground">연습문제</span>
                </div>
                <h3 className="text-lg font-bold mb-6 leading-relaxed">
                  {shuffledQuestions[currentQ].content}
                </h3>
                <div className="space-y-3">
                  {shuffledQuestions[currentQ].options.map((opt, idx) => {
                    let btnClass =
                      "border-gray-100 hover:border-primary/30 hover:bg-gray-50";
                    if (showResult) {
                      if (
                        idx === shuffledQuestions[currentQ].correctAnswer
                      ) {
                        btnClass =
                          "border-green-400 bg-green-50 text-green-800";
                      } else if (
                        idx === selectedAnswer &&
                        idx !== shuffledQuestions[currentQ].correctAnswer
                      ) {
                        btnClass = "border-red-400 bg-red-50 text-red-800";
                      } else {
                        btnClass = "border-gray-100 opacity-50";
                      }
                    } else if (idx === selectedAnswer) {
                      btnClass = "border-primary bg-primary/5";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={showResult}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${btnClass}`}
                      >
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mr-3 font-bold ${
                            showResult &&
                            idx ===
                              shuffledQuestions[currentQ].correctAnswer
                              ? "bg-green-500 text-white"
                              : showResult &&
                                  idx === selectedAnswer
                                ? "bg-red-500 text-white"
                                : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {showResult &&
                          idx ===
                            shuffledQuestions[currentQ].correctAnswer ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : showResult &&
                            idx === selectedAnswer &&
                            idx !==
                              shuffledQuestions[currentQ].correctAnswer ? (
                            <XCircle className="w-5 h-5" />
                          ) : (
                            idx + 1
                          )}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* 해설 */}
                {showResult && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="font-bold text-blue-800 mb-1">💡 해설</p>
                    <p className="text-blue-700">
                      {shuffledQuestions[currentQ].explanation}
                    </p>
                  </div>
                )}

                {/* 다음 문제 */}
                {showResult && (
                  <button
                    onClick={nextQuestion}
                    className="mt-6 flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition ml-auto"
                  >
                    {currentQ >= shuffledQuestions.length - 1
                      ? "결과 보기"
                      : "다음 문제"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
