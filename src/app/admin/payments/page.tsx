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
import { adminUpdate } from "@/lib/admin-api";

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING: { label: "대기", className: "bg-orange-100 text-orange-700" },
  COMPLETED: { label: "완료", className: "bg-green-100 text-green-700" },
  FAILED: { label: "실패", className: "bg-gray-100 text-gray-500" },
  REFUNDED: { label: "환불", className: "bg-red-100 text-red-700" },
  CANCELLED: { label: "취소", className: "bg-gray-100 text-gray-500" },
};

const REFUND_STATUS_MAP: Record<string, { label: string; className: string }> = {
  REQUESTED: { label: "환불요청", className: "bg-orange-100 text-orange-700" },
  APPROVED: { label: "환불승인", className: "bg-red-100 text-red-700" },
  REJECTED: { label: "환불거절", className: "bg-gray-100 text-gray-500" },
};

const TYPE_MAP: Record<string, string> = {
  COURSE: "강의",
  EXAM: "시험",
  CERTIFICATE: "인증서",
};

interface PaymentRow {
  id: string;
  userName: string;
  typeRaw: string;
  type: string;
  itemName: string;
  amount: number;
  method: string;
  status: string;
  refundStatus: string;
  refundKind: string | null;
  refundReason: string | null;
  retakeGranted: boolean;
  tossOrderId: string;
  date: string;
}

export default function AdminPaymentsPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !isAdmin) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const paymentDocs = await getDocuments<PaymentDoc>("payments");

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
              typeRaw: p.type,
              type: TYPE_MAP[p.type] || p.type,
              itemName: p.itemName || "-",
              amount: p.amount,
              method: p.method || "-",
              status: p.status,
              refundStatus: p.refundStatus || "NONE",
              refundKind: p.refundKind ?? null,
              refundReason: p.refundReason ?? null,
              retakeGranted: !!p.retakeGranted,
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

  // 환불 승인 (토스 연동은 추후. 지금은 결제 상태만 환불/취소로 변경)
  const approveRefund = async (row: PaymentRow) => {
    const isCancel = row.refundKind === "CANCEL_BEFORE_EXAM";
    if (!confirm(`${row.userName}님의 "${row.itemName}" 결제 ${row.amount.toLocaleString()}원을 ${isCancel ? "취소(전액 환불)" : "환불"} 처리할까요?\n(실제 토스 환불은 추후 연동, 지금은 상태만 변경됩니다)`)) return;
    setBusyId(row.id);
    try {
      await adminUpdate(["payments", row.id], {
        status: isCancel ? "CANCELLED" : "REFUNDED",
        refundStatus: "APPROVED",
        refundedAt: "__SERVER_TIMESTAMP__",
      });
      setPayments((prev) =>
        prev.map((p) =>
          p.id === row.id ? { ...p, status: isCancel ? "CANCELLED" : "REFUNDED", refundStatus: "APPROVED" } : p
        )
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "처리에 실패했습니다.");
    } finally {
      setBusyId(null);
    }
  };

  // 환불 거절
  const rejectRefund = async (row: PaymentRow) => {
    const note = prompt("거절 사유를 입력해주세요:");
    if (note === null) return;
    setBusyId(row.id);
    try {
      await adminUpdate(["payments", row.id], {
        refundStatus: "REJECTED",
        adminRefundNote: note,
      });
      setPayments((prev) =>
        prev.map((p) => (p.id === row.id ? { ...p, refundStatus: "REJECTED" } : p))
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "처리에 실패했습니다.");
    } finally {
      setBusyId(null);
    }
  };

  // 관리자 직접 환불 (요청 없이)
  const manualRefund = async (row: PaymentRow) => {
    const note = prompt("환불 사유를 입력해주세요:");
    if (!note) return;
    setBusyId(row.id);
    try {
      await adminUpdate(["payments", row.id], {
        status: "REFUNDED",
        refundStatus: "APPROVED",
        refundReason: note,
        refundedAt: "__SERVER_TIMESTAMP__",
      });
      setPayments((prev) =>
        prev.map((p) => (p.id === row.id ? { ...p, status: "REFUNDED", refundStatus: "APPROVED" } : p))
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "처리에 실패했습니다.");
    } finally {
      setBusyId(null);
    }
  };

  // 재시험 허용 (해당 시험을 추가 결제 없이 다시 응시할 수 있게 함)
  const grantRetake = async (row: PaymentRow) => {
    const reason = prompt("재시험 허용 사유를 입력해주세요 (예: 시스템 오류로 인한 재응시):");
    if (reason === null) return;
    setBusyId(row.id);
    try {
      await adminUpdate(["payments", row.id], {
        retakeGranted: true,
        retakeReason: reason,
        retakeGrantedAt: "__SERVER_TIMESTAMP__",
      });
      setPayments((prev) =>
        prev.map((p) => (p.id === row.id ? { ...p, retakeGranted: true } : p))
      );
      alert("재시험이 허용되었습니다. 사용자 마이페이지에서 재응시할 수 있습니다.");
    } catch (e) {
      alert(e instanceof Error ? e.message : "처리에 실패했습니다.");
    } finally {
      setBusyId(null);
    }
  };

  if (!isAdmin && !authLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">접근 권한이 없습니다</h1>
      </div>
    );
  }

  const totalRevenue = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = payments
    .filter((p) => p.status === "REFUNDED" || p.status === "CANCELLED")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingRefunds = payments.filter((p) => p.refundStatus === "REQUESTED").length;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block"
        >
          &larr; 대시보드
        </Link>
        <h1 className="text-2xl font-bold">결제 · 환불 관리</h1>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm text-muted-foreground">총 결제</div>
          <div className="text-xl font-bold text-primary">{payments.length}건</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm text-muted-foreground">매출</div>
          <div className="text-xl font-bold text-green-600">{totalRevenue.toLocaleString()}원</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm text-muted-foreground">환불/취소</div>
          <div className="text-xl font-bold text-red-600">{totalRefunded.toLocaleString()}원</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm text-muted-foreground">환불 요청 대기</div>
          <div className="text-xl font-bold text-orange-600">{pendingRefunds}건</div>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium">사용자</th>
                <th className="text-left p-4 font-medium">상품</th>
                <th className="text-left p-4 font-medium">유형</th>
                <th className="text-left p-4 font-medium">금액</th>
                <th className="text-left p-4 font-medium">상태</th>
                <th className="text-left p-4 font-medium">날짜</th>
                <th className="text-left p-4 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    결제 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                payments.map((p) => {
                  const statusInfo = STATUS_MAP[p.status] || { label: p.status, className: "" };
                  const refundInfo = REFUND_STATUS_MAP[p.refundStatus];
                  const busy = busyId === p.id;
                  return (
                    <tr key={p.id} className="border-t border-border hover:bg-muted/50 align-top">
                      <td className="p-4">{p.userName}</td>
                      <td className="p-4">
                        <div className="font-medium">{p.itemName}</div>
                        <div className="font-mono text-xs text-muted-foreground">{p.tossOrderId}</div>
                        {p.refundStatus === "REQUESTED" && p.refundReason && (
                          <div className="text-xs text-orange-700 mt-1">사유: {p.refundReason}</div>
                        )}
                      </td>
                      <td className="p-4">{p.type}</td>
                      <td className="p-4 font-medium">{p.amount.toLocaleString()}원</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`text-xs px-2 py-1 rounded ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                          {refundInfo && p.refundStatus !== "APPROVED" && (
                            <span className={`text-xs px-2 py-1 rounded ${refundInfo.className}`}>
                              {p.refundKind === "CANCEL_BEFORE_EXAM" && p.refundStatus === "REQUESTED" ? "응시전취소요청" : refundInfo.label}
                            </span>
                          )}
                          {p.retakeGranted && (
                            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">재시험허용</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground whitespace-nowrap">{p.date}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          {p.refundStatus === "REQUESTED" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => approveRefund(p)}
                                disabled={busy}
                                className="text-red-500 hover:underline disabled:opacity-50"
                              >
                                {busy ? "처리중..." : "환불 승인"}
                              </button>
                              <button
                                onClick={() => rejectRefund(p)}
                                disabled={busy}
                                className="text-muted-foreground hover:underline disabled:opacity-50"
                              >
                                거절
                              </button>
                            </div>
                          )}
                          {p.status === "COMPLETED" && p.refundStatus !== "REQUESTED" && (
                            <button
                              onClick={() => manualRefund(p)}
                              disabled={busy}
                              className="text-red-500 hover:underline disabled:opacity-50"
                            >
                              {busy ? "처리중..." : "환불 처리"}
                            </button>
                          )}
                          {p.typeRaw === "EXAM" && !p.retakeGranted && (
                            <button
                              onClick={() => grantRetake(p)}
                              disabled={busy}
                              className="text-green-600 hover:underline disabled:opacity-50"
                            >
                              재시험 허용
                            </button>
                          )}
                        </div>
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
