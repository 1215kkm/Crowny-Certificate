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
