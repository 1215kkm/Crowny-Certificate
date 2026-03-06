import Link from "next/link";

export default function MyPage() {
  // 데모 데이터 (실제로는 세션에서 사용자 정보를 가져옴)
  const user = {
    name: "홍길동",
    email: "hong@example.com",
    joinDate: "2026-01-15",
  };

  const enrollments = [
    {
      id: "1",
      courseTitle: "AI 기초 활용 마스터 과정",
      grade: "3급",
      progress: 65,
      enrolledAt: "2026-02-01",
    },
  ];

  const examResults = [
    {
      id: "1",
      examTitle: "Crowny AI 활용 자격증 3급 - 2026년 3월",
      grade: "3급",
      score: 85,
      passed: true,
      date: "2026-03-01",
    },
  ];

  const certificates = [
    {
      id: "1",
      grade: "3급",
      issueNumber: "CRN-2026-A1B2C3",
      issuedAt: "2026-03-05",
      status: "발급 완료",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">마이페이지</h1>

      {/* 사용자 정보 */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="opacity-80">{user.email}</p>
            <p className="text-sm opacity-60">
              가입일: {user.joinDate}
            </p>
          </div>
        </div>
      </div>

      {/* 수강 현황 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">수강 현황</h2>
        {enrollments.length > 0 ? (
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="border border-border rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded mr-2">
                      {enrollment.grade}
                    </span>
                    <span className="font-medium">
                      {enrollment.courseTitle}
                    </span>
                  </div>
                  <Link
                    href={`/courses/${enrollment.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    이어서 학습
                  </Link>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  진도율: {enrollment.progress}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            수강 중인 강의가 없습니다.
            <Link href="/courses" className="text-primary ml-2 hover:underline">
              강의 둘러보기
            </Link>
          </div>
        )}
      </section>

      {/* 시험 결과 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">시험 결과</h2>
        {examResults.length > 0 ? (
          <div className="space-y-4">
            {examResults.map((result) => (
              <div
                key={result.id}
                className="border border-border rounded-xl p-5 flex items-center justify-between"
              >
                <div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded mr-2 ${
                      result.passed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {result.passed ? "합격" : "불합격"}
                  </span>
                  <span className="font-medium">{result.examTitle}</span>
                  <div className="text-sm text-muted-foreground mt-1">
                    점수: {result.score}점 | 응시일: {result.date}
                  </div>
                </div>
                {result.passed && (
                  <Link
                    href="/certificates"
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition"
                  >
                    인증서 발급
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            시험 결과가 없습니다.
          </div>
        )}
      </section>

      {/* 발급된 인증서 */}
      <section>
        <h2 className="text-xl font-bold mb-4">발급된 인증서</h2>
        {certificates.length > 0 ? (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="border border-border rounded-xl p-5 flex items-center justify-between"
              >
                <div>
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded mr-2">
                    {cert.grade}
                  </span>
                  <span className="font-medium">
                    Crowny AI 활용 자격증 {cert.grade}
                  </span>
                  <div className="text-sm text-muted-foreground mt-1">
                    인증번호: {cert.issueNumber} | 발급일: {cert.issuedAt} |{" "}
                    {cert.status}
                  </div>
                </div>
                <button className="border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition">
                  PDF 다운로드
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            발급된 인증서가 없습니다.
          </div>
        )}
      </section>
    </div>
  );
}
