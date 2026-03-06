import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { generateIssueNumber } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    // 인증 확인
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { certificateTypeId, deliveryMethod, mailingAddress, mailingZipCode, recipientName, recipientPhone } = await request.json();

    if (!certificateTypeId) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 합격 여부 확인
    const submissionsSnapshot = await adminDb
      .collection("examSubmissions")
      .where("userId", "==", userId)
      .where("passed", "==", true)
      .get();

    let hasPassed = false;
    for (const doc of submissionsSnapshot.docs) {
      const submission = doc.data();
      const examDoc = await adminDb.collection("exams").doc(submission.examId).get();
      if (examDoc.exists && examDoc.data()?.certificateTypeId === certificateTypeId) {
        hasPassed = true;
        break;
      }
    }

    if (!hasPassed) {
      return NextResponse.json(
        { error: "해당 자격증의 합격 기록이 없습니다." },
        { status: 400 }
      );
    }

    const issueNumber = generateIssueNumber();

    const issuanceRef = await adminDb.collection("certificateIssuances").add({
      userId,
      certificateTypeId,
      issueNumber,
      deliveryMethod: deliveryMethod || "EMAIL",
      mailingAddress: mailingAddress || null,
      mailingZipCode: mailingZipCode || null,
      recipientName: recipientName || null,
      recipientPhone: recipientPhone || null,
      status: "PENDING",
      issuedAt: null,
      pdfUrl: null,
      trackingNumber: null,
      paymentId: null,
      qrCodeUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      issueNumber,
      issuanceId: issuanceRef.id,
    });
  } catch (error) {
    console.error("Certificate issuance error:", error);
    return NextResponse.json(
      { error: "인증서 발급 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
