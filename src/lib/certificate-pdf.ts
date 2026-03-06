// 인증서 PDF 생성 유틸리티
// 실제 구현 시 @react-pdf/renderer 또는 Puppeteer 사용

export interface CertificateData {
  recipientName: string;
  issueNumber: string;
  gradeName: string;
  gradeTitle: string;
  issuedAt: Date;
  qrCodeUrl: string;
}

// PDF 생성을 위한 HTML 템플릿
export function generateCertificateHTML(data: CertificateData): string {
  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(data.issuedAt);

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: A4 landscape; margin: 0; }
    body {
      font-family: 'Noto Sans KR', sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: white;
    }
    .certificate {
      width: 297mm;
      height: 210mm;
      border: 3px solid #1a365d;
      padding: 20mm;
      box-sizing: border-box;
      position: relative;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }
    .certificate::before {
      content: '';
      position: absolute;
      top: 8mm;
      left: 8mm;
      right: 8mm;
      bottom: 8mm;
      border: 1px solid #cbd5e1;
    }
    .header {
      text-align: center;
      margin-bottom: 15mm;
    }
    .header h1 {
      font-size: 36px;
      color: #1a365d;
      letter-spacing: 8px;
      margin: 0;
    }
    .header .subtitle {
      font-size: 14px;
      color: #64748b;
      margin-top: 5mm;
    }
    .body {
      text-align: center;
      margin: 15mm 0;
    }
    .grade-badge {
      display: inline-block;
      background: #2563eb;
      color: white;
      padding: 4mm 10mm;
      border-radius: 4mm;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8mm;
    }
    .recipient-name {
      font-size: 40px;
      font-weight: bold;
      color: #0f172a;
      margin: 8mm 0;
    }
    .description {
      font-size: 16px;
      color: #334155;
      line-height: 1.8;
      max-width: 180mm;
      margin: 0 auto;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: auto;
      position: absolute;
      bottom: 25mm;
      left: 25mm;
      right: 25mm;
    }
    .issue-info {
      text-align: left;
      font-size: 12px;
      color: #64748b;
    }
    .seal-area {
      text-align: center;
    }
    .seal {
      width: 25mm;
      height: 25mm;
      border: 2px solid #dc2626;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #dc2626;
      font-size: 12px;
      font-weight: bold;
    }
    .org-name {
      font-size: 14px;
      font-weight: bold;
      color: #0f172a;
      margin-top: 3mm;
    }
    .qr-area {
      text-align: right;
    }
    .qr-area img {
      width: 20mm;
      height: 20mm;
    }
    .qr-label {
      font-size: 10px;
      color: #94a3b8;
      margin-top: 2mm;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <h1>자 격 증</h1>
      <div class="subtitle">CERTIFICATE OF QUALIFICATION</div>
    </div>

    <div class="body">
      <div class="grade-badge">Crowny AI 활용 자격증 ${data.gradeName} - ${data.gradeTitle}</div>
      <div class="recipient-name">${data.recipientName}</div>
      <div class="description">
        위 사람은 Crowny AI 활용 자격증 ${data.gradeName} 시험에 합격하였으므로<br>
        이 자격증을 수여합니다.
      </div>
    </div>

    <div class="footer">
      <div class="issue-info">
        <div>인증번호: ${data.issueNumber}</div>
        <div>발급일: ${formattedDate}</div>
      </div>

      <div class="seal-area">
        <div class="seal">직인</div>
        <div class="org-name">Crowny Certificate</div>
      </div>

      <div class="qr-area">
        <img src="${data.qrCodeUrl}" alt="QR Code" />
        <div class="qr-label">진위 확인</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
