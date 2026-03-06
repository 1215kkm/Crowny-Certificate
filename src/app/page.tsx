import Link from "next/link";

const GRADES = [
  {
    grade: "3급",
    title: "AI 기초 활용",
    description: "AI 도구 5종 이상 활용, 프롬프트 엔지니어링 기본",
    format: "객관식 40문항 + 실습 2개",
    time: "60분",
    color: "bg-blue-500",
  },
  {
    grade: "2급",
    title: "AI UI 제작",
    description: "AI를 활용한 UI 디자인 및 프론트엔드 구현",
    format: "실기 시험 (화면 녹화)",
    time: "120분",
    color: "bg-purple-500",
  },
  {
    grade: "1급",
    title: "AI 풀스택 제작",
    description: "UI/UX + 프론트엔드 + 백엔드 API 연동 완성",
    format: "프로젝트 제출 + 코드 리뷰",
    time: "7일",
    color: "bg-orange-500",
  },
  {
    grade: "특급",
    title: "AI 문제해결",
    description: "실제 비즈니스 문제를 AI로 해결하는 솔루션 제작",
    format: "실무 과제 해결 (해커톤)",
    time: "48시간",
    color: "bg-red-500",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Crowny AI 활용 자격증
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            AI 시대, 당신의 역량을 증명하세요
          </p>
          <p className="text-lg mb-10 opacity-80 max-w-2xl mx-auto">
            프롬프트 엔지니어링부터 AI 풀스택 개발까지.
            <br />
            체계적인 강의와 실무 중심 시험으로 AI 활용 능력을 검증합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
            >
              강의 둘러보기
            </Link>
            <Link
              href="/exams"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition"
            >
              시험 신청하기
            </Link>
          </div>
        </div>
      </section>

      {/* Grade System Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            등급별 자격증 체계
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            단계별로 AI 활용 역량을 인증받으세요
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GRADES.map((item) => (
              <div
                key={item.grade}
                className="bg-card rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className={`${item.color} text-white p-4`}>
                  <span className="text-2xl font-bold">{item.grade}</span>
                  <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">시험 형식</span>
                      <span className="font-medium">{item.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">시험 시간</span>
                      <span className="font-medium">{item.time}</span>
                    </div>
                  </div>
                  <Link
                    href={`/exams?grade=${item.grade}`}
                    className="block mt-4 text-center bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition text-sm font-medium"
                  >
                    시험 신청
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            자격증 취득 과정
          </h2>
          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "강의 수강",
                desc: "등급별 맞춤 온라인 강의로 AI 활용 역량을 키우세요.",
              },
              {
                step: "02",
                title: "시험 신청 & 결제",
                desc: "원하는 등급의 시험에 신청하고 응시료를 결제하세요.",
              },
              {
                step: "03",
                title: "온라인 시험 응시",
                desc: "시간과 장소에 구애받지 않는 온라인 시험을 봅니다.",
              },
              {
                step: "04",
                title: "인증서 발급",
                desc: "합격 시 디지털(PDF) 또는 실물 인증서를 발급받으세요.",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            지금 시작하세요
          </h2>
          <p className="text-lg mb-8 opacity-90">
            회원가입 후 무료 샘플 강의를 확인해보세요.
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition inline-block"
          >
            무료 회원가입
          </Link>
        </div>
      </section>
    </div>
  );
}
