/**
 * 1급 실기(AI 앱 제작·배포) 시험용 데이터.
 * - 응시자가 주제를 선택해 앱을 직접 제작·배포하고, 배포 URL과 정보를 제출.
 * - 관리자가 채점표(체크리스트)에 따라 100점 만점으로 채점한다.
 */

export interface AppTheme {
  id: string;
  name: string;
  desc: string;
}

export const APP_THEMES: AppTheme[] = [
  { id: "game", name: "게임", desc: "점수·랭킹이 있는 웹 게임 (배경음/버튼음, 이미지 활용)" },
  { id: "community", name: "아파트·동호회 커뮤니티 앱", desc: "공지·게시판·댓글 중심 커뮤니티" },
  { id: "chat", name: "가족·친구 채팅 앱", desc: "실시간 메시지 공유 채팅" },
  { id: "food", name: "맛집 공유 앱", desc: "맛집 등록·후기·평점 공유" },
  { id: "challenge", name: "습관·운동 챌린지 앱", desc: "인증·기록·점수·랭킹으로 함께 도전" },
];

export interface RubricItem {
  id: string;
  label: string;
  points: number;
  /** 필수 게이트 항목 (미충족 시 총점과 무관하게 불합격) */
  required?: boolean;
}

/** 1급 실기 채점표 (총 100점, 60점 이상 합격, 필수 항목 미충족 시 불합격) */
export const APP_RUBRIC: RubricItem[] = [
  { id: "deploy", label: "실제 배포 (접속 가능한 URL)", points: 20, required: true },
  { id: "auth", label: "회원가입 / 로그인 (서버 인증)", points: 15 },
  { id: "data", label: "글쓰기 등 데이터 작성·조회 (서버 저장)", points: 15, required: true },
  { id: "interaction", label: "댓글 등 사용자 상호작용", points: 15 },
  { id: "multiscore", label: "다중 사용자 + 점수 카운트·순위 비교 (서버)", points: 20 },
  { id: "aiimage", label: "AI 이미지 생성·활용", points: 10 },
  { id: "sound", label: "사운드(배경음/버튼음)·완성도", points: 5 },
];

export const APP_RUBRIC_TOTAL = APP_RUBRIC.reduce((s, r) => s + r.points, 0); // 100
export const APP_PASSING_SCORE = 60;

export function getAppThemeById(id: string): AppTheme | undefined {
  return APP_THEMES.find((t) => t.id === id);
}
