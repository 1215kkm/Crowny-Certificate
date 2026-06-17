"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getDocument, type ExamDoc } from "@/lib/firestore";
import {
  CHALLENGE_PROBLEMS,
  LIFECYCLE_STAGES,
  CHALLENGE_RUBRIC,
  CHALLENGE_PASSING_SCORE,
} from "@/data/grade-special-practical";
import { Trophy, Clock, Send, CheckCircle } from "lucide-react";

type StageKey = (typeof LIFECYCLE_STAGES)[number]["key"];

export default function ChallengeExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [exam, setExam] = useState<(ExamDoc & { id: string }) | null>(null);
  const [loadingExam, setLoadingExam] = useState(true);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [announceAt, setAnnounceAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  const [topicMode, setTopicMode] = useState<"FREE" | "POOL">("FREE");
  const [topicTitle, setTopicTitle] = useState("");
  const [problemId, setProblemId] = useState<string>("");

  const [stages, setStages] = useState<Record<StageKey, string>>({
    marketResearch: "", planning: "", design: "", build: "",
    debugFix: "", completion: "", promotion: "", promotionResponse: "",
  });
  const [appUrl, setAppUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [shareLink, setShareLink] = useState("");

  const lsKey = `challenge-start-${examId}-${user?.uid ?? ""}`;

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth/login"); return; }
    getDocument<ExamDoc>("exams", examId).then((e) => setExam(e)).finally(() => setLoadingExam(false));
  }, [examId, user, authLoading, router]);

  const startExam = () => {
    setStarted(true);
    if (exam && exam.duration > 0 && !localStorage.getItem(lsKey)) {
      localStorage.setItem(lsKey, String(Date.now()));
    }
  };

  useEffect(() => {
    if (!started || !exam || exam.duration <= 0) return;
    const startTs = Number(localStorage.getItem(lsKey)) || Date.now();
    const totalSec = exam.duration * 60;
    const tick = () => {
      const left = totalSec - Math.floor((Date.now() - startTs) / 1000);
      setTimeLeft(left);
      if (left <= 0) setTimedOut(true);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [started, exam, lsKey]);

  const setStage = (k: StageKey, v: string) => setStages((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!user) return;
    const title = topicMode === "POOL"
      ? (CHALLENGE_PROBLEMS.find((p) => p.id === problemId)?.title ?? "")
      : topicTitle.trim();
    if (!title) { alert("주제를 입력하거나 선택해주세요."); return; }
    if (!appUrl.trim()) { alert("배포된 결과물 URL을 입력해주세요."); return; }

    setSubmitting(true);
    try {
      const { getFirebaseAuth } = await import("@/lib/firebase");
      const token = await getFirebaseAuth().currentUser?.getIdToken();
      const res = await fetch("/api/exams/submit-special", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          examId, topicMode, topicTitle: title,
          problemId: topicMode === "POOL" ? problemId : null,
          ...stages, appUrl, repoUrl, demoLink, shareLink, timedOut,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem(lsKey);
        setAnnounceAt(data.announceAt || "");
        setSubmitted(true);
      } else alert(data.error || "제출에 실패했습니다.");
    } catch {
      alert("제출 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (s: number) => {
    const a = Math.abs(s);
    const h = Math.floor(a / 3600), m = Math.floor((a % 3600) / 60), sec = a % 60;
    return `${s < 0 ? "-" : ""}${h > 0 ? `${h}시간 ` : ""}${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  if (authLoading || loadingExam) return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-muted-foreground">로딩 중...</div>;
  if (!user) return null;

  if (submitted) {
    const d = announceAt ? new Date(announceAt) : null;
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 bg-green-500 flex items-center justify-center"><CheckCircle className="w-10 h-10 text-white" /></div>
        <h1 className="text-2xl font-bold mb-2">특급 챌린지 제출 완료</h1>
        <p className="text-muted-foreground mb-6">제출이 접수되었습니다. 수동 채점 후 발표됩니다.</p>
        <div className="bg-muted rounded-xl p-6 mb-6">
          <div className="text-sm text-muted-foreground mb-1">결과 발표 예정</div>
          <div className="text-2xl font-bold text-primary">
            {d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} 오후 1시` : "제출일로부터 15일 후 오후 1시"}
          </div>
        </div>
        <a href="/mypage" className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition inline-block">마이페이지에서 확인</a>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white border border-border rounded-2xl p-8 text-center shadow-sm">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"><Trophy className="w-8 h-8 text-primary" /></div>
          <h1 className="text-2xl font-bold mb-2">특급 실기 — AI 제품 전주기 챌린지</h1>
          <p className="text-muted-foreground mb-8">아이디어 발굴부터 배포·홍보·시장 반응까지, 제품의 전 과정을 수행해 제출합니다.</p>
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-2 text-sm">
            <p>• 단계: 시장조사 → 기획 → 디자인 → 제작 → 디버깅·수정 → 구현완료 → <strong>배포</strong> → 홍보 → <strong>홍보 반응</strong></p>
            <p>• 주제·코드·스택 <strong>자유</strong> (직접 정하거나 제시된 문제 풀에서 선택)</p>
            <p>• 채점: 100점, <strong>{CHALLENGE_PASSING_SCORE}점 이상 합격</strong> (배포 URL 필수). 제출 후 발표일에 결과 공개.</p>
            {exam && exam.duration > 0 && <p className="text-orange-600">• 제한 시간: <strong>{exam.duration}분</strong> (시작 시각부터 카운트다운)</p>}
          </div>
          <button onClick={startExam} className="bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition shadow-md">챌린지 시작</button>
        </div>
      </div>
    );
  }

  // 단계별 입력: 1~6, (7 배포 URL), 8~9
  const preStages = LIFECYCLE_STAGES.filter((s) => !["promotion", "promotionResponse"].includes(s.key));
  const postStages = LIFECYCLE_STAGES.filter((s) => ["promotion", "promotionResponse"].includes(s.key));

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-6 mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="font-bold text-lg flex items-center gap-2"><Trophy className="w-5 h-5" /> 특급 — 제품 전주기 챌린지</div>
          <div className="text-sm opacity-90">전 과정을 채우고 배포 URL과 함께 제출하세요.</div>
        </div>
        {timeLeft !== null && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold ${timedOut ? "bg-red-500/30" : "bg-white/20"}`}>
            <Clock className="w-5 h-5" />{timedOut ? "시간 종료" : fmt(timeLeft)}
          </div>
        )}
      </div>

      {timedOut && <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 text-sm text-orange-700">제한 시간이 지났습니다. 지금 제출하면 <strong>시간 초과</strong>로 기록됩니다.</div>}

      <div className="bg-white border border-border rounded-2xl p-5 mb-6">
        <h3 className="font-bold mb-3">채점표 (100점, {CHALLENGE_PASSING_SCORE}점 이상 합격)</h3>
        <ul className="space-y-1.5 text-sm">
          {CHALLENGE_RUBRIC.map((r) => (
            <li key={r.id} className="flex justify-between"><span>{r.label}{r.required && <span className="text-red-500"> (필수)</span>}</span><span className="font-medium text-muted-foreground">{r.points}점</span></li>
          ))}
        </ul>
      </div>

      {/* 주제 */}
      <div className="bg-white border border-border rounded-2xl p-5 mb-4 space-y-3">
        <div className="font-bold">주제</div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          <button onClick={() => setTopicMode("FREE")} className={`px-3 py-2 rounded-lg text-sm font-medium ${topicMode === "FREE" ? "bg-white shadow-sm text-primary" : "text-muted-foreground"}`}>직접 정하기</button>
          <button onClick={() => setTopicMode("POOL")} className={`px-3 py-2 rounded-lg text-sm font-medium ${topicMode === "POOL" ? "bg-white shadow-sm text-primary" : "text-muted-foreground"}`}>문제 풀에서 선택</button>
        </div>
        {topicMode === "FREE" ? (
          <input value={topicTitle} onChange={(e) => setTopicTitle(e.target.value)} placeholder="제품/서비스 주제명" className="w-full px-3 py-2 border border-border rounded-lg" />
        ) : (
          <select value={problemId} onChange={(e) => setProblemId(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-white">
            <option value="">문제를 선택하세요</option>
            {CHALLENGE_PROBLEMS.map((p) => <option key={p.id} value={p.id}>{p.title} — {p.desc}</option>)}
          </select>
        )}
      </div>

      {/* 전주기 단계 */}
      <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
        {preStages.map((s) => (
          <div key={s.key}>
            <label className="block text-sm font-medium mb-1">{s.label}</label>
            <textarea value={stages[s.key]} onChange={(e) => setStage(s.key, e.target.value)} rows={2} placeholder={s.placeholder} className="w-full px-3 py-2 border border-border rounded-lg resize-none" />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium mb-1">7. 배포 — 접속 URL <span className="text-red-500">*</span></label>
          <input value={appUrl} onChange={(e) => setAppUrl(e.target.value)} placeholder="https://my-product.vercel.app" className="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
        {postStages.map((s) => (
          <div key={s.key}>
            <label className="block text-sm font-medium mb-1">{s.label}</label>
            <textarea value={stages[s.key]} onChange={(e) => setStage(s.key, e.target.value)} rows={2} placeholder={s.placeholder} className="w-full px-3 py-2 border border-border rounded-lg resize-none" />
          </div>
        ))}
        <div className="grid md:grid-cols-3 gap-3 pt-2 border-t border-border">
          <input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="저장소 링크(선택)" className="px-3 py-2 border border-border rounded-lg text-sm" />
          <input value={demoLink} onChange={(e) => setDemoLink(e.target.value)} placeholder="데모 링크(선택)" className="px-3 py-2 border border-border rounded-lg text-sm" />
          <input value={shareLink} onChange={(e) => setShareLink(e.target.value)} placeholder="AI 공유링크(선택)" className="px-3 py-2 border border-border rounded-lg text-sm" />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition disabled:opacity-50">
          <Send className="w-4 h-4" />{submitting ? "제출 중..." : "챌린지 제출하기"}
        </button>
      </div>
    </div>
  );
}
