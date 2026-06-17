"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Layout,
} from "lucide-react";

// ============================================================
// 2급 강의 슬라이드 (AI 활용 심화 - AI 랜딩페이지 제작)
// ============================================================
interface Slide {
  no: number;
  title: string;
  points: string[];
}

const SLIDES: Slide[] = [
  {
    no: 1,
    title: "2급 과정 개요 — AI로 랜딩페이지 만들기",
    points: [
      "목표: AI 도구를 활용해 주제에 맞는 랜딩페이지를 기획·제작하고 제출할 수 있다.",
      "시험 구성: 필기(객관식 40문항, 즉시 채점) + 실기(랜딩페이지 제작, 보름 뒤 발표).",
      "무료 AI 도구만으로도 충분히 제작 가능하도록 설계되어 있습니다.",
    ],
  },
  {
    no: 2,
    title: "랜딩페이지란?",
    points: [
      "방문자가 하나의 명확한 행동(구매·문의·가입)을 하도록 설계한 단일 목적 페이지.",
      "여러 링크로 분산시키지 않고 '하나의 전환 목표'에 집중하는 것이 핵심.",
      "성과는 전환율(목표 행동 완료자 ÷ 방문자)로 측정한다.",
    ],
  },
  {
    no: 3,
    title: "랜딩페이지의 기본 구성요소",
    points: [
      "히어로(Hero): 첫 화면 상단. 대표 이미지 + 핵심 헤드라인 + CTA 버튼.",
      "혜택/기능: 아이콘 + 짧은 문구로 핵심 가치를 시각적으로 전달.",
      "상품/상세: 상품 이미지와 혜택 중심 설명.",
      "신뢰 요소: 후기·판매량·보도 등 사회적 증거.",
      "띠배너: 할인·공지 등 핵심 메시지를 가로로 강조.",
      "CTA: '지금 구매하기' 등 행동 유도 버튼.",
    ],
  },
  {
    no: 4,
    title: "정보 배치 흐름 (전환을 높이는 순서)",
    points: [
      "히어로(핵심 메시지) → 핵심 혜택 → 신뢰 요소 → CTA 순서가 일반적.",
      "방문자의 관심을 끌고 → 설득하고 → 신뢰를 주고 → 행동을 유도한다.",
      "선택지를 분산시키지 말고 핵심 행동 하나에 집중시킨다.",
    ],
  },
  {
    no: 5,
    title: "와이어프레임이란?",
    points: [
      "색·이미지 없이 '어디에 무엇을 배치할지'만 정한 설계도(레이아웃).",
      "2급 실기는 제공된 와이어프레임의 슬롯(히어로1·아이콘6·상품4·띠배너1)을 채우는 방식.",
      "먼저 구조를 잡고 콘텐츠를 채우면 완성도와 속도가 모두 올라간다.",
    ],
  },
  {
    no: 6,
    title: "AI 이미지 생성 — 슬롯별 전략",
    points: [
      "히어로: 가로형(16:9 등) 대표 이미지. 주제·분위기·조명을 구체적으로 지정.",
      "아이콘 6개: 동일한 스타일(선 굵기·색·라운드)로 통일감 유지.",
      "상품 이미지 4개: 배경을 깔끔히, 실제 상품을 과장하지 않게.",
      "띠배너 1개: 가로로 긴 형태, 할인·핵심 메시지 강조.",
    ],
  },
  {
    no: 7,
    title: "좋은 이미지 프롬프트 작성법",
    points: [
      "피사체 · 스타일 · 배경 · 조명 · 색감 · 비율을 구체적으로 명시.",
      "브랜드 컬러가 있으면 색 계열을 프롬프트에 지정해 톤을 통일.",
      "이미지 속 글자는 깨질 수 있으니 핵심 문구는 웹 텍스트로 입력.",
      "무료 플랜(ChatGPT 등)으로 생성 → 결과 이미지를 우리 사이트에 업로드.",
    ],
  },
  {
    no: 8,
    title: "카피라이팅 — 헤드라인과 CTA",
    points: [
      "헤드라인: '타겟이 얻을 핵심 가치'를 한 줄로. 회사 소개가 아님.",
      "혜택(Benefit) 중심: 사양이 아니라 '사용자에게 좋은 점'으로 번역.",
      "CTA 문구: 명확한 행동 + 혜택/긴급성 + 간결함 (예: 오늘만 무료 체험).",
    ],
  },
  {
    no: 9,
    title: "고급 프롬프트로 카피 만들기",
    points: [
      "대상·톤·강조점·길이를 지정: '30~40대 직장인, 신뢰감, 20자 이내, 혜택 1가지 강조'.",
      "역할 부여: '당신은 10년 경력 카피라이터입니다 ...'.",
      "퓨샷: 원하는 스타일 예시 2~3개를 먼저 보여주고 같은 톤으로 요청.",
      "반복 개선: '더 짧게, 혜택을 앞에' 처럼 구체적으로 피드백.",
    ],
  },
  {
    no: 10,
    title: "디자인 기초 — 색·타이포·여백",
    points: [
      "색: 주조색·보조색·강조색을 정하고 CTA에 강조색 사용.",
      "타이포: 글꼴 1~2종으로 절제, 크기·굵기로 제목/본문 위계.",
      "여백: 요소를 구분하고 시선을 핵심에 모은다(공간 낭비가 아님).",
      "이미지: 스타일·색감을 통일해 하나의 브랜드처럼 보이게.",
    ],
  },
  {
    no: 11,
    title: "전환 최적화 & 접근성",
    points: [
      "모바일: 버튼은 크게, 글자는 읽기 쉽게, 이미지는 최적화로 빠른 로딩.",
      "A/B 테스트: 두 버전을 비교해 성과 좋은 안을 데이터로 선택.",
      "접근성: 색 대비 확보, 이미지 대체 텍스트, 키보드 조작 지원.",
    ],
  },
  {
    no: 12,
    title: "실무 윤리 & 법규",
    points: [
      "과장·허위 표현 금지('100% 보장','무조건 1위' 등은 표시광고법 위반 소지).",
      "개인정보 수집 시 목적 고지·동의, 최소 수집 원칙.",
      "AI 이미지/카피의 상업적 사용은 도구 약관·라이선스 확인.",
      "최종 결과물의 사실성·법규 책임은 게시하는 사람에게 있다.",
    ],
  },
  {
    no: 13,
    title: "2급 실기 안내",
    points: [
      "시작 시 주제(시계·지갑·멸치판매·전동자전거·목걸이 중 랜덤)와 와이어프레임(5종 중 랜덤)이 공개됩니다.",
      "각 슬롯(히어로1·아이콘6·상품4·띠배너1)에 주제에 맞는 이미지·문구를 채워 제출.",
      "필기는 제출 즉시 채점, 실기는 응시일로부터 보름 뒤 오후 1시에 발표됩니다.",
      "AI는 본인 계정으로 사용하고 결과물을 업로드하세요(대화 공유링크 첨부 권장).",
    ],
  },
  {
    no: 14,
    title: "마무리 — 핵심 정리",
    points: [
      "랜딩페이지 = 하나의 전환 목표 + 히어로/혜택/신뢰/CTA 흐름.",
      "AI 이미지·카피는 일관된 톤으로, 핵심 문구는 실제 텍스트로.",
      "과장 금지, 사실 검토는 사람이. 이제 예제시험으로 점검해 보세요!",
    ],
  },
];

// ============================================================
// 2급 예제시험 (연습문제) — 객관식 즉시 채점, correctAnswer 0-based
// ============================================================
interface PracticeQuestion {
  content: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    content: "랜딩페이지의 핵심 목적으로 가장 적절한 것은?",
    options: [
      "회사의 모든 제품을 나열하는 것",
      "방문자가 하나의 명확한 행동을 하도록 유도하는 것",
      "외부 링크를 최대한 많이 거는 것",
      "회사 연혁을 자세히 설명하는 것",
    ],
    correctAnswer: 1,
    explanation: "랜딩페이지는 단일 전환 목표에 집중하여 방문자가 특정 행동을 하도록 설계합니다.",
  },
  {
    content: "히어로(Hero) 영역에 들어가는 요소로 가장 적절한 것은?",
    options: [
      "저작권 표시",
      "대표 이미지 + 핵심 헤드라인 + CTA",
      "사업자등록번호",
      "고객센터 운영시간만",
    ],
    correctAnswer: 1,
    explanation: "히어로는 첫 화면 상단으로 대표 이미지·핵심 카피·CTA가 배치되는 가장 중요한 영역입니다.",
  },
  {
    content: "히어로용 가로 배너 이미지를 AI로 만들 때 적절한 비율은?",
    options: ["1:1", "16:9 등 가로형", "9:16 세로형", "비율은 무관"],
    correctAnswer: 1,
    explanation: "히어로는 가로로 넓으므로 16:9 등 가로형 비율로 생성해야 자연스럽게 배치됩니다.",
  },
  {
    content: "여러 아이콘에 통일감을 주는 방법은?",
    options: [
      "아이콘마다 다른 스타일 사용",
      "동일한 스타일(선·색·굵기)을 일관되게 지정",
      "통일할 필요 없음",
      "사진을 무작위로 사용",
    ],
    correctAnswer: 1,
    explanation: "아이콘 세트는 동일한 스타일 가이드를 유지해야 디자인 일관성이 살아납니다.",
  },
  {
    content: "좋은 CTA 문구의 특징과 거리가 먼 것은?",
    options: [
      "명확한 행동 지시",
      "혜택·긴급성 포함",
      "무엇을 누르는지 모호하게",
      "짧고 눈에 띔",
    ],
    correctAnswer: 2,
    explanation: "CTA는 명확·간결하고 혜택/긴급성을 담아야 합니다. 모호하면 클릭률이 떨어집니다.",
  },
  {
    content: "혜택(Benefit) 중심 카피의 예로 적절한 것은?",
    options: [
      "'배터리 10000mAh'",
      "'한 번 충전으로 일주일, 매일 충전하는 번거로움을 없앴습니다'",
      "'모델명 XK-200'",
      "'제조국: 한국'",
    ],
    correctAnswer: 1,
    explanation: "사양(Feature)을 사용자 이득(Benefit)으로 번역해 전달하면 설득력이 높아집니다.",
  },
  {
    content: "AI 이미지를 상업적으로 쓸 때 바람직한 태도는?",
    options: [
      "무조건 자유롭게 사용",
      "도구의 약관·라이선스에서 상업적 이용 가능 여부 확인",
      "확인 불필요",
      "타인 이미지를 그대로 사용",
    ],
    correctAnswer: 1,
    explanation: "AI 이미지의 상업적 이용 조건은 도구마다 다르므로 약관·라이선스를 반드시 확인해야 합니다.",
  },
  {
    content: "랜딩페이지에서 피해야 할 표현은?",
    options: [
      "근거 있는 객관적 수치",
      "'100% 효과 보장' 같은 검증 불가 과장",
      "실제 고객 후기",
      "명확한 환불 정책",
    ],
    correctAnswer: 1,
    explanation: "검증 불가능한 과장·허위 표현은 표시광고법 위반 소지가 있고 신뢰를 떨어뜨립니다.",
  },
  {
    content: "색상 사용으로 가장 적절한 것은?",
    options: [
      "많은 색을 무작위로 사용",
      "주조·보조·강조색을 정하고 CTA에 강조색 사용",
      "버튼을 배경과 같은 색으로",
      "색은 전환과 무관",
    ],
    correctAnswer: 1,
    explanation: "색 체계를 정해 일관되게 쓰고 CTA에 강조색을 사용하면 클릭 유도에 효과적입니다.",
  },
  {
    content: "AI가 만든 카피를 게시하기 전 반드시 할 일은?",
    options: [
      "검토 없이 즉시 게시",
      "사실 여부·과장·브랜드 톤을 사람이 검토·수정",
      "길게 늘리기만",
      "번역만",
    ],
    correctAnswer: 1,
    explanation: "AI 카피는 사실 오류·과장이 있을 수 있어 게시 전 사람이 검토·수정해야 합니다.",
  },
];

export default function Grade2LearnPage() {
  const [activeTab, setActiveTab] = useState<"lecture" | "quiz">("lecture");

  // 퀴즈 상태
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [shuffled, setShuffled] = useState<PracticeQuestion[]>(PRACTICE_QUESTIONS);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const startQuiz = () => {
    // index 기반 셔플 (Math.random 사용)
    const arr = [...PRACTICE_QUESTIONS]
      .map((q) => ({ q, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map((x) => x.q);
    setShuffled(arr);
    setQuizStarted(true);
    setQuizFinished(false);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    if (idx === shuffled[currentQ].correctAnswer) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ >= shuffled.length - 1) {
      setQuizFinished(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 바 */}
      <div className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/courses" className="text-sm text-muted-foreground hover:text-primary">
              &larr; 강의 목록
            </Link>
            <h1 className="font-bold text-lg hidden sm:block">2급 AI 랜딩페이지 제작</h1>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("lecture")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-medium transition ${
                  activeTab === "lecture" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                강의
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-medium transition ${
                  activeTab === "quiz" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ClipboardCheck className="w-4 h-4" />
                예제시험
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 강의 탭 — 슬라이드 카드 */}
      {activeTab === "lecture" && (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
          {SLIDES.map((slide) => (
            <div key={slide.no} className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary text-white text-sm px-3 py-1 rounded-lg font-bold">
                  {slide.no}
                </span>
                <h2 className="text-lg font-bold">{slide.title}</h2>
              </div>
              <ul className="space-y-2">
                {slide.points.map((p, i) => (
                  <li key={i} className="flex gap-2 text-muted-foreground leading-relaxed">
                    <span className="text-primary mt-1">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3">
            <Layout className="w-5 h-5 text-purple-600 shrink-0" />
            <span className="text-sm text-purple-800">
              강의를 다 보셨다면 <strong>예제시험</strong> 탭에서 실력을 점검해 보세요.
            </span>
          </div>
        </div>
      )}

      {/* 예제시험 탭 */}
      {activeTab === "quiz" && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          {!quizStarted ? (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center">
              <ClipboardCheck className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">예제 시험</h2>
              <p className="text-muted-foreground mb-6">
                강의 내용을 바탕으로 한 연습 문제 {PRACTICE_QUESTIONS.length}문항입니다.
                <br />
                시간 제한 없음 · 즉시 정답 및 해설 확인 가능
              </p>
              <button
                onClick={startQuiz}
                className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition"
              >
                시험 시작하기
              </button>
            </div>
          ) : quizFinished ? (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center">
              <div
                className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-white ${
                  score >= 7 ? "bg-green-500" : "bg-orange-500"
                }`}
              >
                <Trophy className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">결과</h2>
              <div className="text-4xl font-bold text-primary my-4">
                {score} / {shuffled.length}
              </div>
              <p className="text-muted-foreground mb-8">
                {score >= 7 ? "잘 하셨습니다! 실제 시험에 도전해보세요." : "강의를 다시 복습한 후 재도전해보세요."}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={startQuiz}
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
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${((currentQ + 1) / shuffled.length) * 100}%` }}
                  />
                </div>
                <span className="text-muted-foreground font-medium whitespace-nowrap">
                  {currentQ + 1} / {shuffled.length}
                </span>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-lg font-bold">
                    Q{currentQ + 1}
                  </span>
                  <span className="text-muted-foreground">연습문제</span>
                </div>
                <h3 className="text-lg font-bold mb-6 leading-relaxed">{shuffled[currentQ].content}</h3>
                <div className="space-y-3">
                  {shuffled[currentQ].options.map((opt, idx) => {
                    let btnClass = "border-gray-100 hover:border-primary/30 hover:bg-gray-50";
                    if (showResult) {
                      if (idx === shuffled[currentQ].correctAnswer) {
                        btnClass = "border-green-400 bg-green-50 text-green-800";
                      } else if (idx === selectedAnswer) {
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
                            showResult && idx === shuffled[currentQ].correctAnswer
                              ? "bg-green-500 text-white"
                              : showResult && idx === selectedAnswer
                                ? "bg-red-500 text-white"
                                : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {showResult && idx === shuffled[currentQ].correctAnswer ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : showResult && idx === selectedAnswer ? (
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

                {showResult && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="font-bold text-blue-800 mb-1">💡 해설</p>
                    <p className="text-blue-700">{shuffled[currentQ].explanation}</p>
                  </div>
                )}

                {showResult && (
                  <button
                    onClick={nextQuestion}
                    className="mt-6 flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition ml-auto"
                  >
                    {currentQ >= shuffled.length - 1 ? "결과 보기" : "다음 문제"}
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
