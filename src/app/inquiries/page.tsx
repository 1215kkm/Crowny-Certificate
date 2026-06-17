"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import {
  getDocuments,
  where,
  orderBy,
  type InquiryDoc,
} from "@/lib/firestore";
import { formatTimestamp, INQUIRY_CATEGORY_MAP, INQUIRY_CATEGORY_OPTIONS } from "@/lib/grade-utils";
import { MessageSquare, Send, ChevronDown, ChevronUp, Clock, CheckCircle } from "lucide-react";

interface InquiryRow {
  id: string;
  category: string;
  title: string;
  content: string;
  status: "PENDING" | "ANSWERED";
  adminReply: string | null;
  adminRepliedAt: string;
  createdAt: string;
}

export default function InquiriesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ category: "ETC", title: "", content: "" });
  const [submitting, setSubmitting] = useState(false);

  // URL 쿼리(?new=1&category=EXAM)로 폼 자동 열기/분류 프리필
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat && INQUIRY_CATEGORY_MAP[cat]) {
      setFormData((prev) => ({ ...prev, category: cat }));
    }
    if (params.get("new") === "1") {
      setShowForm(true);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }

    async function fetchInquiries() {
      try {
        const docs = await getDocuments<InquiryDoc>(
          "inquiries",
          where("userId", "==", user!.uid),
          orderBy("createdAt", "desc")
        );
        setInquiries(
          docs.map((d) => ({
            id: d.id,
            category: d.category || "ETC",
            title: d.title,
            content: d.content,
            status: d.status,
            adminReply: d.adminReply,
            adminRepliedAt: formatTimestamp(d.adminRepliedAt),
            createdAt: formatTimestamp(d.createdAt),
          }))
        );
      } catch (error) {
        console.error("문의 목록 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInquiries();
  }, [user, authLoading, router]);

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    if (!user) return;

    setSubmitting(true);
    try {
      const { getFirebaseAuth } = await import("@/lib/firebase");
      const token = await getFirebaseAuth().currentUser?.getIdToken();
      const res = await fetch("/api/inquiries/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: formData.category,
          title: formData.title.trim(),
          content: formData.content.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "문의 등록에 실패했습니다.");
        return;
      }

      setInquiries((prev) => [
        {
          id: data.id,
          category: formData.category,
          title: formData.title.trim(),
          content: formData.content.trim(),
          status: "PENDING",
          adminReply: null,
          adminRepliedAt: "-",
          createdAt: "방금 전",
        },
        ...prev,
      ]);
      setFormData({ category: "ETC", title: "", content: "" });
      setShowForm(false);
    } catch (error) {
      console.error("문의 등록 실패:", error);
      alert("문의 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            문의하기
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            궁금한 점이나 요청사항을 남겨주세요.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          새 문의 작성
        </button>
      </div>

      {/* 문의 작성 폼 */}
      {showForm && (
        <div className="border border-border rounded-xl p-6 mb-6 bg-muted">
          <h3 className="font-bold mb-4">새 문의 작성</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">문의 종류</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                {INQUIRY_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">제목</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="문의 제목을 입력하세요"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">내용</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="문의 내용을 입력하세요"
                rows={5}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50"
            >
              {submitting ? "등록 중..." : "문의 등록"}
            </button>
            <button
              onClick={() => { setShowForm(false); setFormData({ category: "ETC", title: "", content: "" }); }}
              className="border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 문의 목록 */}
      {loading ? (
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="border border-border rounded-xl p-12 text-center text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>등록된 문의가 없습니다.</p>
          <p className="text-sm mt-1">새 문의를 작성해보세요.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition text-left"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium whitespace-nowrap ${
                      inquiry.status === "ANSWERED"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {inquiry.status === "ANSWERED" ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        답변 완료
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        답변 대기
                      </span>
                    )}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground whitespace-nowrap">
                    {INQUIRY_CATEGORY_MAP[inquiry.category] || "기타"}
                  </span>
                  <span className="font-medium truncate">{inquiry.title}</span>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {inquiry.createdAt}
                  </span>
                  {expandedId === inquiry.id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {expandedId === inquiry.id && (
                <div className="border-t border-border p-4 bg-muted/30">
                  <div className="text-sm whitespace-pre-wrap mb-4">{inquiry.content}</div>

                  {inquiry.adminReply && (
                    <div className="mt-4 border-t border-border pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-primary">관리자 답변</span>
                        <span className="text-xs text-muted-foreground">
                          {inquiry.adminRepliedAt}
                        </span>
                      </div>
                      <div className="text-sm whitespace-pre-wrap bg-primary/5 p-3 rounded-lg border border-primary/10">
                        {inquiry.adminReply}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
