"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  getDocuments,
  where,
  orderBy,
  limit,
  type ExamSubmissionDoc,
  type CertificateIssuanceDoc,
  type PaymentDoc,
  type EnrollmentDoc,
  Timestamp,
} from "@/lib/firestore";
import { getDocs, collection } from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase";

const MENU_ITEMS = [
  { title: "회원 관리", desc: "회원 목록, 검색, 역할 변경", href: "/admin/users", icon: "👤" },
  { title: "강의 관리", desc: "강의 등록/수정, 레슨 관리", href: "/admin/courses", icon: "📚" },
  { title: "시험 관리", desc: "시험 등록, 문제 관리, 채점", href: "/admin/exams", icon: "📝" },
  { title: "결제 관리", desc: "결제 내역, 환불 처리, 정산", href: "/admin/payments", icon: "💳" },
  { title: "인증서 관리", desc: "발급 현황, 배송 관리", href: "/admin/certificates", icon: "🏆" },
  { title: "자격증 종류 관리", desc: "등급별 자격증 설정", href: "/admin/certificate-types", icon: "⚙️" },
];

interface StatItem {
  label: string;
  value: string;
  color: string;
}

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<{ time: string; action: string; user: string; status: string; statusColor: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user || !isAdmin) {
      setLoading(false);
      return;
    }

    async function fetchStats() {
      try {
        const db = getFirebaseFirestore();

        const [usersSnap, enrollmentsSnap, submissionsSnap, issuancesSnap, paymentsData] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "enrollments")),
          getDocs(collection(db, "examSubmissions")),
          getDocs(collection(db, "certificateIssuances")),
          getDocuments<PaymentDoc>("payments", where("status", "==", "COMPLETED")),
        ]);

        // 이번 달 매출 계산
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyRevenue = paymentsData
          .filter((p) => p.createdAt && p.createdAt.toDate() >= monthStart)
          .reduce((sum, p) => sum + p.amount, 0);

        // 환불 건수
        const refunds = await getDocuments<PaymentDoc>("payments", where("status", "==", "REFUNDED"));

        setStats([
          { label: "총 회원수", value: usersSnap.size.toLocaleString(), color: "text-blue-600" },
          { label: "수강생", value: enrollmentsSnap.size.toLocaleString(), color: "text-purple-600" },
          { label: "시험 응시", value: submissionsSnap.size.toLocaleString(), color: "text-orange-600" },
          { label: "인증서 발급", value: issuancesSnap.size.toLocaleString(), color: "text-green-600" },
          { label: "이번 달 매출", value: `${monthlyRevenue.toLocaleString()}원`, color: "text-primary" },
          { label: "환불 건수", value: refunds.length.toLocaleString(), color: "text-red-600" },
        ]);

        // 최근 활동 (최근 시험 제출 5건)
        const recentSubmissions = await getDocuments<ExamSubmissionDoc>(
          "examSubmissions",
          orderBy("submittedAt", "desc"),
          limit(5)
        );

        const activities = recentSubmissions.map((s) => ({
          time: s.submittedAt ? timeAgo(s.submittedAt.toDate()) : "-",
          action: `시험 응시 ${s.status === "GRADED" ? "완료" : "제출"}`,
          user: s.userId.substring(0, 8) + "...",
          status: s.passed ? "합격" : s.status === "SUBMITTED" ? "채점 대기" : "불합격",
          statusColor: s.passed ? "text-green-600" : s.status === "SUBMITTED" ? "text-orange-600" : "text-red-600",
        }));

        setRecentActivities(activities);
      } catch (error) {
        console.error("관리자 통계 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [user, isAdmin, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">접근 권한이 없습니다</h1>
        <p className="text-muted-foreground">관리자만 접근할 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">관리자 대시보드</h1>
          <p className="text-muted-foreground">Crowny AI 자격증 플랫폼 관리</p>
        </div>
        <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-medium">ADMIN</span>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* 관리 메뉴 */}
      <h2 className="text-xl font-bold mb-4">관리 메뉴</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/50 transition group"
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <h3 className="font-bold group-hover:text-primary transition">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* 최근 활동 */}
      <h2 className="text-xl font-bold mb-4">최근 활동</h2>
      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium">시간</th>
              <th className="text-left p-3 font-medium">활동</th>
              <th className="text-left p-3 font-medium">사용자</th>
              <th className="text-left p-3 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, idx) => (
                <tr key={idx} className="border-t border-border hover:bg-muted/50">
                  <td className="p-3 text-muted-foreground">{activity.time}</td>
                  <td className="p-3">{activity.action}</td>
                  <td className="p-3">{activity.user}</td>
                  <td className={`p-3 font-medium ${activity.statusColor}`}>{activity.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted-foreground">
                  최근 활동이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}
