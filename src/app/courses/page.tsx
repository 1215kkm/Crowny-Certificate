"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDocuments, getDocument, where, type CourseDoc, type CertificateTypeDoc, Timestamp } from "@/lib/firestore";
import { getGradeInfo, gradeRank, getGradeThumb } from "@/lib/grade-utils";

// 관리자가 합격기준을 비워둔 경우 등급 기반 기본 문구
function defaultCriteria(certType?: CertificateTypeDoc & { id: string }): string {
  if (!certType) return "";
  const s = certType.passingScore ?? 70;
  switch (certType.grade) {
    case "SPECIAL":
      return `제품 챌린지(실기 단독) 100점 만점 중 ${s}점 이상 시 합격합니다.`;
    case "GRADE_2":
    case "GRADE_1":
      return `필기와 실기를 각각 ${s}점 이상 받아야 합격합니다. (두 영역 모두 충족 필요)`;
    default:
      return `필기(객관식) ${s}점 이상 시 합격합니다.`;
  }
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<(CourseDoc & { id: string; isSample?: boolean })[]>([]);
  const [certTypes, setCertTypes] = useState<Record<string, CertificateTypeDoc & { id: string }>>({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    gradeLabel: string;
    thumb: string | null;
    name: string;
    competencies: string;
    criteria: string;
  } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesData, typesData] = await Promise.all([
          getDocuments<CourseDoc>("courses", where("isPublished", "==", true)),
          getDocuments<CertificateTypeDoc>("certificateTypes"),
        ]);

        const typesMap: Record<string, CertificateTypeDoc & { id: string }> = {};
        typesData.forEach((t) => { typesMap[t.id] = t; });

        // 샘플 데이터 설정 확인
        const settings = await getDocument<{ showSampleData: boolean }>("settings", "site");
        let allCourses: (CourseDoc & { id: string; isSample?: boolean })[] = coursesData;

        if (settings?.showSampleData && coursesData.length === 0) {
          const now = Timestamp.now();
          const typeKeys = Object.keys(typesMap);
          const sampleCourses: (CourseDoc & { id: string; isSample: boolean })[] = [
            {
              id: "sample-1",
              title: "[샘플] AI 기초 활용 과정 - 3급 대비",
              description: "AI 도구의 기본 사용법을 배우고 실무에 적용하는 방법을 학습합니다. ChatGPT, Claude 등 주요 AI 서비스 활용법을 다룹니다.",
              thumbnailUrl: null,
              certificateTypeId: typeKeys[0] || "",
              totalDuration: 1800,
              lessonCount: 12,
              isPublished: true,
              createdAt: now,
              updatedAt: now,
              isSample: true,
            },
            {
              id: "sample-2",
              title: "[샘플] AI UI 제작 과정 - 2급 대비",
              description: "프롬프트 엔지니어링과 AI를 활용한 UI/UX 디자인 및 프론트엔드 구현 능력을 키웁니다.",
              thumbnailUrl: null,
              certificateTypeId: typeKeys[1] || typeKeys[0] || "",
              totalDuration: 3600,
              lessonCount: 24,
              isPublished: true,
              createdAt: now,
              updatedAt: now,
              isSample: true,
            },
            {
              id: "sample-3",
              title: "[샘플] AI 풀스택 개발 과정 - 1급 대비",
              description: "AI를 활용한 풀스택 웹 애플리케이션 개발. UI/UX부터 백엔드 API 연동까지 전 과정을 학습합니다.",
              thumbnailUrl: null,
              certificateTypeId: typeKeys[2] || typeKeys[0] || "",
              totalDuration: 5400,
              lessonCount: 36,
              isPublished: true,
              createdAt: now,
              updatedAt: now,
              isSample: true,
            },
            {
              id: "sample-4",
              title: "[샘플] AI 문제해결 마스터 과정 - 특급 대비",
              description: "실제 비즈니스 문제를 AI로 해결하는 고급 솔루션 설계. 해커톤 형식의 실전 프로젝트를 수행합니다.",
              thumbnailUrl: null,
              certificateTypeId: typeKeys[3] || typeKeys[0] || "",
              totalDuration: 7200,
              lessonCount: 48,
              isPublished: true,
              createdAt: now,
              updatedAt: now,
              isSample: true,
            },
          ];
          allCourses = [...sampleCourses, ...coursesData];
        }

        allCourses.sort((a, b) => gradeRank(typesMap[a.certificateTypeId]?.grade) - gradeRank(typesMap[b.certificateTypeId]?.grade));
        setCourses(allCourses);
        setCertTypes(typesMap);
      } catch (error) {
        console.error("강의 목록 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">강의 목록</h1>
        <p className="text-muted-foreground mb-8">등급별 맞춤 강의로 AI 활용 역량을 키우세요</p>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden animate-pulse">
              <div className="bg-gray-200 h-48" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-6 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">강의 목록</h1>
      <p className="text-muted-foreground mb-8">
        등급별 맞춤 강의로 AI 활용 역량을 키우세요
      </p>

      {courses.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          현재 등록된 강의가 없습니다.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const certType = certTypes[course.certificateTypeId];
            const gradeInfo = certType ? getGradeInfo(certType.grade) : null;
            const price = certType?.coursePrice ?? 0;
            const thumb = course.thumbnailUrl || (certType ? getGradeThumb(certType.grade) : null);

            return (
              <div
                key={course.id}
                className={`border rounded-xl overflow-hidden hover:shadow-lg transition ${(course as { isSample?: boolean }).isSample ? "border-dashed border-orange-300" : "border-border"}`}
              >
                <div className="bg-gray-100 h-48 flex items-center justify-center">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-lg">강의 썸네일</span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {(course as { isSample?: boolean }).isSample && (
                      <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded font-medium">샘플</span>
                    )}
                    {gradeInfo && (
                      <span className={`${gradeInfo.color} text-white text-xs px-2 py-1 rounded font-medium`}>
                        {gradeInfo.label}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {course.lessonCount}강 | {Math.round(course.totalDuration / 60)}시간
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xl font-bold text-primary">
                      {price.toLocaleString()}원
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setModal({
                            gradeLabel: gradeInfo?.label ?? "",
                            thumb,
                            name: certType?.name ?? course.title,
                            competencies: certType?.competencies?.trim() || "",
                            criteria: certType?.passingCriteria?.trim() || defaultCriteria(certType),
                          })
                        }
                        className="border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition"
                      >
                        합격기준
                      </button>
                      <Link
                        href={`/courses/${course.id}`}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition"
                      >
                        수강 신청
                      </Link>
                    </div>
                  </div>
                  {/* 3급 강의는 학습 페이지(강의+예제시험)가 준비되어 있어 바로 진입 가능 */}
                  {course.id === "sample-1" && (
                    <Link
                      href="/courses/grade-3/learn"
                      className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-gradient-brand text-white text-sm font-semibold hover:opacity-90 transition"
                    >
                      학습 시작
                      <span aria-hidden>→</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 합격기준 모달 */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상단 썸네일 */}
            <div className="relative bg-gray-100 h-44 flex items-center justify-center rounded-t-2xl overflow-hidden">
              {modal.thumb ? (
                <img src={modal.thumb} alt={modal.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">썸네일</span>
              )}
              <button
                onClick={() => setModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {modal.gradeLabel && (
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded font-medium">
                    {modal.gradeLabel}
                  </span>
                )}
                <h3 className="text-lg font-bold">{modal.name}</h3>
              </div>

              <div className="mb-5">
                <h4 className="text-sm font-bold text-primary mb-1">이 시험을 통해 키우려는 역량</h4>
                {modal.competencies ? (
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{modal.competencies}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">등록된 역량 설명이 없습니다.</p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-primary mb-1">합격기준</h4>
                <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{modal.criteria}</p>
              </div>

              <button
                onClick={() => setModal(null)}
                className="mt-6 w-full bg-muted py-2.5 rounded-lg text-sm font-medium hover:bg-muted/70 transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
