"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDocuments, getDocument, where, type ExamDoc, type CertificateTypeDoc, Timestamp } from "@/lib/firestore";
import { getGradeInfo, formatTimestamp } from "@/lib/grade-utils";

export default function ExamsPage() {
  const [exams, setExams] = useState<(ExamDoc & { id: string; isSample?: boolean })[]>([]);
  const [certTypes, setCertTypes] = useState<Record<string, CertificateTypeDoc & { id: string }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [examsData, typesData] = await Promise.all([
          getDocuments<ExamDoc>("exams", where("isActive", "==", true)),
          getDocuments<CertificateTypeDoc>("certificateTypes"),
        ]);

        const typesMap: Record<string, CertificateTypeDoc & { id: string }> = {};
        typesData.forEach((t) => { typesMap[t.id] = t; });

        // 샘플 데이터 설정 확인
        const settings = await getDocument<{ showSampleData: boolean }>("settings", "site");
        let allExams: (ExamDoc & { id: string; isSample?: boolean })[] = examsData;

        if (settings?.showSampleData && examsData.length === 0) {
          const now = Timestamp.now();
          const sampleExams: (ExamDoc & { id: string; isSample: boolean })[] = [
            {
              id: "sample-exam-1",
              certificateTypeId: Object.keys(typesMap)[0] || "",
              title: "[샘플] AI 활용 자격증 3급 정기시험",
              description: "AI 기본 활용 능력을 평가하는 3급 자격시험입니다.",
              scheduledDate: now,
              registrationStart: now,
              registrationEnd: now,
              duration: 60,
              questionCount: 30,
              maxAttempts: 3,
              isActive: true,
              createdAt: now,
              updatedAt: now,
              isSample: true,
            },
          ];
          allExams = [...sampleExams, ...examsData];
        }

        setExams(allExams);
        setCertTypes(typesMap);
      } catch (error) {
        console.error("시험 목록 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">시험 신청</h1>
        <p className="text-muted-foreground mb-8">원하는 등급의 시험을 선택하고 신청하세요</p>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-10 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formatExamDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}분`;
    if (minutes < 1440) return `${Math.round(minutes / 60)}시간`;
    return `${Math.round(minutes / 1440)}일`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">시험 신청</h1>
      <p className="text-muted-foreground mb-8">
        원하는 등급의 시험을 선택하고 신청하세요
      </p>

      {exams.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          현재 접수 가능한 시험이 없습니다.
        </div>
      ) : (
        <div className="space-y-6">
          {exams.map((exam) => {
            const certType = certTypes[exam.certificateTypeId];
            const gradeInfo = certType ? getGradeInfo(certType.grade) : null;
            const price = certType?.price ?? 0;
            const passingScore = certType?.passingScore ?? 70;

            return (
              <div
                key={exam.id}
                className={`border rounded-xl p-6 hover:shadow-md transition ${(exam as { isSample?: boolean }).isSample ? "border-dashed border-orange-300" : "border-border"}`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {(exam as { isSample?: boolean }).isSample && (
                        <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded font-medium">샘플</span>
                      )}
                      {gradeInfo && (
                        <span className={`${gradeInfo.color} text-white text-xs px-2 py-1 rounded font-medium`}>
                          {gradeInfo.label}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        접수마감: {formatTimestamp(exam.registrationEnd)}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold mb-3">{exam.title}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">시험 형식</span>
                        <div className="font-medium">{certType?.examFormat === "MULTIPLE_CHOICE" ? "객관식" : certType?.examFormat === "PRACTICAL" ? "실기" : certType?.examFormat === "PROJECT" ? "프로젝트" : "해커톤"}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">시험 시간</span>
                        <div className="font-medium">{formatExamDuration(exam.duration)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">합격 기준</span>
                        <div className="font-medium">{passingScore}점 이상</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">문제 수</span>
                        <div className="font-medium">{exam.questionCount}문항</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-xl font-bold text-primary">
                      {price.toLocaleString()}원
                    </div>
                    <div className="text-xs text-muted-foreground">
                      시험일: {formatTimestamp(exam.scheduledDate)}
                    </div>
                    <Link
                      href={`/payment?type=exam&id=${exam.id}`}
                      className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition"
                    >
                      시험 신청하기
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
