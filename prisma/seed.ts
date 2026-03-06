import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 관리자 계정 생성
  const adminPassword = await bcrypt.hash("admin1234", 12);
  await prisma.user.upsert({
    where: { email: "admin@crowny.co.kr" },
    update: {},
    create: {
      email: "admin@crowny.co.kr",
      name: "관리자",
      hashedPassword: adminPassword,
      role: "ADMIN",
    },
  });

  // 자격증 종류 등록
  const certTypes = [
    {
      name: "Crowny AI 활용 자격증 3급",
      grade: "GRADE_3" as const,
      description:
        "AI 도구 5종 이상 활용 능력을 검증합니다. 프롬프트 엔지니어링 기초, AI 도구 활용 실습을 포함합니다.",
      examFormat: "MULTIPLE_CHOICE" as const,
      price: 30000,
      coursePrice: 59000,
      certPrice: 10000,
      passingScore: 70,
      duration: 60,
    },
    {
      name: "Crowny AI 활용 자격증 2급",
      grade: "GRADE_2" as const,
      description:
        "AI를 활용한 UI 디자인 및 프론트엔드 구현 능력을 검증합니다. v0, Cursor, Figma AI 등 활용 실기 시험.",
      examFormat: "PRACTICAL" as const,
      price: 50000,
      coursePrice: 89000,
      certPrice: 10000,
      passingScore: 70,
      duration: 120,
    },
    {
      name: "Crowny AI 활용 자격증 1급",
      grade: "GRADE_1" as const,
      description:
        "AI를 활용한 풀스택 웹 애플리케이션 제작 능력을 검증합니다. UI/UX + 프론트엔드 + 백엔드 API 연동.",
      examFormat: "PROJECT" as const,
      price: 80000,
      coursePrice: 129000,
      certPrice: 10000,
      passingScore: 80,
      duration: 10080, // 7일 (분)
    },
    {
      name: "Crowny AI 활용 자격증 특급",
      grade: "SPECIAL" as const,
      description:
        "실제 비즈니스 문제를 AI로 분석하고 솔루션을 제작하는 최고급 문제해결 능력을 검증합니다.",
      examFormat: "CHALLENGE" as const,
      price: 120000,
      coursePrice: 199000,
      certPrice: 10000,
      passingScore: 80,
      duration: 2880, // 48시간 (분)
    },
  ];

  for (const certType of certTypes) {
    await prisma.certificateType.upsert({
      where: { id: certType.grade },
      update: certType,
      create: { id: certType.grade, ...certType },
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
