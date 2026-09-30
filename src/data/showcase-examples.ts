/**
 * 합격작 쇼케이스 — 등급별 예시답안(큐레이션).
 * 실제 합격자 제출물과 함께 갤러리/실기 안내에 노출되어 기준을 제시한다.
 */

export type ShowcaseGrade = "GRADE_2" | "GRADE_1" | "SPECIAL";

export const SHOWCASE_GRADE_LABEL: Record<ShowcaseGrade, string> = {
  GRADE_2: "2급 · AI 랜딩페이지",
  GRADE_1: "1급 · AI 앱 제작",
  SPECIAL: "특급 · AI 제품 전주기",
};

export const SHOWCASE_GRADE_OPTIONS: { value: ShowcaseGrade; label: string }[] = [
  { value: "GRADE_2", label: "2급 · AI 랜딩페이지" },
  { value: "GRADE_1", label: "1급 · AI 앱 제작" },
  { value: "SPECIAL", label: "특급 · AI 제품 전주기" },
];

export interface ShowcaseExample {
  grade: ShowcaseGrade;
  title: string;
  summary: string;
  highlights: string[];
}

export const SHOWCASE_EXAMPLES: ShowcaseExample[] = [
  // 2급 — 랜딩페이지
  {
    grade: "GRADE_2",
    title: "[예시] 전동자전거 브랜드 랜딩페이지",
    summary: "히어로 1·아이콘 6·상품 4·띠배너 1 슬롯을 주제에 맞게 채운 랜딩페이지. 통일된 톤의 AI 이미지와 혜택 중심 카피.",
    highlights: ["히어로 카피가 핵심 가치를 한 줄로 전달", "아이콘 6개 스타일 통일", "상품 이미지에 혜택 설명 결합", "띠배너로 한정 혜택 강조"],
  },
  {
    grade: "GRADE_2",
    title: "[예시] 수제 멸치 산지직송 랜딩페이지",
    summary: "신선도·원산지·손질 편의 등 구매자가 중시하는 가치를 강조한 식품 랜딩페이지.",
    highlights: ["타겟 니즈(신선도·원산지) 중심 메시지", "CTA가 명확하고 눈에 띔", "신뢰 요소(후기·산지 정보) 배치"],
  },
  // 1급 — 앱
  {
    grade: "GRADE_1",
    title: "[예시] 가족 습관 챌린지 앱",
    summary: "회원가입·로그인, 인증 기록, 점수·랭킹(서버 비교), 댓글까지 구현해 배포한 다중 사용자 앱.",
    highlights: ["서버에 점수 저장 → 가족 간 순위 비교", "인증샷에 AI 생성 이미지 활용", "댓글로 상호작용", "실제 접속 가능한 URL 배포"],
  },
  {
    grade: "GRADE_1",
    title: "[예시] 동호회 커뮤니티 앱",
    summary: "공지·게시판·댓글 중심의 커뮤니티 앱. 작성자만 수정·삭제 가능하도록 권한 처리.",
    highlights: ["회원 인증 + 권한(본인 글만 수정/삭제)", "서버 데이터 저장·동기화", "배포 및 테스트 계정 제공"],
  },
  // 특급 — 제품 전주기
  {
    grade: "SPECIAL",
    title: "[예시] AI 식단 추천 서비스 (전주기)",
    summary: "시장조사→기획→디자인→제작→배포→홍보→홍보 반응까지 수행. 1주일 방문 420명·가입 65명의 실제 반응을 증빙.",
    highlights: ["타겟·경쟁 분석 기반 기획", "AI를 추천 로직·콘텐츠에 깊게 활용", "배포 후 SNS 홍보 + 실제 반응 수치 제시", "피드백을 반영한 개선"],
  },
];

export function examplesByGrade(grade: ShowcaseGrade): ShowcaseExample[] {
  return SHOWCASE_EXAMPLES.filter((e) => e.grade === grade);
}
