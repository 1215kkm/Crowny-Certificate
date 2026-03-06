import Link from "next/link";

// 데모 강의 상세 (실제로는 DB에서 가져옴)
const DEMO_LESSONS = [
  { id: "1", title: "AI 도구 개요 및 활용 전략", duration: "25분", isFree: true },
  { id: "2", title: "ChatGPT 프롬프트 엔지니어링 기초", duration: "35분", isFree: true },
  { id: "3", title: "Claude를 활용한 문서 분석 및 요약", duration: "30분", isFree: false },
  { id: "4", title: "Midjourney / DALL-E 이미지 생성", duration: "40분", isFree: false },
  { id: "5", title: "AI 코딩 어시스턴트 (Cursor, Copilot)", duration: "45분", isFree: false },
  { id: "6", title: "AI 자동화 워크플로우 구축", duration: "35분", isFree: false },
  { id: "7", title: "프롬프트 체이닝 심화", duration: "30분", isFree: false },
  { id: "8", title: "실전 프로젝트: AI로 블로그 자동화", duration: "50분", isFree: false },
];

export default function CourseDetailPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 강의 헤더 */}
      <div className="mb-8">
        <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded font-medium">
          3급
        </span>
        <h1 className="text-3xl font-bold mt-3 mb-2">
          AI 기초 활용 마스터 과정
        </h1>
        <p className="text-muted-foreground">
          ChatGPT, Claude, Midjourney 등 주요 AI 도구를 실무에서 활용하는 방법을
          배웁니다. 프롬프트 엔지니어링부터 AI 자동화까지 체계적으로 학습합니다.
        </p>
      </div>

      {/* 강의 정보 카드 */}
      <div className="bg-muted rounded-xl p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">8강</div>
            <div className="text-sm text-muted-foreground">총 강의 수</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">4.5시간</div>
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
        <div className="border border-border rounded-xl overflow-hidden">
          {DEMO_LESSONS.map((lesson, idx) => (
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
                {lesson.duration}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 수강 신청 */}
      <div className="bg-card border border-border rounded-xl p-6 sticky bottom-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">59,000원</div>
            <div className="text-sm text-muted-foreground mt-1">
              수강료 (무제한 수강)
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/payment?type=course&id=1"
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
