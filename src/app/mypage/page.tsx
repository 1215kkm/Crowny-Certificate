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
} from "@/lib/firestore";
import { getGradeInfo, formatTimestamp, ISSUANCE_STATUS_MAP } from "@/lib/grade-utils";

export default function MyPage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<{ id: string; courseTitle: string; grade: string; gradeColor: string; progress: number; courseId: string }[]>([]);
  const [examResults, setExamResults] = useState<{ id: string; examTitle: string; grade: string; score: number | null; passed: boolean | null; date: string; feedback: string | null }[]>([]);
  const [certificates, setCertificates] = useState<{ id: string; grade: string; issueNumber: string; issuedAt: string; status: string; pdfUrl: string | null }[]>([]);

  useEffect(() => {
    if (authLoading || !user) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const [enrollmentDocs, submissionDocs, issuanceDocs, certTypeDocs] = await Promise.all([
          getDocuments<EnrollmentDoc>("enrollments", where("userId", "==", user!.uid)),
          getDocuments<ExamSubmissionDoc>("examSubmissions", where("userId", "==", user!.uid)),
          getDocuments<CertificateIssuanceDoc>("certificateIssuances", where("userId", "==", user!.uid)),
          getDocuments<CertificateTypeDoc>("certificateTypes"),
        ]);

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
            const statusInfo = ISSUANCE_STATUS_MAP[iss.status] || { label: iss.status, className: "" };
            return {
              id: iss.id,
              grade: gradeInfo.label,
              issueNumber: iss.issueNumber,
              issuedAt: formatTimestamp(iss.issuedAt),
              status: statusInfo.label,
              pdfUrl: iss.pdfUrl,
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

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
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
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">마이페이지</h1>

      {/* 사용자 정보 */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
            {(user.displayName || user.email || "?").charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.displayName || "이름 미설정"}</h2>
            <p className="opacity-80">{user.email}</p>
          </div>
        </div>
      </div>

      {/* 수강 현황 */}
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

      {/* 시험 결과 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">시험 결과</h2>
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
                  {result.passed && (
                    <Link href="/certificates" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
                      인증서 발급
                    </Link>
                  )}
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

      {/* 발급된 인증서 */}
      <section>
        <h2 className="text-xl font-bold mb-4">발급된 인증서</h2>
        {certificates.length > 0 ? (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="border border-border rounded-xl p-5 flex items-center justify-between">
                <div>
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded mr-2">{cert.grade}</span>
                  <span className="font-medium">Crowny AI 활용 자격증 {cert.grade}</span>
                  <div className="text-sm text-muted-foreground mt-1">
                    인증번호: {cert.issueNumber} | 발급일: {cert.issuedAt} | {cert.status}
                  </div>
                </div>
                {cert.pdfUrl ? (
                  <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer" className="border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition">
                    PDF 다운로드
                  </a>
                ) : (
                  <button disabled className="border border-border px-4 py-2 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
                    PDF 준비 중
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">발급된 인증서가 없습니다.</div>
        )}
      </section>
    </div>
  );
}
