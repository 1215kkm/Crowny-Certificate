"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { getDocuments, orderBy, type AppSubmissionDoc } from "@/lib/firestore";
import { adminUpdate } from "@/lib/admin-api";
import { formatTimestamp } from "@/lib/grade-utils";
import { APP_RUBRIC, APP_PASSING_SCORE, getAppThemeById } from "@/data/grade-1-practical";

type Row = AppSubmissionDoc & { id: string };

export default function AdminAppReviewPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [checks, setChecks] = useState<Record<string, Record<string, boolean>>>({});
  const [feedbackInput, setFeedbackInput] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const docs = await getDocuments<AppSubmissionDoc>("appSubmissions", orderBy("createdAt", "desc"));
      setRows(docs);
    } catch (e) {
      console.error("앱 제출 로드 실패:", e);
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

  const toggleCheck = (rowId: string, itemId: string) => {
    setChecks((prev) => ({
      ...prev,
      [rowId]: { ...(prev[rowId] || {}), [itemId]: !(prev[rowId]?.[itemId]) },
    }));
  };

  const computeTotal = (rowId: string) =>
    APP_RUBRIC.reduce((sum, r) => sum + (checks[rowId]?.[r.id] ? r.points : 0), 0);

  const handleGrade = async (rowId: string) => {
    const rowChecks = checks[rowId] || {};
    const total = computeTotal(rowId);
    const requiredOk = APP_RUBRIC.filter((r) => r.required).every((r) => rowChecks[r.id]);
    const passed = total >= APP_PASSING_SCORE && requiredOk;
    const scores: Record<string, number> = {};
    APP_RUBRIC.forEach((r) => { scores[r.id] = rowChecks[r.id] ? r.points : 0; });

    setSaving(rowId);
    try {
      await adminUpdate(["appSubmissions", rowId], {
        scores,
        score: total,
        passed,
        feedback: feedbackInput[rowId]?.trim() || null,
        status: "GRADED",
        gradedAt: "__SERVER_TIMESTAMP__",
      });
      setLoading(true);
      await fetchData();
    } catch (e) {
      console.error("채점 저장 실패:", e);
      alert(e instanceof Error ? e.message : "채점 저장에 실패했습니다.");
    } finally {
      setSaving(null);
    }
  };

  if (!isAdmin && !authLoading) {
    return <div className="max-w-[1400px] mx-auto px-4 py-12 text-center"><h1 className="text-2xl font-bold">접근 권한이 없습니다</h1></div>;
  }

  const pending = rows.filter((r) => r.status === "SUBMITTED").length;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">&larr; 대시보드</Link>
      <h1 className="text-2xl font-bold mb-6">앱 실기 채점 (1급 앱 제작·배포)</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-muted rounded-xl p-4 text-center"><div className="text-2xl font-bold text-primary">{rows.length}</div><div className="text-sm text-muted-foreground">총 제출</div></div>
        <div className="bg-muted rounded-xl p-4 text-center"><div className="text-2xl font-bold text-orange-500">{pending}</div><div className="text-sm text-muted-foreground">채점 대기</div></div>
        <div className="bg-muted rounded-xl p-4 text-center"><div className="text-2xl font-bold text-green-600">{rows.length - pending}</div><div className="text-sm text-muted-foreground">채점 완료</div></div>
      </div>

      {loading ? (
        <div className="animate-pulse"><div className="h-64 bg-gray-200 rounded-xl" /></div>
      ) : rows.length === 0 ? (
        <div className="border border-border rounded-xl p-12 text-center text-muted-foreground">제출된 앱이 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const theme = getAppThemeById(r.themeId);
            const total = computeTotal(r.id);
            return (
              <div key={r.id} className="border border-border rounded-xl overflow-hidden">
                <button onClick={() => setExpandedId(expandedId === r.id ? null : r.id)} className="w-full flex items-center justify-between p-4 hover:bg-muted/50 text-left">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${r.status === "GRADED" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {r.status === "GRADED" ? `채점완료 (${r.score}점·${r.passed ? "합격" : "불합격"})` : "채점대기"}
                    </span>
                    <span className="font-medium">{r.userName}</span>
                    <span className="text-sm text-muted-foreground">주제: {theme?.name ?? r.themeId}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">제출 {formatTimestamp(r.submittedAt)}</span>
                </button>

                {expandedId === r.id && (
                  <div className="border-t border-border p-4 bg-muted/30 space-y-4">
                    <div className="text-sm space-y-1">
                      <div><span className="font-bold">배포 URL: </span><a href={r.appUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{r.appUrl}</a></div>
                      {r.repoUrl && <div><span className="font-bold">저장소: </span><a href={r.repoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{r.repoUrl}</a></div>}
                      {r.shareLink && <div><span className="font-bold">AI 공유링크: </span><a href={r.shareLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{r.shareLink}</a></div>}
                      {r.description && <div className="whitespace-pre-wrap"><span className="font-bold">설명: </span>{r.description}</div>}
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="font-bold text-sm mb-2">채점표 (체크 시 배점 부여) — 현재 합계: <span className="text-primary">{total}점</span></div>
                      <div className="space-y-2">
                        {APP_RUBRIC.map((item) => {
                          const checked = checks[r.id]?.[item.id] ?? (r.scores ? (r.scores[item.id] ?? 0) > 0 : false);
                          return (
                            <label key={item.id} className="flex items-center gap-2 text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  // 최초 토글 시 기존 저장값으로 초기화
                                  if (!checks[r.id]) {
                                    const init: Record<string, boolean> = {};
                                    APP_RUBRIC.forEach((it) => { init[it.id] = r.scores ? (r.scores[it.id] ?? 0) > 0 : false; });
                                    setChecks((prev) => ({ ...prev, [r.id]: { ...init, [item.id]: !init[item.id] } }));
                                  } else {
                                    toggleCheck(r.id, item.id);
                                  }
                                }}
                              />
                              <span>{item.label} <span className="text-muted-foreground">({item.points}점)</span>{item.required && <span className="text-red-500"> *필수</span>}</span>
                            </label>
                          );
                        })}
                      </div>
                      <input
                        value={feedbackInput[r.id] ?? (r.feedback ?? "")}
                        onChange={(e) => setFeedbackInput((p) => ({ ...p, [r.id]: e.target.value }))}
                        placeholder="피드백 (선택)"
                        className="w-full mt-3 px-3 py-2 border border-border rounded-lg text-sm"
                      />
                      <div className="flex justify-end mt-3">
                        <button onClick={() => handleGrade(r.id)} disabled={saving === r.id} className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50">
                          {saving === r.id ? "저장 중..." : "채점 저장"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
