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

    return NextResponse.json({
      valid: true,
      data: {
        issueNumber: issuance.issueNumber,
        recipientName: userName,
        certificateName: certType?.name || "알 수 없음",
        grade: certType?.grade || "GRADE_3",
        issuedAt: issuance.issuedAt,
        status: issuance.status,
      },
    });
  } catch (error) {
    console.error("Certificate verification error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
