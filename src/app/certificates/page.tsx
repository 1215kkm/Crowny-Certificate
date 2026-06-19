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
import { getGradeInfo, gradeRank, ISSUANCE_STATUS_MAP, DELIVERY_METHOD_MAP } from "@/lib/grade-utils";
import { Mail, Truck, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const CERT_PRICES = {
  EMAIL: 35000,
  BOTH: 55000,
  REISSUE: 19000,
};

interface MailingInfo {
  recipientName: string;
  recipientPhone: string;
  mailingZipCode: string;
  mailingAddress: string;
}

const EMPTY_MAILING: MailingInfo = {
  recipientName: "",
  recipientPhone: "",
  mailingZipCode: "",
  mailingAddress: "",
};

interface PassedExam {
  examId: string;
  examTitle: string;
  certificateTypeId: string;
  grade: string;
  gradeLabel: string;
  gradeColor: string;
  existingIssuance: (CertificateIssuanceDoc & { id: string }) | null;
}

export default function CertificatesPage() {
  const { user, loading: authLoading } = useAuth();
  const [passedExams, setPassedExams] = useState<PassedExam[]>([]);
  const [loading, setLoading] = useState(false);
  const [issuing, setIssuing] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<Record<string, "EMAIL" | "BOTH">>({});
  const [mailingInfo, setMailingInfo] = useState<Record<string, MailingInfo>>({});

  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchPassedExams() {
      setLoading(true);
      try {
        const [submissions, issuances, certTypes] = await Promise.all([
          getDocuments<ExamSubmissionDoc>(
            "examSubmissions",
            where("userId", "==", user!.uid),
            where("passed", "==", true)
          ),
          getDocuments<CertificateIssuanceDoc>(
            "certificateIssuances",
            where("userId", "==", user!.uid)
          ),
          getDocuments<CertificateTypeDoc>("certificateTypes"),
        ]);

        const typesMap: Record<string, CertificateTypeDoc & { id: string }> = {};
        certTypes.forEach((t) => {
          typesMap[t.id] = t;
        });

        const issuanceMap: Record<string, CertificateIssuanceDoc & { id: string }> = {};
        issuances.forEach((i) => {
          issuanceMap[i.certificateTypeId] = i;
        });

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
            grade: certType.grade,
            gradeLabel: gradeInfo.label,
            gradeColor: gradeInfo.color,
            existingIssuance: issuanceMap[exam.certificateTypeId] || null,
          });
        }

        examsData.sort((a, b) => gradeRank(a.grade) - gradeRank(b.grade));
        setPassedExams(examsData);
      } catch (error) {
        console.error("합격 시험 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPassedExams();
  }, [user, authLoading]);

  const getMethodForExam = (certTypeId: string) =>
    selectedMethod[certTypeId] || "EMAIL";

  const getMailing = (certTypeId: string) =>
    mailingInfo[certTypeId] || EMPTY_MAILING;

  const getPrice = (certTypeId: string, isReissue: boolean) => {
    if (isReissue) return CERT_PRICES.REISSUE;
    const method = getMethodForExam(certTypeId);
    return method === "EMAIL" ? CERT_PRICES.EMAIL : CERT_PRICES.BOTH;
  };

  const handleIssue = async (certificateTypeId: string, isReissue: boolean) => {
    if (!user) return;
    const method = getMethodForExam(certificateTypeId);
    const price = getPrice(certificateTypeId, isReissue);
    const mailing = getMailing(certificateTypeId);

    // 우편(이메일+우편) 선택 시 배송지 정보 필수
    if (method === "BOTH") {
      if (
        !mailing.recipientName.trim() ||
        !mailing.recipientPhone.trim() ||
        !mailing.mailingAddress.trim()
      ) {
        alert("우편 수령을 위해 받는 분 이름, 연락처, 주소를 모두 입력해주세요.");
        return;
      }
    }

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
        body: JSON.stringify({
          certificateTypeId,
          deliveryMethod: method,
          price,
          isReissue,
          ...(method === "BOTH"
            ? {
                recipientName: mailing.recipientName.trim(),
                recipientPhone: mailing.recipientPhone.trim(),
                mailingZipCode: mailing.mailingZipCode.trim(),
                mailingAddress: mailing.mailingAddress.trim(),
              }
            : {}),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // 발급 즉시 합격증 보기/다운로드 페이지로 이동 (이메일 발송 대신 바로 다운로드)
        if (data.issuanceId) {
          window.location.href = `/certificates/view/${data.issuanceId}`;
          return;
        }
        alert("발급이 완료되었습니다.");
        window.location.reload();
      } else {
        alert(data.error || "발급 신청에 실패했습니다.");
      }
    } catch {
      alert("발급 신청 중 오류가 발생했습니다.");
    } finally {
      setIssuing(null);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">자격증 발급</h1>
          <p className="text-muted-foreground">
            시험 합격 후 공식 자격증을 발급받으세요
          </p>
        </div>
        <Link
          href="/showcase/manage"
          className="inline-flex items-center gap-2 border border-primary text-primary px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/5 transition whitespace-nowrap"
        >
          🏆 내 합격작 등록/관리
        </Link>
      </div>

      {/* 발급 방법 안내 */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-border rounded-2xl p-6 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold">이메일로만 받기</h3>
              <div className="text-2xl font-bold text-primary">
                {CERT_PRICES.EMAIL.toLocaleString()}원
              </div>
            </div>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li>• PDF 디지털 자격증 이메일 발송</li>
            <li>• 직인 + QR코드 진위 확인 포함</li>
            <li>• 발급 즉시 이메일 수신</li>
            <li className="text-orange-600 font-medium">
              • 사이트에서 1개월간 보관 후 자동 삭제
            </li>
            <li className="text-muted-foreground">
              • 재발급 시 {CERT_PRICES.REISSUE.toLocaleString()}원
            </li>
          </ul>
        </div>

        <div className="border border-border rounded-2xl p-6 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold">이메일+우편으로 받기</h3>
              <div className="text-2xl font-bold text-primary">
                {CERT_PRICES.BOTH.toLocaleString()}원
              </div>
            </div>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li>• 이메일 PDF + 고급 용지 실물 자격증 우편 배송</li>
            <li>• 직인 날인 공식 인증서</li>
            <li>• 등기우편 배송 (3~5영업일)</li>
            <li>• 배송 추적 가능 (받는 주소 입력 필요)</li>
            <li className="text-muted-foreground">
              • 재발급 시 {CERT_PRICES.REISSUE.toLocaleString()}원 + 배송비
            </li>
          </ul>
        </div>
      </div>

      {/* 인증서 발급 신청 */}
      {!authLoading && user ? (
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">발급 신청</h2>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              로딩 중...
            </div>
          ) : passedExams.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-12 text-center">
              <div className="text-muted-foreground mb-4">
                합격한 시험이 없습니다.
              </div>
              <p className="text-muted-foreground mb-6">
                시험에 합격한 후 자격증을 발급받을 수 있습니다.
              </p>
              <Link
                href="/exams"
                className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition inline-block"
              >
                시험 신청하기
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {passedExams.map((exam) => {
                const isReissue = !!exam.existingIssuance;
                const method = getMethodForExam(exam.certificateTypeId);
                const price = getPrice(exam.certificateTypeId, isReissue);
                const issuance = exam.existingIssuance;

                return (
                  <div
                    key={exam.certificateTypeId}
                    className="bg-white border border-border rounded-2xl p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`${exam.gradeColor} text-white px-2 py-0.5 rounded font-medium`}
                          >
                            {exam.gradeLabel}
                          </span>
                          <span className="font-bold">{exam.examTitle}</span>
                        </div>

                        {/* 기존 발급 정보 */}
                        {issuance && (
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-muted-foreground">
                            {(() => {
                              const st = ISSUANCE_STATUS_MAP[issuance.status] || {
                                label: issuance.status,
                                className: "",
                              };
                              const done =
                                issuance.status === "CONFIRMED" ||
                                issuance.status === "DELIVERED";
                              return (
                                <span
                                  className={`flex items-center gap-1 ${done ? "text-green-600" : issuance.status === "SHIPPING" ? "text-blue-600" : "text-orange-600"}`}
                                >
                                  {done ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <Clock className="w-4 h-4" />
                                  )}
                                  {st.label}
                                </span>
                              );
                            })()}
                            <span>
                              수령방법:{" "}
                              {DELIVERY_METHOD_MAP[issuance.deliveryMethod] ||
                                issuance.deliveryMethod}
                            </span>
                            <span>발급번호: {issuance.issueNumber}</span>
                            <Link href={`/certificates/view/${issuance.id}`} className="text-primary font-medium hover:underline">
                              합격증 보기/다운로드
                            </Link>
                            <span className="flex items-center gap-1 text-orange-500">
                              <AlertTriangle className="w-4 h-4" />
                              1개월간 보관
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {/* 발급 방법 선택 */}
                        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                          <button
                            onClick={() =>
                              setSelectedMethod((prev) => ({
                                ...prev,
                                [exam.certificateTypeId]: "EMAIL",
                              }))
                            }
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition ${
                              method === "EMAIL"
                                ? "bg-white shadow-sm text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            <Mail className="w-4 h-4" />
                            이메일로만
                          </button>
                          <button
                            onClick={() =>
                              setSelectedMethod((prev) => ({
                                ...prev,
                                [exam.certificateTypeId]: "BOTH",
                              }))
                            }
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition ${
                              method === "BOTH"
                                ? "bg-white shadow-sm text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            <Truck className="w-4 h-4" />
                            이메일+우편
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {price.toLocaleString()}원
                          </div>
                          {isReissue && (
                            <div className="text-orange-600 font-medium">
                              재발급
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            handleIssue(exam.certificateTypeId, isReissue)
                          }
                          disabled={issuing === exam.certificateTypeId}
                          className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-dark transition disabled:opacity-50 whitespace-nowrap"
                        >
                          {issuing === exam.certificateTypeId
                            ? "처리 중..."
                            : isReissue
                              ? "재발급 신청"
                              : "결제 및 발급"}
                        </button>
                      </div>
                    </div>

                    {/* 우편 수령 시 배송지 입력 */}
                    {method === "BOTH" && (
                      <div className="mt-5 border-t border-border pt-5">
                        <h4 className="font-bold mb-1 flex items-center gap-2">
                          <Truck className="w-4 h-4 text-purple-600" />
                          받는 주소 입력
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          실물 자격증을 우편으로 받으실 주소를 입력해주세요.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">받는 분 이름</label>
                            <input
                              value={getMailing(exam.certificateTypeId).recipientName}
                              onChange={(e) =>
                                setMailingInfo((prev) => ({
                                  ...prev,
                                  [exam.certificateTypeId]: {
                                    ...getMailing(exam.certificateTypeId),
                                    recipientName: e.target.value,
                                  },
                                }))
                              }
                              placeholder="홍길동"
                              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">연락처</label>
                            <input
                              value={getMailing(exam.certificateTypeId).recipientPhone}
                              onChange={(e) =>
                                setMailingInfo((prev) => ({
                                  ...prev,
                                  [exam.certificateTypeId]: {
                                    ...getMailing(exam.certificateTypeId),
                                    recipientPhone: e.target.value,
                                  },
                                }))
                              }
                              placeholder="010-0000-0000"
                              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">우편번호</label>
                            <input
                              value={getMailing(exam.certificateTypeId).mailingZipCode}
                              onChange={(e) =>
                                setMailingInfo((prev) => ({
                                  ...prev,
                                  [exam.certificateTypeId]: {
                                    ...getMailing(exam.certificateTypeId),
                                    mailingZipCode: e.target.value,
                                  },
                                }))
                              }
                              placeholder="00000"
                              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">주소</label>
                            <input
                              value={getMailing(exam.certificateTypeId).mailingAddress}
                              onChange={(e) =>
                                setMailingInfo((prev) => ({
                                  ...prev,
                                  [exam.certificateTypeId]: {
                                    ...getMailing(exam.certificateTypeId),
                                    mailingAddress: e.target.value,
                                  },
                                }))
                              }
                              placeholder="도로명 주소, 상세주소"
                              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-12 text-center mb-12">
          <h2 className="text-xl font-bold mb-2">자격증 발급 신청</h2>
          <p className="text-muted-foreground mb-6">
            로그인 후 합격한 시험의 자격증을 발급받을 수 있습니다.
          </p>
          <Link
            href="/auth/login"
            className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-dark transition inline-block"
          >
            로그인하여 신청하기
          </Link>
        </div>
      )}

      {/* 요금 안내 */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-12">
        <h3 className="font-bold mb-4">💰 요금 안내</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-border">
            <div className="font-medium mb-1">이메일로만 받기</div>
            <div className="text-2xl font-bold text-primary">
              {CERT_PRICES.EMAIL.toLocaleString()}원
            </div>
            <div className="text-muted-foreground mt-1">
              사이트 1개월 보관
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-border">
            <div className="font-medium mb-1">이메일+우편 받기</div>
            <div className="text-2xl font-bold text-primary">
              {CERT_PRICES.BOTH.toLocaleString()}원
            </div>
            <div className="text-muted-foreground mt-1">
              등기우편 3~5영업일
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-border">
            <div className="font-medium mb-1">재발급</div>
            <div className="text-2xl font-bold text-primary">
              {CERT_PRICES.REISSUE.toLocaleString()}원
            </div>
            <div className="text-muted-foreground mt-1">
              이메일/우편 동일
            </div>
          </div>
        </div>
      </div>

      {/* 인증서 진위 확인 */}
      <div className="border-t border-border pt-8">
        <h2 className="text-xl font-bold mb-4">자격증 진위 확인</h2>
        <p className="text-muted-foreground mb-4">
          자격증에 기재된 인증번호를 입력하여 진위 여부를 확인할 수 있습니다.
        </p>
        <div className="flex gap-3 max-w-md">
          <input
            type="text"
            placeholder="인증번호 입력 (예: CRN-2026-A1B2C3)"
            className="flex-1 px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Link
            href="/certificates/verify"
            className="bg-gray-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-900 transition whitespace-nowrap"
          >
            확인
          </Link>
        </div>
      </div>
    </div>
  );
}
