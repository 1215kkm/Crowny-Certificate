"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  getDocuments,
  getDocument,
  type CertificateIssuanceDoc,
  type CertificateTypeDoc,
  type UserDoc,
} from "@/lib/firestore";
import { adminUpdate } from "@/lib/admin-api";
import { getGradeInfo, formatTimestamp, DELIVERY_METHOD_MAP, ISSUANCE_STATUS_MAP } from "@/lib/grade-utils";

interface IssuanceRow {
  id: string;
  issueNumber: string;
  userName: string;
  grade: string;
  method: string;
  deliveryMethod: string;
  status: string;
  statusKey: string;
  statusClassName: string;
  date: string;
  recipientName: string | null;
  recipientPhone: string | null;
  mailingZipCode: string | null;
  mailingAddress: string | null;
  trackingNumber: string | null;
}

export default function AdminCertificatesPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [issuances, setIssuances] = useState<IssuanceRow[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, mailing: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [issuanceDocs, typeDocs] = await Promise.all([
        getDocuments<CertificateIssuanceDoc>("certificateIssuances"),
        getDocuments<CertificateTypeDoc>("certificateTypes"),
      ]);

      const typesMap: Record<string, CertificateTypeDoc & { id: string }> = {};
      typeDocs.forEach((t) => { typesMap[t.id] = t; });

      // 사용자 이름 조회
      const userIds = [...new Set(issuanceDocs.map((i) => i.userId))];
      const usersMap: Record<string, string> = {};
      await Promise.all(
        userIds.map(async (uid) => {
          const u = await getDocument<UserDoc>("users", uid);
          usersMap[uid] = u?.name || u?.email || uid.substring(0, 8) + "...";
        })
      );

      // 통계 계산: 준비중 / 배송중 / 완료(확인완료·배송완료). 구버전 상태값도 호환.
      let pending = 0, mailing = 0, completed = 0;
      issuanceDocs.forEach((i) => {
        const s = i.status as string;
        if (s === "PENDING" || s === "GENERATING") pending++;
        else if (s === "SHIPPING" || s === "MAILING") mailing++;
        else if (s === "CONFIRMED" || s === "DELIVERED" || s === "ISSUED") completed++;
      });

      setStats({ total: issuanceDocs.length, pending, mailing, completed });

      setIssuances(
        issuanceDocs.map((i) => {
          const certType = typesMap[i.certificateTypeId];
          const gradeInfo = certType ? getGradeInfo(certType.grade) : { label: "-" };
          const statusInfo = ISSUANCE_STATUS_MAP[i.status] || { label: i.status, className: "bg-gray-100 text-gray-500" };

          return {
            id: i.id,
            issueNumber: i.issueNumber,
            userName: usersMap[i.userId] || "-",
            grade: gradeInfo.label,
            method: DELIVERY_METHOD_MAP[i.deliveryMethod] || i.deliveryMethod,
            deliveryMethod: i.deliveryMethod,
            status: statusInfo.label,
            statusKey: i.status,
            statusClassName: statusInfo.className,
            date: formatTimestamp(i.createdAt),
            recipientName: i.recipientName ?? null,
            recipientPhone: i.recipientPhone ?? null,
            mailingZipCode: i.mailingZipCode ?? null,
            mailingAddress: i.mailingAddress ?? null,
            trackingNumber: i.trackingNumber ?? null,
          };
        })
      );
    } catch (error) {
      console.error("인증서 목록 로드 실패:", error);
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

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await adminUpdate(["certificateIssuances", id], {
        status: newStatus,
        // 확인완료 시 발급일 기록 (서버 시각)
        ...(newStatus === "CONFIRMED" ? { issuedAt: "__SERVER_TIMESTAMP__" } : {}),
      });
      setLoading(true);
      await fetchData();
    } catch (error) {
      console.error("상태 변경 실패:", error);
      alert(error instanceof Error ? error.message : "상태 변경에 실패했습니다.");
    }
  };

  if (!isAdmin && !authLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">접근 권한이 없습니다</h1>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">&larr; 대시보드</Link>
          <h1 className="text-2xl font-bold">인증서 관리</h1>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-muted rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-sm text-muted-foreground">총 발급</div>
        </div>
        <div className="bg-muted rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-500">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">발급 대기</div>
        </div>
        <div className="bg-muted rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-500">{stats.mailing}</div>
          <div className="text-sm text-muted-foreground">배송 중</div>
        </div>
        <div className="bg-muted rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">완료</div>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse"><div className="h-64 bg-gray-200 rounded-xl" /></div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium">인증번호</th>
                <th className="text-left p-4 font-medium">수여자</th>
                <th className="text-left p-4 font-medium">등급</th>
                <th className="text-left p-4 font-medium">발급 방법</th>
                <th className="text-left p-4 font-medium">배송지</th>
                <th className="text-left p-4 font-medium">상태</th>
                <th className="text-left p-4 font-medium">신청일</th>
                <th className="text-left p-4 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {issuances.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">발급된 인증서가 없습니다.</td></tr>
              ) : (
                issuances.map((issuance) => {
                  const isMail = issuance.deliveryMethod === "BOTH" || issuance.deliveryMethod === "MAIL";
                  // 상태 정규화 (구버전 호환)
                  const key =
                    issuance.statusKey === "GENERATING" ? "PENDING"
                    : issuance.statusKey === "ISSUED" ? "CONFIRMED"
                    : issuance.statusKey === "MAILING" ? "SHIPPING"
                    : issuance.statusKey;
                  return (
                  <tr key={issuance.id} className="border-t border-border hover:bg-muted/50 align-top">
                    <td className="p-4 font-mono text-sm">{issuance.issueNumber}</td>
                    <td className="p-4">{issuance.userName}</td>
                    <td className="p-4">{issuance.grade}</td>
                    <td className="p-4">{issuance.method}</td>
                    <td className="p-4 text-sm">
                      {isMail && issuance.mailingAddress ? (
                        <div className="text-muted-foreground">
                          <div className="font-medium text-foreground">
                            {issuance.recipientName} {issuance.recipientPhone ? `· ${issuance.recipientPhone}` : ""}
                          </div>
                          <div>
                            {issuance.mailingZipCode ? `(${issuance.mailingZipCode}) ` : ""}
                            {issuance.mailingAddress}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${issuance.statusClassName}`}>
                        {issuance.status}
                      </span>
                    </td>
                    <td className="p-4">{issuance.date}</td>
                    <td className="p-4">
                      {key === "PENDING" && (
                        <button
                          onClick={() => handleUpdateStatus(issuance.id, "CONFIRMED")}
                          className="text-green-600 hover:underline text-sm"
                        >
                          확인완료 처리
                        </button>
                      )}
                      {key === "CONFIRMED" && isMail && (
                        <button
                          onClick={() => handleUpdateStatus(issuance.id, "SHIPPING")}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          배송 시작
                        </button>
                      )}
                      {key === "CONFIRMED" && !isMail && (
                        <span className="text-xs text-muted-foreground">완료</span>
                      )}
                      {key === "SHIPPING" && (
                        <button
                          onClick={() => handleUpdateStatus(issuance.id, "DELIVERED")}
                          className="text-green-600 hover:underline text-sm"
                        >
                          배송 완료
                        </button>
                      )}
                      {key === "DELIVERED" && (
                        <span className="text-xs text-muted-foreground">완료</span>
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
