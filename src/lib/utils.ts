import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function generateIssueNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CRN-${year}-${random}`;
}

export function getGradeLabel(grade: string): string {
  const labels: Record<string, string> = {
    GRADE_3: "3급",
    GRADE_2: "2급",
    GRADE_1: "1급",
    SPECIAL: "특급",
  };
  return labels[grade] || grade;
}

export function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    GRADE_3: "bg-blue-500",
    GRADE_2: "bg-purple-500",
    GRADE_1: "bg-orange-500",
    SPECIAL: "bg-red-500",
  };
  return colors[grade] || "bg-gray-500";
}
