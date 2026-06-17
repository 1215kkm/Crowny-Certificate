/**
 * 2급 실기(AI 랜딩페이지 제작) 시험용 데이터.
 * - 주제 5종 / 와이어프레임 5종 중 응시 시작 시 랜덤 1개씩 배정.
 * - 모든 와이어프레임은 동일한 슬롯 수: 히어로 1 · 아이콘 6 · 상품 4 · 띠배너 1.
 *   (와이어프레임은 섹션 '배치 순서'만 다르게 함)
 */

export interface PracticalTheme {
  id: string;
  name: string;
  desc: string;
}

export interface PracticalWireframe {
  id: string;
  name: string;
  desc: string;
  /** 섹션 배치 순서 */
  order: ("hero" | "band" | "icons" | "products")[];
}

export const PRACTICAL_THEMES: PracticalTheme[] = [
  { id: "watch", name: "시계", desc: "손목시계/벽시계 등 시계 브랜드 랜딩페이지" },
  { id: "wallet", name: "지갑", desc: "가죽/패션 지갑 브랜드 랜딩페이지" },
  { id: "anchovy", name: "멸치 판매", desc: "산지직송 멸치/건어물 판매 랜딩페이지" },
  { id: "ebike", name: "전동자전거", desc: "전동자전거 제품 소개 랜딩페이지" },
  { id: "necklace", name: "목걸이", desc: "주얼리/목걸이 브랜드 랜딩페이지" },
];

export const PRACTICAL_WIREFRAMES: PracticalWireframe[] = [
  {
    id: "wf-classic",
    name: "클래식형",
    desc: "히어로 → 띠배너 → 아이콘 6 → 상품 4",
    order: ["hero", "band", "icons", "products"],
  },
  {
    id: "wf-product-first",
    name: "상품 우선형",
    desc: "히어로 → 상품 4 → 아이콘 6 → 띠배너",
    order: ["hero", "products", "icons", "band"],
  },
  {
    id: "wf-benefit",
    name: "혜택 강조형",
    desc: "히어로 → 아이콘 6 → 띠배너 → 상품 4",
    order: ["hero", "icons", "band", "products"],
  },
  {
    id: "wf-banner-top",
    name: "배너 상단형",
    desc: "띠배너 → 히어로 → 상품 4 → 아이콘 6",
    order: ["band", "hero", "products", "icons"],
  },
  {
    id: "wf-gallery",
    name: "갤러리형",
    desc: "히어로 → 상품 4 → 띠배너 → 아이콘 6",
    order: ["hero", "products", "band", "icons"],
  },
];

export const PRACTICAL_SLOT_SPEC = {
  hero: 1,
  icons: 6,
  products: 4,
  band: 1,
};

/** 실기 합격 점수(100점 만점) */
export const PRACTICAL_PASSING_SCORE = 60;

export function getThemeById(id: string): PracticalTheme | undefined {
  return PRACTICAL_THEMES.find((t) => t.id === id);
}

export function getWireframeById(id: string): PracticalWireframe | undefined {
  return PRACTICAL_WIREFRAMES.find((w) => w.id === id);
}
