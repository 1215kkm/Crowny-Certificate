"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { uploadFile } from "@/lib/firebase-storage";
import { APP_THEMES, APP_RUBRIC, APP_PASSING_SCORE } from "@/data/grade-1-practical";
import { Rocket, CheckCircle, Send, Upload } from "lucide-react";

export default function AppSubmitPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [themeId, setThemeId] = useState(APP_THEMES[0].id);
  const [appUrl, setAppUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [shotUploading, setShotUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (authLoading) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-muted-foreground">로딩 중...</div>;
  }
  if (!user) {
    if (typeof window !== "undefined") router.push("/auth/login");
    return null;
  }

  const uploadScreenshot = async (file: File) => {
    if (!user) return;
    setShotUploading(true);
    try {
      const safe = file.name.replace(/[^\w.\-]/g, "_");
      const url = await uploadFile(`app/${user.uid}/${Math.floor(Math.random() * 1e9)}-${safe}`, file);
      setScreenshotUrl(url);
    } catch (e) {
      console.error(e);
      alert("스크린샷 업로드에 실패했습니다. (Storage 규칙 확인 필요)");
    } finally {
      setShotUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!appUrl.trim()) {
      alert("배포된 앱 URL을 입력해주세요.");
      return;
    }
    if (shotUploading) {
      alert("스크린샷 업로드가 끝날 때까지 기다려주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const { getFirebaseAuth } = await import("@/lib/firebase");
      const token = await getFirebaseAuth().currentUser?.getIdToken();
      const res = await fetch("/api/exams/submit-app", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ examId, themeId, appUrl, repoUrl, description, shareLink, screenshotUrl }),
      });
      const data = await res.json();
      if (res.ok) setSubmitted(true);
      else alert(data.error || "제출에 실패했습니다.");
    } catch {
      alert("제출 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 bg-green-500 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">앱(실기) 제출 완료</h1>
        <p className="text-muted-foreground mb-6">제출이 접수되었습니다. 관리자 채점 후 결과가 마이페이지에 표시됩니다.</p>
        <a href="/mypage" className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition inline-block">마이페이지에서 확인</a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-1"><Rocket className="w-5 h-5" /><span className="font-bold text-lg">1급 실기 — 앱 제작·배포 제출</span></div>
        <p className="text-sm opacity-90">주제를 선택해 직접 만든 앱을 배포하고, 접속 URL과 정보를 제출하세요.</p>
      </div>

      {/* 채점표 안내 */}
      <div className="bg-white border border-border rounded-2xl p-5 mb-6">
        <h3 className="font-bold mb-3">채점표 (100점, {APP_PASSING_SCORE}점 이상 합격)</h3>
        <ul className="space-y-1.5 text-sm">
          {APP_RUBRIC.map((r) => (
            <li key={r.id} className="flex justify-between">
              <span>{r.label}{r.required && <span className="text-red-500"> (필수)</span>}</span>
              <span className="font-medium text-muted-foreground">{r.points}점</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mt-3">* 필수 항목(배포·서버 데이터 저장) 미충족 시 총점과 무관하게 불합격됩니다.</p>
      </div>

      <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">주제 선택</label>
          <select value={themeId} onChange={(e) => setThemeId(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-white">
            {APP_THEMES.map((t) => (
              <option key={t.id} value={t.id}>{t.name} — {t.desc}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">배포된 앱 URL <span className="text-red-500">*</span></label>
          <input value={appUrl} onChange={(e) => setAppUrl(e.target.value)} placeholder="https://my-app.vercel.app" className="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">소스 저장소 링크 (선택)</label>
          <input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/..." className="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">앱 설명 (구현 기능·사용 방법)</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="회원가입/로그인, 글쓰기·댓글, 점수·랭킹, AI 이미지 활용 등 구현한 기능과 테스트 계정을 적어주세요." className="w-full px-3 py-2 border border-border rounded-lg resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">AI 대화 공유링크 (선택, 권장)</label>
          <input value={shareLink} onChange={(e) => setShareLink(e.target.value)} placeholder="https://chatgpt.com/share/..." className="w-full px-3 py-2 border border-border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">결과물 스크린샷</label>
          <p className="text-xs text-muted-foreground mb-2">대표 화면을 캡처해 등록하세요. 합격 시 합격작에 그대로 사용됩니다.</p>
          <label className="flex items-center gap-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/40 transition p-3 overflow-hidden">
            {screenshotUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={screenshotUrl} alt="결과물 스크린샷" className="w-24 h-16 object-cover rounded" />
            ) : (
              <Upload className="w-5 h-5 text-muted-foreground shrink-0" />
            )}
            <span className="text-sm text-muted-foreground truncate">
              {shotUploading ? "업로드 중..." : screenshotUrl ? "스크린샷 변경 (클릭)" : "이미지 선택 (클릭)"}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadScreenshot(f); }} />
          </label>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition disabled:opacity-50">
          <Send className="w-4 h-4" />
          {submitting ? "제출 중..." : "앱 제출하기"}
        </button>
      </div>
    </div>
  );
}
