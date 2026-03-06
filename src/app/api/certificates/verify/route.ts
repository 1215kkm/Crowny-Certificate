import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    const issuance = await db.certificateIssuance.findUnique({
      where: { issueNumber },
      include: {
        user: { select: { name: true } },
        certificateType: { select: { name: true, grade: true } },
      },
    });

    if (!issuance) {
      return NextResponse.json(
        { valid: false, error: "유효하지 않은 인증번호입니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      data: {
        issueNumber: issuance.issueNumber,
        recipientName: issuance.user.name,
        certificateName: issuance.certificateType.name,
        grade: issuance.certificateType.grade,
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
