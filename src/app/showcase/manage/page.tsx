"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { uploadFile } from "@/lib/firebase-storage";
import { SHOWCASE_GRADE_LABEL, type ShowcaseGrade } from "@/data/showcase-examples";
import { Upload, Trash2, Eye, EyeOff } from "lucide-react";

interface MyShowcase {
  id: string;
  grade: ShowcaseGrade;
  title: string;
  url: string;
  screenshotUrl: string | null;
  description: string;
  authorAge: string | null;
  authorBackground: string | null;
  isPublished: boolean;
}

const EMPTY = {
  id: "", grade: "" as ShowcaseGrade | "", title: "", url: "",
  screenshotUrl: "", description: "", authorAge: "", authorBackground: "", isPublished: false,
};

export default function ShowcaseManagePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [eligible, setEligible] = useState<ShowcaseGrade[]>([]);
  const [mine, setMine] = useState<MyShowcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...EMPTY });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const token = useCallback(async () => {
    const { getFirebaseAuth } = await import("@/lib/firebase");
    return getFirebaseAuth().currentUser?.getIdToken();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/showcase/mine", { method: "POST", headers: { Authorization: `Bearer ${await token()}` } });
      const d = await res.json();
      setEligible(d.eligibleGrades || []);
      setMine(d.mine || []);
    } catch { /* noop */ } finally { setLoading(false); }
  }, [token]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth/login"); return; }
    load();
  }, [user, authLoading, router, load]);

  const handleUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const url = await uploadFile(`showcase/${user.uid}/${Date.now()}-${file.name}`, file);
      setForm((f) => ({ ...f, screenshotUrl: url }));
    } catch {
      alert("이미지 업로드 실패. (관리자: Firebase Storage 규칙 확인) URL 붙여넣기를 이용하세요.");
    } finally { setUploading(false); }
  };

  const save = async () => {
    if (!form.grade) { alert("등급을 선택해주세요."); return; }
    if (!form.title.trim() || !form.url.trim()) { alert("제목과 주소(URL)는 필수입니다."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/showcase/save", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${await token()}` },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) { alert(d.error || "저장에 실패했습니다."); return; }
      setForm({ ...EMPTY });
      await load();
    } catch { alert("저장 중 오류가 발생했습니다."); } finally { setSaving(false); }
  };

  const edit = (m: MyShowcase) => setForm({
    id: m.id, grade: m.grade, title: m.title, url: m.url,
    screenshotUrl: m.screenshotUrl || "", description: m.description || "",
    authorAge: m.authorAge || "", authorBackground: m.authorBackground || "", isPublished: m.isPublished,
  });

  const remove = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch("/api/showcase/save", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${await token()}` }, body: JSON.stringify({ action: "delete", id }) });
    await load();
  };

  const togglePublish = async (m: MyShowcase) => {
    await fetch("/api/showcase/save", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${await token()}` },
      body: JSON.stringify({ ...m, screenshotUrl: m.screenshotUrl || "", description: m.description || "", authorAge: m.authorAge || "", authorBackground: m.authorBackground || "", isPublished: !m.isPublished }),
    });
    await load();
  };

  if (authLoading || loading) return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-muted-foreground">로딩 중...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/showcase" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">&larr; 쇼케이스</Link>
      <h1 className="text-2xl font-bold mb-6">내 합격작 등록/관리</h1>

      {eligible.length === 0 ? (
        <div className="border border-border rounded-2xl p-10 text-center text-muted-foreground">
          실기에 합격하면 합격작을 등록할 수 있습니다. (2급·1급·특급 실기)
        </div>
      ) : (
        <>
          {/* 등록/수정 폼 */}
          <div className="bg-white border border-border rounded-2xl p-6 mb-8 space-y-4">
            <h2 className="font-bold">{form.id ? "합격작 수정" : "새 합격작 등록"}</h2>
            <div>
              <label className="block text-sm font-medium mb-1">등급</label>
              <select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value as ShowcaseGrade })} className="w-full px-3 py-2 border border-border rounded-lg bg-white">
                <option value="">등급 선택</option>
                {eligible.map((g) => <option key={g} value={g}>{SHOWCASE_GRADE_LABEL[g]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">제목 <span className="text-red-500">*</span></label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="작품 제목" className="w-full px-3 py-2 border border-border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">주소(URL) <span className="text-red-500">*</span></label>
              <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 border border-border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">캡쳐화면</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 border border-dashed border-border rounded-lg px-4 py-2 cursor-pointer hover:border-primary/40 text-sm">
                  <Upload className="w-4 h-4" /> {uploading ? "업로드 중..." : "이미지 업로드"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
                </label>
                {form.screenshotUrl && <img src={form.screenshotUrl} alt="미리보기" className="h-12 rounded border border-border" />}
              </div>
              <input value={form.screenshotUrl} onChange={(e) => setForm({ ...form, screenshotUrl: e.target.value })} placeholder="또는 이미지 URL 붙여넣기" className="w-full mt-2 px-3 py-2 border border-border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">설명</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="어떤 작품인지, 무엇을 구현했는지" className="w-full px-3 py-2 border border-border rounded-lg resize-none" />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">제작자 나이 (선택)</label>
                <input value={form.authorAge} onChange={(e) => setForm({ ...form, authorAge: e.target.value })} placeholder="예: 20대" className="w-full px-3 py-2 border border-border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">이력 (선택)</label>
                <input value={form.authorBackground} onChange={(e) => setForm({ ...form, authorBackground: e.target.value })} placeholder="예: 비전공 직장인" className="w-full px-3 py-2 border border-border rounded-lg" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
              <span>공개에 동의합니다 (체크 시 갤러리에 공개되며, 입력한 나이·이력도 함께 공개됩니다)</span>
            </label>
            <div className="flex gap-3">
              <button onClick={save} disabled={saving || uploading} className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition disabled:opacity-50">
                {saving ? "저장 중..." : form.id ? "수정 저장" : "등록"}
              </button>
              {form.id && <button onClick={() => setForm({ ...EMPTY })} className="border border-border px-5 py-2.5 rounded-lg font-medium">취소</button>}
            </div>
          </div>

          {/* 내 합격작 목록 */}
          <h2 className="font-bold mb-3">내 합격작</h2>
          {mine.length === 0 ? (
            <div className="text-muted-foreground text-sm">등록한 합격작이 없습니다.</div>
          ) : (
            <div className="space-y-3">
              {mine.map((m) => (
                <div key={m.id} className="border border-border rounded-xl p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded ${m.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{m.isPublished ? "공개" : "비공개"}</span>
                      <span className="text-xs text-muted-foreground">{SHOWCASE_GRADE_LABEL[m.grade]}</span>
                      <span className="font-medium truncate">{m.title}</span>
                    </div>
                    <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">{m.url}</a>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => togglePublish(m)} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1" title={m.isPublished ? "비공개로" : "공개로"}>
                      {m.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => edit(m)} className="text-sm text-primary hover:underline">수정</button>
                    <button onClick={() => remove(m.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
