"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { uploadFile } from "@/lib/firebase-storage";
import {
  PRACTICAL_THEMES,
  PRACTICAL_WIREFRAMES,
  type PracticalTheme,
  type PracticalWireframe,
} from "@/data/grade-2-practical";
import { Layout, Upload, ImageIcon, CheckCircle, Send } from "lucide-react";

interface HeroSlot { imageUrl: string | null; headline: string; subcopy: string; cta: string }
interface IconSlot { imageUrl: string | null; label: string }
interface ProductSlot { imageUrl: string | null; name: string; desc: string }
interface BandSlot { imageUrl: string | null; message: string }

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function PracticalExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [announceAt, setAnnounceAt] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [startTs] = useState(() => `${Math.floor(Math.random() * 1e9)}`);

  const [theme, setTheme] = useState<PracticalTheme | null>(null);
  const [wireframe, setWireframe] = useState<PracticalWireframe | null>(null);

  const [hero, setHero] = useState<HeroSlot>({ imageUrl: null, headline: "", subcopy: "", cta: "" });
  const [icons, setIcons] = useState<IconSlot[]>(
    Array.from({ length: 6 }, () => ({ imageUrl: null, label: "" }))
  );
  const [products, setProducts] = useState<ProductSlot[]>(
    Array.from({ length: 4 }, () => ({ imageUrl: null, name: "", desc: "" }))
  );
  const [band, setBand] = useState<BandSlot>({ imageUrl: null, message: "" });
  const [shareLink, setShareLink] = useState("");

  const startExam = () => {
    setTheme(pickRandom(PRACTICAL_THEMES));
    setWireframe(pickRandom(PRACTICAL_WIREFRAMES));
    setStarted(true);
  };

  const uploadImage = async (key: string, file: File): Promise<string | null> => {
    if (!user) return null;
    setUploadingCount((c) => c + 1);
    try {
      const path = `practical/${user.uid}/${startTs}/${key}-${file.name}`;
      const url = await uploadFile(path, file);
      return url;
    } catch (e) {
      console.error("이미지 업로드 실패:", e);
      alert("이미지 업로드에 실패했습니다. (관리자: Firebase Storage 규칙 확인 필요)");
      return null;
    } finally {
      setUploadingCount((c) => c - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user || !theme || !wireframe) return;
    if (uploadingCount > 0) {
      alert("이미지 업로드가 끝날 때까지 기다려주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const { getFirebaseAuth } = await import("@/lib/firebase");
      const token = await getFirebaseAuth().currentUser?.getIdToken();
      const res = await fetch("/api/exams/submit-practical", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          examId,
          themeId: theme.id,
          wireframeId: wireframe.id,
          hero,
          icons,
          products,
          band,
          shareLink: shareLink.trim() || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAnnounceAt(data.announceAt || "");
        setSubmitted(true);
      } else {
        alert(data.error || "제출에 실패했습니다.");
      }
    } catch {
      alert("제출 중 오류가 발생했습니다.");
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
          <p className="text-muted-foreground mb-8">시작하면 주제와 와이어프레임이 랜덤으로 배정됩니다.</p>
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-2 text-sm">
            <p>• 배정된 <strong>주제</strong>에 맞춰 랜딩페이지를 제작합니다.</p>
            <p>• 슬롯: <strong>히어로 1 · 아이콘 6 · 상품 4 · 띠배너 1</strong></p>
            <p>• 이미지는 <strong>본인 AI 계정</strong>으로 생성해 업로드하고, 대화 공유링크를 첨부하세요.</p>
            <p>• 각 슬롯에 이미지와 문구를 채운 뒤 제출합니다.</p>
            <p className="text-orange-600">• 실기는 수동 채점이며 <strong>제출일 + 15일 후 오후 1시</strong>에 발표됩니다.</p>
          </div>
          <button onClick={startExam} className="bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition shadow-md">
            시험 시작 (랜덤 배정)
          </button>
        </div>
      </div>
    );
  }

  // 슬롯 렌더러
  const ImageUploader = ({ url, onUploaded, label }: { url: string | null; onUploaded: (u: string) => void; label: string }) => (
    <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/40 transition h-28 overflow-hidden bg-gray-50">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={label} className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center text-muted-foreground text-xs">
          <Upload className="w-5 h-5 mb-1" />
          이미지 업로드
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) {
            const u = await uploadImage(label, f);
            if (u) onUploaded(u);
          }
        }}
      />
    </label>
  );

  const sections: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-bold mb-3 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-primary" /> 히어로 (대표 영역)</h3>
        <div className="grid md:grid-cols-[200px_1fr] gap-4">
          <ImageUploader url={hero.imageUrl} label="hero" onUploaded={(u) => setHero((p) => ({ ...p, imageUrl: u }))} />
          <div className="space-y-2">
            <input value={hero.headline} onChange={(e) => setHero((p) => ({ ...p, headline: e.target.value }))} placeholder="헤드라인 (핵심 한 줄)" className="w-full px-3 py-2 border border-border rounded-lg" />
            <input value={hero.subcopy} onChange={(e) => setHero((p) => ({ ...p, subcopy: e.target.value }))} placeholder="서브 카피" className="w-full px-3 py-2 border border-border rounded-lg" />
            <input value={hero.cta} onChange={(e) => setHero((p) => ({ ...p, cta: e.target.value }))} placeholder="CTA 버튼 문구 (예: 지금 구매하기)" className="w-full px-3 py-2 border border-border rounded-lg" />
          </div>
        </div>
      </section>
    ),
    icons: (
      <section key="icons" className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-bold mb-3">아이콘 6개 (핵심 혜택)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {icons.map((ic, i) => (
            <div key={i} className="space-y-2">
              <ImageUploader url={ic.imageUrl} label={`icon-${i}`} onUploaded={(u) => setIcons((prev) => prev.map((x, j) => (j === i ? { ...x, imageUrl: u } : x)))} />
              <input value={ic.label} onChange={(e) => setIcons((prev) => prev.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} placeholder={`아이콘 ${i + 1} 문구`} className="w-full px-2 py-1.5 border border-border rounded-lg text-sm" />
            </div>
          ))}
        </div>
      </section>
    ),
    products: (
      <section key="products" className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-bold mb-3">상품 이미지 4개</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {products.map((pr, i) => (
            <div key={i} className="space-y-2">
              <ImageUploader url={pr.imageUrl} label={`product-${i}`} onUploaded={(u) => setProducts((prev) => prev.map((x, j) => (j === i ? { ...x, imageUrl: u } : x)))} />
              <input value={pr.name} onChange={(e) => setProducts((prev) => prev.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} placeholder={`상품 ${i + 1} 이름`} className="w-full px-2 py-1.5 border border-border rounded-lg text-sm" />
              <input value={pr.desc} onChange={(e) => setProducts((prev) => prev.map((x, j) => (j === i ? { ...x, desc: e.target.value } : x)))} placeholder="혜택 설명" className="w-full px-2 py-1.5 border border-border rounded-lg text-sm" />
            </div>
          ))}
        </div>
      </section>
    ),
    band: (
      <section key="band" className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-bold mb-3">띠배너 (가로 강조 배너)</h3>
        <div className="grid md:grid-cols-[200px_1fr] gap-4">
          <ImageUploader url={band.imageUrl} label="band" onUploaded={(u) => setBand((p) => ({ ...p, imageUrl: u }))} />
          <input value={band.message} onChange={(e) => setBand((p) => ({ ...p, message: e.target.value }))} placeholder="띠배너 메시지 (예: 오늘만 무료배송)" className="w-full px-3 py-2 border border-border rounded-lg self-start" />
        </div>
      </section>
    ),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 배정 정보 */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-6 mb-6">
        <div className="text-sm opacity-80 mb-1">배정된 과제</div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <div><span className="opacity-80 text-sm">주제 </span><span className="font-bold text-lg">{theme?.name}</span></div>
          <div><span className="opacity-80 text-sm">와이어프레임 </span><span className="font-bold text-lg">{wireframe?.name}</span></div>
        </div>
        <div className="text-sm opacity-90 mt-2">{theme?.desc} · 배치: {wireframe?.desc}</div>
      </div>

      <div className="space-y-4">
        {wireframe?.order.map((sec) => sections[sec])}

        {/* AI 공유링크 */}
        <section className="bg-white border border-border rounded-2xl p-5">
          <h3 className="font-bold mb-2">AI 대화 공유링크 (선택, 권장)</h3>
          <p className="text-sm text-muted-foreground mb-2">이미지·카피 생성에 사용한 AI 대화 공유링크를 붙여넣으면 채점에 참고됩니다.</p>
          <input value={shareLink} onChange={(e) => setShareLink(e.target.value)} placeholder="https://chatgpt.com/share/..." className="w-full px-3 py-2 border border-border rounded-lg" />
        </section>
      </div>

      <div className="flex items-center justify-between mt-6">
        <span className="text-sm text-muted-foreground">
          {uploadingCount > 0 ? `이미지 업로드 중... (${uploadingCount})` : "모든 슬롯을 채운 뒤 제출하세요."}
        </span>
        <button
          onClick={handleSubmit}
          disabled={submitting || uploadingCount > 0}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {submitting ? "제출 중..." : "실기 제출하기"}
        </button>
      </div>
    </div>
  );
}
