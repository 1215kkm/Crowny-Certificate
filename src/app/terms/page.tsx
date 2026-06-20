export const metadata = { title: "이용약관 | Crowny AI 자격증" };

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "제1조 (목적)",
    body: [
      "본 약관은 Crowny AI 자격증(이하 \"회사\")이 웹사이트(https://kaiat.kr)를 통해 제공하는 온라인 강의·시험·자격증 발급 등 서비스(이하 \"서비스\")의 이용과 관련하여 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.",
    ],
  },
  {
    title: "제2조 (정의)",
    body: [
      "\"이용자\"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원을 말합니다.",
      "\"회원\"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 서비스를 지속적으로 이용할 수 있는 자를 말합니다.",
    ],
  },
  {
    title: "제3조 (약관의 효력 및 변경)",
    body: [
      "본 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.",
      "회사는 관련 법령을 위반하지 않는 범위에서 약관을 개정할 수 있으며, 변경 시 적용일자와 변경사유를 명시하여 사전 공지합니다.",
    ],
  },
  {
    title: "제4조 (서비스의 제공)",
    body: [
      "회사는 AI 활용 능력 강의, 자격 시험 응시, 합격증(자격증) 발급, 합격작 갤러리 등의 서비스를 제공합니다.",
      "회사는 운영상·기술상 필요에 따라 제공하는 서비스의 내용을 변경할 수 있습니다.",
    ],
  },
  {
    title: "제5조 (결제 및 환불)",
    body: [
      "강의 수강료·시험 응시료·자격증 발급비 등의 결제 금액은 각 상품 페이지에 표시된 바에 따릅니다.",
      "환불은 별도 고지된 환불 약정 및 관련 법령(콘텐츠이용자보호지침 등)에 따라 처리됩니다. 시험은 응시(시작) 전 전액 환불, 응시 후 환불 불가를 원칙으로 합니다.",
    ],
  },
  {
    title: "제6조 (이용자의 의무)",
    body: [
      "이용자는 시험 응시 시 부정행위(대리응시, 화면 캡처·복제, 외부 도움 등)를 하여서는 안 됩니다.",
      "이용자는 타인의 정보를 도용하거나 허위 정보를 등록해서는 안 되며, 위반 시 합격·자격이 취소될 수 있습니다.",
    ],
  },
  {
    title: "제7조 (지적재산권)",
    body: [
      "서비스에 포함된 강의 콘텐츠, 문제, 디자인 등에 대한 저작권 및 지적재산권은 회사에 귀속됩니다.",
      "이용자가 제출한 합격작의 저작권은 이용자에게 있으며, 공개(합격작 갤러리) 동의 시 회사는 이를 홍보 등의 목적으로 노출할 수 있습니다.",
    ],
  },
  {
    title: "제8조 (책임의 한계)",
    body: [
      "회사는 천재지변, 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">이용약관</h1>
      <p className="text-muted-foreground mb-8">Crowny AI 자격증 서비스 이용약관입니다.</p>
      <div className="space-y-6">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-bold mb-2">{s.title}</h2>
            <ul className="space-y-1.5 text-sm text-foreground leading-relaxed list-disc pl-5">
              {s.body.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-10">시행일: 2026년 6월 19일</p>
    </div>
  );
}
