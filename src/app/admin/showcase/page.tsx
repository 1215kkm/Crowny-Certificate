"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { adminUpdate, adminDelete, adminList } from "@/lib/admin-api";
import { SHOWCASE_GRADE_LABEL } from "@/data/showcase-examples";

interface Row {
  id: string;
  userName: string;
  grade: string;
  title: string;
  url: string;
  screenshotUrl: string | null;
  description: string;
  isPublished: boolean;
  hiddenByAdmin: boolean;
  adminHideReason: string | null;
}

export default function AdminShowcasePage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const docs = await adminList<Record<string, unknown>>(["showcases"], "createdAt", "desc");
      setRows(
        docs.map((d) => ({
          id: d.id as string,
          userName: (d.userName as string) ?? "-",
          grade: (d.grade as string) ?? "",
          title: (d.title as string) ?? "",
          url: (d.url as string) ?? "",
          screenshotUrl: (d.screenshotUrl as string) ?? null,
          description: (d.description as string) ?? "",
          isPublished: d.isPublished !== false,
          hiddenByAdmin: !!d.hiddenByAdmin,
          adminHideReason: (d.adminHideReason as string) ?? null,
        }))
      );
    } catch (e) {
      console.error("합격작 로드 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !isAdmin) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [isAdmin, authLoading]);

  const toggleHide = async (r: Row) => {
    let reason = r.adminHideReason ?? "";
    if (!r.hiddenByAdmin) {
      const input = prompt("숨김 사유를 입력해주세요 (작성자에게는 비공개):", "");
      if (input === null) return;
      reason = input;
    }
    setBusy(r.id);
    try {
      await adminUpdate(["showcases", r.id], {
        hiddenByAdmin: !r.hiddenByAdmin,
        adminHideReason: !r.hiddenByAdmin ? reason : r.adminHideReason ?? null,
      });
      setRows((prev) =>
        prev.map((x) => (x.id === r.id ? { ...x, hiddenByAdmin: !r.hiddenByAdmin, adminHideReason: !r.hiddenByAdmin ? reason : x.adminHideReason } : x))
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "처리에 실패했습니다.");
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (r: Row) => {
    const reason = prompt("삭제 사유를 입력해주세요 (기록용):", "");
    if (reason === null) return;
    if (!confirm(`"${r.title}" 합격작을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    setBusy(r.id);
    try {
      await adminDelete(["showcases", r.id]);
      setRows((prev) => prev.filter((x) => x.id !== r.id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "삭제에 실패했습니다.");
    } finally {
      setBusy(null);
    }
  };

  if (!isAdmin && !authLoading) {
    return <div className="max-w-[1400px] mx-auto px-4 py-12 text-center"><h1 className="text-2xl font-bold">접근 권한이 없습니다</h1></div>;
  }

  const hiddenCount = rows.filter((r) => r.hiddenByAdmin).length;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">&larr; 대시보드</Link>
      <h1 className="text-2xl font-bold mb-6">합격작 관리</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-muted rounded-xl p-4 text-center"><div className="text-2xl font-bold text-primary">{rows.length}</div><div className="text-sm text-muted-foreground">전체</div></div>
        <div className="bg-muted rounded-xl p-4 text-center"><div className="text-2xl font-bold text-green-600">{rows.length - hiddenCount}</div><div className="text-sm text-muted-foreground">공개</div></div>
        <div className="bg-muted rounded-xl p-4 text-center"><div className="text-2xl font-bold text-gray-500">{hiddenCount}</div><div className="text-sm text-muted-foreground">숨김</div></div>
      </div>

      {loading ? (
        <div className="animate-pulse"><div className="h-64 bg-gray-200 rounded-xl" /></div>
      ) : rows.length === 0 ? (
        <div className="border border-border rounded-xl p-12 text-center text-muted-foreground">등록된 합격작이 없습니다.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((r) => (
            <div key={r.id} className={`border rounded-xl overflow-hidden ${r.hiddenByAdmin ? "border-gray-300 opacity-70" : "border-border"}`}>
              <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                {r.screenshotUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.screenshotUrl} alt={r.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm">스크린샷 없음</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="bg-primary text-white text-xs px-2 py-0.5 rounded">{SHOWCASE_GRADE_LABEL[r.grade as keyof typeof SHOWCASE_GRADE_LABEL] ?? r.grade}</span>
                  {r.hiddenByAdmin ? (
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-600">숨김</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">공개</span>
                  )}
                </div>
                <div className="font-bold truncate">{r.title}</div>
                <div className="text-xs text-muted-foreground mb-1">{r.userName}</div>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">{r.url}</a>
                {r.hiddenByAdmin && r.adminHideReason && (
                  <div className="text-xs text-gray-500 mt-2 bg-gray-50 rounded p-2">숨김 사유: {r.adminHideReason}</div>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => toggleHide(r)}
                    disabled={busy === r.id}
                    className="flex-1 border border-border rounded-lg py-2 text-sm font-medium hover:bg-muted transition disabled:opacity-50"
                  >
                    {r.hiddenByAdmin ? "공개로 전환" : "숨기기"}
                  </button>
                  <button
                    onClick={() => handleDelete(r)}
                    disabled={busy === r.id}
                    className="px-4 border border-red-200 text-red-500 rounded-lg py-2 text-sm font-medium hover:bg-red-50 transition disabled:opacity-50"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
