import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateIssueNumber } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { userId, certificateTypeId, deliveryMethod, mailingAddress, mailingZipCode, recipientName, recipientPhone } = await request.json();

    if (!userId || !certificateTypeId) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 합격 여부 확인
    const passedExam = await db.examSubmission.findFirst({
      where: {
        userId,
        passed: true,
        exam: { certificateTypeId },
      },
    });

    if (!passedExam) {
      return NextResponse.json(
        { error: "해당 자격증의 합격 기록이 없습니다." },
        { status: 400 }
      );
    }

    // 인증번호 생성
    const issueNumber = generateIssueNumber();

    // 인증서 발급 레코드 생성
    const issuance = await db.certificateIssuance.create({
      data: {
        userId,
        certificateTypeId,
        issueNumber,
        deliveryMethod: deliveryMethod || "EMAIL",
        mailingAddress: mailingAddress || null,
        mailingZipCode: mailingZipCode || null,
        recipientName: recipientName || null,
        recipientPhone: recipientPhone || null,
        status: "PENDING",
      },
    });

    // TODO: PDF 생성 및 이메일 발송 로직 추가
    // TODO: QR 코드 생성

    return NextResponse.json({
      success: true,
      issueNumber: issuance.issueNumber,
      issuanceId: issuance.id,
    });
  } catch (error) {
    console.error("Certificate issuance error:", error);
    return NextResponse.json(
      { error: "인증서 발급 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
