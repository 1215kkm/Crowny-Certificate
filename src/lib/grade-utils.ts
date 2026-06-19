import type { CertificateGrade } from "./firestore";

export const GRADE_MAP: Record<CertificateGrade, { label: string; color: string }> = {
  GRADE_3: { label: "3급", color: "bg-blue-500" },
  GRADE_2: { label: "2급", color: "bg-purple-500" },
  GRADE_1: { label: "1급", color: "bg-orange-500" },
  SPECIAL: { label: "특급", color: "bg-red-500" },
};

export function getGradeInfo(grade: CertificateGrade) {
  return GRADE_MAP[grade] || { label: grade, color: "bg-gray-500" };
}

// 등급별 썸네일 (public 폴더)
export const GRADE_THUMB: Record<CertificateGrade, string> = {
  GRADE_3: "/grade3.png",
  GRADE_2: "/grade2.png",
  GRADE_1: "/grade1.png",
  SPECIAL: "/gradeS.png",
};

export function getGradeThumb(grade: CertificateGrade | undefined | null): string | null {
  return grade && grade in GRADE_THUMB ? GRADE_THUMB[grade as CertificateGrade] : null;
}

// 등급별 "이 시험을 통해 키우려는 역량" 기본 문구.
// 관리자가 certificateTypes.competencies를 비워두면 이 문구를 노출하고,
// 관리자 페이지에서는 이 문구를 미리 채워(초안) 수정할 수 있게 한다.
export const GRADE_COMPETENCIES: Record<CertificateGrade, string> = {
  GRADE_3:
    "AI 도구(챗봇 등)의 기본 개념과 사용법을 이해하고, 일상·학습·업무에서 프롬프트를 작성해 원하는 결과를 얻는 기초 활용 능력을 기릅니다.\nAI를 두려움 없이 다루는 디지털 리터러시와, 결과를 비판적으로 검토하는 안목을 키웁니다.",
  GRADE_2:
    "프롬프트 엔지니어링으로 AI를 활용해 실제 동작하는 랜딩페이지·UI를 기획하고 제작하는 능력을 기릅니다.\n디자인 의도를 AI에게 정확히 전달하고, 생성된 결과물을 목적에 맞게 다듬어 완성도를 높이는 협업 역량을 키웁니다.",
  GRADE_1:
    "AI를 활용해 프론트엔드부터 백엔드·배포까지, 실제 사용 가능한 웹 애플리케이션을 완성하는 능력을 기릅니다.\n문제를 구조화해 AI와 협업하고, 동작하는 제품으로 구현·검증하는 풀스택 개발 역량을 키웁니다.",
  SPECIAL:
    "실제 비즈니스·사회 문제를 스스로 정의하고, AI를 활용해 시장조사부터 기획·디자인·개발·배포·홍보까지 제품의 전 주기를 완수하는 종합 문제해결 역량을 기릅니다.\n제한된 시간 안에 가치 있는 결과물을 만들어내는 실전 실행력을 검증합니다.",
};

export function getGradeCompetencies(grade: CertificateGrade | undefined | null): string {
  return grade && grade in GRADE_COMPETENCIES ? GRADE_COMPETENCIES[grade as CertificateGrade] : "";
}

// 등급별 "합격기준" 기본(초안) 문구 — 합격 점수 + 실기 감점 요인 포함.
// 관리자가 certificateTypes.passingCriteria를 비워두면 노출하고,
// 관리자 페이지에서는 초안으로 미리 채워 수정할 수 있게 한다.
export function getDefaultPassingCriteria(
  grade: CertificateGrade | undefined | null,
  passingScore?: number
): string {
  const s = passingScore ?? (grade === "SPECIAL" ? 60 : 70);
  switch (grade) {
    case "SPECIAL":
      return [
        `• 제품 챌린지(실기 단독) 100점 만점 중 ${s}점 이상 시 합격합니다.`,
        `• 시장조사 → 기획 → 디자인 → 개발 → 배포 → 홍보까지 제품 전 주기를 종합 평가합니다.`,
        ``,
        `[실기 감점 요인]`,
        `• 배포 URL 미작동 또는 데모 시연 불가`,
        `• 문제 정의·시장조사의 구체성/근거 부족`,
        `• 기획 의도 대비 구현 완성도 미흡`,
        `• 핵심 기능 미작동 또는 치명적 버그`,
        `• 홍보물·시연 자료 부실`,
        `• 제한 시간 초과 제출`,
        `• AI 활용 내역 미제출 또는 불충분`,
      ].join("\n");
    case "GRADE_2":
      return [
        `• 필기와 실기를 각각 ${s}점 이상 받아야 최종 합격합니다. (두 영역 모두 충족 필요)`,
        `• 실기는 AI를 활용한 랜딩페이지/UI 제작 결과물로 평가합니다.`,
        ``,
        `[실기 감점 요인]`,
        `• 요구한 섹션(히어로·아이콘·제품·배너 등) 누락 또는 미완성`,
        `• 디자인 일관성 부족(색상·여백·정렬이 어긋남)`,
        `• 텍스트 가독성 저하 및 오탈자`,
        `• 반응형 미대응(모바일에서 레이아웃 깨짐)`,
        `• 동작하지 않는 링크/버튼`,
        `• AI 활용 내역 미제출 또는 불충분`,
      ].join("\n");
    case "GRADE_1":
      return [
        `• 필기와 실기를 각각 ${s}점 이상 받아야 최종 합격합니다. (두 영역 모두 충족 필요)`,
        `• 실기는 배포된 웹 애플리케이션과 코드로 평가합니다.`,
        ``,
        `[실기 감점 요인]`,
        `• 배포 URL 미작동 또는 핵심 기능 미구현`,
        `• 프론트엔드-백엔드 연동 오류(데이터 저장/조회 실패)`,
        `• 예외 처리 부재로 오류가 그대로 노출`,
        `• UI 완성도 및 사용성 부족`,
        `• 코드 구조·가독성 미흡`,
        `• AI 활용 내역 미제출 또는 불충분`,
      ].join("\n");
    default:
      return [
        `• 필기(객관식) 시험에서 ${s}점 이상 시 합격합니다.`,
        `• 등록된 문제 은행에서 문항이 무작위로 출제됩니다.`,
        ``,
        `[유의사항 / 감점 요인]`,
        `• 시험 중 화면 캡처·복사·우클릭·탭 이동 등은 부정행위로 기록됩니다.`,
        `• 부정행위가 누적되면 채점에서 불이익을 받거나 불합격 처리될 수 있습니다.`,
        `• 시험 시작 후 새로고침 시 진행 상황이 초기화됩니다.`,
      ].join("\n");
  }
}

// 표시 순서: 3급 → 2급 → 1급 → 특급
export const GRADE_ORDER: Record<string, number> = {
  GRADE_3: 0,
  GRADE_2: 1,
  GRADE_1: 2,
  SPECIAL: 3,
};

export function gradeRank(grade: string | undefined | null): number {
  return grade && grade in GRADE_ORDER ? GRADE_ORDER[grade] : 99;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}시간`;
  return `${hours}시간 ${mins}분`;
}

// Firestore Timestamp({toDate}), ISO 문자열, 숫자(millis), {seconds} 모두 처리
export function formatTimestamp(
  timestamp: { toDate: () => Date } | { seconds: number } | string | number | null | undefined
): string {
  if (!timestamp) return "-";
  let date: Date;
  if (typeof timestamp === "string" || typeof timestamp === "number") {
    date = new Date(timestamp);
  } else if (typeof (timestamp as { toDate?: unknown }).toDate === "function") {
    date = (timestamp as { toDate: () => Date }).toDate();
  } else if (typeof (timestamp as { seconds?: number }).seconds === "number") {
    date = new Date((timestamp as { seconds: number }).seconds * 1000);
  } else {
    return "-";
  }
  if (isNaN(date.getTime())) return "-";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export const INQUIRY_CATEGORY_MAP: Record<string, string> = {
  EXAM: "시험/채점",
  CERTIFICATE: "자격증 발급",
  PAYMENT: "결제/환불",
  COURSE: "강의",
  ETC: "기타",
};

export const INQUIRY_CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "EXAM", label: "시험/채점" },
  { value: "CERTIFICATE", label: "자격증 발급" },
  { value: "PAYMENT", label: "결제/환불" },
  { value: "COURSE", label: "강의" },
  { value: "ETC", label: "기타" },
];

export const DELIVERY_METHOD_MAP: Record<string, string> = {
  EMAIL: "이메일",
  BOTH: "이메일+우편",
  // 구버전 호환
  MAIL: "우편",
};

export const ISSUANCE_STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING: { label: "준비중", className: "bg-orange-100 text-orange-700" },
  CONFIRMED: { label: "확인완료", className: "bg-green-100 text-green-700" },
  SHIPPING: { label: "배송중", className: "bg-blue-100 text-blue-700" },
  DELIVERED: { label: "배송완료", className: "bg-green-100 text-green-700" },
  // 구버전 호환
  GENERATING: { label: "준비중", className: "bg-orange-100 text-orange-700" },
  ISSUED: { label: "확인완료", className: "bg-green-100 text-green-700" },
  MAILING: { label: "배송중", className: "bg-blue-100 text-blue-700" },
};
