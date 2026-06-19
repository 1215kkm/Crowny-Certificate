"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  getDocuments,
  orderBy,
  Timestamp,
  type InquiryDoc,
} from "@/lib/firestore";
import { formatTimestamp, INQUIRY_CATEGORY_MAP } from "@/lib/grade-utils";
import { MessageSquare, ChevronDown, ChevronUp, Send, Clock, CheckCircle } from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase";

interface InquiryRow {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: string;
  title: string;
  content: string;
  imageUrl: string | null;
  status: "PENDING" | "ANSWERED";
  adminReply: string | null;
  adminRepliedAt: string;
  replyRead: boolean;
  replyReadAt: string;
  createdAt: string;
}

const PRESET_REPLIES: { label: string; text: string }[] = [
  { label: "확인중", text: "문의 주셔서 감사합니다. 현재 내용을 확인 중이며, 확인되는 대로 다시 안내드리겠습니다." },
];

export default function AdminInquiriesPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replying, setReplying] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "ANSWERED">("ALL");

  const fetchData = async () => {
    try {
      const docs = await getDocuments<InquiryDoc>(
        "inquiries",
        orderBy("createdAt", "desc")
      );
      setInquiries(
        docs.map((d) => ({
          id: d.id,
          userId: d.userId,
          userName: d.userName,
          userEmail: d.userEmail,
          category: d.category || "ETC",
          title: d.title,
          content: d.content,
          imageUrl: d.imageUrl ?? null,
          status: d.status,
          adminReply: d.adminReply,
          adminRepliedAt: formatTimestamp(d.adminRepliedAt),
          replyRead: !!d.replyReadAt,
          replyReadAt: d.replyReadAt ? formatTimestamp(d.replyReadAt) : "",
          createdAt: formatTimestamp(d.createdAt),
        }))
      );
    } catch (error) {
      console.error("문의 목록 로드 실패:", error);
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

  const handleReply = async (inquiryId: string) => {
    const current = inquiries.find((i) => i.id === inquiryId);
    const reply = (replyText[inquiryId] ?? current?.adminReply ?? "").trim();
    if (!reply) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    setReplying(inquiryId);
    try {
      const auth = getFirebaseAuth();
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("인증 토큰을 가져올 수 없습니다.");

      const res = await fetch("/api/inquiries/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inquiryId, reply }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "답변 등록에 실패했습니다.");
      }

      // 로컬 상태 업데이트
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === inquiryId
            ? {
                ...inq,
                status: "ANSWERED" as const,
                adminReply: reply,
                adminRepliedAt: formatTimestamp(Timestamp.now()),
                replyRead: false,
                replyReadAt: "",
              }
            : inq
        )
      );
      setReplyText((prev) => ({ ...prev, [inquiryId]: "" }));
    } catch (error) {
      console.error("답변 등록 실패:", error);
      alert(error instanceof Error ? error.message : "답변 등록에 실패했습니다.");
    } finally {
      setReplying(null);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (filter === "ALL") return true;
    return inq.status === filter;
  });

  const pendingCount = inquiries.filter((i) => i.status === "PENDING").length;
  const answeredCount = inquiries.filter((i) => i.status === "ANSWERED").length;

  if (!isAdmin && !authLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">접근 권한이 없습니다</h1>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block"
        >
          &larr; 대시보드
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          문의 관리
        </h1>
      </div>

      {/* 필터 & 통계 */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            filter === "ALL"
              ? "bg-primary text-white"
              : "border border-border hover:bg-muted"
          }`}
        >
          전체 ({inquiries.length})
        </button>
        <button
          onClick={() => setFilter("PENDING")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            filter === "PENDING"
              ? "bg-orange-500 text-white"
              : "border border-border hover:bg-muted"
          }`}
        >
          답변 대기 ({pendingCount})
        </button>
        <button
          onClick={() => setFilter("ANSWERED")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            filter === "ANSWERED"
              ? "bg-green-600 text-white"
              : "border border-border hover:bg-muted"
          }`}
        >
          답변 완료 ({answeredCount})
        </button>
      </div>

      {/* 문의 목록 */}
      {loading ? (
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="border border-border rounded-xl p-12 text-center text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>
            {filter === "ALL"
              ? "등록된 문의가 없습니다."
              : filter === "PENDING"
              ? "답변 대기 중인 문의가 없습니다."
              : "답변 완료된 문의가 없습니다."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === inquiry.id ? null : inquiry.id)
                }
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
                    {inquiry.userName} | {inquiry.createdAt}
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
                  {/* 사용자 정보 */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>작성자: {inquiry.userName}</span>
                    <span>이메일: {inquiry.userEmail}</span>
                    <span>작성일: {inquiry.createdAt}</span>
                  </div>

                  {/* 문의 내용 */}
                  <div className="text-sm whitespace-pre-wrap mb-4 bg-white/50 p-3 rounded-lg border border-border">
                    {inquiry.content}
                  </div>

                  {/* 첨부 이미지 */}
                  {inquiry.imageUrl && (
                    <a href={inquiry.imageUrl} target="_blank" rel="noopener noreferrer" className="inline-block mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={inquiry.imageUrl} alt="첨부 이미지" className="max-h-72 rounded-lg border border-border" />
                    </a>
                  )}

                  {/* 기존 답변 */}
                  {inquiry.adminReply && (
                    <div className="mb-4 border-t border-border pt-4">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm font-bold text-primary">관리자 답변</span>
                        <span className="text-xs text-muted-foreground">
                          {inquiry.adminRepliedAt}
                        </span>
                        {/* 작성자 읽음 여부 */}
                        {inquiry.replyRead ? (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium">
                            읽음{inquiry.replyReadAt ? ` · ${inquiry.replyReadAt}` : ""}
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
                            안읽음
                          </span>
                        )}
                      </div>
                      <div className="text-sm whitespace-pre-wrap bg-primary/5 p-3 rounded-lg border border-primary/10">
                        {inquiry.adminReply}
                      </div>
                    </div>
                  )}

                  {/* 답변 작성/수정 폼 */}
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <label className="block text-sm font-medium">
                        {inquiry.adminReply ? "답변 수정" : "답변 작성"}
                      </label>
                      <div className="flex gap-1.5">
                        {PRESET_REPLIES.map((p) => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => setReplyText((prev) => ({ ...prev, [inquiry.id]: p.text }))}
                            className="text-xs border border-border rounded-full px-3 py-1 hover:bg-muted transition"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={replyText[inquiry.id] ?? (inquiry.adminReply ?? "")}
                      onChange={(e) =>
                        setReplyText((prev) => ({
                          ...prev,
                          [inquiry.id]: e.target.value,
                        }))
                      }
                      placeholder="답변 내용을 입력하세요"
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleReply(inquiry.id)}
                        disabled={replying === inquiry.id}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50 flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {replying === inquiry.id ? "등록 중..." : inquiry.adminReply ? "답변 수정" : "답변 등록"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
