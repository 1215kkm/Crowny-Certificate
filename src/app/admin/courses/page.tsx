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
  type CourseDoc,
  type CertificateTypeDoc,
  type EnrollmentDoc,
} from "@/lib/firestore";
import { getGradeInfo } from "@/lib/grade-utils";

interface CourseRow {
  id: string;
  title: string;
  grade: string;
  lessonCount: number;
  students: number;
  published: boolean;
  certificateTypeId: string;
}

export default function AdminCoursesPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [certTypes, setCertTypes] = useState<(CertificateTypeDoc & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", certificateTypeId: "", isPublished: true });

  const fetchData = async () => {
    try {
      const [courseDocs, typeDocs, enrollmentDocs] = await Promise.all([
        getDocuments<CourseDoc>("courses"),
        getDocuments<CertificateTypeDoc>("certificateTypes"),
        getDocuments<EnrollmentDoc>("enrollments"),
      ]);

      const typesMap: Record<string, CertificateTypeDoc & { id: string }> = {};
      typeDocs.forEach((t) => { typesMap[t.id] = t; });
      setCertTypes(typeDocs);

      // 강의별 수강생 수 카운트
      const studentCount: Record<string, number> = {};
      enrollmentDocs.forEach((e) => {
        studentCount[e.courseId] = (studentCount[e.courseId] || 0) + 1;
      });

      setCourses(
        courseDocs.map((c) => {
          const certType = typesMap[c.certificateTypeId];
          const gradeInfo = certType ? getGradeInfo(certType.grade) : { label: "-" };
          return {
            id: c.id,
            title: c.title,
            grade: gradeInfo.label,
            lessonCount: c.lessonCount,
            students: studentCount[c.id] || 0,
            published: c.isPublished,
            certificateTypeId: c.certificateTypeId,
          };
        })
      );
    } catch (error) {
      console.error("강의 목록 로드 실패:", error);
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
      alert("강의명과 자격증 유형을 선택해주세요.");
      return;
    }

    try {
      const now = Timestamp.now();
      if (editingId) {
        await updateDocument("courses", editingId, {
          title: formData.title,
          description: formData.description,
          certificateTypeId: formData.certificateTypeId,
          isPublished: formData.isPublished,
          updatedAt: now,
        });
      } else {
        await createDocument("courses", {
          title: formData.title,
          description: formData.description,
          certificateTypeId: formData.certificateTypeId,
          thumbnailUrl: null,
          totalDuration: 0,
          lessonCount: 0,
          isPublished: formData.isPublished,
          createdAt: now,
          updatedAt: now,
        });
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: "", description: "", certificateTypeId: "", isPublished: true });
      setLoading(true);
      await fetchData();
    } catch (error) {
      console.error("강의 저장 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };

  const handleEdit = (course: CourseRow) => {
    setEditingId(course.id);
    setFormData({
      title: course.title,
      description: "",
      certificateTypeId: course.certificateTypeId,
      isPublished: course.published,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteDocument("courses", id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("강의 삭제 실패:", error);
      alert("삭제에 실패했습니다.");
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
          <h1 className="text-2xl font-bold">강의 관리</h1>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setFormData({ title: "", description: "", certificateTypeId: "", isPublished: true }); }}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition"
        >
          + 새 강의 등록
        </button>
      </div>

      {/* 등록/수정 폼 */}
      {showForm && (
        <div className="border border-border rounded-xl p-6 mb-6 bg-muted">
          <h3 className="font-bold mb-4">{editingId ? "강의 수정" : "새 강의 등록"}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">강의명</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="강의명을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">설명</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="강의 설명을 입력하세요"
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
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              />
              <label htmlFor="isPublished" className="text-sm">공개</label>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
                {editingId ? "수정" : "등록"}
              </button>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition">
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium">강의명</th>
                <th className="text-left p-4 font-medium">등급</th>
                <th className="text-left p-4 font-medium">레슨 수</th>
                <th className="text-left p-4 font-medium">수강생</th>
                <th className="text-left p-4 font-medium">상태</th>
                <th className="text-left p-4 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">등록된 강의가 없습니다.</td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id} className="border-t border-border hover:bg-muted/50">
                    <td className="p-4 font-medium">{course.title}</td>
                    <td className="p-4">{course.grade}</td>
                    <td className="p-4">{course.lessonCount}강</td>
                    <td className="p-4">{course.students}명</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${course.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {course.published ? "공개" : "비공개"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleEdit(course)} className="text-primary hover:underline text-sm mr-3">수정</button>
                      <button onClick={() => handleDelete(course.id)} className="text-red-500 hover:underline text-sm">삭제</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
