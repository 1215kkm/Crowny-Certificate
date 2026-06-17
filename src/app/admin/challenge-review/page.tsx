"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { type SpecialSubmissionDoc } from "@/lib/firestore";
import { adminUpdate, adminList } from "@/lib/admin-api";
import { formatTimestamp } from "@/lib/grade-utils";
import { CHALLENGE_RUBRIC, CHALLENGE_PASSING_SCORE, LIFECYCLE_STAGES } from "@/data/grade-special-practical";

type Row = SpecialSubmissionDoc & { id: string };

export default function AdminChallengeReviewPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [checks, setChecks] = useState<Record<string, Record<string, boolean>>>({});
  const [feedbackInput, setFeedbackInput] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const docs = await adminList<SpecialSubmissionDoc>(["specialSubmissions"], "createdAt", "desc");
      setRows(docs as unknown as Row[]);
    } catch (e) {
      console.error("특급 제출 로드 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !isAdmin) { setLoading(false); return; }
    fetchData();
  }, [isAdmin, authLoading]);

  const computeTotal = (rowId: string) =>
    CHALLENGE_RUBRIC.reduce((sum, r) => sum + (checks[rowId]?.[r.id] ? r.points : 0), 0);

  const handleGrade = async (rowId: string) => {
    const rowChecks = checks[rowId] || {};
    const total = computeTotal(rowId);
    const requiredOk = CHALLENGE_RUBRIC.filter((r) => r.required).every((r) => rowChecks[r.id]);
    const passed = total >= CHALLENGE_PASSING_SCORE && requiredOk;
    const scores: Record<string, number> = {};
    CHALLENGE_RUBRIC.forEach((r) => { scores[r.id] = rowChecks[r.id] ? r.points : 0; });
    setSaving(rowId);
    try {
      await adminUpdate(["specialSubmissions", rowId], {
        scores, score: total, passed,
        feedback: feedbackInput[rowId]?.trim() || null,
        status: "GRADED", gradedAt: "__SERVER_TIMESTAMP__",
      });
      setLoading(true);
      await fetchData();
    } catch (e) {
      alert(e instanceof Error ? e.message : "채점 저장에 실패했습니다.");
    } finally {
      setSaving(null);
    }
  };

  if (!isAdmin && !authLoading) return <div className="max-w-[1400px] mx-auto px-4 py-12 text-center"><h1 className="text-2xl font-bold">접근 권한이 없습니다</h1></div>;

  const pending = rows.filter((r) => r.status === "SUBMITTED").length;
  const stageLabels: Record<string, string> = Object.fromEntries(LIFECYCLE_STAGES.map((s) => [s.key, s.label]));

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">&larr; 대시보드</Link>
      <h1 className="text-2xl font-bold mb-6">특급 챌린지 채점 (AI 제품 전주기)</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-muted rounded-xl p-4 text-center"><div className="text-2xl font-bold text-primary">{rows.length}</div><div className="text-sm text-muted-foreground">총 제출</div></div>
        <div className="bg-muted rounded-xl p-4 text-center"><div className="text-2xl font-bold text-orange-500">{pending}</div><div className="text-sm text-muted-foreground">채점 대기</div></div>
        <div className="bg-muted rounded-xl p-4 text-center"><div className="text-2xl font-bold text-green-600">{rows.length - pending}</div><div className="text-sm text-muted-foreground">채점 완료</div></div>
      </div>

      {loading ? (
        <div className="animate-pulse"><div className="h-64 bg-gray-200 rounded-xl" /></div>
      ) : rows.length === 0 ? (
        <div className="border border-border rounded-xl p-12 text-center text-muted-foreground">제출된 챌린지가 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const total = computeTotal(r.id);
            return (
              <div key={r.id} className="border border-border rounded-xl overflow-hidden">
                <button onClick={() => setExpandedId(expandedId === r.id ? null : r.id)} className="w-full flex items-center justify-between p-4 hover:bg-muted/50 text-left">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${r.status === "GRADED" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {r.status === "GRADED" ? `채점완료 (${r.score}점·${r.passed ? "합격" : "불합격"})` : "채점대기"}
                    </span>
                    <span className="font-medium">{r.userName}</span>
                    <span className="text-sm text-muted-foreground">주제: {r.topicTitle}{r.timedOut && " · ⏱시간초과"}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">제출 {formatTimestamp(r.submittedAt)} · 발표 {formatTimestamp(r.announceAt)}</span>
                </button>

                {expandedId === r.id && (
                  <div className="border-t border-border p-4 bg-muted/30 space-y-3 text-sm">
                    <div><span className="font-bold">배포 URL: </span><a href={r.appUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{r.appUrl}</a></div>
                    {r.repoUrl && <div><span className="font-bold">저장소: </span><a href={r.repoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{r.repoUrl}</a></div>}
                    {r.demoLink && <div><span className="font-bold">데모: </span><a href={r.demoLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{r.demoLink}</a></div>}
                    {r.shareLink && <div><span className="font-bold">AI 공유링크: </span><a href={r.shareLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{r.shareLink}</a></div>}
                    {/* 전주기 단계 */}
                    {LIFECYCLE_STAGES.map((s) => {
                      const val = (r as unknown as Record<string, string>)[s.key];
                      return val ? (
                        <div key={s.key} className="border-t border-border pt-2">
                          <div className="font-bold">{stageLabels[s.key]}</div>
                          <div className="whitespace-pre-wrap text-muted-foreground">{val}</div>
                        </div>
                      ) : null;
                    })}

                    {/* 채점 */}
                    <div className="border-t border-border pt-3">
                      <div className="font-bold mb-2">채점표 — 현재 합계: <span className="text-primary">{total}점</span></div>
                      <div className="space-y-2">
                        {CHALLENGE_RUBRIC.map((item) => {
                          const checked = checks[r.id]?.[item.id] ?? (r.scores ? (r.scores[item.id] ?? 0) > 0 : false);
                          return (
                            <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={checked} onChange={() => {
                                if (!checks[r.id]) {
                                  const init: Record<string, boolean> = {};
                                  CHALLENGE_RUBRIC.forEach((it) => { init[it.id] = r.scores ? (r.scores[it.id] ?? 0) > 0 : false; });
                                  setChecks((p) => ({ ...p, [r.id]: { ...init, [item.id]: !init[item.id] } }));
                                } else {
                                  setChecks((p) => ({ ...p, [r.id]: { ...p[r.id], [item.id]: !p[r.id]?.[item.id] } }));
                                }
                              }} />
                              <span>{item.label} <span className="text-muted-foreground">({item.points}점)</span>{item.required && <span className="text-red-500"> *필수</span>}</span>
                            </label>
                          );
                        })}
                      </div>
                      <input value={feedbackInput[r.id] ?? (r.feedback ?? "")} onChange={(e) => setFeedbackInput((p) => ({ ...p, [r.id]: e.target.value }))} placeholder="피드백 (선택)" className="w-full mt-3 px-3 py-2 border border-border rounded-lg" />
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
