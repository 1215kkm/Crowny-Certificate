import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

/**
 * 합격증 렌더용 데이터 (본인만). 발급일 + 30일까지 열람/다운로드 가능.
 * POST /api/certificates/cert-data  Body: { issuanceId }
 */
const GRADE_MAP: Record<string, { label: string; qual: string; badge: string }> = {
  GRADE_3: { label: "3급", qual: "AIAT 3급 (AI 활용 입문자)", badge: "linear-gradient(135deg,#6a9a3a,#3f7020)" },
  GRADE_2: { label: "2급", qual: "AIAT 2급 (AI 활용 우수자)", badge: "linear-gradient(135deg,#3a8fd0,#1f5fa8)" },
  GRADE_1: { label: "1급", qual: "AIAT 1급 (AI 활용 전문가)", badge: "linear-gradient(135deg,#5b5be0,#3a3ac0)" },
  SPECIAL: { label: "특급", qual: "AIAT 특급 (AI 활용 마스터)", badge: "linear-gradient(135deg,#c0392b,#7b241c)" },
};

function fmtDot(d: Date) {
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;
}
function fmtKo(d: Date) {
  return `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, "0")}월 ${String(d.getDate()).padStart(2, "0")}일`;
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    const decoded = await adminAuth.verifyIdToken(authHeader.split("Bearer ")[1]);
    const userId = decoded.uid;

    const { issuanceId } = await request.json();
    if (!issuanceId) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });

    const issDoc = await adminDb.collection("certificateIssuances").doc(issuanceId).get();
    if (!issDoc.exists) return NextResponse.json({ error: "발급 내역이 없습니다." }, { status: 404 });
    const iss = issDoc.data()!;

    // 본인 또는 관리자만
    const me = await adminDb.collection("users").doc(userId).get();
    const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(me.data()?.role);
    if (iss.userId !== userId && !isAdmin) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    // 1달 보관: 발급/생성일 + 30일
    const created: Date = iss.createdAt?.toDate?.() ?? new Date();
    const issued: Date = iss.issuedAt?.toDate?.() ?? created;
    const expireAt = new Date(created.getTime() + 30 * 24 * 3600 * 1000);
    const expired = Date.now() > expireAt.getTime();

    const owner = await adminDb.collection("users").doc(iss.userId).get();
    const ownerData = owner.data() || {};
    const certType = await adminDb.collection("certificateTypes").doc(iss.certificateTypeId).get();
    const grade = certType.data()?.grade ?? "GRADE_3";
    const g = GRADE_MAP[grade] || GRADE_MAP.GRADE_3;

    let birth = "-";
    if (ownerData.birthDate) {
      const bd = new Date(ownerData.birthDate);
      if (!isNaN(bd.getTime())) birth = fmtDot(bd);
    }

    // 주민번호: 수집한 앞6+뒤1만 표시하고 나머지는 마스킹
    const rrn = ownerData.rrn ? `${ownerData.rrn}` + "•".repeat(6) : "-";

    return NextResponse.json({
      expired,
      expireAt: fmtKo(expireAt),
      data: {
        name: ownerData.name || "-",
        birthDate: birth,
        rrn,
        gradeLabel: g.label,
        qualLine: g.qual,
        badgeBg: g.badge,
        issueNumber: iss.issueNumber || "-",
        docNumber: iss.issueNumber || "-",
        issuedDate: fmtDot(issued),
        issuedDateKo: fmtKo(issued),
      },
    });
  } catch (error) {
    console.error("cert-data error:", error);
    return NextResponse.json({ error: "조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}
