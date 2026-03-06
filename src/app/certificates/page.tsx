"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  getDocuments,
  where,
  type ExamSubmissionDoc,
  type ExamDoc,
  type CertificateIssuanceDoc,
  type CertificateTypeDoc,
  getDocument,
} from "@/lib/firestore";
import { getGradeInfo } from "@/lib/grade-utils";

interface PassedExam {
  examId: string;
  examTitle: string;
  certificateTypeId: string;
  grade: string;
  gradeColor: string;
  alreadyIssued: boolean;
}

export default function CertificatesPage() {
  const { user, loading: authLoading } = useAuth();
  const [passedExams, setPassedExams] = useState<PassedExam[]>([]);
  const [loading, setLoading] = useState(false);
  const [issuing, setIssuing] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"EMAIL" | "MAIL" | "BOTH">("EMAIL");

  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchPassedExams() {
      setLoading(true);
      try {
        const [submissions, issuances, certTypes] = await Promise.all([
          getDocuments<ExamSubmissionDoc>("examSubmissions", where("userId", "==", user!.uid), where("passed", "==", true)),
          getDocuments<CertificateIssuanceDoc>("certificateIssuances", where("userId", "==", user!.uid)),
          getDocuments<CertificateTypeDoc>("certificateTypes"),
        ]);

        const typesMap: Record<string, CertificateTypeDoc & { id: string }> = {};
        certTypes.forEach((t) => { typesMap[t.id] = t; });

        const issuedTypeIds = new Set(issuances.map((i) => i.certificateTypeId));

        const examIds = [...new Set(submissions.map((s) => s.examId))];
        const examsData: PassedExam[] = [];

        for (const examId of examIds) {
          const exam = await getDocument<ExamDoc>("exams", examId);
          if (!exam) continue;
          const certType = typesMap[exam.certificateTypeId];
          if (!certType) continue;
          const gradeInfo = getGradeInfo(certType.grade);

          examsData.push({
            examId,
            examTitle: exam.title,
            certificateTypeId: exam.certificateTypeId,
            grade: gradeInfo.label,
            gradeColor: gradeInfo.color,
            alreadyIssued: issuedTypeIds.has(exam.certificateTypeId),
          });
        }

        setPassedExams(examsData);
      } catch (error) {
        console.error("합격 시험 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPassedExams();
  }, [user, authLoading]);

  const handleIssue = async (certificateTypeId: string) => {
    if (!user) return;
    setIssuing(certificateTypeId);
    try {
      const { getFirebaseAuth } = await import("@/lib/firebase");
      const token = await getFirebaseAuth().currentUser?.getIdToken();
      const res = await fetch("/api/certificates/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ certificateTypeId, deliveryMethod }),
      });

      if (res.ok) {
        alert("인증서 발급이 신청되었습니다!");
        setPassedExams((prev) =>
          prev.map((e) =>
            e.certificateTypeId === certificateTypeId ? { ...e, alreadyIssued: true } : e
          )
        );
      } else {
        const data = await res.json();
        alert(data.error || "발급 신청에 실패했습니다.");
      }
    } catch {
      alert("발급 신청 중 오류가 발생했습니다.");
    } finally {
      setIssuing(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">인증서 발급</h1>
      <p className="text-muted-foreground mb-8">
        시험 합격 후 디지털 또는 실물 인증서를 발급받으세요
      </p>

      {/* 발급 방법 안내 */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-border rounded-xl p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2">디지털 인증서 (이메일)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            PDF 형식의 디지털 인증서를 이메일로 발급받습니다. 직인과 QR 코드가 포함되어 진위 확인이 가능합니다.
          </p>
          <ul className="text-sm space-y-1 text-muted-foreground mb-4">
            <li>- 발급 즉시 이메일 수신</li>
            <li>- PDF 다운로드 가능</li>
            <li>- QR 코드 진위 확인</li>
            <li>- 고유 인증번호 부여</li>
          </ul>
          <div className="text-xl font-bold text-primary">10,000원</div>
        </div>

        <div className="border border-border rounded-xl p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2">실물 인증서 (우편 배송)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            고급 용지에 인쇄된 실물 인증서를 우편으로 배송합니다. 직인이 찍힌 공식 인증서입니다.
          </p>
          <ul className="text-sm space-y-1 text-muted-foreground mb-4">
            <li>- 고급 용지 인쇄</li>
            <li>- 직인 날인</li>
            <li>- 등기우편 배송 (3~5영업일)</li>
            <li>- 배송 추적 가능</li>
          </ul>
          <div className="text-xl font-bold text-primary">50,000원</div>
        </div>
      </div>

      {/* 인증서 발급 신청 */}
      {!authLoading && user ? (
        <div className="bg-muted rounded-xl p-8 mb-12">
          <h2 className="text-xl font-bold mb-4">인증서 발급 신청</h2>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
          ) : passedExams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              합격한 시험이 없습니다. 시험에 합격한 후 인증서를 발급받을 수 있습니다.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">발급 방법 선택</label>
                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value as "EMAIL" | "MAIL" | "BOTH")}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="EMAIL">디지털 (이메일) - 10,000원</option>
                  <option value="MAIL">실물 (우편) - 50,000원</option>
                  <option value="BOTH">디지털 + 실물 - 55,000원</option>
                </select>
              </div>

              {passedExams.map((exam) => (
                <div key={exam.certificateTypeId} className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
                  <div>
                    <span className={`${exam.gradeColor} text-white text-xs px-2 py-0.5 rounded mr-2`}>
                      {exam.grade}
                    </span>
                    <span className="font-medium">{exam.examTitle}</span>
                  </div>
                  {exam.alreadyIssued ? (
                    <span className="text-sm text-green-600 font-medium">발급 완료</span>
                  ) : (
                    <button
                      onClick={() => handleIssue(exam.certificateTypeId)}
                      disabled={issuing === exam.certificateTypeId}
                      className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50"
                    >
                      {issuing === exam.certificateTypeId ? "신청 중..." : "발급 신청"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-muted rounded-xl p-8 text-center mb-12">
          <h2 className="text-xl font-bold mb-2">인증서 발급 신청</h2>
          <p className="text-muted-foreground mb-6">
            로그인 후 합격한 시험의 인증서를 발급받을 수 있습니다.
          </p>
          <Link
            href="/auth/login"
            className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition inline-block"
          >
            로그인하여 신청하기
          </Link>
        </div>
      )}

      {/* 인증서 진위 확인 */}
      <div className="border-t border-border pt-8">
        <h2 className="text-xl font-bold mb-4">인증서 진위 확인</h2>
        <p className="text-sm text-muted-foreground mb-4">
          인증서에 기재된 인증번호를 입력하여 진위 여부를 확인할 수 있습니다.
        </p>
        <div className="flex gap-3 max-w-md">
          <input
            type="text"
            placeholder="인증번호 입력 (예: CRN-2026-A1B2C3)"
            className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Link
            href="/certificates/verify"
            className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition whitespace-nowrap"
          >
            확인
          </Link>
        </div>
      </div>
    </div>
  );
}
