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
  Rocket,
} from "lucide-react";

interface Slide {
  no: number;
  title: string;
  points: string[];
}

const SLIDES: Slide[] = [
  {
    no: 1,
    title: "1급 과정 개요 — AI로 앱 만들고 배포하기",
    points: [
      "목표: AI 코딩 도구를 활용해 다중 사용자 앱을 만들고 실제로 배포할 수 있다.",
      "시험 구성: 필기(객관식 40문항, 즉시 채점) + 실기(앱 제작·배포 후 제출, 수동 채점).",
      "스택·코드는 자유. 단, 배포된 앱이 합격 조건(기능)을 충족해야 한다.",
    ],
  },
  {
    no: 2,
    title: "앱의 기본 구조 — 프론트엔드 / 백엔드",
    points: [
      "프론트엔드: 사용자가 보는 화면과 상호작용.",
      "백엔드: 서버에서의 데이터 처리·로직·DB 연동.",
      "클라이언트가 요청 → 서버가 응답하는 요청-응답 모델이 기본.",
    ],
  },
  {
    no: 3,
    title: "데이터 다루기 — DB와 CRUD",
    points: [
      "데이터베이스: 데이터를 구조적으로 저장·관리.",
      "CRUD: Create(생성)·Read(조회)·Update(수정)·Delete(삭제).",
      "다중 사용자 데이터는 반드시 서버(DB)에 저장해야 공유·동기화·기기 변경에 대응.",
      "localStorage만 쓰면 사용자 간 공유·순위 비교가 불가능.",
    ],
  },
  {
    no: 4,
    title: "API와 데이터 교환",
    points: [
      "API: 프로그램끼리 정해진 규약으로 데이터를 주고받는 인터페이스.",
      "JSON: 키-값 구조의 경량 데이터 교환 형식.",
      "HTTP 상태코드: 200 성공 · 404 없음 · 500 서버 오류.",
    ],
  },
  {
    no: 5,
    title: "인증 — 회원가입 / 로그인",
    points: [
      "인증(Authentication): 사용자가 본인인지 확인. (권한 확인은 인가/Authorization)",
      "비밀번호는 해시로 저장(평문 저장 금지). 대부분 인증 서비스가 자동 처리.",
      "로그인 상태는 세션/토큰(JWT 등)으로 유지.",
    ],
  },
  {
    no: 6,
    title: "다중 사용자 & 권한",
    points: [
      "각 데이터에 작성자 ID(uid)를 저장해 소유자를 구분.",
      "수정·삭제는 작성자 본인/관리자만 가능하도록 권한(인가) 제어.",
      "사용자 입력은 신뢰하지 말고 서버에서 검증(validation).",
    ],
  },
  {
    no: 7,
    title: "점수·카운트 & 리더보드",
    points: [
      "점수는 앱 상태(state)로 관리하고 이벤트(정답·클릭 등) 시 갱신.",
      "여러 사용자 점수 비교(랭킹)는 점수를 서버(DB)에 저장해야 가능.",
      "리더보드는 점수 내림차순 정렬로 상위권을 표시.",
      "중요 점수는 클라이언트 값 조작 위험이 있으므로 서버 검증 고려.",
    ],
  },
  {
    no: 8,
    title: "AI 이미지 & 미디어 활용",
    points: [
      "AI 생성 이미지를 최적화(압축)해 사용하고 라이선스 확인.",
      "배경음악·버튼음은 사용자 제어(켜기/끄기·음량) 제공, 자동재생 정책 고려.",
      "AI 이미지 API 직접 연동 시 호출량에 따른 비용 관리(제한·캐싱).",
    ],
  },
  {
    no: 9,
    title: "배포 (Deploy)",
    points: [
      "배포: 만든 앱을 호스팅에 올려 누구나 접속 가능하게 공개(예: Vercel 등).",
      "HTTPS로 통신을 암호화.",
      "API 키·비밀번호는 환경변수/시크릿으로 분리, 공개 저장소에 노출 금지.",
    ],
  },
  {
    no: 10,
    title: "보안 & 운영",
    points: [
      "사용자 입력 출력 시 XSS 주의(검증·이스케이프).",
      "다중 사용자 서비스는 신고·차단·삭제 등 모더레이션 기능 마련.",
      "정기 백업·복구 전략, 로그/오류 메시지로 디버깅.",
    ],
  },
  {
    no: 11,
    title: "윤리 & 책임",
    points: [
      "개인정보는 목적 고지·동의·최소 수집·적정 파기.",
      "AI 생성 코드도 배포 전 테스트·보안 검토는 사람이 수행.",
      "배포한 서비스의 기능·보안·법규 준수의 최종 책임은 개발자에게 있다.",
    ],
  },
  {
    no: 12,
    title: "1급 실기 안내 (앱 제작·배포)",
    points: [
      "주제 예시: 게임 / 아파트·동호회 커뮤니티 / 가족·친구 채팅 / 맛집 공유 / 습관·운동 챌린지(랭킹).",
      "필수: 실제 배포 URL, 회원가입·로그인, 서버 데이터 저장, 댓글 등 상호작용, 다중 사용자 + 점수/순위 비교.",
      "권장: AI 이미지 활용, 사운드(배경음/버튼음).",
      "제출: 배포 URL + 저장소 링크 + 설명 + AI 공유링크. 100점 만점, 60점 이상 합격(배포·서버저장 미충족 시 불합격).",
    ],
  },
];

interface PracticeQuestion {
  content: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    content: "프론트엔드와 백엔드의 역할로 올바른 것은?",
    options: [
      "프론트=서버 로직, 백엔드=화면",
      "프론트=화면·상호작용, 백엔드=서버·데이터·로직",
      "둘 다 동일",
      "프론트=DB, 백엔드=CSS",
    ],
    correctAnswer: 1,
    explanation: "프론트엔드는 화면·상호작용, 백엔드는 서버·데이터·로직을 담당합니다.",
  },
  {
    content: "여러 사용자의 점수를 비교(랭킹)하려면 점수를 어디에 저장해야 하는가?",
    options: ["각자 브라우저에만", "서버(DB)에 모아서", "이미지 파일에", "저장 안 함"],
    correctAnswer: 1,
    explanation: "랭킹·비교는 모든 사용자 점수를 서버(DB)에 모아야 가능합니다.",
  },
  {
    content: "비밀번호를 서버에 저장하는 올바른 방법은?",
    options: ["평문 저장", "해시(암호화)하여 저장", "이메일에 적기", "이미지로 저장"],
    correctAnswer: 1,
    explanation: "비밀번호는 단방향 해시로 저장하고 평문은 저장하지 않습니다.",
  },
  {
    content: "'배포(Deploy)'의 의미로 올바른 것은?",
    options: [
      "내 컴퓨터에서만 실행",
      "호스팅에 올려 누구나 접속 가능하게 공개",
      "코드 삭제",
      "이미지 압축",
    ],
    correctAnswer: 1,
    explanation: "배포는 앱을 호스팅에 올려 인터넷으로 접속 가능하게 공개하는 것입니다.",
  },
  {
    content: "API 키 같은 민감한 값을 다루는 올바른 방법은?",
    options: [
      "코드에 하드코딩 후 공개 저장소에 업로드",
      "환경변수/시크릿으로 분리하고 노출하지 않음",
      "이미지에 적기",
      "모두에게 공개",
    ],
    correctAnswer: 1,
    explanation: "민감 키는 환경변수/시크릿으로 분리하고 공개 저장소에 노출하지 않아야 합니다.",
  },
  {
    content: "사용자 입력을 서버에서 처리할 때 반드시 해야 하는 것은?",
    options: ["무조건 신뢰", "검증(validation)", "그대로 실행", "무시"],
    correctAnswer: 1,
    explanation: "클라이언트 입력은 신뢰할 수 없으므로 서버에서 반드시 검증해야 합니다.",
  },
  {
    content: "콘텐츠 수정·삭제 권한 설계로 올바른 것은?",
    options: [
      "누구나 타인 글 삭제 가능",
      "작성자 본인/관리자만 가능",
      "비로그인도 삭제 가능",
      "권한 불필요",
    ],
    correctAnswer: 1,
    explanation: "수정·삭제는 작성자 본인/관리자로 제한해야 보안과 무결성이 유지됩니다.",
  },
  {
    content: "클라이언트에서만 계산된 게임 점수를 서버로 보낼 때의 위험은?",
    options: [
      "점수 조작 가능",
      "위험 없음",
      "자동 암호화됨",
      "서버 비용 0",
    ],
    correctAnswer: 0,
    explanation: "클라이언트 값은 조작될 수 있어 중요한 점수는 서버 검증이 필요합니다.",
  },
  {
    content: "배포한 웹 앱에서 HTTPS를 쓰는 이유는?",
    options: [
      "통신 암호화로 도청·변조 방지",
      "화면을 예쁘게",
      "이미지 용량 감소",
      "서버 종료",
    ],
    correctAnswer: 0,
    explanation: "HTTPS는 통신을 암호화해 도청·변조를 막고 신뢰를 확보합니다.",
  },
  {
    content: "localStorage만 쓰고 서버를 안 쓰면 생기는 한계는?",
    options: [
      "사용자 간 공유·비교 불가, 기기 변경 시 소실",
      "한계 없음",
      "항상 더 안전",
      "순위 비교가 쉬워짐",
    ],
    correctAnswer: 0,
    explanation: "localStorage는 해당 브라우저에만 저장돼 다중 사용자 공유·순위 비교가 불가능합니다.",
  },
];

export default function Grade1LearnPage() {
  const [activeTab, setActiveTab] = useState<"lecture" | "quiz">("lecture");
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [shuffled, setShuffled] = useState<PracticeQuestion[]>(PRACTICE_QUESTIONS);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const startQuiz = () => {
    const arr = [...PRACTICE_QUESTIONS].map((q) => ({ q, r: Math.random() })).sort((a, b) => a.r - b.r).map((x) => x.q);
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
    if (currentQ >= shuffled.length - 1) setQuizFinished(true);
    else {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/courses" className="text-sm text-muted-foreground hover:text-primary">&larr; 강의 목록</Link>
          <h1 className="font-bold text-lg hidden sm:block">1급 AI 앱 제작·배포</h1>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setActiveTab("lecture")} className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-medium transition ${activeTab === "lecture" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <BookOpen className="w-4 h-4" /> 강의
            </button>
            <button onClick={() => setActiveTab("quiz")} className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-medium transition ${activeTab === "quiz" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <ClipboardCheck className="w-4 h-4" /> 예제시험
            </button>
          </div>
        </div>
      </div>

      {activeTab === "lecture" && (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
          {SLIDES.map((slide) => (
            <div key={slide.no} className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary text-white text-sm px-3 py-1 rounded-lg font-bold">{slide.no}</span>
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
            <Rocket className="w-5 h-5 text-purple-600 shrink-0" />
            <span className="text-sm text-purple-800">강의를 다 보셨다면 <strong>예제시험</strong>으로 점검 후, 실기(앱 제작·배포)에 도전하세요.</span>
          </div>
        </div>
      )}

      {activeTab === "quiz" && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          {!quizStarted ? (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center">
              <ClipboardCheck className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">예제 시험</h2>
              <p className="text-muted-foreground mb-6">강의 내용을 바탕으로 한 연습 문제 {PRACTICE_QUESTIONS.length}문항입니다.<br />시간 제한 없음 · 즉시 정답 및 해설 확인 가능</p>
              <button onClick={startQuiz} className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition">시험 시작하기</button>
            </div>
          ) : quizFinished ? (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center">
              <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-white ${score >= 7 ? "bg-green-500" : "bg-orange-500"}`}>
                <Trophy className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">결과</h2>
              <div className="text-4xl font-bold text-primary my-4">{score} / {shuffled.length}</div>
              <p className="text-muted-foreground mb-8">{score >= 7 ? "잘 하셨습니다! 실기에 도전해보세요." : "강의를 다시 복습한 후 재도전해보세요."}</p>
              <div className="flex gap-3 justify-center">
                <button onClick={startQuiz} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition"><RotateCcw className="w-4 h-4" /> 다시 풀기</button>
                <button onClick={() => setActiveTab("lecture")} className="flex items-center gap-2 border border-border px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition"><BookOpen className="w-4 h-4" /> 강의 복습</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${((currentQ + 1) / shuffled.length) * 100}%` }} />
                </div>
                <span className="text-muted-foreground font-medium whitespace-nowrap">{currentQ + 1} / {shuffled.length}</span>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-lg font-bold">Q{currentQ + 1}</span>
                  <span className="text-muted-foreground">연습문제</span>
                </div>
                <h3 className="text-lg font-bold mb-6 leading-relaxed">{shuffled[currentQ].content}</h3>
                <div className="space-y-3">
                  {shuffled[currentQ].options.map((opt, idx) => {
                    let btnClass = "border-gray-100 hover:border-primary/30 hover:bg-gray-50";
                    if (showResult) {
                      if (idx === shuffled[currentQ].correctAnswer) btnClass = "border-green-400 bg-green-50 text-green-800";
                      else if (idx === selectedAnswer) btnClass = "border-red-400 bg-red-50 text-red-800";
                      else btnClass = "border-gray-100 opacity-50";
                    } else if (idx === selectedAnswer) btnClass = "border-primary bg-primary/5";
                    return (
                      <button key={idx} onClick={() => handleAnswer(idx)} disabled={showResult} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${btnClass}`}>
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mr-3 font-bold ${showResult && idx === shuffled[currentQ].correctAnswer ? "bg-green-500 text-white" : showResult && idx === selectedAnswer ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                          {showResult && idx === shuffled[currentQ].correctAnswer ? <CheckCircle className="w-5 h-5" /> : showResult && idx === selectedAnswer ? <XCircle className="w-5 h-5" /> : idx + 1}
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
                  <button onClick={nextQuestion} className="mt-6 flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition ml-auto">
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
