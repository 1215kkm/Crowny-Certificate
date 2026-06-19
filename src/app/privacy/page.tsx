export const metadata = { title: "개인정보처리방침 | Crowny AI 자격증" };

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "1. 수집하는 개인정보 항목",
    body: [
      "회원가입 시: 이름, 이메일, 비밀번호, 연락처(선택), 주소(선택), 주민등록번호 앞 6자리 및 뒷자리 첫 번째 숫자(생년월일·자격증 발급 본인 확인용).",
      "서비스 이용 시: 시험 응시·제출 기록, 결제 내역, 합격작 제출물, 문의 내용 및 첨부파일.",
    ],
  },
  {
    title: "2. 개인정보의 수집·이용 목적",
    body: [
      "회원 식별 및 관리, 시험 응시·채점·합격 판정, 자격증(합격증) 발급 및 본인 확인.",
      "결제·환불 처리, 문의 응대, 서비스 개선 및 부정행위 방지.",
    ],
  },
  {
    title: "3. 주민등록번호 처리",
    body: [
      "회사는 자격증 발급의 본인 확인 목적에 한하여 주민등록번호 앞 6자리(생년월일)와 뒷자리 첫 번째 숫자만 수집하며, 전체 주민등록번호는 수집·저장하지 않습니다.",
    ],
  },
  {
    title: "4. 개인정보의 보유 및 이용기간",
    body: [
      "회원 탈퇴 시 지체 없이 파기하는 것을 원칙으로 합니다. 다만 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.",
      "전자상거래 등에서의 소비자보호에 관한 법률에 따라 계약·결제·환불 기록은 5년, 소비자 불만·분쟁처리 기록은 3년 보관합니다.",
      "발급된 합격증(PDF)은 발급일로부터 1개월간 보관 후 자동 삭제됩니다.",
    ],
  },
  {
    title: "5. 개인정보의 제3자 제공",
    body: [
      "회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 결제 처리를 위한 결제대행사(토스페이먼츠) 등 서비스 제공에 필요한 경우, 또는 법령에 근거한 경우에 한해 제공합니다.",
    ],
  },
  {
    title: "6. 개인정보의 파기",
    body: [
      "보유기간이 경과하거나 처리목적이 달성된 개인정보는 지체 없이 파기합니다. 전자적 파일은 복구 불가능한 방법으로 삭제합니다.",
    ],
  },
  {
    title: "7. 이용자의 권리",
    body: [
      "이용자는 언제든지 본인의 개인정보 조회·수정(마이페이지 > 내정보 수정) 및 회원 탈퇴(처리 정지)를 요청할 수 있습니다.",
    ],
  },
  {
    title: "8. 개인정보 보호책임자",
    body: [
      "개인정보 관련 문의: rute20002@gmail.com (문의하기 메뉴 이용 가능).",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">개인정보처리방침</h1>
      <p className="text-muted-foreground mb-8">
        Crowny AI 자격증은 이용자의 개인정보를 중요시하며 관련 법령을 준수합니다.
      </p>
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
