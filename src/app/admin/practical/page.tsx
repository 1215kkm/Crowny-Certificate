"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { type PracticalSubmissionDoc } from "@/lib/firestore";
import { adminUpdate, adminList } from "@/lib/admin-api";
import { formatTimestamp } from "@/lib/grade-utils";
import {
  getThemeById,
  PRACTICAL_PASSING_SCORE,
} from "@/data/grade-2-practical";

type Row = PracticalSubmissionDoc & { id: string };

export default function AdminPracticalPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [scoreInput, setScoreInput] = useState<Record<string, string>>({});
  const [feedbackInput, setFeedbackInput] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const docs = await adminList<PracticalSubmissionDoc>(
        ["practicalSubmissions"],
        "createdAt",
        "desc"
      );
      setRows(docs as unknown as Row[]);
    } catch (e) {
      console.error("실기 제출 로드 실패:", e);
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

  const handleGrade = async (id: string) => {
    const raw = scoreInput[id];
    const score = Number(raw);
    if (raw === undefined || raw === "" || isNaN(score) || score < 0 || score > 100) {
      alert("0~100 사이의 점수를 입력해주세요.");
      return;
    }
    setSaving(id);
    try {
      await adminUpdate(["practicalSubmissions", id], {
        score,
        passed: score >= PRACTICAL_PASSING_SCORE,
        feedback: feedbackInput[id]?.trim() || null,
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
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">접근 권한이 없습니다</h1>
      </div>
    );
  }

  const pending = rows.filter((r) => r.status === "SUBMITTED").length;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">&larr; 대시보드</Link>
      <h1 className="text-2xl font-bold mb-6">실기 채점 관리 (2급 랜딩페이지)</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-muted rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">{rows.length}</div>
          <div className="text-sm text-muted-foreground">총 제출</div>
        </div>
        <div className="bg-muted rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-500">{pending}</div>
          <div className="text-sm text-muted-foreground">채점 대기</div>
        </div>
        <div className="bg-muted rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{rows.length - pending}</div>
          <div className="text-sm text-muted-foreground">채점 완료</div>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse"><div className="h-64 bg-gray-200 rounded-xl" /></div>
      ) : rows.length === 0 ? (
        <div className="border border-border rounded-xl p-12 text-center text-muted-foreground">
          제출된 실기가 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const theme = getThemeById(r.themeId);
            const wfLabel = r.wireframeCode
              ? `${r.wireframeCode}. ${r.wireframeName ?? ""}`.trim()
              : r.wireframeName ?? r.wireframeId;
            const isLegacy = !r.zipUrl && !r.liveUrl && !!r.hero;
            return (
              <div key={r.id} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 text-left"
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${r.status === "GRADED" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {r.status === "GRADED" ? `채점완료 (${r.score}점·${r.passed ? "합격" : "불합격"})` : "채점대기"}
                    </span>
                    <span className="font-medium">{r.userName}</span>
                    <span className="text-sm text-muted-foreground">주제: {theme?.name ?? r.themeId} · {wfLabel}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">제출 {formatTimestamp(r.submittedAt)} · 발표 {formatTimestamp(r.announceAt)}</span>
                </button>

                {expandedId === r.id && (
                  <div className="border-t border-border p-4 bg-muted/30 space-y-4">
                    {isLegacy ? (
                      <>
                        {/* (구버전) 슬롯 기반 제출 */}
                        <div>
                          <div className="font-bold text-sm mb-1">히어로</div>
                          <div className="flex gap-3">
                            {r.hero?.imageUrl && <img src={r.hero.imageUrl} alt="hero" className="w-40 h-24 object-cover rounded-lg border border-border" />}
                            <div className="text-sm">
                              <div className="font-medium">{r.hero?.headline}</div>
                              <div className="text-muted-foreground">{r.hero?.subcopy}</div>
                              <div className="text-primary">CTA: {r.hero?.cta}</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-sm mb-1">아이콘 6</div>
                          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {r.icons?.map((ic, i) => (
                              <div key={i} className="text-center text-xs">
                                {ic.imageUrl ? <img src={ic.imageUrl} alt={`icon${i}`} className="w-full h-16 object-cover rounded border border-border" /> : <div className="h-16 bg-gray-100 rounded" />}
                                <div className="mt-1 truncate">{ic.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {r.shareLink && (
                          <div className="text-sm">
                            <span className="font-bold">AI 공유링크: </span>
                            <a href={r.shareLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{r.shareLink}</a>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* 결과물 스크린샷 */}
                        {r.screenshotUrl && (
                          <div>
                            <div className="font-bold text-sm mb-1">결과물 스크린샷</div>
                            <img src={r.screenshotUrl} alt="스크린샷" className="max-h-60 rounded-lg border border-border" />
                          </div>
                        )}
                        {/* 결과물 / 주소 */}
                        <div className="flex flex-wrap gap-2">
                          {r.zipUrl ? (
                            <a href={r.zipUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
                              결과물(zip) 다운로드{r.zipName ? ` · ${r.zipName}` : ""}
                            </a>
                          ) : (
                            <span className="text-sm text-muted-foreground">결과물 미첨부</span>
                          )}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="font-bold mb-0.5">실제 주소(배포 URL)</div>
                            {r.liveUrl ? (
                              <a href={r.liveUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{r.liveUrl}</a>
                            ) : <span className="text-muted-foreground">-</span>}
                          </div>
                          <div>
                            <div className="font-bold mb-0.5">깃허브 주소</div>
                            {r.repoUrl ? (
                              <a href={r.repoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{r.repoUrl}</a>
                            ) : <span className="text-muted-foreground">-</span>}
                          </div>
                        </div>
                        {/* AI 사용 내역 */}
                        <div>
                          <div className="font-bold text-sm mb-1">AI 사용 내역 ({r.aiUsages?.length ?? 0})</div>
                          {r.aiUsages && r.aiUsages.length > 0 ? (
                            <div className="space-y-2">
                              {r.aiUsages.map((u, i) => (
                                <div key={i} className="border border-border rounded-lg p-3 bg-white text-sm">
                                  {u.content && <div className="whitespace-pre-line mb-1">{u.content}</div>}
                                  {u.link && <a href={u.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{u.link}</a>}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">작성된 AI 내역이 없습니다.</span>
                          )}
                        </div>
                      </>
                    )}

                    {/* 채점 */}
                    <div className="border-t border-border pt-4">
                      <div className="font-bold text-sm mb-2">채점 (100점 만점, {PRACTICAL_PASSING_SCORE}점 이상 합격)</div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="number" min={0} max={100}
                          value={scoreInput[r.id] ?? (r.score ?? "")}
                          onChange={(e) => setScoreInput((p) => ({ ...p, [r.id]: e.target.value }))}
                          placeholder="점수"
                          className="w-28 px-3 py-2 border border-border rounded-lg"
                        />
                        <input
                          value={feedbackInput[r.id] ?? (r.feedback ?? "")}
                          onChange={(e) => setFeedbackInput((p) => ({ ...p, [r.id]: e.target.value }))}
                          placeholder="피드백 (선택)"
                          className="flex-1 px-3 py-2 border border-border rounded-lg"
                        />
                        <button
                          onClick={() => handleGrade(r.id)}
                          disabled={saving === r.id}
                          className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50"
                        >
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
