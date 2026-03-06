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
