/**
 * 「따라하며 배우는 코딩」 학습 데이터 타입.
 *
 * 설계 원칙
 * - 초등학생이 읽어도 이해되는 문장. 한자어·영어 약어는 처음 등장 시 괄호로 풀이.
 * - 콘텐츠는 전부 이 타입에 맞춘 TS 파일로 작성한다 (src/data/learn/courses/*).
 *   → 기존 src/data/grade-*.ts 와 같은 패턴.
 * - 유료화 대비: 모든 단계에 tier 를 심어둔다. 지금은 전부 "free".
 */

/** 상단에서 고르는 언어·프레임워크 */
export type TrackId =
  | "html"
  | "javascript"
  | "jquery"
  | "react"
  | "vue"
  | "angular";

/** 무료 / 유료 (지금은 전부 free, 나중에 기획·UX고도화·마케팅을 pro 로 전환) */
export type Tier = "free" | "pro";

/** 1번칸 학습 목차의 7단계 */
export type StageId =
  | "topic" // 1 주제 정하기
  | "promo" // 2 홍보 방법 학습
  | "plan" // 3 기획하기
  | "design" // 4 디자인
  | "stack" // 5 구현 방법 정하기
  | "build" // 6 따라하기
  | "deploy"; // 7 배포하기

export const STAGE_ORDER: StageId[] = [
  "topic",
  "promo",
  "plan",
  "design",
  "stack",
  "build",
  "deploy",
];

export const STAGE_LABELS: Record<StageId, string> = {
  topic: "주제 정하기",
  promo: "홍보 방법 배우기",
  plan: "기획하기",
  design: "디자인하기",
  stack: "구현 방법 정하기",
  build: "따라하기",
  deploy: "배포하기",
};

/**
 * 선생(2번칸) 설명 한 단락.
 * 평소에는 아주 연하게 깔려 있다가, 키를 누르거나 NEXT 를 누르면
 * 타이핑 효과로 또렷하게 나타난다.
 */
export interface Paragraph {
  /** 화면에 타이핑될 문장 */
  text: string;
  /** 말머리 아이콘 종류 — 목표/이유/할일/다음/위치 */
  kind?: "goal" | "why" | "what" | "next" | "where" | "tip";
}

/** 비교표·선택지 카드 (예: 경쟁 프로그램 비교, 서버 비교) */
export interface CompareCard {
  title: string;
  body: string;
  /** 이 샘플에서 최종적으로 고른 것인가 */
  picked?: boolean;
  /** 고른 이유 / 안 고른 이유 */
  note?: string;
}

/**
 * 1~5단계(주제·홍보·기획·디자인·구현방법) 화면 한 개.
 * 학생은 practiceText 를 따라 치거나, "건너뛰고 붙여넣기" 를 눌러 채운다.
 */
export interface StageContent {
  id: StageId;
  no: number;
  title: string;
  /** 한 줄 요약 — 목차에 같이 보여준다 */
  summary: string;
  tier: Tier;
  /** 이 단계를 마치면 무엇을 얻는가 */
  goal: string;
  /** 선생 설명 — 한 단락씩 타이핑된다 */
  paragraphs: Paragraph[];
  /** 비교표가 필요한 단계(기획·디자인·구현방법)에서 사용 */
  cards?: CompareCard[];
  /**
   * 학생이 따라 칠 내용. 없으면 따라치기 영역을 숨긴다.
   *
   * ⚠ 한글 자판으로 바로 칠 수 있는 글자만 쓸 것.
   *   금지 — 원문자(①②③), 화살표(→), 낫표(「」), 별표(⭐), 가운뎃점(·), 줄표(—)
   *   이런 기호는 특수문자 입력을 거쳐야 해서 초등학생이 여기서 막힌다.
   *   설명(paragraphs)·카드(cards)는 읽기만 하므로 써도 된다.
   */
  practiceText?: string;
  /** 따라치기 영역 위에 붙는 안내 문구 */
  practiceLabel?: string;
}

/**
 * 터미널에 **한 줄씩** 따라 치는 명령어 한 줄.
 *
 * 네 줄을 한꺼번에 실행해 버리면 "뭐가 어떻게 생긴 건지" 모르고 넘어간다.
 * 그래서 한 줄 → 결과 → 한 줄 → 결과 순으로 끊어서 보여준다.
 */
export interface ScaffoldLine {
  /** 터미널에 칠 명령어 한 줄 */
  text: string;
  /** 이 줄이 무슨 뜻인지 한 마디 (치기 전에 읽는다) */
  does: string;
  /** 실행하면 터미널에 한 줄씩 뜨는 글 */
  output: string[];
  /** 이 줄 때문에 생기는 파일 경로 (step.files 안에 있어야 한다) */
  creates?: string[];
  /** 진행 애니메이션 종류 — 설치는 진행 막대, 실행은 초록 불 */
  effect?: "install" | "serve";
}

/**
 * 6단계 「따라하기」의 한 스텝.
 * 선생(2번칸)이 먼저 보여주고 → 학생(3번칸)이 같은 파일을 만든다.
 */
export interface BuildStep {
  id: string;
  title: string;
  /** 목표 — 이번 스텝이 끝나면 화면이 어떻게 되는가 */
  goal: string;
  /** 이제 무엇을 왜 하려는지 */
  why: string;
  /** 뭘 해야 하는지 */
  what: string;
  /** 코드를 어디에 넣어야 되는지 */
  where: string;
  /** 다음에는 뭘 할 건지 */
  next: string;
  /** 이번 스텝에서 새로 만드는 폴더 (예: "/src/pages") */
  createFolders?: string[];
  /**
   * 이 스텝이 "명령어를 쳐서 파일이 저절로 생기는" 단계일 때 채운다.
   * 학생은 파일을 손으로 만들지 않고, 명령어를 **한 줄씩 따라 치면** 그 줄이
   * 만드는 파일이 하나씩 생긴다.
   * (실제로는 npm 이 만들어 주는 걸, 여기서는 같은 결과가 나오도록 흉내 낸다)
   */
  scaffold?: {
    /** 터미널 상자 아래 붙는 한 줄 설명 */
    note: string;
    /** 위에서부터 한 줄씩 치는 명령어들 */
    lines: ScaffoldLine[];
  };
  /**
   * 이번 스텝에서 만들거나 고치는 파일.
   * code 는 "이 스텝이 끝났을 때의 파일 전체 내용" 이다.
   */
  files: {
    path: string;
    code: string;
    /** 새로 만드는 파일인지, 기존 파일을 고치는 것인지 */
    action: "create" | "edit";
    /** 학생에게 주는 힌트 한 줄 */
    hint?: string;
  }[];
}

/** 7단계 배포 — 클릭해서 따라가는 체크리스트 */
export interface DeployStep {
  id: string;
  title: string;
  /** 왜 이걸 하는지 */
  why: string;
  /** 실제로 눌러야 하는 것들 */
  actions: string[];
  /** 복사해서 쓸 명령어 (없을 수 있음) */
  command?: string;
  /** 바로 열어볼 수 있는 바깥 링크 */
  link?: { label: string; href: string };
}

/** 학습 주제 하나 (= 샘플 앱 하나) */
export interface Course {
  id: string;
  track: TrackId;
  /** 목차 맨 위에 뜨는 이름 */
  title: string;
  /** 한 줄 설명 */
  subtitle: string;
  /** 난이도 표시 */
  level: "왕초보" | "초보" | "중급";
  /** 예상 소요 시간 */
  duration: string;
  /** 만들 페이지 이름 3개 이상 */
  pages: string[];
  /** Sandpack 실행 템플릿 */
  template: "react" | "vanilla" | "vue" | "angular" | "static";
  /** 1~5단계 콘텐츠 */
  stages: StageContent[];
  /** 6단계 따라하기 스텝들 */
  buildSteps: BuildStep[];
  /** 7단계 배포 체크리스트 */
  deploySteps: DeployStep[];
  /** 학생이 처음 받는 파일 (거의 빈 상태) */
  starterFiles: Record<string, string>;
  /** Sandpack 에 넘길 추가 npm 패키지 */
  dependencies?: Record<string, string>;
}

/** 상단 언어 탭 하나 */
export interface Track {
  id: TrackId;
  label: string;
  /** 뱃지에 쓰는 짧은 설명 */
  tagline: string;
  /** 준비된 주제들 */
  courses: Course[];
  /** 아직 콘텐츠가 없으면 "준비 중" 으로 표시 */
  ready: boolean;
}
