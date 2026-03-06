import Link from "next/link";

// 데모 데이터 (실제로는 DB에서 가져옴)
const DEMO_COURSES = [
  {
    id: "1",
    title: "AI 기초 활용 마스터 과정",
    grade: "3급",
    gradeColor: "bg-blue-500",
    description:
      "ChatGPT, Claude, Midjourney 등 주요 AI 도구를 실무에서 활용하는 방법을 배웁니다.",
    lessonCount: 20,
    duration: "10시간",
    price: 59000,
    thumbnail: null,
  },
  {
    id: "2",
    title: "AI를 활용한 UI 디자인 & 개발",
    grade: "2급",
    gradeColor: "bg-purple-500",
    description:
      "v0, Cursor, Figma AI 등을 활용하여 실제 UI를 제작하는 실무 과정입니다.",
    lessonCount: 30,
    duration: "15시간",
    price: 89000,
    thumbnail: null,
  },
  {
    id: "3",
    title: "AI 풀스택 웹 개발 과정",
    grade: "1급",
    gradeColor: "bg-orange-500",
    description:
      "AI 도구를 활용하여 프론트엔드부터 백엔드, 배포까지 완성하는 풀스택 과정.",
    lessonCount: 40,
    duration: "25시간",
    price: 129000,
    thumbnail: null,
  },
  {
    id: "4",
    title: "AI 문제해결 전문가 과정",
    grade: "특급",
    gradeColor: "bg-red-500",
    description:
      "실제 비즈니스 문제를 AI로 분석하고 솔루션을 제작하는 최고급 과정.",
    lessonCount: 25,
    duration: "20시간",
    price: 199000,
    thumbnail: null,
  },
];

export default function CoursesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">강의 목록</h1>
      <p className="text-muted-foreground mb-8">
        등급별 맞춤 강의로 AI 활용 역량을 키우세요
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {DEMO_COURSES.map((course) => (
          <div
            key={course.id}
            className="border border-border rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            <div className="bg-gray-100 h-48 flex items-center justify-center">
              <span className="text-gray-400 text-lg">강의 썸네일</span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`${course.gradeColor} text-white text-xs px-2 py-1 rounded font-medium`}
                >
                  {course.grade}
                </span>
                <span className="text-xs text-muted-foreground">
                  {course.lessonCount}강 | {course.duration}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2">{course.title}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {course.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">
                  {course.price.toLocaleString()}원
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
        ))}
      </div>
    </div>
  );
}
