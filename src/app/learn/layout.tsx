import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "따라하며 코딩 배우기 — 초등학생도 만드는 진짜 앱",
  description:
    "로그인 없이 바로 시작하는 코딩 학습. 주제 정하기부터 기획·디자인·구현·배포까지, 제가 먼저 만들면 그대로 따라 만들면 됩니다. React 로 만드는 3페이지 할 일 앱부터.",
  alternates: { canonical: "/learn" },
  openGraph: {
    title: "따라하며 코딩 배우기 | KAIAT",
    description:
      "기획부터 배포까지 7단계. 왼쪽에서 보여주면 오른쪽에서 따라 만들고, 오른쪽 끝에서 바로 실행됩니다.",
    url: "/learn",
  },
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
