/**
 * 「따라하며 코딩 배우기」 화면 테마.
 *
 * 상단 셀렉트로 갈아끼운다. 구조·기능은 그대로 두고 **색만** 바뀐다.
 * 각 테마는 CSS 변수 묶음으로 바뀌어 .learn-root 에 인라인으로 박힌다
 * (전역 토큰을 건드리면 사이트 나머지가 같이 바뀌므로 /learn 안에서만 적용).
 *
 * 강디 카탈로그(.claude/knowledge/ui-designer/styles/)의 활성 스타일 #1 Crowny Class 가
 * 기본값이고, 나머지는 학습 화면 전용 색 오버라이드다.
 * (스타일 번호는 그대로 1번 — README 룰: Primary/Secondary 교체는 "테마 컬러 오버라이드")
 */

export interface LearnTheme {
  id: string;
  name: string;
  /** 셀렉트에서 옆에 뜨는 한 줄 */
  tagline: string;
  /** 어두운 테마인가 — 코드 에디터를 다크로 돌릴지 판단 */
  dark: boolean;
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    primary50: string;
    primary100: string;
    primary200: string;
    primary800: string;
    secondary: string;
    /** 앱 바탕 */
    background: string;
    /** 1칸 카드/흰 면 */
    surface: string;
    /** 2·3칸 작업면 — 1칸과 반드시 구분 */
    workface: string;
    /** 2·3칸 머리줄 */
    workfaceHead: string;
    workfaceBorder: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    success: string;
    danger: string;
    accent: string;
  };
  radiusBtn: number;
  radiusCard: number;
}

/* ────────────────────────────────────────────────────────────
 * 강디 1차 5안 (Crowny Class 기반 색 오버라이드)
 * ──────────────────────────────────────────────────────────── */

const BASE_THEMES: LearnTheme[] = [
  {
    id: "crown-refine",
    name: "크라운 리파인",
    tagline: "기본 · 범용",
    dark: false,
    colors: {
      primary: "#7C3AED",
      primaryDark: "#6D28D9",
      primaryLight: "#A78BFA",
      primary50: "#F7F3FF",
      primary100: "#EDE4FE",
      primary200: "#DCCAFD",
      primary800: "#4A1F8A",
      secondary: "#D53A6B",
      background: "#F6F4FB",
      surface: "#FFFFFF",
      workface: "#F1EBFF",
      workfaceHead: "#E3D7FB",
      workfaceBorder: "#D5C4F7",
      foreground: "#2A2440",
      muted: "#F3F4F6",
      mutedForeground: "#6B7280",
      border: "#E5E7EB",
      success: "#22C55E",
      danger: "#EF4444",
      accent: "#F59E0B",
    },
    radiusBtn: 10,
    radiusCard: 16,
  },
  {
    id: "soft-sky",
    name: "말랑 하늘",
    tagline: "초등 저학년 · 파스텔",
    dark: false,
    colors: {
      primary: "#3AA0EA",
      primaryDark: "#2B7FBC",
      primaryLight: "#7CC4F5",
      primary50: "#F2F9FF",
      primary100: "#DFF0FE",
      primary200: "#C2E3FC",
      primary800: "#1B5480",
      secondary: "#FF9F43",
      background: "#F4FAFF",
      surface: "#FFFFFF",
      workface: "#E2F1FF",
      workfaceHead: "#CDE6FD",
      workfaceBorder: "#B3D9F8",
      foreground: "#183A52",
      muted: "#EFF6FB",
      mutedForeground: "#5B7A8E",
      border: "#DCEAF4",
      success: "#2FBF71",
      danger: "#F0544F",
      accent: "#FFC145",
    },
    radiusBtn: 14,
    radiusCard: 20,
  },
  {
    id: "midnight-coder",
    name: "미드나잇 코더",
    tagline: "집중 · 다크",
    dark: true,
    colors: {
      primary: "#A78BFA",
      primaryDark: "#8B6CF0",
      primaryLight: "#C4B5FD",
      primary50: "#1B1830",
      primary100: "#241F3D",
      primary200: "#31294F",
      primary800: "#C4B5FD",
      secondary: "#22D3EE",
      background: "#0E1017",
      surface: "#171A24",
      workface: "#1C202C",
      workfaceHead: "#252A38",
      workfaceBorder: "#333A4D",
      foreground: "#E6E8EF",
      muted: "#1F2430",
      mutedForeground: "#9BA3B4",
      border: "#2C3242",
      success: "#4ADE80",
      danger: "#F87171",
      accent: "#FBBF24",
    },
    radiusBtn: 10,
    radiusCard: 14,
  },
  {
    id: "mint-grapefruit",
    name: "민트 자몽",
    tagline: "청소년 · 상큼",
    dark: false,
    colors: {
      primary: "#17A98E",
      primaryDark: "#0F8471",
      primaryLight: "#5DCBB5",
      primary50: "#F1FBF8",
      primary100: "#DBF3EC",
      primary200: "#B9E7DB",
      primary800: "#0A5B4D",
      secondary: "#FF6B6B",
      background: "#F3FAF8",
      surface: "#FFFFFF",
      workface: "#E4F4EF",
      workfaceHead: "#CFEBE2",
      workfaceBorder: "#B3DCD0",
      foreground: "#123A33",
      muted: "#EFF6F4",
      mutedForeground: "#5A7B74",
      border: "#DCEBE7",
      success: "#22B573",
      danger: "#E5484D",
      accent: "#FFA94D",
    },
    radiusBtn: 12,
    radiusCard: 18,
  },
  {
    id: "high-contrast",
    name: "또렷 고대비",
    tagline: "접근성 · 저시력",
    dark: false,
    colors: {
      primary: "#1A56DB",
      primaryDark: "#123E9E",
      primaryLight: "#4B7FE8",
      primary50: "#F0F5FF",
      primary100: "#DDE8FF",
      primary200: "#BBD1FF",
      primary800: "#0B2C73",
      secondary: "#D6006E",
      background: "#FFFFFF",
      surface: "#FFFFFF",
      workface: "#FFF4D6",
      workfaceHead: "#FFE9AE",
      workfaceBorder: "#111111",
      foreground: "#111111",
      muted: "#F2F2F2",
      mutedForeground: "#454545",
      border: "#111111",
      success: "#0F7B33",
      danger: "#C81E1E",
      accent: "#B45309",
    },
    radiusBtn: 8,
    radiusCard: 12,
  },
];

/* ────────────────────────────────────────────────────────────
 * 강디 2차 5안 — CEO 레퍼런스 이미지에서 뽑음
 * 원본 스펙·WCAG 실측표: .claude/knowledge/ui-designer/styles/learn-themes.md
 * 커머스 랜딩의 고채도 원색을 그대로 쓰지 않고, 장시간 코드를 읽는 화면 기준으로
 * 채도·명도를 내린 값이다.
 * ──────────────────────────────────────────────────────────── */

const IMAGE_THEMES: LearnTheme[] = [
  {
    // 가구/인테리어 커머스 — 차콜 지배면 + 코랄 쿠션
    id: "terracotta-stone",
    name: "테라코타 스톤",
    tagline: "성인 재교육 · 웜 뉴트럴",
    dark: false,
    colors: {
      primary: "#B84E33",
      primaryDark: "#933C26",
      primaryLight: "#DD7B5C",
      primary50: "#FBF1ED",
      primary100: "#F6E1D9",
      primary200: "#EBC3B4",
      primary800: "#6E2C19",
      secondary: "#4A5A6A",
      background: "#F4F2EF",
      surface: "#FFFFFF",
      workface: "#E7EAEE",
      workfaceHead: "#D5DAE1",
      workfaceBorder: "#C2C9D2",
      foreground: "#22282E",
      muted: "#EFEDEA",
      mutedForeground: "#5B6672",
      border: "#DDD9D4",
      success: "#2F7D57",
      danger: "#B93B2E",
      accent: "#E8896A",
    },
    radiusBtn: 12,
    radiusCard: 18,
  },
  {
    // WATCH PRO — 잉크 블랙 초대형 타이포 + 버밀리언 알약 버튼
    id: "vermilion-ink",
    name: "버밀리언 잉크",
    tagline: "고대비 · 단체수업",
    dark: false,
    colors: {
      primary: "#D0360F",
      primaryDark: "#A32A0B",
      primaryLight: "#F35C30",
      primary50: "#FDF0EC",
      primary100: "#FBDDD4",
      primary200: "#F5BBA9",
      primary800: "#7A1F08",
      secondary: "#17181C",
      background: "#F5F4F1",
      surface: "#FFFFFF",
      workface: "#E9E7E2",
      workfaceHead: "#D6D3CC",
      workfaceBorder: "#C4C0B8",
      foreground: "#17181C",
      muted: "#EFEDE9",
      mutedForeground: "#5E5C57",
      border: "#DEDBD5",
      success: "#2E7D4F",
      danger: "#9B1C1C",
      accent: "#FF8A3D",
    },
    radiusBtn: 24,
    radiusCard: 20,
  },
  {
    // 스타벅스풍 — 딥 포레스트 그린 + 크림 종이 + 원두 브라운
    id: "forest-cream",
    name: "포레스트 크림",
    tagline: "저자극 · 롱세션",
    dark: false,
    colors: {
      primary: "#1E6A4C",
      primaryDark: "#14513A",
      primaryLight: "#2F8B65",
      primary50: "#EFF5F1",
      primary100: "#DBEAE1",
      primary200: "#B4D2C3",
      primary800: "#0E3D2B",
      secondary: "#9A6B3F",
      background: "#F3F1E8",
      surface: "#FFFFFF",
      workface: "#E7EBE0",
      workfaceHead: "#D5DCCB",
      workfaceBorder: "#C3CCB7",
      foreground: "#1E2A24",
      muted: "#EDEDE4",
      mutedForeground: "#56635B",
      border: "#DCDACE",
      success: "#2B8055",
      danger: "#C0392B",
      accent: "#C89B4A",
    },
    radiusBtn: 20,
    radiusCard: 16,
  },
  {
    // 푸드/레스토랑 옐로우 — 노른자 카드 + 흰 배경 + 채소 그린
    // (「또렷 고대비」의 연노랑 작업면과 인상이 가까워 목록에서 서로 떨어뜨려 배치)
    id: "amber-sand",
    name: "앰버 샌드",
    tagline: "초등 고학년~중학생",
    dark: false,
    colors: {
      primary: "#A26706",
      primaryDark: "#7E4F04",
      primaryLight: "#E0A020",
      primary50: "#FDF6E7",
      primary100: "#FAEBCB",
      primary200: "#F2D794",
      primary800: "#603B03",
      secondary: "#3E7A55",
      background: "#FBF7EE",
      surface: "#FFFFFF",
      workface: "#F0E7D4",
      workfaceHead: "#E2D3B4",
      workfaceBorder: "#D2C09C",
      foreground: "#2A2417",
      muted: "#F4EEE1",
      mutedForeground: "#6A5D45",
      border: "#E3DACA",
      success: "#2E7D4F",
      danger: "#C0392B",
      accent: "#F5C518",
    },
    radiusBtn: 14,
    radiusCard: 20,
  },
  {
    // 스시 레스토랑 — 먹빛 차콜 + 연어 오렌지
    // 다크는 명암 방향을 뒤집어 작업면(2·3칸)을 1칸보다 밝게 = 만지는 면이 앞으로 떠오름
    id: "charcoal-sushi",
    name: "먹빛 살몬",
    tagline: "야간 집중 · 다크",
    dark: true,
    colors: {
      primary: "#FF7A45",
      primaryDark: "#E85F28",
      primaryLight: "#FF9B70",
      primary50: "#2A1A12",
      primary100: "#3A2318",
      primary200: "#4E2F1E",
      primary800: "#FFC4A3",
      secondary: "#7FB069",
      background: "#101216",
      surface: "#1B1E24",
      workface: "#282D36",
      workfaceHead: "#333A45",
      workfaceBorder: "#3E4550",
      foreground: "#ECE7E1",
      muted: "#191C21",
      mutedForeground: "#A2A9B3",
      border: "#2A2F37",
      success: "#57C08A",
      danger: "#FF6B5E",
      accent: "#FFB07C",
    },
    radiusBtn: 10,
    radiusCard: 14,
  },
];

/** 셀렉트에 뜨는 최종 목록 (10종) */
export const LEARN_THEMES: LearnTheme[] = [...BASE_THEMES, ...IMAGE_THEMES];

export const DEFAULT_THEME_ID = "crown-refine";

export function getTheme(id: string): LearnTheme {
  return LEARN_THEMES.find((t) => t.id === id) ?? LEARN_THEMES[0];
}

/**
 * 테마를 CSS 변수 묶음으로 바꾼다. /learn 최상단 div 에 인라인으로 박는다.
 *
 * Tailwind v4 는 `@theme` 토큰을 CSS 변수로 컴파일하고 유틸리티가 그 변수를 참조한다
 * (`bg-primary` → `background-color: var(--color-primary)`).
 * 그래서 **여기서 같은 이름의 변수를 덮어쓰면 className 을 하나도 안 고쳐도**
 * /learn 안의 모든 색이 갈린다. 전역이 아니라 이 div 하위에만 적용되므로
 * 사이트의 나머지 화면은 영향이 없다.
 *
 * 2·3칸 작업면은 코드가 primary-100/200/300 을 쓰고 있어 그 자리에 workface 를 넣는다.
 * 흰 면(bg-white)은 globals.css 의 `.learn-root .bg-white` 규칙이 surface 로 돌린다.
 */
export function themeToCssVars(theme: LearnTheme): Record<string, string> {
  const c = theme.colors;
  return {
    /* Tailwind 토큰 덮어쓰기 — 기존 className 이 그대로 새 색을 먹는다 */
    "--color-primary": c.primary,
    "--color-primary-dark": c.primaryDark,
    "--color-primary-light": c.primaryLight,
    "--color-primary-50": c.primary50,
    "--color-primary-100": c.workface, // 2·3칸 작업면
    "--color-primary-200": c.workfaceHead, // 2·3칸 머리줄
    "--color-primary-300": c.workfaceBorder, // 작업면 보더
    "--color-primary-400": c.primaryLight,
    "--color-primary-500": c.primary,
    "--color-primary-600": c.primaryDark,
    "--color-primary-700": c.primaryDark,
    "--color-primary-800": c.primary800,
    "--color-primary-900": c.primary800,
    "--color-secondary": c.secondary,
    "--color-secondary-light": c.secondary,
    "--color-secondary-dark": c.secondary,
    "--color-accent": c.accent,
    "--color-accent-light": c.accent,
    "--color-accent-dark": c.accent,
    "--color-success": c.success,
    "--color-danger": c.danger,
    "--color-warning": c.accent,
    "--color-background": c.background,
    "--color-foreground": c.foreground,
    "--color-muted": c.muted,
    "--color-muted-foreground": c.mutedForeground,
    "--color-border": c.border,
    "--color-card": c.surface,
    "--color-card-foreground": c.foreground,
    "--gradient-brand": `linear-gradient(135deg, ${c.primary} 0%, ${c.secondary} 100%)`,
    "--radius-md": `${theme.radiusBtn}px`,
    "--radius-xl": `${theme.radiusCard}px`,

    /* /learn 전용 — globals.css 의 스코프 규칙이 쓴다 */
    "--lt-surface": c.surface,
    "--lt-workface": c.workface,
  };
}
