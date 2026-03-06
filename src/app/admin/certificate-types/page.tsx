"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  Timestamp,
  type CertificateTypeDoc,
  type CertificateGrade,
  type ExamFormat,
} from "@/lib/firestore";
import { getGradeInfo } from "@/lib/grade-utils";

const GRADE_OPTIONS: { value: CertificateGrade; label: string }[] = [
  { value: "GRADE_3", label: "3급" },
  { value: "GRADE_2", label: "2급" },
  { value: "GRADE_1", label: "1급" },
  { value: "SPECIAL", label: "특급" },
];

const FORMAT_OPTIONS: { value: ExamFormat; label: string }[] = [
  { value: "MULTIPLE_CHOICE", label: "객관식" },
  { value: "PRACTICAL", label: "실기" },
  { value: "PROJECT", label: "프로젝트" },
  { value: "CHALLENGE", label: "챌린지" },
];

interface FormData {
  name: string;
  grade: CertificateGrade;
  description: string;
  examFormat: ExamFormat;
  price: number;
  coursePrice: number;
  certPrice: number;
  passingScore: number;
  duration: number;
  isActive: boolean;
}

const DEFAULT_FORM: FormData = {
  name: "",
  grade: "GRADE_3",
  description: "",
  examFormat: "MULTIPLE_CHOICE",
  price: 0,
  coursePrice: 0,
  certPrice: 0,
  passingScore: 70,
  duration: 60,
  isActive: true,
};

export default function AdminCertificateTypesPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [certTypes, setCertTypes] = useState<
    (CertificateTypeDoc & { id: string })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);

  const fetchData = async () => {
    try {
      const docs = await getDocuments<CertificateTypeDoc>("certificateTypes");
      setCertTypes(docs);
    } catch (error) {
      console.error("자격증 종류 로드 실패:", error);
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
    if (!formData.name) {
      alert("자격증 이름을 입력해주세요.");
      return;
    }

    try {
      const now = Timestamp.now();
      if (editingId) {
        await updateDocument("certificateTypes", editingId, {
          ...formData,
          updatedAt: now,
        });
      } else {
        await createDocument("certificateTypes", {
          ...formData,
          createdAt: now,
          updatedAt: now,
        });
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(DEFAULT_FORM);
      setLoading(true);
      await fetchData();
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };

  const handleEdit = (ct: CertificateTypeDoc & { id: string }) => {
    setEditingId(ct.id);
    setFormData({
      name: ct.name,
      grade: ct.grade,
      description: ct.description,
      examFormat: ct.examFormat,
      price: ct.price,
      coursePrice: ct.coursePrice,
      certPrice: ct.certPrice,
      passingScore: ct.passingScore,
      duration: ct.duration,
      isActive: ct.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까? 관련된 시험/강의에 영향을 줄 수 있습니다."))
      return;
    try {
      await deleteDocument("certificateTypes", id);
      setCertTypes((prev) => prev.filter((ct) => ct.id !== id));
    } catch (error) {
      console.error("삭제 실패:", error);
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
          <Link
            href="/admin"
            className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block"
          >
            &larr; 대시보드
          </Link>
          <h1 className="text-2xl font-bold">자격증 종류 관리</h1>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData(DEFAULT_FORM);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition"
        >
          + 새 자격증 종류
        </button>
      </div>

      {/* 등록/수정 폼 */}
      {showForm && (
        <div className="border border-border rounded-xl p-6 mb-6 bg-muted">
          <h3 className="font-bold mb-4">
            {editingId ? "자격증 종류 수정" : "새 자격증 종류 등록"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                자격증 이름
              </label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="예: Crowny AI 활용 자격증"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">등급</label>
              <select
                value={formData.grade}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    grade: e.target.value as CertificateGrade,
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">설명</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                시험 형식
              </label>
              <select
                value={formData.examFormat}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    examFormat: e.target.value as ExamFormat,
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {FORMAT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                합격 점수
              </label>
              <input
                type="number"
                value={formData.passingScore}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    passingScore: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                시험 가격 (원)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                강의 가격 (원)
              </label>
              <input
                type="number"
                value={formData.coursePrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coursePrice: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                인증서 가격 (원)
              </label>
              <input
                type="number"
                value={formData.certPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    certPrice: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                시험 시간 (분)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
            />
            <label htmlFor="isActive" className="text-sm">
              활성화
            </label>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {editingId ? "수정" : "등록"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="border border-border px-4 py-2 rounded-lg text-sm font-medium"
            >
              취소
            </button>
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
                <th className="text-left p-4 font-medium">이름</th>
                <th className="text-left p-4 font-medium">등급</th>
                <th className="text-left p-4 font-medium">시험형식</th>
                <th className="text-left p-4 font-medium">시험가격</th>
                <th className="text-left p-4 font-medium">강의가격</th>
                <th className="text-left p-4 font-medium">인증서가격</th>
                <th className="text-left p-4 font-medium">합격점수</th>
                <th className="text-left p-4 font-medium">상태</th>
                <th className="text-left p-4 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {certTypes.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="p-8 text-center text-muted-foreground"
                  >
                    등록된 자격증 종류가 없습니다.
                  </td>
                </tr>
              ) : (
                certTypes.map((ct) => {
                  const gradeInfo = getGradeInfo(ct.grade);
                  const formatInfo = FORMAT_OPTIONS.find(
                    (f) => f.value === ct.examFormat
                  );
                  return (
                    <tr
                      key={ct.id}
                      className="border-t border-border hover:bg-muted/50"
                    >
                      <td className="p-4 font-medium">{ct.name}</td>
                      <td className="p-4">
                        <span
                          className={`${gradeInfo.color} text-white text-xs px-2 py-0.5 rounded`}
                        >
                          {gradeInfo.label}
                        </span>
                      </td>
                      <td className="p-4">
                        {formatInfo?.label || ct.examFormat}
                      </td>
                      <td className="p-4">
                        {ct.price.toLocaleString()}원
                      </td>
                      <td className="p-4">
                        {ct.coursePrice.toLocaleString()}원
                      </td>
                      <td className="p-4">
                        {ct.certPrice.toLocaleString()}원
                      </td>
                      <td className="p-4">{ct.passingScore}점</td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            ct.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {ct.isActive ? "활성" : "비활성"}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleEdit(ct)}
                          className="text-primary hover:underline text-sm mr-3"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(ct.id)}
                          className="text-red-500 hover:underline text-sm"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
