import Link from "next/link";

const DEMO_EXAMS = [
  { id: "1", title: "3급 2026년 4월 정기시험", grade: "3급", questions: 42, applicants: 128, date: "2026-04-15", active: true },
  { id: "2", title: "2급 2026년 4월 정기시험", grade: "2급", questions: 5, applicants: 56, date: "2026-04-15", active: true },
  { id: "3", title: "1급 2026년 4월 정기시험", grade: "1급", questions: 3, applicants: 23, date: "2026-04-15", active: true },
  { id: "4", title: "특급 2026년 5월 특별시험", grade: "특급", questions: 1, applicants: 12, date: "2026-05-10", active: false },
];

export default function AdminExamsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">&larr; 대시보드</Link>
          <h1 className="text-2xl font-bold">시험 관리</h1>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
          + 새 시험 등록
        </button>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium">시험명</th>
              <th className="text-left p-4 font-medium">등급</th>
              <th className="text-left p-4 font-medium">문제 수</th>
              <th className="text-left p-4 font-medium">신청자</th>
              <th className="text-left p-4 font-medium">시험일</th>
              <th className="text-left p-4 font-medium">상태</th>
              <th className="text-left p-4 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_EXAMS.map((exam) => (
              <tr key={exam.id} className="border-t border-border hover:bg-muted/50">
                <td className="p-4 font-medium">{exam.title}</td>
                <td className="p-4">{exam.grade}</td>
                <td className="p-4">{exam.questions}문항</td>
                <td className="p-4">{exam.applicants}명</td>
                <td className="p-4">{exam.date}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded ${exam.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {exam.active ? '접수중' : '준비중'}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-primary hover:underline text-sm mr-3">문제 관리</button>
                  <button className="text-primary hover:underline text-sm mr-3">채점</button>
                  <button className="text-red-500 hover:underline text-sm">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 채점 대기 */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">채점 대기 (실기 시험)</h2>
        <div className="border border-border rounded-xl p-6 text-center text-muted-foreground">
          채점 대기 중인 실기 시험이 없습니다.
        </div>
      </div>
    </div>
  );
}
