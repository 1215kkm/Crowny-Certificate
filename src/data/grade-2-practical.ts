/**
 * 2급 실기(AI 랜딩페이지 제작) 시험용 데이터.
 * - 주제 5종 / 와이어프레임 5종(A~E) 중 응시 시작 시 랜덤 1개씩 배정.
 * - 와이어프레임은 "그레이아웃(회색 블록 레이아웃)"으로 보여주는 시각 가이드이며,
 *   응시자는 이 레이아웃과 배정 주제에 맞춰 결과물을 직접 제작/배포해 제출한다.
 * - 와이어프레임은 관리자 페이지에서 등록/수정할 수 있고, DB(wireframes)가 비어 있으면
 *   아래 DEFAULT_WIREFRAMES(A~E)를 사용한다.
 */

export interface PracticalTheme {
  id: string;
  name: string;
  desc: string;
}

// 그레이아웃 블록 종류
export type WireframeBlockType =
  | "hero"
  | "band"
  | "icons"
  | "products"
  | "text"
  | "image"
  | "footer";

export interface WireframeBlock {
  type: WireframeBlockType;
  label?: string;
}

export interface PracticalWireframe {
  id: string;
  code: string; // A~E
  name: string;
  desc: string;
  blocks: WireframeBlock[];
}

export const WIREFRAME_BLOCK_LABELS: Record<WireframeBlockType, string> = {
  hero: "히어로 (대표 이미지/카피)",
  band: "띠배너 (가로 강조)",
  icons: "아이콘 6 (핵심 혜택)",
  products: "상품 4 (제품 카드)",
  text: "텍스트/설명",
  image: "이미지",
  footer: "푸터",
};

export const WIREFRAME_BLOCK_OPTIONS: { value: WireframeBlockType; label: string }[] = [
  { value: "hero", label: "히어로" },
  { value: "band", label: "띠배너" },
  { value: "icons", label: "아이콘 6" },
  { value: "products", label: "상품 4" },
  { value: "text", label: "텍스트/설명" },
  { value: "image", label: "이미지" },
  { value: "footer", label: "푸터" },
];

export const PRACTICAL_THEMES: PracticalTheme[] = [
  { id: "watch", name: "시계", desc: "손목시계/벽시계 등 시계 브랜드 랜딩페이지" },
  { id: "wallet", name: "지갑", desc: "가죽/패션 지갑 브랜드 랜딩페이지" },
  { id: "anchovy", name: "멸치 판매", desc: "산지직송 멸치/건어물 판매 랜딩페이지" },
  { id: "ebike", name: "전동자전거", desc: "전동자전거 제품 소개 랜딩페이지" },
  { id: "necklace", name: "목걸이", desc: "주얼리/목걸이 브랜드 랜딩페이지" },
];

// 기본 와이어프레임 5종 (A~E). 관리자가 비워두면 이 값을 사용.
export const DEFAULT_WIREFRAMES: PracticalWireframe[] = [
  {
    id: "wf-a",
    code: "A",
    name: "클래식형",
    desc: "히어로 → 띠배너 → 아이콘 6 → 상품 4 → 푸터",
    blocks: [{ type: "hero" }, { type: "band" }, { type: "icons" }, { type: "products" }, { type: "footer" }],
  },
  {
    id: "wf-b",
    code: "B",
    name: "상품 우선형",
    desc: "히어로 → 상품 4 → 아이콘 6 → 띠배너 → 푸터",
    blocks: [{ type: "hero" }, { type: "products" }, { type: "icons" }, { type: "band" }, { type: "footer" }],
  },
  {
    id: "wf-c",
    code: "C",
    name: "혜택 강조형",
    desc: "히어로 → 아이콘 6 → 띠배너 → 상품 4 → 푸터",
    blocks: [{ type: "hero" }, { type: "icons" }, { type: "band" }, { type: "products" }, { type: "footer" }],
  },
  {
    id: "wf-d",
    code: "D",
    name: "배너 상단형",
    desc: "띠배너 → 히어로 → 상품 4 → 아이콘 6 → 푸터",
    blocks: [{ type: "band" }, { type: "hero" }, { type: "products" }, { type: "icons" }, { type: "footer" }],
  },
  {
    id: "wf-e",
    code: "E",
    name: "갤러리형",
    desc: "히어로 → 상품 4 → 띠배너 → 아이콘 6 → 푸터",
    blocks: [{ type: "hero" }, { type: "products" }, { type: "band" }, { type: "icons" }, { type: "footer" }],
  },
];

// 응시자가 작성하는 AI 사용 내역(여러 개)
export interface AiUsage {
  content: string; // 어떤 작업에 어떻게 사용했는지
  link: string; // 대화 공유 링크
}

/** 실기 합격 점수(100점 만점) */
export const PRACTICAL_PASSING_SCORE = 60;

export function getThemeById(id: string): PracticalTheme | undefined {
  return PRACTICAL_THEMES.find((t) => t.id === id);
}

export function getWireframeById(id: string): PracticalWireframe | undefined {
  return DEFAULT_WIREFRAMES.find((w) => w.id === id);
}
