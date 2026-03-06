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

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}시간`;
  return `${hours}시간 ${mins}분`;
}

export function formatTimestamp(timestamp: { toDate: () => Date } | null): string {
  if (!timestamp) return "-";
  const date = timestamp.toDate();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export const DELIVERY_METHOD_MAP: Record<string, string> = {
  EMAIL: "이메일",
  MAIL: "우편",
  BOTH: "이메일+우편",
};

export const ISSUANCE_STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING: { label: "발급 대기", className: "bg-orange-100 text-orange-700" },
  GENERATING: { label: "생성 중", className: "bg-yellow-100 text-yellow-700" },
  ISSUED: { label: "발급 완료", className: "bg-green-100 text-green-700" },
  MAILING: { label: "배송 중", className: "bg-blue-100 text-blue-700" },
  DELIVERED: { label: "배송 완료", className: "bg-green-100 text-green-700" },
};
