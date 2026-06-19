"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getDocuments, getDocument, where, type ExamDoc, type CertificateTypeDoc, type CertExample, Timestamp } from "@/lib/firestore";
import { getGradeInfo, formatTimestamp, gradeRank } from "@/lib/grade-utils";
import { useAuth } from "@/contexts/auth-context";

export default function ExamsPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState<(ExamDoc & { id: string; isSample?: boolean })[]>([]);
  const [certTypes, setCertTypes] = useState<Record<string, CertificateTypeDoc & { id: string }>>({});
  const [loading, setLoading] = useState(true);
  const [passedCerts, setPassedCerts] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<{ title: string; examples: CertExample[] } | null>(null);
  const [selectedEx, setSelectedEx] = useState<CertExample | null>(null);

  const closeModal = () => { setModal(null); setSelectedEx(null); };

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
          const typeKeys = Object.keys(typesMap);
          const sampleExams: (ExamDoc & { id: string; isSample: boolean })[] = [
            {
              id: "sample-exam-1",
              certificateTypeId: typeKeys[0] || "",
              title: "[샘플] AI 활용 자격증 3급 정기시험",
              description: "AI 기본 활용 능력을 평가하는 3급 자격시험입니다. 40문항 중 25문항이 랜덤으로 출제됩니다.",
              scheduledDate: now,
              registrationStart: now,
              registrationEnd: now,
              duration: 60,
              questionCount: 25,
              maxAttempts: 3,
              isActive: true,
              createdAt: now,
              updatedAt: now,
              isSample: true,
            },
            {
              id: "sample-exam-2",
              certificateTypeId: typeKeys[1] || typeKeys[0] || "",
              title: "[샘플] AI UI 제작 자격증 2급 정기시험",
              description: "AI를 활용한 UI 디자인 및 프론트엔드 구현 능력을 평가합니다. 실기 시험(화면 녹화)으로 진행됩니다.",
              scheduledDate: now,
              registrationStart: now,
              registrationEnd: now,
              duration: 120,
              questionCount: 5,
              maxAttempts: 2,
              isActive: true,
              createdAt: now,
              updatedAt: now,
              isSample: true,
            },
            {
              id: "sample-exam-3",
              certificateTypeId: typeKeys[2] || typeKeys[0] || "",
              title: "[샘플] AI 풀스택 자격증 1급 정기시험",
              description: "UI/UX + 프론트엔드 + 백엔드 API 연동 프로젝트를 제출하고 코드 리뷰를 받습니다.",
              scheduledDate: now,
              registrationStart: now,
              registrationEnd: now,
              duration: 10080,
              questionCount: 3,
              maxAttempts: 1,
              isActive: true,
              createdAt: now,
              updatedAt: now,
              isSample: true,
            },
            {
              id: "sample-exam-4",
              certificateTypeId: typeKeys[3] || typeKeys[0] || "",
              title: "[샘플] AI 문제해결 특급 해커톤",
              description: "실제 비즈니스 문제를 AI로 해결하는 48시간 해커톤 형식의 특급 시험입니다.",
              scheduledDate: now,
              registrationStart: now,
              registrationEnd: now,
              duration: 2880,
              questionCount: 1,
              maxAttempts: 1,
              isActive: true,
              createdAt: now,
              updatedAt: now,
              isSample: true,
            },
          ];
          allExams = [...sampleExams, ...examsData];
        }

        allExams.sort((a, b) => gradeRank(typesMap[a.certificateTypeId]?.grade) - gradeRank(typesMap[b.certificateTypeId]?.grade));
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

  // 로그인 사용자가 합격한 자격증 표시용
  useEffect(() => {
    if (!user) { setPassedCerts(new Set()); return; }
    (async () => {
      try {
        const { getFirebaseAuth } = await import("@/lib/firebase");
        const token = await getFirebaseAuth().currentUser?.getIdToken();
        const res = await fetch("/api/my/passed-certs", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const d = await res.json();
          setPassedCerts(new Set<string>(d.passed || []));
        }
      } catch {
        /* 무시 */
      }
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12">
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
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">시험 신청</h1>
      <p className="text-muted-foreground mb-8">
        원하는 등급의 시험을 선택하고 신청하세요
      </p>

      {exams.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          현재 접수 가능한 시험이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams.map((exam) => {
            const certType = certTypes[exam.certificateTypeId];
            const gradeInfo = certType ? getGradeInfo(certType.grade) : null;
            const price = certType?.price ?? 0;
            const passingScore = certType?.passingScore ?? 70;
            const g = certType?.grade;
            const specialOnly = g === "SPECIAL"; // 특급은 실기 단독(필기 없음)
            const hasWritten = !specialOnly; // 3급·2급·1급은 필기 있음
            const examples = certType?.examples ?? [];
            const isPassed = certType ? passedCerts.has(certType.id) : false;

            return (
              <div
                key={exam.id}
                className={`relative border rounded-xl p-6 hover:shadow-md transition ${isPassed ? "border-amber-300 ring-1 ring-amber-200" : (exam as { isSample?: boolean }).isSample ? "border-dashed border-orange-300" : "border-border"}`}
              >
                {isPassed && (
                  <div className="absolute top-3 right-3 flex flex-col items-center">
                    <Image src="/aiat.png" alt="합격" width={56} height={56} className="w-14 h-14 object-contain drop-shadow" />
                    <span className="mt-0.5 text-[11px] font-bold text-amber-600">합격한 자격증</span>
                  </div>
                )}
                <div className="flex flex-col gap-4 h-full">
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
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">시험 형식</span>
                        <div className="font-medium">
                          {specialOnly ? "실기 (제품 전주기)" : g === "GRADE_2" || g === "GRADE_1" ? "필기 + 실기" : "필기(객관식)"}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">시험 시간</span>
                        <div className="font-medium">{specialOnly ? "제출형" : formatExamDuration(exam.duration)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">합격 기준</span>
                        <div className="font-medium">
                          {specialOnly ? "100점 중 60점 이상" : g === "GRADE_2" || g === "GRADE_1" ? `필기·실기 각 ${passingScore}점` : `${passingScore}점 이상`}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{specialOnly ? "구성" : "필기 문제 수"}</span>
                        <div className="font-medium">{specialOnly ? "실기 단독" : `${exam.questionCount}문항 (랜덤 출제)`}</div>
                      </div>
                    </div>
                    {examples.length > 0 && (
                      <button
                        onClick={() => setModal({ title: exam.title, examples })}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        📄 합격 예시 보기 ({examples.length})
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4 mt-auto">
                    <div>
                      <div className="text-xl font-bold text-primary">
                        {price.toLocaleString()}원
                      </div>
                      <div className="text-xs text-muted-foreground">
                        시험일: {formatTimestamp(exam.scheduledDate)}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                    {hasWritten && (
                      <Link
                        href={`/payment?type=exam&id=${exam.id}`}
                        className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition"
                      >
                        필기 응시
                      </Link>
                    )}
                    {certType?.grade === "GRADE_2" && !(exam as { isSample?: boolean }).isSample && (
                      <Link
                        href={`/exams/${exam.id}/practical`}
                        className="border border-primary text-primary px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/5 transition text-center"
                      >
                        실기 응시 (랜딩페이지)
                      </Link>
                    )}
                    {certType?.grade === "GRADE_1" && !(exam as { isSample?: boolean }).isSample && (
                      <Link
                        href={`/exams/${exam.id}/app-submit`}
                        className="border border-primary text-primary px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/5 transition text-center"
                      >
                        실기 제출 (앱 배포)
                      </Link>
                    )}
                    {certType?.grade === "SPECIAL" && !(exam as { isSample?: boolean }).isSample && (
                      <Link
                        href={`/exams/${exam.id}/challenge`}
                        className="border border-primary text-primary px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/5 transition text-center"
                      >
                        실기 응시 (제품 챌린지)
                      </Link>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 합격 예시 모달 */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {selectedEx && (
                  <button onClick={() => setSelectedEx(null)} className="text-sm text-primary hover:underline">← 목록</button>
                )}
                <div>
                  <h3 className="text-lg font-bold">합격 예시</h3>
                  <p className="text-sm text-muted-foreground">{modal.title}</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground text-xl leading-none">
                ✕
              </button>
            </div>

            {!selectedEx ? (
              // 캡쳐 이미지 그리드 (클릭 시 상세)
              <div className="grid grid-cols-2 gap-3">
                {modal.examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedEx(ex)}
                    className="text-left border border-border rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition"
                  >
                    <div className="h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                      {ex.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ex.imageUrl} alt={ex.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-sm">미리보기 없음</span>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="font-medium text-sm truncate">{ex.title}</div>
                      {ex.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ex.description}</p>}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // 상세: 큰 이미지 + 제목/설명 + 실물 보기 버튼
              <div>
                {selectedEx.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-border mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedEx.imageUrl} alt={selectedEx.title} className="w-full object-contain max-h-[50vh]" />
                  </div>
                )}
                <h4 className="text-lg font-bold mb-1">{selectedEx.title}</h4>
                {selectedEx.description && (
                  <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">{selectedEx.description}</p>
                )}
                {selectedEx.url && (
                  <a
                    href={selectedEx.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition"
                  >
                    작업물 실물 보러가기 ↗
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
