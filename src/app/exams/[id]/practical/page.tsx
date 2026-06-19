"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { uploadFile } from "@/lib/firebase-storage";
import { getDocument, type ExamDoc } from "@/lib/firestore";
import {
  PRACTICAL_THEMES,
  DEFAULT_WIREFRAMES,
  type PracticalTheme,
  type PracticalWireframe,
  type AiUsage,
} from "@/data/grade-2-practical";
import WireframePreview from "@/components/wireframe-preview";
import { Layout, Upload, FileArchive, CheckCircle, Send, Plus, Trash2 } from "lucide-react";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function PracticalExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [wireframes, setWireframes] = useState<PracticalWireframe[]>(DEFAULT_WIREFRAMES);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [announceAt, setAnnounceAt] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [startTs] = useState(() => `${Math.floor(Math.random() * 1e9)}`);

  const [theme, setTheme] = useState<PracticalTheme | null>(null);
  const [wireframe, setWireframe] = useState<PracticalWireframe | null>(null);

  // 실기 제한 시간(분) — 관리자가 시험에 설정한 practicalDuration
  const [examMins, setExamMins] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const lsKey = `practical-start-${examId}-${user?.uid ?? ""}`;

  // 결과물 제출
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [shotUploading, setShotUploading] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [aiUsages, setAiUsages] = useState<AiUsage[]>([{ content: "", link: "" }]);

  // 와이어프레임 목록 로드 (관리자 등록분 우선, 없으면 기본 5종)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/wireframes");
        if (res.ok) {
          const d = await res.json();
          if (Array.isArray(d.wireframes) && d.wireframes.length > 0) {
            setWireframes(d.wireframes as PracticalWireframe[]);
          }
        }
      } catch {
        /* 기본값 사용 */
      }
    })();
  }, []);

  // 시험의 실기 제한 시간 로드
  useEffect(() => {
    (async () => {
      try {
        const exam = await getDocument<ExamDoc>("exams", examId);
        if (exam) setExamMins(exam.practicalDuration ?? 0);
      } catch {
        /* 무시 */
      }
    })();
  }, [examId]);

  // 카운트다운 (시작 후, 제한 시간이 있는 경우)
  useEffect(() => {
    if (!started || examMins <= 0) return;
    const startMs = Number(localStorage.getItem(lsKey)) || Date.now();
    const totalSec = examMins * 60;
    const tick = () => {
      const left = totalSec - Math.floor((Date.now() - startMs) / 1000);
      setTimeLeft(left);
      if (left <= 0) setTimedOut(true);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [started, examMins, lsKey]);

  const startExam = () => {
    const msg =
      examMins > 0
        ? `시험이 시작된 후 ${examMins}분 동안 취소 및 환불이 되지 않습니다.\n진행하시겠습니까?`
        : "시험을 시작하면 취소 및 환불이 되지 않습니다.\n진행하시겠습니까?";
    if (!confirm(msg)) return;
    setTheme(pickRandom(PRACTICAL_THEMES));
    setWireframe(pickRandom(wireframes.length > 0 ? wireframes : DEFAULT_WIREFRAMES));
    if (examMins > 0 && !localStorage.getItem(lsKey)) {
      localStorage.setItem(lsKey, String(Date.now()));
    }
    setStarted(true);
  };

  const fmtTime = (s: number) => {
    const a = Math.abs(s);
    const h = Math.floor(a / 3600), m = Math.floor((a % 3600) / 60), sec = a % 60;
    return `${s < 0 ? "-" : ""}${h > 0 ? `${h}시간 ` : ""}${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const uploadScreenshot = async (file: File) => {
    if (!user) return;
    setShotUploading(true);
    try {
      const safe = file.name.replace(/[^\w.\-]/g, "_");
      const url = await uploadFile(`practical/${user.uid}/${startTs}/shot-${safe}`, file);
      setScreenshotUrl(url);
    } catch (e) {
      console.error(e);
      alert("스크린샷 업로드에 실패했습니다. (Storage 규칙 확인 필요)");
    } finally {
      setShotUploading(false);
    }
  };

  const addAiUsage = () => setAiUsages((p) => [...p, { content: "", link: "" }]);
  const removeAiUsage = (i: number) =>
    setAiUsages((p) => (p.length <= 1 ? p : p.filter((_, j) => j !== i)));
  const updateAiUsage = (i: number, key: keyof AiUsage, value: string) =>
    setAiUsages((p) => p.map((u, j) => (j === i ? { ...u, [key]: value } : u)));

  const handleSubmit = async () => {
    if (!user || !theme || !wireframe) return;
    if (!zipFile) {
      alert("결과물(압축 파일, .zip)을 첨부해주세요.");
      return;
    }
    if (!liveUrl.trim()) {
      alert("실제 볼 수 있는 주소(배포 URL)를 입력해주세요.");
      return;
    }
    if (shotUploading) {
      alert("스크린샷 업로드가 끝날 때까지 기다려주세요.");
      return;
    }
    setSubmitting(true);
    try {
      // 1) 결과물 zip 업로드
      const safeName = zipFile.name.replace(/[^\w.\-]/g, "_");
      const zipUrl = await uploadFile(`practical/${user.uid}/${startTs}/result-${safeName}`, zipFile);

      // 2) 제출
      const usages = aiUsages
        .map((u) => ({ content: u.content.trim(), link: u.link.trim() }))
        .filter((u) => u.content || u.link);

      const { getFirebaseAuth } = await import("@/lib/firebase");
      const token = await getFirebaseAuth().currentUser?.getIdToken();
      const res = await fetch("/api/exams/submit-practical", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          examId,
          themeId: theme.id,
          wireframeId: wireframe.id,
          wireframeName: wireframe.name,
          wireframeCode: wireframe.code,
          zipUrl,
          zipName: zipFile.name,
          screenshotUrl,
          repoUrl: repoUrl.trim() || null,
          liveUrl: liveUrl.trim() || null,
          aiUsages: usages,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem(lsKey);
        setAnnounceAt(data.announceAt || "");
        setSubmitted(true);
      } else {
        alert(data.error || "제출에 실패했습니다.");
      }
    } catch (e) {
      console.error(e);
      alert("제출 중 오류가 발생했습니다. (결과물 업로드 실패 시 Storage 규칙 확인 필요)");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-muted-foreground">로딩 중...</div>;
  }
  if (!user) {
    if (typeof window !== "undefined") router.push("/auth/login");
    return null;
  }

  // 제출 완료 화면
  if (submitted) {
    const announceDate = announceAt ? new Date(announceAt) : null;
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 bg-green-500 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">실기 제출 완료</h1>
        <p className="text-muted-foreground mb-6">
          제출이 정상적으로 접수되었습니다. 실기는 수동 채점 후 발표됩니다.
        </p>
        <div className="bg-muted rounded-xl p-6 mb-6">
          <div className="text-sm text-muted-foreground mb-1">결과 발표 예정</div>
          <div className="text-2xl font-bold text-primary">
            {announceDate
              ? `${announceDate.getFullYear()}-${String(announceDate.getMonth() + 1).padStart(2, "0")}-${String(announceDate.getDate()).padStart(2, "0")} 오후 1시`
              : "제출일로부터 15일 후 오후 1시"}
          </div>
        </div>
        <a href="/mypage" className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition inline-block">
          마이페이지에서 확인
        </a>
      </div>
    );
  }

  // 시작 전 안내
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white border border-border rounded-2xl p-8 text-center shadow-sm">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Layout className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">2급 실기 — AI 랜딩페이지 제작</h1>
          <p className="text-muted-foreground mb-8">시작하면 주제와 와이어프레임(A~E)이 랜덤으로 배정됩니다.</p>
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-2 text-sm">
            <p>• 배정된 <strong>주제</strong>와 <strong>와이어프레임(그레이아웃)</strong>에 맞춰 랜딩페이지를 직접 제작·배포합니다.</p>
            <p>• 제출 시 <strong>결과물(.zip)</strong>, <strong>깃허브 주소</strong>, <strong>실제 볼 수 있는 주소</strong>를 함께 제출합니다.</p>
            <p>• 제작에 사용한 <strong>AI 대화 내용과 공유 링크</strong>를 (여러 개) 작성합니다.</p>
            <p className="text-orange-600">• 실기는 수동 채점이며 <strong>제출일 + 15일 후 오후 1시</strong>에 발표됩니다.</p>
          </div>
          <button onClick={startExam} className="bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition shadow-md">
            시험 시작 (랜덤 배정)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 배정 정보 */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-sm opacity-80 mb-1">배정된 과제</div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              <div><span className="opacity-80 text-sm">주제 </span><span className="font-bold text-lg">{theme?.name}</span></div>
              <div>
                <span className="opacity-80 text-sm">와이어프레임 </span>
                <span className="font-bold text-lg">{wireframe?.code ? `${wireframe.code}. ` : ""}{wireframe?.name}</span>
              </div>
            </div>
            <div className="text-sm opacity-90 mt-2">{theme?.desc}</div>
          </div>
          {timeLeft !== null && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold ${timedOut ? "bg-red-500/30" : "bg-white/20"}`}>
              ⏱ {timedOut ? "시간 종료" : fmtTime(timeLeft)}
            </div>
          )}
        </div>
      </div>

      {timedOut && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 text-sm text-orange-700">
          제한 시간이 지났습니다. 지금 제출하면 시간 초과로 간주될 수 있습니다.
        </div>
      )}

      <div className="grid md:grid-cols-[320px_1fr] gap-6">
        {/* 와이어프레임 그레이아웃 */}
        <div>
          <div className="sticky top-4">
            <h3 className="font-bold mb-2 flex items-center gap-2"><Layout className="w-4 h-4 text-primary" /> 배정 와이어프레임</h3>
            <p className="text-xs text-muted-foreground mb-2">{wireframe?.desc}</p>
            {wireframe && <WireframePreview blocks={wireframe.blocks} />}
            <p className="text-[11px] text-muted-foreground mt-2">
              위 회색 레이아웃 구조(섹션 순서·구성)에 맞춰 제작하세요.
            </p>
          </div>
        </div>

        {/* 제출 폼 */}
        <div className="space-y-4">
          {/* 결과물 zip */}
          <section className="bg-white border border-border rounded-2xl p-5">
            <h3 className="font-bold mb-2 flex items-center gap-2"><FileArchive className="w-4 h-4 text-primary" /> 결과물 제출 (압축 .zip) <span className="text-red-500">*</span></h3>
            <p className="text-sm text-muted-foreground mb-3">제작한 결과물(소스/이미지 등)을 하나의 zip 파일로 압축해 첨부하세요.</p>
            <label className="flex items-center gap-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/40 transition p-4">
              <Upload className="w-5 h-5 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground truncate">
                {zipFile ? zipFile.name : "zip 파일 선택 (클릭)"}
              </span>
              <input
                type="file"
                accept=".zip,application/zip,application/x-zip-compressed,application/octet-stream"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  if (f && !/\.zip$/i.test(f.name)) {
                    alert("zip 형식의 압축 파일만 첨부할 수 있습니다.");
                    return;
                  }
                  setZipFile(f);
                }}
              />
            </label>
          </section>

          {/* 결과물 스크린샷 */}
          <section className="bg-white border border-border rounded-2xl p-5">
            <h3 className="font-bold mb-2">결과물 스크린샷</h3>
            <p className="text-sm text-muted-foreground mb-3">완성한 결과물의 대표 화면을 캡처해 등록하세요. 합격 시 합격작에 그대로 사용됩니다.</p>
            <label className="flex items-center gap-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/40 transition p-4 overflow-hidden">
              {screenshotUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={screenshotUrl} alt="결과물 스크린샷" className="w-28 h-20 object-cover rounded" />
              ) : (
                <Upload className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
              <span className="text-sm text-muted-foreground truncate">
                {shotUploading ? "업로드 중..." : screenshotUrl ? "스크린샷 변경 (클릭)" : "이미지 선택 (클릭)"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadScreenshot(f);
                }}
              />
            </label>
          </section>

          {/* 주소 */}
          <section className="bg-white border border-border rounded-2xl p-5 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">실제 볼 수 있는 주소 (배포 URL) <span className="text-red-500">*</span></label>
              <input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://my-landing.vercel.app" className="w-full px-3 py-2 border border-border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">깃허브 주소</label>
              <input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/내계정/저장소" className="w-full px-3 py-2 border border-border rounded-lg" />
            </div>
          </section>

          {/* AI 사용 내역 (여러 개) */}
          <section className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">AI 사용 내역</h3>
              <button onClick={addAiUsage} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                <Plus className="w-4 h-4" /> AI 추가
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">제작에 사용한 AI의 대화 내용과 공유 링크를 작성하세요. 여러 AI를 사용했다면 추가하세요.</p>
            <div className="space-y-3">
              {aiUsages.map((u, i) => (
                <div key={i} className="border border-border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">AI {i + 1}</span>
                    {aiUsages.length > 1 && (
                      <button onClick={() => removeAiUsage(i)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={u.content}
                    onChange={(e) => updateAiUsage(i, "content", e.target.value)}
                    rows={2}
                    placeholder="대화 내용 / 어떤 작업에 어떻게 사용했는지 (예: 헤드라인 카피 생성, 이미지 프롬프트 작성 등)"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm mb-2 resize-none"
                  />
                  <input
                    value={u.link}
                    onChange={(e) => updateAiUsage(i, "link", e.target.value)}
                    placeholder="대화 공유 링크 (https://chatgpt.com/share/...)"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">결과물·주소·AI 내역을 작성한 뒤 제출하세요.</span>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? "제출 중..." : "실기 제출하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
