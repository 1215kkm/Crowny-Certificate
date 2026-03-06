"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  getDocument,
  Timestamp,
  questionsCollection,
  type ExamDoc,
  type ExamQuestionDoc,
  type QuestionType,
} from "@/lib/firestore";
import {
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase";
import { updateDocument } from "@/lib/firestore";

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "MULTIPLE_CHOICE", label: "객관식" },
  { value: "SHORT_ANSWER", label: "단답형" },
  { value: "ESSAY", label: "서술형" },
  { value: "FILE_UPLOAD", label: "파일 업로드" },
];

interface QuestionRow extends ExamQuestionDoc {
  docId: string;
}

interface FormData {
  type: QuestionType;
  content: string;
  options: string[];
  correctAnswer: string;
  points: number;
  order: number;
  explanation: string;
}

const DEFAULT_FORM: FormData = {
  type: "MULTIPLE_CHOICE",
  content: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  points: 10,
  order: 1,
  explanation: "",
};

export default function AdminQuestionsPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const params = useParams();
  const examId = params.id as string;

  const [exam, setExam] = useState<(ExamDoc & { id: string }) | null>(null);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);

  const fetchData = async () => {
    try {
      const examDoc = await getDocument<ExamDoc>("exams", examId);
      setExam(examDoc);

      const q = query(questionsCollection(examId), orderBy("order"));
      const snap = await getDocs(q);
      const qs: QuestionRow[] = snap.docs.map((d) => ({
        docId: d.id,
        ...(d.data() as ExamQuestionDoc),
      }));
      setQuestions(qs);
    } catch (error) {
      console.error("문항 로드 실패:", error);
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
  }, [isAdmin, authLoading, examId]);

  const handleSave = async () => {
    if (!formData.content) {
      alert("문제 내용을 입력해주세요.");
      return;
    }

    try {
      const db = getFirebaseFirestore();
      if (editingId) {
        const docRef = doc(db, "exams", examId, "questions", editingId);
        await updateDoc(docRef, {
          type: formData.type,
          content: formData.content,
          options: formData.type === "MULTIPLE_CHOICE" ? formData.options.filter(Boolean) : [],
          correctAnswer: formData.correctAnswer || null,
          points: formData.points,
          order: formData.order,
          explanation: formData.explanation || null,
        });
      } else {
        await addDoc(questionsCollection(examId), {
          examId,
          type: formData.type,
          content: formData.content,
          options: formData.type === "MULTIPLE_CHOICE" ? formData.options.filter(Boolean) : [],
          correctAnswer: formData.correctAnswer || null,
          points: formData.points,
          order: formData.order,
          explanation: formData.explanation || null,
          createdAt: Timestamp.now(),
        });
      }

      // 문제 수 업데이트
      setShowForm(false);
      setEditingId(null);
      setFormData({ ...DEFAULT_FORM, order: questions.length + 2 });
      setLoading(true);
      await fetchData();

      // 시험의 questionCount 업데이트
      const q = query(questionsCollection(examId));
      const snap = await getDocs(q);
      await updateDocument("exams", examId, {
        questionCount: snap.size,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("문항 저장 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };

  const handleEdit = (question: QuestionRow) => {
    setEditingId(question.docId);
    setFormData({
      type: question.type,
      content: question.content,
      options:
        question.options.length > 0
          ? [...question.options, ...Array(Math.max(0, 4 - question.options.length)).fill("")]
          : ["", "", "", ""],
      correctAnswer: question.correctAnswer || "",
      points: question.points,
      order: question.order,
      explanation: question.explanation || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const db = getFirebaseFirestore();
      await deleteDoc(doc(db, "exams", examId, "questions", docId));
      setQuestions((prev) => prev.filter((q) => q.docId !== docId));

      // questionCount 업데이트
      await updateDocument("exams", examId, {
        questionCount: questions.length - 1,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("문항 삭제 실패:", error);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ""] });
  };

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) return;
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
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
            href="/admin/exams"
            className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block"
          >
            &larr; 시험 관리
          </Link>
          <h1 className="text-2xl font-bold">
            문항 관리 {exam ? `- ${exam.title}` : ""}
          </h1>
          {exam && (
            <p className="text-sm text-muted-foreground">
              등록된 문항: {questions.length}개
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ ...DEFAULT_FORM, order: questions.length + 1 });
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition"
        >
          + 새 문항 추가
        </button>
      </div>

      {/* 등록/수정 폼 */}
      {showForm && (
        <div className="border border-border rounded-xl p-6 mb-6 bg-muted">
          <h3 className="font-bold mb-4">
            {editingId ? "문항 수정" : "새 문항 추가"}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  문항 유형
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as QuestionType,
                    })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {QUESTION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">배점</label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      points: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">순서</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                문제 내용
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="문제 내용을 입력하세요"
              />
            </div>

            {/* 객관식 보기 */}
            {formData.type === "MULTIPLE_CHOICE" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  보기 (선택지)
                </label>
                <div className="space-y-2">
                  {formData.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-sm font-medium w-6">
                        {idx + 1}.
                      </span>
                      <input
                        value={opt}
                        onChange={(e) => updateOption(idx, e.target.value)}
                        placeholder={`보기 ${idx + 1}`}
                        className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        onClick={() => removeOption(idx)}
                        className="text-red-500 hover:text-red-700 text-sm px-2"
                        type="button"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addOption}
                  className="mt-2 text-primary hover:underline text-sm"
                  type="button"
                >
                  + 보기 추가
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                정답{" "}
                {formData.type === "MULTIPLE_CHOICE"
                  ? "(보기 번호, 예: 1)"
                  : "(텍스트)"}
              </label>
              <input
                value={formData.correctAnswer}
                onChange={(e) =>
                  setFormData({ ...formData, correctAnswer: e.target.value })
                }
                placeholder={
                  formData.type === "ESSAY" || formData.type === "FILE_UPLOAD"
                    ? "서술형/파일은 수동 채점 (비워두세요)"
                    : "정답 입력"
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                해설 (선택)
              </label>
              <textarea
                value={formData.explanation}
                onChange={(e) =>
                  setFormData({ ...formData, explanation: e.target.value })
                }
                rows={2}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="채점 후 표시될 해설"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {editingId ? "수정" : "추가"}
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

      {/* 문항 목록 */}
      {loading ? (
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      ) : questions.length === 0 ? (
        <div className="border border-border rounded-xl p-8 text-center text-muted-foreground">
          등록된 문항이 없습니다. 위의 &quot;+ 새 문항 추가&quot; 버튼을 클릭하세요.
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const typeLabel =
              QUESTION_TYPES.find((t) => t.value === q.type)?.label || q.type;
            return (
              <div
                key={q.docId}
                className="border border-border rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded">
                      {q.order || idx + 1}번
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {typeLabel}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {q.points}점
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(q)}
                      className="text-primary hover:underline text-sm"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(q.docId)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <p className="font-medium mb-2">{q.content}</p>
                {q.type === "MULTIPLE_CHOICE" && q.options.length > 0 && (
                  <div className="ml-4 space-y-1">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={`text-sm ${
                          q.correctAnswer === String(optIdx + 1)
                            ? "text-green-600 font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {optIdx + 1}. {opt}
                        {q.correctAnswer === String(optIdx + 1) && " (정답)"}
                      </div>
                    ))}
                  </div>
                )}
                {q.correctAnswer &&
                  q.type !== "MULTIPLE_CHOICE" && (
                    <div className="text-sm text-green-600 mt-1">
                      정답: {q.correctAnswer}
                    </div>
                  )}
                {q.explanation && (
                  <div className="text-sm text-muted-foreground mt-2 bg-muted rounded-lg p-2">
                    해설: {q.explanation}
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
