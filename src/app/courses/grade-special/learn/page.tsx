"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ClipboardCheck, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Crown } from "lucide-react";

interface Slide { no: number; title: string; points: string[] }

const SLIDES: Slide[] = [
  { no: 1, title: "특급 개요 — AI 제품 전주기", points: ["목표: 아이디어 발굴부터 배포·홍보·시장 반응까지 제품의 전 과정을 AI로 수행한다.", "시험: 필기(객관식 40, 자동채점) + 실기(제품 전주기 제출, 수동채점). 각 100점, 둘 다 통과.", "주제·코드·스택 자유. 최고 난이도 — '만들기'를 넘어 '시장에서 검증'까지."] },
  { no: 2, title: "1. 시장조사", points: ["타겟 고객·시장 규모·경쟁 상황·실제 니즈를 파악.", "인터뷰·설문·행동 데이터로 '진짜 문제'를 검증.", "AI로 트렌드·리뷰·경쟁 정보를 요약하되 출처를 검증."] },
  { no: 3, title: "2. 기획 (이유·목표·기대효과)", points: ["왜 만드는지(문제)·목표(KPI)·기대효과를 명확히.", "가치 제안: 누구의 어떤 문제를 어떻게 해결하는지 한 줄로.", "MVP: 핵심 가치를 검증할 최소 기능부터."] },
  { no: 4, title: "3. 디자인", points: ["사용자가 목표를 쉽게 달성하도록 직관적으로 설계.", "색·타이포·여백의 일관성, 모바일 사용성, 접근성 고려.", "AI로 시안·이미지·카피를 빠르게 만들되 사람이 검토."] },
  { no: 5, title: "4~6. 제작 · 디버깅·수정 · 구현 완료", points: ["용도별 AI 도구를 워크플로로 연결(기획·코드·이미지·데이터).", "다중 사용자 데이터는 서버 저장, 입력은 서버 검증.", "만들고 피드백받아 개선하는 반복으로 완성도를 높임."] },
  { no: 6, title: "7. 배포", points: ["호스팅에 올려 누구나 접속 가능하게 공개(필수).", "HTTPS 사용, API 키·비밀번호는 환경변수/시크릿으로 분리.", "성능: 압축·캐싱·CDN. 로그·오류 모니터링·백업."] },
  { no: 7, title: "8. 홍보", points: ["타겟 고객이 모이는 채널을 파악해 맞는 메시지를 전달.", "AI로 콘텐츠 초안을 빠르게 생성하되 사실성·과장 검토.", "검증 불가 과장('100% 보장')·허위 후기는 금지."] },
  { no: 8, title: "9. 홍보 반응 (시장 검증)", points: ["방문자·클릭률·가입·전환·피드백 등으로 반응 측정.", "데이터·피드백을 분석해 우선순위를 정하고 개선.", "지속적 가치 제공 + 데이터 기반 개선이 성장의 핵심."] },
  { no: 9, title: "윤리·책임", points: ["개인정보: 목적 고지·동의·최소 수집·적정 파기.", "AI 생성물: 라이선스·저작권·사실성 확인, 책임은 사람.", "제품의 기능·보안·법규 준수 최종 책임은 운영자에게 있다."] },
  { no: 10, title: "특급 실기 안내", points: ["시장조사~홍보 반응까지 단계별로 작성하고 배포 URL과 함께 제출.", "채점(100점, 60↑ 합격): 시장조사·기획 20 / 디자인·완성도 20 / 제작·기술 20 / 배포 15(필수) / 홍보·반응 25.", "제출 후 발표일에 결과 공개. (관리자가 타이머를 켜면 제한시간 내 제출)"] },
];

interface PracticeQuestion { content: string; options: string[]; correctAnswer: number; explanation: string }

const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  { content: "시장조사의 핵심 목적은?", options: ["경쟁사 디자인 복사", "타겟 니즈·시장·경쟁 파악", "코드 빨리 작성", "서버 비용 절감"], correctAnswer: 1, explanation: "시장조사는 고객 니즈·시장·경쟁을 파악하는 활동입니다." },
  { content: "MVP의 개념은?", options: ["완성된 최종 제품", "핵심 가치를 검증할 최소 기능 제품", "예산이 큰 제품", "버그 없는 제품"], correctAnswer: 1, explanation: "MVP는 핵심 가치를 빠르게 검증할 최소 기능 제품입니다." },
  { content: "좋은 KPI는?", options: ["'잘 되게 한다'", "'1개월 내 가입 500명'처럼 측정 가능", "세우지 않음", "경쟁사가 정함"], correctAnswer: 1, explanation: "KPI는 구체적·측정 가능해야 합니다." },
  { content: "배포(Deploy)의 의미는?", options: ["내 PC에서만 실행", "호스팅에 올려 누구나 접속 가능", "코드 삭제", "이미지 압축"], correctAnswer: 1, explanation: "배포는 제품을 공개해 접속 가능하게 하는 것입니다." },
  { content: "홍보 반응 측정 지표는?", options: ["방문자·클릭·가입·전환·피드백", "코드 줄 수", "서버 위치", "도메인 길이"], correctAnswer: 0, explanation: "시장 반응은 방문·전환·피드백 등으로 측정합니다." },
  { content: "광고에서 피해야 할 표현은?", options: ["근거 있는 수치", "'무조건 1위' 같은 검증 불가 과장", "실제 후기", "환불 정책"], correctAnswer: 1, explanation: "검증 불가 과장·허위는 표시광고법 위반 소지가 있습니다." },
  { content: "API 키 같은 민감 정보는?", options: ["코드에 하드코딩 후 공개", "환경변수/시크릿으로 분리·비공개", "이미지에 적기", "공개"], correctAnswer: 1, explanation: "민감 정보는 환경변수/시크릿으로 분리합니다." },
  { content: "제품 운영자의 책임은?", options: ["AI가 책임", "기능·보안·법규 최종 책임은 운영자", "사용자 책임", "책임 없음"], correctAnswer: 1, explanation: "AI는 도구이며 최종 책임은 운영자에게 있습니다." },
];

export default function GradeSpecialLearnPage() {
  const [activeTab, setActiveTab] = useState<"lecture" | "quiz">("lecture");
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [shuffled, setShuffled] = useState<PracticeQuestion[]>(PRACTICE_QUESTIONS);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const startQuiz = () => {
    setShuffled([...PRACTICE_QUESTIONS].map((q) => ({ q, r: Math.random() })).sort((a, b) => a.r - b.r).map((x) => x.q));
    setQuizStarted(true); setQuizFinished(false); setCurrentQ(0); setSelectedAnswer(null); setShowResult(false); setScore(0);
  };
  const handleAnswer = (idx: number) => { if (showResult) return; setSelectedAnswer(idx); setShowResult(true); if (idx === shuffled[currentQ].correctAnswer) setScore((s) => s + 1); };
  const nextQuestion = () => { if (currentQ >= shuffled.length - 1) setQuizFinished(true); else { setCurrentQ((q) => q + 1); setSelectedAnswer(null); setShowResult(false); } };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/courses" className="text-sm text-muted-foreground hover:text-primary">&larr; 강의 목록</Link>
          <h1 className="font-bold text-lg hidden sm:block">특급 AI 제품 전주기</h1>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setActiveTab("lecture")} className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-medium transition ${activeTab === "lecture" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}><BookOpen className="w-4 h-4" /> 강의</button>
            <button onClick={() => setActiveTab("quiz")} className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-medium transition ${activeTab === "quiz" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}><ClipboardCheck className="w-4 h-4" /> 예제시험</button>
          </div>
        </div>
      </div>

      {activeTab === "lecture" && (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
          {SLIDES.map((s) => (
            <div key={s.no} className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3"><span className="bg-primary text-white text-sm px-3 py-1 rounded-lg font-bold">{s.no}</span><h2 className="text-lg font-bold">{s.title}</h2></div>
              <ul className="space-y-2">{s.points.map((p, i) => <li key={i} className="flex gap-2 text-muted-foreground leading-relaxed"><span className="text-primary mt-1">•</span><span>{p}</span></li>)}</ul>
            </div>
          ))}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3"><Crown className="w-5 h-5 text-purple-600 shrink-0" /><span className="text-sm text-purple-800">예제시험으로 점검 후, 실기(제품 전주기 챌린지)에 도전하세요.</span></div>
        </div>
      )}

      {activeTab === "quiz" && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          {!quizStarted ? (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center">
              <ClipboardCheck className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">예제 시험</h2>
              <p className="text-muted-foreground mb-6">연습 문제 {PRACTICE_QUESTIONS.length}문항 · 즉시 정답·해설 확인</p>
              <button onClick={startQuiz} className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition">시험 시작하기</button>
            </div>
          ) : quizFinished ? (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center">
              <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-white ${score >= 6 ? "bg-green-500" : "bg-orange-500"}`}><Trophy className="w-10 h-10" /></div>
              <h2 className="text-2xl font-bold mb-2">결과</h2>
              <div className="text-4xl font-bold text-primary my-4">{score} / {shuffled.length}</div>
              <div className="flex gap-3 justify-center">
                <button onClick={startQuiz} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition"><RotateCcw className="w-4 h-4" /> 다시 풀기</button>
                <button onClick={() => setActiveTab("lecture")} className="flex items-center gap-2 border border-border px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition"><BookOpen className="w-4 h-4" /> 강의 복습</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${((currentQ + 1) / shuffled.length) * 100}%` }} /></div>
                <span className="text-muted-foreground font-medium whitespace-nowrap">{currentQ + 1} / {shuffled.length}</span>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
                <div className="flex items-center gap-2 mb-4"><span className="bg-primary text-white px-3 py-1 rounded-lg font-bold">Q{currentQ + 1}</span><span className="text-muted-foreground">연습문제</span></div>
                <h3 className="text-lg font-bold mb-6 leading-relaxed">{shuffled[currentQ].content}</h3>
                <div className="space-y-3">
                  {shuffled[currentQ].options.map((opt, idx) => {
                    let c = "border-gray-100 hover:border-primary/30 hover:bg-gray-50";
                    if (showResult) {
                      if (idx === shuffled[currentQ].correctAnswer) c = "border-green-400 bg-green-50 text-green-800";
                      else if (idx === selectedAnswer) c = "border-red-400 bg-red-50 text-red-800";
                      else c = "border-gray-100 opacity-50";
                    } else if (idx === selectedAnswer) c = "border-primary bg-primary/5";
                    return (
                      <button key={idx} onClick={() => handleAnswer(idx)} disabled={showResult} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${c}`}>
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mr-3 font-bold ${showResult && idx === shuffled[currentQ].correctAnswer ? "bg-green-500 text-white" : showResult && idx === selectedAnswer ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                          {showResult && idx === shuffled[currentQ].correctAnswer ? <CheckCircle className="w-5 h-5" /> : showResult && idx === selectedAnswer ? <XCircle className="w-5 h-5" /> : idx + 1}
                        </span>{opt}
                      </button>
                    );
                  })}
                </div>
                {showResult && <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4"><p className="font-bold text-blue-800 mb-1">💡 해설</p><p className="text-blue-700">{shuffled[currentQ].explanation}</p></div>}
                {showResult && <button onClick={nextQuestion} className="mt-6 flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition ml-auto">{currentQ >= shuffled.length - 1 ? "결과 보기" : "다음 문제"}<ArrowRight className="w-4 h-4" /></button>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
