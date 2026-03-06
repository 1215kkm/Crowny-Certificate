import Link from "next/link";

const DEMO_COURSES = [
  { id: "1", title: "AI 기초 활용 마스터 과정", grade: "3급", lessons: 20, students: 342, published: true },
  { id: "2", title: "AI를 활용한 UI 디자인 & 개발", grade: "2급", lessons: 30, students: 156, published: true },
  { id: "3", title: "AI 풀스택 웹 개발 과정", grade: "1급", lessons: 40, students: 89, published: true },
  { id: "4", title: "AI 문제해결 전문가 과정", grade: "특급", lessons: 25, students: 34, published: false },
];

export default function AdminCoursesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">&larr; 대시보드</Link>
          <h1 className="text-2xl font-bold">강의 관리</h1>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
          + 새 강의 등록
        </button>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium">강의명</th>
              <th className="text-left p-4 font-medium">등급</th>
              <th className="text-left p-4 font-medium">레슨 수</th>
              <th className="text-left p-4 font-medium">수강생</th>
              <th className="text-left p-4 font-medium">상태</th>
              <th className="text-left p-4 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_COURSES.map((course) => (
              <tr key={course.id} className="border-t border-border hover:bg-muted/50">
                <td className="p-4 font-medium">{course.title}</td>
                <td className="p-4">{course.grade}</td>
                <td className="p-4">{course.lessons}강</td>
                <td className="p-4">{course.students}명</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded ${course.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {course.published ? '공개' : '비공개'}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-primary hover:underline text-sm mr-3">수정</button>
                  <button className="text-red-500 hover:underline text-sm">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
