import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const issueNumber = searchParams.get("issueNumber");

    if (!issueNumber) {
      return NextResponse.json(
        { error: "인증번호를 입력해주세요." },
        { status: 400 }
      );
    }

    const snapshot = await adminDb
      .collection("certificateIssuances")
      .where("issueNumber", "==", issueNumber)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { valid: false, error: "유효하지 않은 인증번호입니다." },
        { status: 404 }
      );
    }

    const issuance = snapshot.docs[0].data();

    const userDoc = await adminDb.collection("users").doc(issuance.userId).get();
    const userName = userDoc.exists ? userDoc.data()?.name : null;

    const certTypeDoc = await adminDb.collection("certificateTypes").doc(issuance.certificateTypeId).get();
    const certType = certTypeDoc.exists ? certTypeDoc.data() : null;

    // 발급일 직렬화 (Timestamp → YYYY-MM-DD)
    let issuedAt = "-";
    const raw = issuance.issuedAt ?? issuance.createdAt;
    const d = raw?.toDate ? raw.toDate() : null;
    if (d) {
      issuedAt = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }

    const certificate = {
      issueNumber: issuance.issueNumber,
      recipientName: userName || issuance.recipientName || "-",
      certificateName: certType?.name || "알 수 없음",
      grade: certType?.grade || "GRADE_3",
      issuedAt,
      status: issuance.status,
    };

    // 구버전(page에서 data.data 사용) 및 신버전(certificate) 모두 호환
    return NextResponse.json({ valid: true, certificate, data: certificate });
  } catch (error) {
    console.error("Certificate verification error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
