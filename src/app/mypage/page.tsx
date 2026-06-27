"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  getDocuments,
  getDocument,
  where,
  type EnrollmentDoc,
  type CourseDoc,
  type ExamSubmissionDoc,
  type ExamDoc,
  type CertificateIssuanceDoc,
  type CertificateTypeDoc,
  type PaymentDoc,
  type InquiryDoc,
  orderBy,
} from "@/lib/firestore";
import { getThemeById } from "@/data/grade-2-practical";
import { getAppThemeById } from "@/data/grade-1-practical";
import { getGradeInfo, formatTimestamp, ISSUANCE_STATUS_MAP, DELIVERY_METHOD_MAP, INQUIRY_CATEGORY_MAP } from "@/lib/grade-utils";
import { REFUND_POLICY, REFUND_POLICY_TITLE, REFUND_AGREE_LABEL } from "@/lib/refund-policy";

const PAY_TYPE_LABEL: Record<string, string> = { COURSE: "강의", EXAM: "시험", CERTIFICATE: "인증서" };

type TabKey = "courses" | "exams" | "practical" | "payments" | "certificates" | "inquiries";
const TABS: { key: TabKey; label: string }[] = [
  { key: "courses", label: "수강 현황" },
  { key: "exams", label: "시험 결과" },
  { key: "practical", label: "실기 결과" },
  { key: "payments", label: "결제 내역·환불" },
  { key: "certificates", label: "발급된 인증서" },
  { key: "inquiries", label: "내 문의 내역" },
];

interface InquiryRow {
  id: string;
  category: string;
  title: string;
  content: string;
  imageUrl: string | null;
  status: string;
  adminReply: string | null;
  adminRepliedAt: string;
  createdAt: string;
}

interface PaymentRow {
  id: string;
  type: string;
  itemName: string;
  amount: number;
  date: string;
  status: string;
  refundStatus: string;
  refundKind: string | null;
  adminRefundNote: string | null;
  targetId: string | null;
  isExam: boolean;
  taken: boolean; // 시험 응시(제출) 여부
  retakeGranted: boolean;
}

export default function MyPage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<{ id: string; courseTitle: string; grade: string; gradeColor: string; progress: number; courseId: string }[]>([]);
  const [examResults, setExamResults] = useState<{ id: string; examTitle: string; grade: string; score: number | null; passed: boolean | null; date: string; feedback: string | null }[]>([]);
  const [certificates, setCertificates] = useState<{ id: string; grade: string; issueNumber: string; issuedAt: string; status: string; statusClassName: string; method: string; trackingNumber: string | null; pdfUrl: string | null }[]>([]);
  const [practicals, setPracticals] = useState<{ id: string; themeName: string; status: string; statusClassName: string; detail: string; eligible: boolean }[]>([]);
  const [appSubs, setAppSubs] = useState<{ id: string; themeName: string; appUrl: string; status: string; statusClassName: string; detail: string; eligible: boolean }[]>([]);
  const [specialSubs, setSpecialSubs] = useState<{ id: string; topicTitle: string; appUrl: string; status: string; statusClassName: string; detail: string; eligible: boolean }[]>([]);
  // 합격작 등록 상태
  const [registeredSubs, setRegisteredSubs] = useState<Set<string>>(new Set());
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("courses");
  const [openInquiryId, setOpenInquiryId] = useState<string | null>(null);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  // 환불/취소 신청 모달 상태
  const [refundModal, setRefundModal] = useState<{ row: PaymentRow; kind: "REFUND" | "CANCEL_BEFORE_EXAM" } | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundAgreed, setRefundAgreed] = useState(false);
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [refundError, setRefundError] = useState("");

  useEffect(() => {
    if (authLoading || !user) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const [enrollmentDocs, submissionDocs, issuanceDocs, certTypeDocs, paymentDocs] = await Promise.all([
          getDocuments<EnrollmentDoc>("enrollments", where("userId", "==", user!.uid)),
          getDocuments<ExamSubmissionDoc>("examSubmissions", where("userId", "==", user!.uid)),
          getDocuments<CertificateIssuanceDoc>("certificateIssuances", where("userId", "==", user!.uid)),
          getDocuments<CertificateTypeDoc>("certificateTypes"),
          getDocuments<PaymentDoc>("payments", where("userId", "==", user!.uid)),
        ]);

        // 내 문의 내역
        try {
          const inquiryDocs = await getDocuments<InquiryDoc>(
            "inquiries",
            where("userId", "==", user!.uid),
            orderBy("createdAt", "desc")
          );
          setInquiries(
            inquiryDocs.map((d) => ({
              id: d.id,
              category: d.category || "ETC",
              title: d.title,
              content: d.content,
              imageUrl: d.imageUrl ?? null,
              status: d.status,
              adminReply: d.adminReply,
              adminRepliedAt: formatTimestamp(d.adminRepliedAt),
              createdAt: formatTimestamp(d.createdAt),
            }))
          );
        } catch (e) {
          console.error("문의 내역 로드 실패:", e);
        }

        // 응시(제출)한 시험 examId 집합 — 시험 응시 전 취소 가능 여부 판단용
        const takenExamIds = new Set(submissionDocs.map((s) => s.examId));

        // 실기 제출(2급 랜딩페이지/1급 앱)은 신규 컬렉션이라 서버 경유로 조회 (Firestore 규칙 우회)
        let practicalDocs: Array<{ id: string; themeId: string; announceAt: string; status: string; passed: boolean | null; score: number | null; feedback: string | null }> = [];
        let appDocs: Array<{ id: string; themeId: string; appUrl: string; status: string; passed: boolean | null; score: number | null; feedback: string | null }> = [];
        let specialDocs: Array<{ id: string; topicTitle: string; appUrl: string; announceAt: string; status: string; passed: boolean | null; score: number | null; feedback: string | null }> = [];
        try {
          const { getFirebaseAuth } = await import("@/lib/firebase");
          const token = await getFirebaseAuth().currentUser?.getIdToken();
          const res = await fetch("/api/my/submissions", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const d = await res.json();
            practicalDocs = (d.practical || []) as typeof practicalDocs;
            appDocs = (d.app || []) as typeof appDocs;
            specialDocs = (d.special || []) as typeof specialDocs;
          }
        } catch (e) {
          console.error("실기 제출 조회 실패:", e);
        }

        const typesMap: Record<string, CertificateTypeDoc & { id: string }> = {};
        certTypeDocs.forEach((t) => { typesMap[t.id] = t; });

        // 수강 현황
        const courseIds = [...new Set(enrollmentDocs.map((e) => e.courseId))];
        const courseMap: Record<string, CourseDoc & { id: string }> = {};
        await Promise.all(
          courseIds.map(async (cid) => {
            const c = await getDocument<CourseDoc>("courses", cid);
            if (c) courseMap[cid] = c;
          })
        );

        setEnrollments(
          enrollmentDocs.map((e) => {
            const course = courseMap[e.courseId];
            const certType = course ? typesMap[course.certificateTypeId] : null;
            const gradeInfo = certType ? getGradeInfo(certType.grade) : { label: "-", color: "bg-gray-500" };
            return {
              id: e.id,
              courseTitle: course?.title ?? "알 수 없는 강의",
              grade: gradeInfo.label,
              gradeColor: gradeInfo.color,
              progress: e.progress,
              courseId: e.courseId,
            };
          })
        );

        // 시험 결과
        const examIds = [...new Set(submissionDocs.map((s) => s.examId))];
        const examMap: Record<string, ExamDoc & { id: string }> = {};
        await Promise.all(
          examIds.map(async (eid) => {
            const ex = await getDocument<ExamDoc>("exams", eid);
            if (ex) examMap[eid] = ex;
          })
        );

        setExamResults(
          submissionDocs.map((s) => {
            const exam = examMap[s.examId];
            const certType = exam ? typesMap[exam.certificateTypeId] : null;
            const gradeInfo = certType ? getGradeInfo(certType.grade) : { label: "-", color: "bg-gray-500" };
            return {
              id: s.id,
              examTitle: exam?.title ?? "알 수 없는 시험",
              grade: gradeInfo.label,
              score: s.score,
              passed: s.passed,
              date: formatTimestamp(s.submittedAt),
              feedback: s.feedback,
            };
          })
        );

        // 인증서
        setCertificates(
          issuanceDocs.map((iss) => {
            const certType = typesMap[iss.certificateTypeId];
            const gradeInfo = certType ? getGradeInfo(certType.grade) : { label: "-", color: "bg-gray-500" };
            const statusInfo = ISSUANCE_STATUS_MAP[iss.status] || { label: iss.status, className: "bg-gray-100 text-gray-600" };
            return {
              id: iss.id,
              grade: gradeInfo.label,
              issueNumber: iss.issueNumber,
              issuedAt: formatTimestamp(iss.issuedAt),
              status: statusInfo.label,
              statusClassName: statusInfo.className,
              method: DELIVERY_METHOD_MAP[iss.deliveryMethod] || iss.deliveryMethod,
              trackingNumber: iss.trackingNumber ?? null,
              pdfUrl: iss.pdfUrl,
            };
          })
        );
        // 실기 제출 현황
        const nowMs = Date.now();
        setPracticals(
          practicalDocs.map((p) => {
            const theme = getThemeById(p.themeId);
            const announceMs = p.announceAt ? new Date(p.announceAt).getTime() : 0;
            const announced = p.status === "GRADED" && nowMs >= announceMs;
            if (announced) {
              return {
                id: p.id,
                themeName: theme?.name ?? p.themeId,
                status: p.passed ? "합격" : "불합격",
                statusClassName: p.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
                detail: `${p.score ?? 0}점${p.feedback ? ` · ${p.feedback}` : ""}`,
                eligible: !!p.passed,
              };
            }
            return {
              id: p.id,
              themeName: theme?.name ?? p.themeId,
              status: "발표 예정",
              statusClassName: "bg-orange-100 text-orange-700",
              detail: `발표: ${formatTimestamp(p.announceAt)} 오후 1시`,
              eligible: false,
            };
          })
        );
        // 1급 앱 실기 제출 현황
        setAppSubs(
          appDocs.map((a) => {
            const theme = getAppThemeById(a.themeId);
            const graded = a.status === "GRADED";
            return {
              id: a.id,
              themeName: theme?.name ?? a.themeId,
              appUrl: a.appUrl,
              status: graded ? (a.passed ? "합격" : "불합격") : "채점 대기",
              statusClassName: graded
                ? a.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                : "bg-orange-100 text-orange-700",
              detail: graded ? `${a.score ?? 0}점${a.feedback ? ` · ${a.feedback}` : ""}` : "관리자 채점 후 발표됩니다.",
              eligible: graded && !!a.passed,
            };
          })
        );

        // 특급 챌린지 제출 현황 (발표일 전에는 점수 비공개)
        setSpecialSubs(
          specialDocs.map((s) => {
            const announceMs = s.announceAt ? new Date(s.announceAt).getTime() : 0;
            const announced = s.status === "GRADED" && nowMs >= announceMs;
            if (announced) {
              return {
                id: s.id, topicTitle: s.topicTitle, appUrl: s.appUrl,
                status: s.passed ? "합격" : "불합격",
                statusClassName: s.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
                detail: `${s.score ?? 0}점${s.feedback ? ` · ${s.feedback}` : ""}`,
                eligible: !!s.passed,
              };
            }
            return {
              id: s.id, topicTitle: s.topicTitle, appUrl: s.appUrl,
              status: "발표 예정", statusClassName: "bg-orange-100 text-orange-700",
              detail: `발표: ${formatTimestamp(s.announceAt)} 오후 1시`,
              eligible: false,
            };
          })
        );

        // 이미 등록한 합격작(sourceSubmissionId) 집합
        try {
          const { getFirebaseAuth } = await import("@/lib/firebase");
          const token = await getFirebaseAuth().currentUser?.getIdToken();
          const res = await fetch("/api/showcase/mine", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const d = await res.json();
            const ids = (d.mine || [])
              .map((m: { sourceSubmissionId?: string }) => m.sourceSubmissionId)
              .filter(Boolean) as string[];
            setRegisteredSubs(new Set(ids));
          }
        } catch {
          /* 무시 */
        }

        // 결제 내역 + 환불/재시험
        setPayments(
          paymentDocs
            .sort((a, b) => {
              const at = a.createdAt?.toDate?.()?.getTime?.() || 0;
              const bt = b.createdAt?.toDate?.()?.getTime?.() || 0;
              return bt - at;
            })
            .map((p) => {
              const isExam = p.type === "EXAM";
              const taken = isExam && p.targetId ? takenExamIds.has(p.targetId) : false;
              return {
                id: p.id,
                type: PAY_TYPE_LABEL[p.type] || p.type,
                itemName: p.itemName || `${PAY_TYPE_LABEL[p.type] || p.type} 결제`,
                amount: p.amount,
                date: formatTimestamp(p.createdAt),
                status: p.status,
                refundStatus: p.refundStatus || "NONE",
                refundKind: p.refundKind ?? null,
                adminRefundNote: p.adminRefundNote ?? null,
                targetId: p.targetId ?? null,
                isExam,
                taken,
                retakeGranted: !!p.retakeGranted,
              };
            })
        );
      } catch (error) {
        console.error("마이페이지 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user, authLoading]);

  // 실기 제출물을 그대로 합격작으로 등록(원클릭)
  const registerShowcase = async (type: "practical" | "app" | "special", submissionId: string) => {
    setRegisteringId(submissionId);
    try {
      const { getFirebaseAuth } = await import("@/lib/firebase");
      const token = await getFirebaseAuth().currentUser?.getIdToken();
      const res = await fetch("/api/showcase/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type, submissionId }),
      });
      const d = await res.json();
      if (!res.ok) { alert(d.error || "합격작 등록에 실패했습니다."); return; }
      setRegisteredSubs((prev) => new Set(prev).add(submissionId));
      alert("합격작으로 등록되었습니다. 합격작 갤러리에 공개됩니다.");
    } catch {
      alert("합격작 등록 중 오류가 발생했습니다.");
    } finally {
      setRegisteringId(null);
    }
  };

  const ShowcaseAction = ({ type, id }: { type: "practical" | "app" | "special"; id: string }) => {
    if (registeredSubs.has(id)) {
      return (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-medium">✅ 합격작 등록됨</span>
          <Link href="/showcase/manage" className="text-xs text-primary hover:underline">관리</Link>
        </div>
      );
    }
    return (
      <button
        onClick={() => registerShowcase(type, id)}
        disabled={registeringId === id}
        className="border border-primary text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/5 transition disabled:opacity-50 whitespace-nowrap"
      >
        {registeringId === id ? "등록 중..." : "🏆 합격작으로 등록"}
      </button>
    );
  };

  const toggleInquiry = async (inq: InquiryRow) => {
    const next = openInquiryId === inq.id ? null : inq.id;
    setOpenInquiryId(next);
    if (next && inq.adminReply) {
      try {
        const { getFirebaseAuth } = await import("@/lib/firebase");
        const token = await getFirebaseAuth().currentUser?.getIdToken();
        fetch("/api/inquiries/mark-read", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ inquiryId: inq.id }),
        });
      } catch {
        /* 무시 */
      }
    }
  };

  const openRefund = (row: PaymentRow, kind: "REFUND" | "CANCEL_BEFORE_EXAM") => {
    setRefundModal({ row, kind });
    setRefundReason("");
    setRefundAgreed(false);
    setRefundError("");
  };

  const submitRefund = async () => {
    if (!refundModal) return;
    if (!refundAgreed) { setRefundError("환불 약정에 동의해주세요."); return; }
    setRefundSubmitting(true);
    setRefundError("");
    try {
      const { getFirebaseAuth } = await import("@/lib/firebase");
      const token = await getFirebaseAuth().currentUser?.getIdToken();
      const res = await fetch("/api/my/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          paymentId: refundModal.row.id,
          reason: refundReason,
          kind: refundModal.kind,
          agreed: refundAgreed,
        }),
      });
      const d = await res.json();
      if (!res.ok) { setRefundError(d.error || "신청 중 오류가 발생했습니다."); return; }
      // 로컬 상태 갱신
      setPayments((prev) =>
        prev.map((p) =>
          p.id === refundModal.row.id
            ? { ...p, refundStatus: "REQUESTED", refundKind: refundModal.kind }
            : p
        )
      );
      setRefundModal(null);
    } catch {
      setRefundError("신청 중 오류가 발생했습니다.");
    } finally {
      setRefundSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">마이페이지</h1>
        <div className="animate-pulse space-y-6">
          <div className="bg-gray-200 rounded-xl h-24" />
          <div className="bg-gray-200 rounded-xl h-32" />
          <div className="bg-gray-200 rounded-xl h-32" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">마이페이지</h1>
        <p className="text-muted-foreground mb-6">로그인이 필요합니다.</p>
        <Link
          href="/auth/login"
          className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition inline-block"
        >
          로그인하기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">마이페이지</h1>

      {/* 사용자 정보 */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
              {(user.displayName || user.email || "?").charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.displayName || "이름 미설정"}</h2>
              <p className="opacity-80">{user.email}</p>
            </div>
          </div>
          <Link
            href="/profile"
            className="bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
          >
            내정보 수정
          </Link>
        </div>
      </div>

      {/* 좌측 메뉴 + 우측 내용 */}
      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        <aside>
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible border border-border rounded-xl p-2 md:sticky md:top-4">
            {TABS.map((t) => {
              const badge = t.key === "inquiries" ? inquiries.filter((i) => i.status === "ANSWERED" && i.adminReply).length : 0;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center justify-between gap-2 text-left px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${activeTab === t.key ? "bg-primary text-white" : "hover:bg-muted text-foreground"}`}
                >
                  {t.label}
                  {t.key === "inquiries" && badge > 0 && (
                    <span className={`text-xs px-1.5 rounded-full ${activeTab === t.key ? "bg-white/30" : "bg-primary/10 text-primary"}`}>{badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        <div>
      {/* 수강 현황 */}
      {activeTab === "courses" && (
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">수강 현황</h2>
        {enrollments.length > 0 ? (
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className={`${enrollment.gradeColor} text-white text-xs px-2 py-0.5 rounded mr-2`}>
                      {enrollment.grade}
                    </span>
                    <span className="font-medium">{enrollment.courseTitle}</span>
                  </div>
                  <Link href={`/courses/${enrollment.courseId}`} className="text-sm text-primary hover:underline">
                    이어서 학습
                  </Link>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${enrollment.progress}%` }} />
                </div>
                <div className="text-sm text-muted-foreground mt-1">진도율: {enrollment.progress}%</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            수강 중인 강의가 없습니다.
            <Link href="/courses" className="text-primary ml-2 hover:underline">강의 둘러보기</Link>
          </div>
        )}
      </section>
      )}

      {/* 시험 결과 */}
      {activeTab === "exams" && (
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">시험 결과 (필기)</h2>
        {examResults.length > 0 ? (
          <div className="space-y-4">
            {examResults.map((result) => (
              <div key={result.id} className="border border-border rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded mr-2 ${result.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {result.passed ? "합격" : "불합격"}
                    </span>
                    <span className="font-medium">{result.examTitle}</span>
                    <div className="text-sm text-muted-foreground mt-1">
                      점수: {result.score ?? "-"}점 | 응시일: {result.date}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {result.passed ? (
                      <Link href="/certificates" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
                        인증서 발급
                      </Link>
                    ) : (
                      <Link href="/inquiries?new=1&category=EXAM" className="border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition">
                        문의하기
                      </Link>
                    )}
                  </div>
                </div>
                {!result.passed && result.feedback && (
                  <div className="text-sm text-red-600 mt-3 bg-red-50 rounded-lg p-3">
                    <span className="font-medium">불합격 사유: </span>{result.feedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">시험 결과가 없습니다.</div>
        )}
      </section>
      )}

      {/* 실기 결과 (2급/1급/특급) */}
      {activeTab === "practical" && (
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">실기 결과</h2>
        {practicals.length === 0 && appSubs.length === 0 && specialSubs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">실기 제출 내역이 없습니다.</div>
        ) : (
        <div className="space-y-8">
        {practicals.length > 0 && (
          <div>
            <h3 className="font-bold mb-3">2급 랜딩페이지</h3>
            <div className="space-y-4">
            {practicals.map((p) => (
              <div key={p.id} className="border border-border rounded-xl p-5 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded mr-2 ${p.statusClassName}`}>{p.status}</span>
                  <span className="font-medium">주제: {p.themeName}</span>
                  <div className="text-sm text-muted-foreground mt-1">{p.detail}</div>
                </div>
                {p.eligible && <ShowcaseAction type="practical" id={p.id} />}
              </div>
            ))}
            </div>
          </div>
        )}

        {appSubs.length > 0 && (
          <div>
            <h3 className="font-bold mb-3">1급 앱 실기</h3>
            <div className="space-y-4">
            {appSubs.map((a) => (
              <div key={a.id} className="border border-border rounded-xl p-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded ${a.statusClassName}`}>{a.status}</span>
                    <span className="font-medium">주제: {a.themeName}</span>
                    <a href={a.appUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">{a.appUrl}</a>
                  </div>
                  {a.eligible && <ShowcaseAction type="app" id={a.id} />}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{a.detail}</div>
              </div>
            ))}
            </div>
          </div>
        )}

        {specialSubs.length > 0 && (
          <div>
            <h3 className="font-bold mb-3">특급 챌린지</h3>
            <div className="space-y-4">
            {specialSubs.map((s) => (
              <div key={s.id} className="border border-border rounded-xl p-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded ${s.statusClassName}`}>{s.status}</span>
                    <span className="font-medium">{s.topicTitle}</span>
                    <a href={s.appUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">{s.appUrl}</a>
                  </div>
                  {s.eligible && <ShowcaseAction type="special" id={s.id} />}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{s.detail}</div>
              </div>
            ))}
            </div>
          </div>
        )}
        </div>
        )}
      </section>
      )}

      {/* 결제 내역 · 환불 */}
      {activeTab === "payments" && (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">결제 내역 · 환불</h2>
          <button
            onClick={() => setRefundModal({ row: { id: "", type: "", itemName: "", amount: 0, date: "", status: "", refundStatus: "NONE", refundKind: null, adminRefundNote: null, targetId: null, isExam: false, taken: false, retakeGranted: false }, kind: "REFUND" })}
            className="text-sm text-primary hover:underline"
          >
            환불 약정 보기
          </button>
        </div>
        {payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((p) => {
              const completed = p.status === "COMPLETED";
              const canAct = completed && (p.refundStatus === "NONE" || p.refundStatus === "REJECTED");
              return (
                <div key={p.id} className="border border-border rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-muted text-foreground text-xs px-2 py-0.5 rounded">{p.type}</span>
                        <span className="font-medium">{p.itemName}</span>
                        {p.status === "REFUNDED" && <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">환불완료</span>}
                        {p.status === "CANCELLED" && <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500">취소됨</span>}
                        {p.refundStatus === "REQUESTED" && <span className="text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-700">환불 검토중</span>}
                        {p.refundStatus === "REJECTED" && p.status === "COMPLETED" && <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-600">환불 거절</span>}
                        {p.retakeGranted && <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">재시험 허용됨</span>}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {p.amount.toLocaleString()}원 · 결제일 {p.date}
                        {p.isExam && completed && (p.taken ? " · 응시 완료" : " · 미응시")}
                      </div>
                      {p.refundStatus === "REJECTED" && p.adminRefundNote && (
                        <div className="text-xs text-red-600 mt-2 bg-red-50 rounded-lg p-2">거절 사유: {p.adminRefundNote}</div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {p.retakeGranted && p.isExam && p.targetId && (
                        <Link
                          href={`/exams/${p.targetId}/take`}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                        >
                          재시험 응시
                        </Link>
                      )}
                      {canAct && p.isExam && !p.taken && (
                        <button
                          onClick={() => openRefund(p, "CANCEL_BEFORE_EXAM")}
                          className="border border-primary text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/5 transition"
                        >
                          시험 취소(전액 환불)
                        </button>
                      )}
                      {canAct && (
                        <button
                          onClick={() => openRefund(p, "REFUND")}
                          className="border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition"
                        >
                          환불 요청
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">결제 내역이 없습니다.</div>
        )}
      </section>
      )}

      {/* 발급된 인증서 */}
      {activeTab === "certificates" && (
      <section>
        <h2 className="text-xl font-bold mb-4">발급된 인증서</h2>
        {certificates.length > 0 ? (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="border border-border rounded-xl p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">{cert.grade}</span>
                    <span className="font-medium">KAIAT 자격증 {cert.grade}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${cert.statusClassName}`}>{cert.status}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    인증번호: {cert.issueNumber} | 수령방법: {cert.method} | 발급일: {cert.issuedAt}
                    {cert.trackingNumber ? ` | 송장번호: ${cert.trackingNumber}` : ""}
                  </div>
                </div>
                <Link href={`/certificates/view/${cert.id}`} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
                  합격증 보기/다운로드
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">발급된 인증서가 없습니다.</div>
        )}
      </section>
      )}

      {/* 내 문의 내역 */}
      {activeTab === "inquiries" && (
      <section>
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h2 className="text-xl font-bold">내 문의 내역</h2>
          <Link href="/inquiries?new=1" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
            새 문의 작성
          </Link>
        </div>
        {inquiries.length > 0 ? (
          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div key={inq.id} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleInquiry(inq)}
                  className="w-full flex items-center justify-between gap-3 p-4 hover:bg-muted/50 text-left"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className={`text-xs px-2 py-1 rounded font-medium whitespace-nowrap ${inq.status === "ANSWERED" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {inq.status === "ANSWERED" ? "답변 완료" : "답변 대기"}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground whitespace-nowrap">
                      {INQUIRY_CATEGORY_MAP[inq.category] || "기타"}
                    </span>
                    <span className="font-medium truncate">{inq.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{inq.createdAt}</span>
                </button>
                {openInquiryId === inq.id && (
                  <div className="border-t border-border p-4 bg-muted/30">
                    <div className="text-sm whitespace-pre-wrap mb-3">{inq.content}</div>
                    {inq.imageUrl && (
                      <a href={inq.imageUrl} target="_blank" rel="noopener noreferrer" className="inline-block mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={inq.imageUrl} alt="첨부 이미지" className="max-h-56 rounded-lg border border-border" />
                      </a>
                    )}
                    {inq.adminReply && (
                      <div className="mt-3 border-t border-border pt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-bold text-primary">관리자 답변</span>
                          <span className="text-xs text-muted-foreground">{inq.adminRepliedAt}</span>
                        </div>
                        <div className="text-sm whitespace-pre-wrap bg-primary/5 p-3 rounded-lg border border-primary/10">{inq.adminReply}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">등록된 문의가 없습니다.</div>
        )}
      </section>
      )}
        </div>
      </div>

      {/* 환불/취소 신청 + 환불 약정 모달 */}
      {refundModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !refundSubmitting && setRefundModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[88vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold">
                {refundModal.row.id === ""
                  ? REFUND_POLICY_TITLE
                  : refundModal.kind === "CANCEL_BEFORE_EXAM"
                    ? "시험 취소(전액 환불) 신청"
                    : "환불 요청"}
              </h3>
              <button
                onClick={() => !refundSubmitting && setRefundModal(null)}
                className="text-muted-foreground hover:text-foreground text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {refundModal.row.id !== "" && (
              <div className="bg-muted rounded-lg p-3 mb-4 text-sm">
                <div className="font-medium">{refundModal.row.itemName}</div>
                <div className="text-muted-foreground">
                  {refundModal.row.amount.toLocaleString()}원 · 결제일 {refundModal.row.date}
                </div>
              </div>
            )}

            {/* 환불 약정 */}
            <div className="border border-border rounded-lg p-4 mb-4 space-y-3 max-h-56 overflow-y-auto bg-gray-50">
              {REFUND_POLICY.map((item) => (
                <div key={item.heading}>
                  <p className="text-sm font-bold">{item.heading}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>

            {refundModal.row.id === "" ? (
              <button
                onClick={() => setRefundModal(null)}
                className="w-full bg-muted py-2.5 rounded-lg text-sm font-medium hover:bg-muted/70 transition"
              >
                닫기
              </button>
            ) : (
              <>
                <label className="block text-sm font-medium mb-1">사유 (선택)</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  rows={2}
                  placeholder="환불/취소 사유를 입력해주세요."
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-3"
                />
                <label className="flex items-start gap-2 text-sm cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={refundAgreed}
                    onChange={(e) => setRefundAgreed(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>{REFUND_AGREE_LABEL}</span>
                </label>
                {refundError && <p className="text-sm text-red-600 mb-2">{refundError}</p>}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={submitRefund}
                    disabled={refundSubmitting || !refundAgreed}
                    className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50"
                  >
                    {refundSubmitting ? "신청 중..." : "신청하기"}
                  </button>
                  <button
                    onClick={() => setRefundModal(null)}
                    disabled={refundSubmitting}
                    className="px-5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition"
                  >
                    취소
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  ※ 실제 환불은 관리자 확인 후 처리되며, 영업일 기준 3~7일이 소요될 수 있습니다.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
