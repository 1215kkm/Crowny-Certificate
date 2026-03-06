"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getDocument,
  getDocs,
  query,
  orderBy,
  lessonsCollection,
  type CourseDoc,
  type LessonDoc,
  type CertificateTypeDoc,
  Timestamp,
} from "@/lib/firestore";
import { getGradeInfo, formatDuration } from "@/lib/grade-utils";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<(CourseDoc & { id: string }) | null>(null);
  const [lessons, setLessons] = useState<(LessonDoc & { id: string })[]>([]);
  const [certType, setCertType] = useState<(CertificateTypeDoc & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 샘플 강의 처리
        if (courseId.startsWith("sample-")) {
          const sampleCourses: Record<string, { title: string; description: string; lessonCount: number; totalDuration: number; }> = {
            "sample-1": { title: "[샘플] AI 기초 활용 과정 - 3급 대비", description: "AI 도구의 기본 사용법을 배우고 실무에 적용하는 방법을 학습합니다. ChatGPT, Claude 등 주요 AI 서비스 활용법을 다룹니다.", lessonCount: 12, totalDuration: 1800 },
            "sample-2": { title: "[샘플] AI UI 제작 과정 - 2급 대비", description: "프롬프트 엔지니어링과 AI를 활용한 UI/UX 디자인 및 프론트엔드 구현 능력을 키웁니다.", lessonCount: 24, totalDuration: 3600 },
            "sample-3": { title: "[샘플] AI 풀스택 개발 과정 - 1급 대비", description: "AI를 활용한 풀스택 웹 애플리케이션 개발. UI/UX부터 백엔드 API 연동까지 전 과정을 학습합니다.", lessonCount: 36, totalDuration: 5400 },
            "sample-4": { title: "[샘플] AI 문제해결 마스터 과정 - 특급 대비", description: "실제 비즈니스 문제를 AI로 해결하는 고급 솔루션 설계. 해커톤 형식의 실전 프로젝트를 수행합니다.", lessonCount: 48, totalDuration: 7200 },
          };
          const sample = sampleCourses[courseId];
          if (sample) {
            const now = Timestamp.now();
            setCourse({ id: courseId, ...sample, thumbnailUrl: null, certificateTypeId: "", isPublished: true, createdAt: now, updatedAt: now });
            setLessons([
              { id: "s-lesson-1", title: "강의 소개 및 환경 설정", videoUrl: "", duration: 15, order: 1, isFree: true, createdAt: now, updatedAt: now },
              { id: "s-lesson-2", title: "기본 개념 학습", videoUrl: "", duration: 30, order: 2, isFree: false, createdAt: now, updatedAt: now },
              { id: "s-lesson-3", title: "실습 프로젝트", videoUrl: "", duration: 45, order: 3, isFree: false, createdAt: now, updatedAt: now },
            ]);
          }
          setLoading(false);
          return;
        }

        const courseData = await getDocument<CourseDoc>("courses", courseId);
        if (!courseData) {
          setLoading(false);
          return;
        }
        setCourse(courseData);

        const [lessonsSnap, typeData] = await Promise.all([
          getDocs(query(lessonsCollection(courseId), orderBy("order"))),
          getDocument<CertificateTypeDoc>("certificateTypes", courseData.certificateTypeId),
        ]);

        const lessonsData = lessonsSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as LessonDoc),
        }));
        setLessons(lessonsData);
        setCertType(typeData);
      } catch (error) {
        console.error("강의 상세 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-16 mb-3" />
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-8" />
        <div className="bg-muted rounded-xl p-6 mb-8 h-24" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">강의를 찾을 수 없습니다</h1>
        <Link href="/courses" className="text-primary hover:underline">
          강의 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const gradeInfo = certType ? getGradeInfo(certType.grade) : null;
  const price = certType?.coursePrice ?? 0;
  const totalMinutes = Math.round(course.totalDuration / 60);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 강의 헤더 */}
      <div className="mb-8">
        {gradeInfo && (
          <span className={`${gradeInfo.color} text-white text-sm px-3 py-1 rounded font-medium`}>
            {gradeInfo.label}
          </span>
        )}
        <h1 className="text-3xl font-bold mt-3 mb-2">{course.title}</h1>
        <p className="text-muted-foreground">{course.description}</p>
      </div>

      {/* 강의 정보 카드 */}
      <div className="bg-muted rounded-xl p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{lessons.length}강</div>
            <div className="text-sm text-muted-foreground">총 강의 수</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{formatDuration(totalMinutes)}</div>
            <div className="text-sm text-muted-foreground">총 학습 시간</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">무제한</div>
            <div className="text-sm text-muted-foreground">수강 기간</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">인증서</div>
            <div className="text-sm text-muted-foreground">수료 시 발급</div>
          </div>
        </div>
      </div>

      {/* 커리큘럼 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">커리큘럼</h2>
        {lessons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border border-border rounded-xl">
            아직 등록된 레슨이 없습니다.
          </div>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden">
            {lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-6">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-sm font-medium">{lesson.title}</span>
                    {lesson.isFree && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        무료
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDuration(lesson.duration)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 수강 신청 */}
      <div className="bg-card border border-border rounded-xl p-6 sticky bottom-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{price.toLocaleString()}원</div>
            <div className="text-sm text-muted-foreground mt-1">
              수강료 (무제한 수강)
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/payment?type=course&id=${course.id}`}
              className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition"
            >
              수강 신청하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
