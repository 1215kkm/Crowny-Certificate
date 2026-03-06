"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  getDocuments,
  getDocument,
  type PaymentDoc,
  type UserDoc,
} from "@/lib/firestore";
import { formatTimestamp } from "@/lib/grade-utils";
import { getIdToken } from "@/lib/firebase-auth";

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING: { label: "대기", className: "bg-orange-100 text-orange-700" },
  COMPLETED: { label: "완료", className: "bg-green-100 text-green-700" },
  FAILED: { label: "실패", className: "bg-gray-100 text-gray-500" },
  REFUNDED: { label: "환불", className: "bg-red-100 text-red-700" },
  CANCELLED: { label: "취소", className: "bg-gray-100 text-gray-500" },
};

const TYPE_MAP: Record<string, string> = {
  COURSE: "강의",
  EXAM: "시험",
  CERTIFICATE: "인증서",
};

interface PaymentRow {
  id: string;
  userName: string;
  type: string;
  amount: number;
  method: string;
  status: string;
  tossOrderId: string;
  date: string;
}

export default function AdminPaymentsPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundingId, setRefundingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !isAdmin) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const paymentDocs = await getDocuments<PaymentDoc>("payments");

        // 유저 정보 매핑
        const userIds = [...new Set(paymentDocs.map((p) => p.userId))];
        const userMap: Record<string, string> = {};
        await Promise.all(
          userIds.map(async (uid) => {
            const u = await getDocument<UserDoc>("users", uid);
            userMap[uid] = u?.name || u?.email || uid.substring(0, 8) + "...";
          })
        );

        setPayments(
          paymentDocs
            .sort((a, b) => {
              const aTime = a.createdAt?.toDate?.()?.getTime?.() || 0;
              const bTime = b.createdAt?.toDate?.()?.getTime?.() || 0;
              return bTime - aTime;
            })
            .map((p) => ({
              id: p.id,
              userName: userMap[p.userId] || p.userId,
              type: TYPE_MAP[p.type] || p.type,
              amount: p.amount,
              method: p.method || "-",
              status: p.status,
              tossOrderId: p.tossOrderId || "-",
              date: formatTimestamp(p.createdAt),
            }))
        );
      } catch (error) {
        console.error("결제 목록 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isAdmin, authLoading]);

  const handleRefund = async (paymentId: string) => {
    const reason = prompt("환불 사유를 입력해주세요:");
    if (!reason) return;

    setRefundingId(paymentId);
    try {
      const token = await getIdToken();
      const res = await fetch("/api/payments/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentId, cancelReason: reason }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "환불 처리 실패");
      }

      setPayments((prev) =>
        prev.map((p) =>
          p.id === paymentId ? { ...p, status: "REFUNDED" } : p
        )
      );
      alert("환불이 완료되었습니다.");
    } catch (error) {
      console.error("환불 실패:", error);
      alert(
        error instanceof Error ? error.message : "환불 처리에 실패했습니다."
      );
    } finally {
      setRefundingId(null);
    }
  };

  if (!isAdmin && !authLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">접근 권한이 없습니다</h1>
      </div>
    );
  }

  // 통계
  const totalRevenue = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = payments
    .filter((p) => p.status === "REFUNDED")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block"
        >
          &larr; 대시보드
        </Link>
        <h1 className="text-2xl font-bold">결제 관리</h1>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm text-muted-foreground">총 결제</div>
          <div className="text-xl font-bold text-primary">
            {payments.length}건
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm text-muted-foreground">매출</div>
          <div className="text-xl font-bold text-green-600">
            {totalRevenue.toLocaleString()}원
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm text-muted-foreground">환불</div>
          <div className="text-xl font-bold text-red-600">
            {totalRefunded.toLocaleString()}원
          </div>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium">주문ID</th>
                <th className="text-left p-4 font-medium">사용자</th>
                <th className="text-left p-4 font-medium">유형</th>
                <th className="text-left p-4 font-medium">금액</th>
                <th className="text-left p-4 font-medium">결제수단</th>
                <th className="text-left p-4 font-medium">상태</th>
                <th className="text-left p-4 font-medium">날짜</th>
                <th className="text-left p-4 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-8 text-center text-muted-foreground"
                  >
                    결제 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => {
                  const statusInfo = STATUS_MAP[payment.status] || {
                    label: payment.status,
                    className: "",
                  };
                  return (
                    <tr
                      key={payment.id}
                      className="border-t border-border hover:bg-muted/50"
                    >
                      <td className="p-4 font-mono text-xs">
                        {payment.tossOrderId}
                      </td>
                      <td className="p-4">{payment.userName}</td>
                      <td className="p-4">{payment.type}</td>
                      <td className="p-4 font-medium">
                        {payment.amount.toLocaleString()}원
                      </td>
                      <td className="p-4">{payment.method}</td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2 py-1 rounded ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {payment.date}
                      </td>
                      <td className="p-4">
                        {payment.status === "COMPLETED" && (
                          <button
                            onClick={() => handleRefund(payment.id)}
                            disabled={refundingId === payment.id}
                            className="text-red-500 hover:underline text-sm disabled:opacity-50"
                          >
                            {refundingId === payment.id
                              ? "처리중..."
                              : "환불"}
                          </button>
                        )}
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
