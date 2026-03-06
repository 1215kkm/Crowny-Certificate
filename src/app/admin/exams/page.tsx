"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  where,
  Timestamp,
  type ExamDoc,
  type CertificateTypeDoc,
  type ExamSubmissionDoc,
} from "@/lib/firestore";
import { getGradeInfo, formatTimestamp } from "@/lib/grade-utils";

interface ExamRow {
  id: string;
  title: string;
  grade: string;
  questionCount: number;
  applicants: number;
  date: string;
  active: boolean;
  certificateTypeId: string;
}

interface PendingSubmission {
  id: string;
  userId: string;
  examTitle: string;
  submittedAt: string;
}

export default function AdminExamsPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [certTypes, setCertTypes] = useState<(CertificateTypeDoc & { id: string })[]>([]);
  const [pendingGrading, setPendingGrading] = useState<PendingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "", certificateTypeId: "", duration: 60, questionCount: 0, isActive: true,
  });

  const fetchData = async () => {
    try {
      const [examDocs, typeDocs, submissionDocs] = await Promise.all([
        getDocuments<ExamDoc>("exams"),
        getDocuments<CertificateTypeDoc>("certificateTypes"),
        getDocuments<ExamSubmissionDoc>("examSubmissions"),
      ]);

      const typesMap: Record<string, CertificateTypeDoc & { id: string }> = {};
      typeDocs.forEach((t) => { typesMap[t.id] = t; });
      setCertTypes(typeDocs);

      // 시험별 신청자 수 카운트
      const applicantCount: Record<string, number> = {};
      submissionDocs.forEach((s) => {
        applicantCount[s.examId] = (applicantCount[s.examId] || 0) + 1;
      });

      setExams(
        examDocs.map((e) => {
          const certType = typesMap[e.certificateTypeId];
          const gradeInfo = certType ? getGradeInfo(certType.grade) : { label: "-" };
          return {
            id: e.id,
            title: e.title,
            grade: gradeInfo.label,
            questionCount: e.questionCount,
            applicants: applicantCount[e.id] || 0,
            date: formatTimestamp(e.scheduledDate),
            active: e.isActive,
            certificateTypeId: e.certificateTypeId,
          };
        })
      );

      // 채점 대기
      const pending = submissionDocs.filter((s) => s.status === "SUBMITTED");
      setPendingGrading(
        pending.map((s) => {
          const exam = examDocs.find((e) => e.id === s.examId);
          return {
            id: s.id,
            userId: s.userId.substring(0, 8) + "...",
            examTitle: exam?.title ?? "알 수 없음",
            submittedAt: formatTimestamp(s.submittedAt),
          };
        })
      );
    } catch (error) {
      console.error("시험 목록 로드 실패:", error);
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

  const handleSave = async () => {
    if (!formData.title || !formData.certificateTypeId) {
      alert("시험명과 자격증 유형을 선택해주세요.");
      return;
    }

    try {
      const now = Timestamp.now();
      if (editingId) {
        await updateDocument("exams", editingId, {
          title: formData.title,
          certificateTypeId: formData.certificateTypeId,
          duration: formData.duration,
          questionCount: formData.questionCount,
          isActive: formData.isActive,
          updatedAt: now,
        });
      } else {
        await createDocument("exams", {
          title: formData.title,
          certificateTypeId: formData.certificateTypeId,
          description: null,
          scheduledDate: null,
          registrationStart: null,
          registrationEnd: null,
          duration: formData.duration,
          questionCount: formData.questionCount,
          maxAttempts: 3,
          isActive: formData.isActive,
          createdAt: now,
          updatedAt: now,
        });
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: "", certificateTypeId: "", duration: 60, questionCount: 0, isActive: true });
      setLoading(true);
      await fetchData();
    } catch (error) {
      console.error("시험 저장 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteDocument("exams", id);
      setExams((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("시험 삭제 실패:", error);
    }
  };

  if (!isAdmin && !authLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">접근 권한이 없습니다</h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">&larr; 대시보드</Link>
          <h1 className="text-2xl font-bold">시험 관리</h1>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setFormData({ title: "", certificateTypeId: "", duration: 60, questionCount: 0, isActive: true }); }}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition"
        >
          + 새 시험 등록
        </button>
      </div>

      {/* 등록/수정 폼 */}
      {showForm && (
        <div className="border border-border rounded-xl p-6 mb-6 bg-muted">
          <h3 className="font-bold mb-4">{editingId ? "시험 수정" : "새 시험 등록"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">시험명</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">자격증 유형</label>
              <select
                value={formData.certificateTypeId}
                onChange={(e) => setFormData({ ...formData, certificateTypeId: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">선택하세요</option>
                {certTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({getGradeInfo(t.grade).label})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">시험 시간 (분)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">문제 수</label>
              <input
                type="number"
                value={formData.questionCount}
                onChange={(e) => setFormData({ ...formData, questionCount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
            <label htmlFor="isActive" className="text-sm">접수 중</label>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
              {editingId ? "수정" : "등록"}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="border border-border px-4 py-2 rounded-lg text-sm font-medium">
              취소
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse"><div className="h-64 bg-gray-200 rounded-xl" /></div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium">시험명</th>
                <th className="text-left p-4 font-medium">등급</th>
                <th className="text-left p-4 font-medium">문제 수</th>
                <th className="text-left p-4 font-medium">신청자</th>
                <th className="text-left p-4 font-medium">시험일</th>
                <th className="text-left p-4 font-medium">상태</th>
                <th className="text-left p-4 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {exams.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">등록된 시험이 없습니다.</td></tr>
              ) : (
                exams.map((exam) => (
                  <tr key={exam.id} className="border-t border-border hover:bg-muted/50">
                    <td className="p-4 font-medium">{exam.title}</td>
                    <td className="p-4">{exam.grade}</td>
                    <td className="p-4">{exam.questionCount}문항</td>
                    <td className="p-4">{exam.applicants}명</td>
                    <td className="p-4">{exam.date}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${exam.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {exam.active ? "접수중" : "준비중"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => {
                        setEditingId(exam.id);
                        setFormData({ title: exam.title, certificateTypeId: exam.certificateTypeId, duration: 60, questionCount: exam.questionCount, isActive: exam.active });
                        setShowForm(true);
                      }} className="text-primary hover:underline text-sm mr-3">수정</button>
                      <button onClick={() => handleDelete(exam.id)} className="text-red-500 hover:underline text-sm">삭제</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 채점 대기 */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">채점 대기 (실기 시험)</h2>
        {pendingGrading.length > 0 ? (
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium">시험</th>
                  <th className="text-left p-3 font-medium">응시자</th>
                  <th className="text-left p-3 font-medium">제출일</th>
                  <th className="text-left p-3 font-medium">관리</th>
                </tr>
              </thead>
              <tbody>
                {pendingGrading.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-3">{p.examTitle}</td>
                    <td className="p-3">{p.userId}</td>
                    <td className="p-3">{p.submittedAt}</td>
                    <td className="p-3">
                      <button className="text-primary hover:underline text-sm">채점하기</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-border rounded-xl p-6 text-center text-muted-foreground">
            채점 대기 중인 실기 시험이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
