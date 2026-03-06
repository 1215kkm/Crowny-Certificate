import Link from "next/link";

const STATS = [
  { label: "총 회원수", value: "1,234", change: "+56", color: "text-blue-600" },
  { label: "수강생", value: "856", change: "+32", color: "text-purple-600" },
  { label: "시험 응시", value: "428", change: "+18", color: "text-orange-600" },
  { label: "인증서 발급", value: "312", change: "+12", color: "text-green-600" },
  { label: "이번 달 매출", value: "12,450,000원", change: "+15%", color: "text-primary" },
  { label: "환불 건수", value: "3", change: "-2", color: "text-red-600" },
];

const MENU_ITEMS = [
  {
    title: "회원 관리",
    desc: "회원 목록, 검색, 역할 변경",
    href: "/admin/users",
    icon: "👤",
  },
  {
    title: "강의 관리",
    desc: "강의 등록/수정, 레슨 관리",
    href: "/admin/courses",
    icon: "📚",
  },
  {
    title: "시험 관리",
    desc: "시험 등록, 문제 관리, 채점",
    href: "/admin/exams",
    icon: "📝",
  },
  {
    title: "결제 관리",
    desc: "결제 내역, 환불 처리, 정산",
    href: "/admin/payments",
    icon: "💳",
  },
  {
    title: "인증서 관리",
    desc: "발급 현황, 배송 관리",
    href: "/admin/certificates",
    icon: "🏆",
  },
  {
    title: "자격증 종류 관리",
    desc: "등급별 자격증 설정",
    href: "/admin/certificate-types",
    icon: "⚙️",
  },
];

export default function AdminPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">관리자 대시보드</h1>
          <p className="text-muted-foreground">
            Crowny AI 자격증 플랫폼 관리
          </p>
        </div>
        <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-medium">
          ADMIN
        </span>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="text-sm text-muted-foreground mb-1">
              {stat.label}
            </div>
            <div className={`text-xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {stat.change} (이번 달)
            </div>
          </div>
        ))}
      </div>

      {/* 관리 메뉴 */}
      <h2 className="text-xl font-bold mb-4">관리 메뉴</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/50 transition group"
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <h3 className="font-bold group-hover:text-primary transition">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* 최근 활동 */}
      <h2 className="text-xl font-bold mb-4">최근 활동</h2>
      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium">시간</th>
              <th className="text-left p-3 font-medium">활동</th>
              <th className="text-left p-3 font-medium">사용자</th>
              <th className="text-left p-3 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                time: "10분 전",
                action: "3급 시험 응시 완료",
                user: "김철수",
                status: "합격",
                statusColor: "text-green-600",
              },
              {
                time: "25분 전",
                action: "2급 강의 수강 신청",
                user: "이영희",
                status: "결제 완료",
                statusColor: "text-blue-600",
              },
              {
                time: "1시간 전",
                action: "인증서 발급 신청",
                user: "박지민",
                status: "발급 대기",
                statusColor: "text-orange-600",
              },
              {
                time: "2시간 전",
                action: "회원가입",
                user: "최수현",
                status: "가입 완료",
                statusColor: "text-green-600",
              },
              {
                time: "3시간 전",
                action: "1급 시험 응시 완료",
                user: "정민수",
                status: "채점 대기",
                statusColor: "text-orange-600",
              },
            ].map((activity, idx) => (
              <tr
                key={idx}
                className="border-t border-border hover:bg-muted/50"
              >
                <td className="p-3 text-muted-foreground">{activity.time}</td>
                <td className="p-3">{activity.action}</td>
                <td className="p-3">{activity.user}</td>
                <td className={`p-3 font-medium ${activity.statusColor}`}>
                  {activity.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
