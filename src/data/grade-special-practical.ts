/**
 * 특급 실기(AI 제품 전주기 챌린지) 데이터.
 * - 시장조사 → 기획 → 디자인 → 제작 → 디버깅·수정 → 구현완료 → 배포 → 홍보 → 홍보반응 까지
 *   제품의 전체 라이프사이클을 수행하고 단계별로 제출한다. 코드·스택·주제 자유.
 * - 주제: 자유 선택 또는 아래 문제 풀에서 선택 (둘 다 지원).
 * - 타이머(해커톤)는 시험의 duration(분)이 0보다 크면 동작. 결과는 제출 후 발표일에 공개.
 */

export interface ChallengeProblem {
  id: string;
  title: string;
  desc: string;
}

/** 주제를 직접 정하기 어려운 응시자를 위한 실전 문제 풀(선택용) */
export const CHALLENGE_PROBLEMS: ChallengeProblem[] = [
  { id: "sales-dashboard", title: "소상공인 매출·재고 분석 대시보드", desc: "매출/재고 데이터를 분석해 인사이트를 제공" },
  { id: "cs-chatbot", title: "고객 문의 자동응대 AI 챗봇", desc: "FAQ·상품정보 기반 자동 응답 서비스" },
  { id: "content-pipeline", title: "콘텐츠 대량 생성·발행 파이프라인", desc: "블로그/SNS 콘텐츠 생성·관리·발행 도구" },
  { id: "booking-automation", title: "예약·일정 관리 자동화 서비스", desc: "예약 접수·충돌 방지·알림 처리" },
  { id: "recommender", title: "맞춤 추천 미니 서비스", desc: "취향·이력 기반 개인화 추천" },
];

/** 실기 제출 단계 (제품 전주기) — 폼 입력 항목 */
export interface LifecycleStage {
  key:
    | "marketResearch"
    | "planning"
    | "design"
    | "build"
    | "debugFix"
    | "completion"
    | "promotion"
    | "promotionResponse";
  label: string;
  placeholder: string;
}

export const LIFECYCLE_STAGES: LifecycleStage[] = [
  { key: "marketResearch", label: "1. 시장조사", placeholder: "타겟 고객, 경쟁 서비스, 시장 니즈를 조사한 내용" },
  { key: "planning", label: "2. 기획 (제작 이유·목표·기대효과)", placeholder: "왜 만드는지, 목표, 제작 후 기대효과" },
  { key: "design", label: "3. 디자인", placeholder: "컨셉·화면 구성 (설명 또는 링크)" },
  { key: "build", label: "4. 제작", placeholder: "구현한 핵심 기능과 사용 기술/AI 활용" },
  { key: "debugFix", label: "5. 디버깅·수정", placeholder: "발견한 문제와 해결·개선 과정" },
  { key: "completion", label: "6. 구현 완료", placeholder: "완성된 기능 정리, 테스트 계정 등" },
  { key: "promotion", label: "8. 홍보", placeholder: "어떤 채널로 어떻게 알렸는지" },
  { key: "promotionResponse", label: "9. 홍보 반응", placeholder: "방문자 수·가입·피드백·SNS 반응 등 증빙(수치/링크)" },
];

export interface RubricItem {
  id: string;
  label: string;
  points: number;
  required?: boolean;
}

/** 특급 실기 채점표 (총 100점, 60점 이상 합격, 필수 항목 미충족 시 불합격) */
export const CHALLENGE_RUBRIC: RubricItem[] = [
  { id: "research", label: "시장조사·기획 (이유·목표·기대효과)", points: 20 },
  { id: "design", label: "디자인·완성도", points: 20 },
  { id: "build", label: "제작·기술 (AI 활용)", points: 20 },
  { id: "deploy", label: "배포·재현성 (접속 가능한 URL)", points: 15, required: true },
  { id: "promotion", label: "홍보·홍보 반응 (시장 임팩트)", points: 25 },
];

export const CHALLENGE_PASSING_SCORE = 60;

export function getChallengeProblemById(id: string): ChallengeProblem | undefined {
  return CHALLENGE_PROBLEMS.find((p) => p.id === id);
}
