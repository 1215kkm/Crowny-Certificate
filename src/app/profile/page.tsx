"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", birthDate: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setDone(false);
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth/login"); return; }
    (async () => {
      try {
        const { getFirebaseAuth } = await import("@/lib/firebase");
        const token = await getFirebaseAuth().currentUser?.getIdToken();
        const res = await fetch("/api/my/profile", { headers: { Authorization: `Bearer ${token}` } });
        const d = await res.json();
        if (res.ok) {
          setForm({
            name: d.name || "",
            email: d.email || "",
            phone: d.phone || "",
            birthDate: d.birthDate || "",
            address: d.address || "",
          });
        }
      } catch {
        setError("정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const { getFirebaseAuth } = await import("@/lib/firebase");
      const token = await getFirebaseAuth().currentUser?.getIdToken();
      const res = await fetch("/api/my/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "저장 중 오류가 발생했습니다."); return; }
      // 이메일·이름 변경이 클라이언트 세션에 반영되도록 토큰 갱신
      await getFirebaseAuth().currentUser?.getIdToken(true);
      await getFirebaseAuth().currentUser?.reload();
      setDone(true);
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return <div className="max-w-md mx-auto px-4 py-12 text-center text-muted-foreground">불러오는 중...</div>;
  }

  return (
    <div className="min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">내정보 수정</h1>
          <Link href="/mypage" className="text-sm text-primary hover:underline">마이페이지</Link>
        </div>
        <p className="text-muted-foreground mb-8 text-sm">회원 정보를 수정할 수 있습니다.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
          {done && <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg">저장되었습니다.</div>}

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">이메일 (로그인 계정)</label>
            <div className="w-full px-4 py-3 border border-border rounded-lg bg-muted text-muted-foreground">
              {form.email || "-"}
            </div>
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium mb-1">
              생년월일 <span className="text-red-500">*</span>
            </label>
            <input id="birthDate" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            <p className="text-xs text-muted-foreground mt-1">합격증에 인쇄됩니다.</p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">연락처</label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="010-0000-0000" />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">주소</label>
            <textarea id="address" name="address" value={form.address} onChange={handleChange} rows={2}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="우편 수령 시 사용됩니다 (선택)" />
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition disabled:opacity-50">
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
