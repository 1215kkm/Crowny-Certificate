"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { adminCreate, adminUpdate, adminDelete, adminList } from "@/lib/admin-api";
import {
  DEFAULT_WIREFRAMES,
  WIREFRAME_BLOCK_OPTIONS,
  type WireframeBlock,
  type WireframeBlockType,
} from "@/data/grade-2-practical";
import WireframePreview from "@/components/wireframe-preview";

interface WireframeRow {
  id: string;
  code: string;
  name: string;
  desc: string;
  blocks: WireframeBlock[];
  order: number;
  isActive: boolean;
}

interface FormState {
  code: string;
  name: string;
  desc: string;
  blocks: WireframeBlock[];
  order: number;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  code: "",
  name: "",
  desc: "",
  blocks: [{ type: "hero" }],
  order: 0,
  isActive: true,
};

export default function AdminWireframesPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<WireframeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);

  const fetchData = async () => {
    try {
      const docs = await adminList<WireframeRow>(["wireframes"], "order", "asc");
      setRows(
        docs.map((d) => ({
          id: d.id,
          code: d.code ?? "",
          name: d.name ?? "",
          desc: d.desc ?? "",
          blocks: Array.isArray(d.blocks) ? (d.blocks as WireframeBlock[]) : [],
          order: typeof d.order === "number" ? d.order : 0,
          isActive: d.isActive !== false,
        }))
      );
    } catch (e) {
      console.error("와이어프레임 로드 실패:", e);
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

  const openNew = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, order: rows.length });
    setShowForm(true);
  };

  const openEdit = (r: WireframeRow) => {
    setEditingId(r.id);
    setForm({
      code: r.code,
      name: r.name,
      desc: r.desc,
      blocks: r.blocks.length > 0 ? r.blocks.map((b) => ({ ...b })) : [{ type: "hero" }],
      order: r.order,
      isActive: r.isActive,
    });
    setShowForm(true);
  };

  const setBlockType = (i: number, type: WireframeBlockType) =>
    setForm((f) => ({ ...f, blocks: f.blocks.map((b, j) => (j === i ? { ...b, type } : b)) }));
  const setBlockLabel = (i: number, label: string) =>
    setForm((f) => ({ ...f, blocks: f.blocks.map((b, j) => (j === i ? { ...b, label } : b)) }));
  const addBlock = () => setForm((f) => ({ ...f, blocks: [...f.blocks, { type: "text" }] }));
  const removeBlock = (i: number) =>
    setForm((f) => ({ ...f, blocks: f.blocks.length <= 1 ? f.blocks : f.blocks.filter((_, j) => j !== i) }));
  const moveBlock = (i: number, dir: -1 | 1) =>
    setForm((f) => {
      const j = i + dir;
      if (j < 0 || j >= f.blocks.length) return f;
      const next = [...f.blocks];
      [next[i], next[j]] = [next[j], next[i]];
      return { ...f, blocks: next };
    });

  const handleSave = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      alert("코드(A~E 등)와 이름을 입력해주세요.");
      return;
    }
    setBusy(true);
    try {
      const payload = {
        code: form.code.trim(),
        name: form.name.trim(),
        desc: form.desc.trim(),
        blocks: form.blocks.map((b) => ({ type: b.type, label: b.label?.trim() || "" })),
        order: form.order,
        isActive: form.isActive,
      };
      if (editingId) await adminUpdate(["wireframes", editingId], payload);
      else await adminCreate(["wireframes"], payload);
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      setLoading(true);
      await fetchData();
    } catch (e) {
      alert(e instanceof Error ? e.message : "저장에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 와이어프레임을 삭제할까요?")) return;
    try {
      await adminDelete(["wireframes", id]);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "삭제에 실패했습니다.");
    }
  };

  // 기본 5종(A~E) 일괄 등록
  const seedDefaults = async () => {
    if (!confirm("기본 와이어프레임 5종(A~E)을 등록할까요? (기존 항목은 그대로 두고 추가됩니다)")) return;
    setBusy(true);
    try {
      for (let i = 0; i < DEFAULT_WIREFRAMES.length; i++) {
        const w = DEFAULT_WIREFRAMES[i];
        await adminCreate(["wireframes"], {
          code: w.code,
          name: w.name,
          desc: w.desc,
          blocks: w.blocks.map((b) => ({ type: b.type, label: b.label || "" })),
          order: i,
          isActive: true,
        });
      }
      setLoading(true);
      await fetchData();
    } catch (e) {
      alert(e instanceof Error ? e.message : "기본 등록에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  if (!isAdmin && !authLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">접근 권한이 없습니다</h1>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">&larr; 대시보드</Link>
          <h1 className="text-2xl font-bold">와이어프레임 관리 (2급 실기)</h1>
          <p className="text-sm text-muted-foreground">시험 시작 시 활성 와이어프레임 중 하나가 랜덤으로 배정됩니다. (없으면 기본 5종 사용)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={seedDefaults} disabled={busy} className="border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition disabled:opacity-50">
            기본 5종 등록
          </button>
          <button onClick={openNew} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
            + 새 와이어프레임
          </button>
        </div>
      </div>

      {/* 등록/수정 폼 */}
      {showForm && (
        <div className="border border-border rounded-xl p-6 mb-6 bg-muted">
          <h3 className="font-bold mb-4">{editingId ? "와이어프레임 수정" : "새 와이어프레임 등록"}</h3>
          <div className="grid md:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">코드 (A~E)</label>
                  <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="A" className="w-full px-3 py-2 border border-border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">정렬 순서</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full px-3 py-2 border border-border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">이름</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="클래식형" className="w-full px-3 py-2 border border-border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">설명</label>
                <input value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="히어로 → 띠배너 → 아이콘 6 → 상품 4 → 푸터" className="w-full px-3 py-2 border border-border rounded-lg" />
              </div>

              {/* 블록 편집 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">블록(섹션) 구성 — 위에서부터 순서대로</label>
                  <button onClick={addBlock} className="text-sm text-primary hover:underline">+ 블록 추가</button>
                </div>
                <div className="space-y-2">
                  {form.blocks.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white border border-border rounded-lg p-2">
                      <span className="text-xs text-muted-foreground w-5 text-center">{i + 1}</span>
                      <select
                        value={b.type}
                        onChange={(e) => setBlockType(i, e.target.value as WireframeBlockType)}
                        className="px-2 py-1.5 border border-border rounded-lg text-sm"
                      >
                        {WIREFRAME_BLOCK_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <input
                        value={b.label || ""}
                        onChange={(e) => setBlockLabel(i, e.target.value)}
                        placeholder="라벨(선택)"
                        className="flex-1 px-2 py-1.5 border border-border rounded-lg text-sm"
                      />
                      <button onClick={() => moveBlock(i, -1)} disabled={i === 0} className="px-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30">↑</button>
                      <button onClick={() => moveBlock(i, 1)} disabled={i === form.blocks.length - 1} className="px-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30">↓</button>
                      <button onClick={() => removeBlock(i)} className="px-1.5 text-red-500 hover:text-red-600">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                활성화 (랜덤 배정 대상에 포함)
              </label>

              <div className="flex gap-3">
                <button onClick={handleSave} disabled={busy} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                  {busy ? "저장 중..." : editingId ? "수정" : "등록"}
                </button>
                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="border border-border px-4 py-2 rounded-lg text-sm font-medium">
                  취소
                </button>
              </div>
            </div>

            {/* 미리보기 */}
            <div>
              <div className="text-sm font-medium mb-2">미리보기 (그레이아웃)</div>
              <WireframePreview blocks={form.blocks} />
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse"><div className="h-64 bg-gray-200 rounded-xl" /></div>
      ) : rows.length === 0 ? (
        <div className="border border-border rounded-xl p-12 text-center text-muted-foreground">
          등록된 와이어프레임이 없습니다. 현재는 기본 5종(A~E)이 자동 사용됩니다.
          <div className="mt-3">
            <button onClick={seedDefaults} disabled={busy} className="text-primary hover:underline">기본 5종 등록하기</button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((r) => (
            <div key={r.id} className="border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-primary text-white text-xs px-2 py-0.5 rounded font-bold">{r.code || "-"}</span>
                  <span className="font-bold">{r.name}</span>
                  {!r.isActive && <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500">비활성</span>}
                </div>
                <div className="text-sm">
                  <button onClick={() => openEdit(r)} className="text-primary hover:underline mr-2">수정</button>
                  <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:underline">삭제</button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{r.desc}</p>
              <WireframePreview blocks={r.blocks} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
