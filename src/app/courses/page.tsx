"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDocuments, getDocument, where, type CourseDoc, type CertificateTypeDoc, type CertificateGrade, type CertExample, Timestamp } from "@/lib/firestore";
import { getGradeInfo, gradeRank, getGradeThumb, getGradeCompetencies, getDefaultPassingCriteria, gradeLearnHref, findTypeIdByGrade } from "@/lib/grade-utils";
import { ExampleDetail, ExampleGrid } from "@/components/example-preview";

type CourseCard = CourseDoc & { id: string; isSample?: boolean; learnHref?: string };

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [certTypes, setCertTypes] = useState<Record<string, CertificateTypeDoc & { id: string }>>({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    gradeLabel: string;
    thumb: string | null;
    name: string;
    competencies: string;
    criteria: string;
    examples: CertExample[];
  } | null>(null);
  // 합격기준 모달 안에서 선택한 예시(상세/미리보기)
  const [selectedEx, setSelectedEx] = useState<CertExample | null>(null);

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
        let allCourses: CourseCard[] = coursesData;

        if (settings?.showSampleData && coursesData.length === 0) {
          const now = Timestamp.now();
          // 등급별로 certificateTypes에서 실제 유형을 찾아 매핑한다.
          // (typeKeys 인덱스로 매핑하면 등급이 어긋나 배지·가격·링크가 밀리는 문제가 있었음)
          const sampleDefs: {
            id: string;
            grade: CertificateGrade;
            title: string;
            description: string;
            totalDuration: number;
            lessonCount: number;
          }[] = [
            {
              id: "sample-1",
              grade: "GRADE_3",
              title: "[샘플] AI 기초 활용 과정 - 3급 대비",
              description: "AI 도구의 기본 사용법을 배우고 실무에 적용하는 방법을 학습합니다. ChatGPT, Claude 등 주요 AI 서비스 활용법을 다룹니다.",
              totalDuration: 1800,
              lessonCount: 12,
            },
            {
              id: "sample-2",
              grade: "GRADE_2",
              title: "[샘플] AI UI 제작 과정 - 2급 대비",
              description: "프롬프트 엔지니어링과 AI를 활용한 UI/UX 디자인 및 프론트엔드 구현 능력을 키웁니다.",
              totalDuration: 3600,
              lessonCount: 24,
            },
            {
              id: "sample-3",
              grade: "GRADE_1",
              title: "[샘플] AI 풀스택 개발 과정 - 1급 대비",
              description: "AI를 활용한 풀스택 웹 애플리케이션 개발. UI/UX부터 백엔드 API 연동까지 전 과정을 학습합니다.",
              totalDuration: 5400,
              lessonCount: 36,
            },
            {
              id: "sample-4",
              grade: "SPECIAL",
              title: "[샘플] AI 문제해결 마스터 과정 - 특급 대비",
              description: "실제 비즈니스 문제를 AI로 해결하는 고급 솔루션 설계. 해커톤 형식의 실전 프로젝트를 수행합니다.",
              totalDuration: 7200,
              lessonCount: 48,
            },
          ];
          const sampleCourses: CourseCard[] = sampleDefs.map((d) => ({
            id: d.id,
            title: d.title,
            description: d.description,
            thumbnailUrl: null,
            certificateTypeId: findTypeIdByGrade(typesMap, d.grade),
            totalDuration: d.totalDuration,
            lessonCount: d.lessonCount,
            isPublished: true,
            createdAt: now,
            updatedAt: now,
            isSample: true,
            learnHref: gradeLearnHref(d.grade) ?? undefined,
          }));
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
            // 등급별 학습 페이지가 있으면 학습 시작 버튼 노출 (샘플·실강 공통)
            const learnHref = course.learnHref ?? gradeLearnHref(certType?.grade);

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
                        onClick={() => {
                          setSelectedEx(null);
                          setModal({
                            gradeLabel: gradeInfo?.label ?? "",
                            thumb,
                            name: certType?.name ?? course.title,
                            competencies: certType?.competencies?.trim() || getGradeCompetencies(certType?.grade),
                            criteria: certType?.passingCriteria?.trim() || getDefaultPassingCriteria(certType?.grade, certType?.passingScore),
                            examples: certType?.examples ?? [],
                          });
                        }}
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
                  {/* 등급별 학습 페이지(강의+예제시험)가 준비되어 있어 바로 진입 가능 */}
                  {learnHref && (
                    <Link
                      href={learnHref}
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
          onClick={() => { setModal(null); setSelectedEx(null); }}
        >
          <div
            className="bg-white rounded-2xl max-w-[538px] w-full max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상단 썸네일 */}
            <div className="relative bg-gray-100 h-52 flex items-center justify-center rounded-t-2xl overflow-hidden">
              {modal.thumb ? (
                <img src={modal.thumb} alt={modal.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">썸네일</span>
              )}
              <button
                onClick={() => { setModal(null); setSelectedEx(null); }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            <div className="p-7">
              <div className="flex items-center gap-2 mb-5">
                {modal.gradeLabel && (
                  <span className="bg-primary text-white text-xs px-2.5 py-1 rounded font-medium">
                    {modal.gradeLabel}
                  </span>
                )}
                <h3 className="text-xl font-bold">{modal.name}</h3>
              </div>

              <div className="mb-6">
                <h4 className="text-base font-bold text-primary mb-1.5">이 시험을 통해 키우려는 역량</h4>
                {modal.competencies ? (
                  <p className="text-[15px] text-foreground whitespace-pre-line leading-relaxed">{modal.competencies}</p>
                ) : (
                  <p className="text-[15px] text-muted-foreground">등록된 역량 설명이 없습니다.</p>
                )}
              </div>

              <div>
                <h4 className="text-base font-bold text-primary mb-1.5">합격기준</h4>
                <p className="text-[15px] text-foreground whitespace-pre-line leading-relaxed">{modal.criteria}</p>
              </div>

              {/* 관리자가 등록한 합격 예시(이미지/코드/링크) 미리보기 */}
              {modal.examples.length > 0 && (
                <div className="mt-6 border-t border-border pt-5">
                  <div className="flex items-center gap-2 mb-3">
                    {selectedEx && (
                      <button onClick={() => setSelectedEx(null)} className="text-sm text-primary hover:underline">
                        ← 목록
                      </button>
                    )}
                    <h4 className="text-base font-bold text-primary">합격 예시 미리보기 ({modal.examples.length})</h4>
                  </div>
                  {selectedEx ? (
                    <ExampleDetail example={selectedEx} />
                  ) : (
                    <ExampleGrid examples={modal.examples} onSelect={setSelectedEx} />
                  )}
                </div>
              )}

              <button
                onClick={() => { setModal(null); setSelectedEx(null); }}
                className="mt-7 w-full bg-muted py-3 rounded-lg text-sm font-medium hover:bg-muted/70 transition"
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
