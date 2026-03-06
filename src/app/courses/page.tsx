"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDocuments, where, type CourseDoc, type CertificateTypeDoc } from "@/lib/firestore";
import { getGradeInfo } from "@/lib/grade-utils";

export default function CoursesPage() {
  const [courses, setCourses] = useState<(CourseDoc & { id: string })[]>([]);
  const [certTypes, setCertTypes] = useState<Record<string, CertificateTypeDoc & { id: string }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesData, typesData] = await Promise.all([
          getDocuments<CourseDoc>("courses", where("isPublished", "==", true)),
          getDocuments<CertificateTypeDoc>("certificateTypes"),
        ]);

        const typesMap: Record<string, CertificateTypeDoc & { id: string }> = {};
        typesData.forEach((t) => { typesMap[t.id] = t; });

        setCourses(coursesData);
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
      <div className="max-w-6xl mx-auto px-4 py-12">
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
    <div className="max-w-6xl mx-auto px-4 py-12">
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

            return (
              <div
                key={course.id}
                className="border border-border rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <div className="bg-gray-100 h-48 flex items-center justify-center">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-lg">강의 썸네일</span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
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
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">
                      {price.toLocaleString()}원
                    </span>
                    <Link
                      href={`/courses/${course.id}`}
                      className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition"
                    >
                      수강 신청
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
