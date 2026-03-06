import Link from "next/link";

const DEMO_EXAMS = [
  {
    id: "1",
    grade: "3급",
    gradeColor: "bg-blue-500",
    title: "Crowny AI 활용 자격증 3급 - 2026년 4월 정기시험",
    format: "객관식 40문항 + 실습 2개",
    duration: "60분",
    passingScore: 70,
    price: 30000,
    registrationEnd: "2026-03-31",
    scheduledDate: "2026-04-15",
    seats: "제한 없음 (온라인)",
  },
  {
    id: "2",
    grade: "2급",
    gradeColor: "bg-purple-500",
    title: "Crowny AI 활용 자격증 2급 - 2026년 4월 정기시험",
    format: "실기 시험 (화면 녹화 제출)",
    duration: "120분",
    passingScore: 70,
    price: 50000,
    registrationEnd: "2026-03-31",
    scheduledDate: "2026-04-15",
    seats: "제한 없음 (온라인)",
  },
  {
    id: "3",
    grade: "1급",
    gradeColor: "bg-orange-500",
    title: "Crowny AI 활용 자격증 1급 - 2026년 4월 정기시험",
    format: "프로젝트 제출 + 코드 리뷰",
    duration: "7일",
    passingScore: 80,
    price: 80000,
    registrationEnd: "2026-03-31",
    scheduledDate: "2026-04-15",
    seats: "제한 없음 (온라인)",
  },
  {
    id: "4",
    grade: "특급",
    gradeColor: "bg-red-500",
    title: "Crowny AI 활용 자격증 특급 - 2026년 5월 특별시험",
    format: "실무 과제 해결 (해커톤)",
    duration: "48시간",
    passingScore: 80,
    price: 120000,
    registrationEnd: "2026-04-30",
    scheduledDate: "2026-05-10",
    seats: "30명 제한",
  },
];

export default function ExamsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">시험 신청</h1>
      <p className="text-muted-foreground mb-8">
        원하는 등급의 시험을 선택하고 신청하세요
      </p>

      <div className="space-y-6">
        {DEMO_EXAMS.map((exam) => (
          <div
            key={exam.id}
            className="border border-border rounded-xl p-6 hover:shadow-md transition"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`${exam.gradeColor} text-white text-xs px-2 py-1 rounded font-medium`}
                  >
                    {exam.grade}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    접수마감: {exam.registrationEnd}
                  </span>
                </div>
                <h2 className="text-lg font-bold mb-3">{exam.title}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">시험 형식</span>
                    <div className="font-medium">{exam.format}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">시험 시간</span>
                    <div className="font-medium">{exam.duration}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">합격 기준</span>
                    <div className="font-medium">{exam.passingScore}점 이상</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">정원</span>
                    <div className="font-medium">{exam.seats}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-xl font-bold text-primary">
                  {exam.price.toLocaleString()}원
                </div>
                <div className="text-xs text-muted-foreground">
                  시험일: {exam.scheduledDate}
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
        ))}
      </div>
    </div>
  );
}
