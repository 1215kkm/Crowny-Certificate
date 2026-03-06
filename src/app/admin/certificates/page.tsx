import Link from "next/link";

const DEMO_ISSUANCES = [
  { id: "1", issueNumber: "CRN-2026-A1B2C3", user: "홍길동", grade: "3급", method: "이메일", status: "발급 완료", date: "2026-03-05" },
  { id: "2", issueNumber: "CRN-2026-D4E5F6", user: "김철수", grade: "3급", method: "우편", status: "배송 중", date: "2026-03-04" },
  { id: "3", issueNumber: "CRN-2026-G7H8I9", user: "이영희", grade: "2급", method: "이메일+우편", status: "발급 대기", date: "2026-03-06" },
];

export default function AdminCertificatesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">&larr; 대시보드</Link>
          <h1 className="text-2xl font-bold">인증서 관리</h1>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-muted rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">312</div>
          <div className="text-sm text-muted-foreground">총 발급</div>
        </div>
        <div className="bg-muted rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-500">3</div>
          <div className="text-sm text-muted-foreground">발급 대기</div>
        </div>
        <div className="bg-muted rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-500">5</div>
          <div className="text-sm text-muted-foreground">배송 중</div>
        </div>
        <div className="bg-muted rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-500">304</div>
          <div className="text-sm text-muted-foreground">완료</div>
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium">인증번호</th>
              <th className="text-left p-4 font-medium">수여자</th>
              <th className="text-left p-4 font-medium">등급</th>
              <th className="text-left p-4 font-medium">발급 방법</th>
              <th className="text-left p-4 font-medium">상태</th>
              <th className="text-left p-4 font-medium">신청일</th>
              <th className="text-left p-4 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_ISSUANCES.map((issuance) => (
              <tr key={issuance.id} className="border-t border-border hover:bg-muted/50">
                <td className="p-4 font-mono text-sm">{issuance.issueNumber}</td>
                <td className="p-4">{issuance.user}</td>
                <td className="p-4">{issuance.grade}</td>
                <td className="p-4">{issuance.method}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded ${
                    issuance.status === '발급 완료' ? 'bg-green-100 text-green-700' :
                    issuance.status === '배송 중' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {issuance.status}
                  </span>
                </td>
                <td className="p-4">{issuance.date}</td>
                <td className="p-4">
                  <button className="text-primary hover:underline text-sm mr-3">상세</button>
                  {issuance.status === '발급 대기' && (
                    <button className="text-green-600 hover:underline text-sm">발급 처리</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
