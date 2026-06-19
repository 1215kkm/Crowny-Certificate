"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Download, AlertTriangle } from "lucide-react";

interface CertData {
  name: string;
  birthDate: string;
  rrn: string;
  gradeLabel: string;
  qualLine: string;
  badgeBg: string;
  issueNumber: string;
  docNumber: string;
  issuedDate: string;
  issuedDateKo: string;
  examName: string;
  examDescription: string;
  competencies: string;
  passingCriteria: string;
}

function esc(s: string): string {
  return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildCertHtml(d: CertData): string {
  return `
  <div style="position:relative; width:660px; height:918px; background:linear-gradient(135deg,#1a2a6c 0%,#2540a0 40%,#1a2a6c 100%); box-shadow:0 24px 60px rgba(20,30,70,0.35); flex:none;">
    <div class="cert-corner" style="position:absolute; top:0; left:0; width:96px; height:96px; background:linear-gradient(135deg,#0d1840,#26307a); clip-path:polygon(0 0,100% 0,0 100%); z-index:3;"></div>
    <div class="cert-corner" style="position:absolute; top:0; right:0; width:96px; height:96px; background:linear-gradient(225deg,#0d1840,#26307a); clip-path:polygon(0 0,100% 0,100% 100%); z-index:3;"></div>
    <div class="cert-corner" style="position:absolute; bottom:0; left:0; width:120px; height:120px; background:linear-gradient(45deg,#a9842f,#e6c873 60%,#c9a24a); clip-path:polygon(0 0,0 100%,100% 100%); z-index:3;"></div>
    <div class="cert-corner" style="position:absolute; bottom:0; right:0; width:120px; height:120px; background:linear-gradient(-45deg,#a9842f,#e6c873 60%,#c9a24a); clip-path:polygon(100% 0,100% 100%,0 100%); z-index:3;"></div>
    <div style="position:absolute; inset:13px; background:#fbfaf5; box-shadow:inset 0 0 0 2px #c9a24a, inset 0 0 0 6px #fbfaf5, inset 0 0 0 7.5px #d8b863; z-index:2;">
      <div style="position:absolute; inset:0; background-image:repeating-linear-gradient(45deg,rgba(40,55,130,0.018) 0 2px,transparent 2px 9px); pointer-events:none;"></div>
      <div style="position:absolute; top:30px; left:44px; font-size:13px; letter-spacing:0.5px; color:#3a3a3a; z-index:5;">제 ${d.docNumber} 호</div>
      <div style="position:relative; z-index:5; height:100%; box-sizing:border-box; padding:44px 52px 30px; display:flex; flex-direction:column; align-items:center; text-align:center;">
        <img src="/aiat.png" alt="AIAT" style="width:148px; height:auto;" />
        <div style="font-size:40px; font-weight:900; letter-spacing:1px; color:#1a2a6c; margin-top:4px; font-family:'Noto Sans KR',sans-serif;">AIAT 자격증</div>
        <div style="font-size:17px; font-weight:500; letter-spacing:6px; color:#555; margin-top:4px;">AI 활용능력인증</div>
        <div style="width:300px; height:1px; background:linear-gradient(90deg,transparent,#d8b863 20%,#d8b863 80%,transparent); margin:14px 0 10px;"></div>
        <div style="font-size:46px; font-weight:900; letter-spacing:14px; color:#16235e; font-family:'Noto Serif KR',serif; text-indent:14px;">합격증</div>
        <div style="font-size:15px; font-weight:600; letter-spacing:5px; color:#888; margin-top:6px; font-family:'Cormorant Garamond',serif;">CERTIFICATE OF ACHIEVEMENT</div>
        <div style="display:flex; align-items:center; gap:26px; margin-top:20px;">
          <div style="width:88px; height:64px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:900; color:#fff; background:${d.badgeBg}; box-shadow:0 6px 16px rgba(60,70,160,0.35); flex:none;">${d.gradeLabel}</div>
          <div style="display:grid; grid-template-columns:auto auto; row-gap:7px; column-gap:22px; text-align:left;">
            <div style="font-size:14px; font-weight:700; color:#1a2a6c; letter-spacing:8px;">성명</div>
            <div style="font-size:15px; color:#222; font-weight:500;">${d.name}</div>
            <div style="font-size:14px; font-weight:700; color:#1a2a6c; letter-spacing:1px;">생년월일</div>
            <div style="font-size:15px; color:#222; font-weight:500;">${d.birthDate}</div>
            <div style="font-size:14px; font-weight:700; color:#1a2a6c; letter-spacing:1px;">주민번호</div>
            <div style="font-size:15px; color:#222; font-weight:500; letter-spacing:1px;">${d.rrn}</div>
            <div style="font-size:14px; font-weight:700; color:#1a2a6c; letter-spacing:1px;">자격등급</div>
            <div style="font-size:15px; color:#222; font-weight:500;">${d.qualLine}</div>
            <div style="font-size:14px; font-weight:700; color:#1a2a6c; letter-spacing:1px;">합격일자</div>
            <div style="font-size:15px; color:#222; font-weight:500;">${d.issuedDate}</div>
            <div style="font-size:14px; font-weight:700; color:#1a2a6c; letter-spacing:1px;">인증번호</div>
            <div style="font-size:15px; color:#222; font-weight:500;">${d.issueNumber}</div>
          </div>
        </div>
        <div style="margin-top:22px; font-size:16px; font-weight:700; color:#1a2a6c; line-height:1.7;">위 사람은 AI 활용능력인증시험(AIAT)에서<br>위와 같이 우수한 성적으로 합격하였음을 증명합니다.</div>
        <div style="margin-top:10px; font-size:12.5px; color:#777; line-height:1.6; font-family:'Cormorant Garamond',serif; letter-spacing:0.2px;">This is to certify that the person above has successfully passed<br>the AIAT (AI Ability Test) and is hereby awarded this certificate.</div>
        <div style="margin-top:auto; font-size:18px; font-weight:700; color:#222; letter-spacing:1px;">${d.issuedDateKo}</div>
        <div style="display:flex; align-items:center; justify-content:center; gap:14px; margin-top:16px; position:relative;">
          <img src="/logo.png" alt="Crowny AI" style="width:38px; height:38px; object-fit:contain;" />
          <div style="font-size:22px; font-weight:900; color:#1a2a6c; letter-spacing:0.5px;">Crowny AI 자격증</div>
          <div style="position:absolute; right:-58px; top:50%; transform:translateY(-50%) rotate(-4deg); width:54px; height:54px; border:2.5px solid #c0392b; border-radius:8px; display:grid; grid-template-columns:1fr 1fr; align-content:center; padding:3px; box-sizing:border-box;">
            <div style="color:#c0392b; font-size:17px; font-weight:700; font-family:'Noto Serif KR',serif; text-align:center;">認</div>
            <div style="color:#c0392b; font-size:17px; font-weight:700; font-family:'Noto Serif KR',serif; text-align:center;">證</div>
            <div style="color:#c0392b; font-size:17px; font-weight:700; font-family:'Noto Serif KR',serif; text-align:center;">委</div>
            <div style="color:#c0392b; font-size:17px; font-weight:700; font-family:'Noto Serif KR',serif; text-align:center;">員</div>
          </div>
        </div>
        <div style="margin-top:8px; font-size:14px; font-weight:500; color:#444; letter-spacing:2px;">AIAT 운영위원회</div>
      </div>
    </div>
  </div>`;
}

// 합격증과 함께 출력되는 "자격 설명 페이지" (이 시험이 무엇을 평가했는지·목표·통과 증명)
function buildExplainHtml(d: CertData): string {
  const competencies = esc(d.competencies).replace(/\n/g, "<br>");
  const passingCriteria = esc(d.passingCriteria).replace(/\n/g, "<br>");
  const desc = esc(d.examDescription);
  return `
  <div style="position:relative; width:660px; min-height:918px; background:#fff; box-shadow:0 24px 60px rgba(20,30,70,0.18); flex:none; box-sizing:border-box; padding:56px 56px 48px; border-top:8px solid #1a2a6c;">
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:6px;">
      <img src="/aiat.png" alt="AIAT" style="width:48px; height:auto;" />
      <div>
        <div style="font-size:22px; font-weight:900; color:#1a2a6c;">AIAT 자격 안내</div>
        <div style="font-size:13px; color:#777;">Certificate Description</div>
      </div>
    </div>
    <div style="height:2px; background:linear-gradient(90deg,#1a2a6c,#d8b863); margin:14px 0 24px;"></div>

    <div style="display:grid; grid-template-columns:auto 1fr; row-gap:8px; column-gap:18px; font-size:14px; margin-bottom:26px;">
      <div style="font-weight:700; color:#1a2a6c;">자격명</div><div style="color:#222;">${esc(d.examName)} (${d.gradeLabel})</div>
      <div style="font-weight:700; color:#1a2a6c;">자격등급</div><div style="color:#222;">${esc(d.qualLine)}</div>
      <div style="font-weight:700; color:#1a2a6c;">취득자</div><div style="color:#222;">${esc(d.name)}</div>
      <div style="font-weight:700; color:#1a2a6c;">인증번호</div><div style="color:#222;">${esc(d.issueNumber)}</div>
      <div style="font-weight:700; color:#1a2a6c;">합격일자</div><div style="color:#222;">${esc(d.issuedDate)}</div>
    </div>

    ${desc ? `<div style="margin-bottom:22px;">
      <div style="font-size:15px; font-weight:800; color:#1a2a6c; margin-bottom:6px;">■ 이 자격이 평가하는 내용</div>
      <div style="font-size:13.5px; color:#333; line-height:1.7;">${desc}</div>
    </div>` : ""}

    <div style="margin-bottom:22px;">
      <div style="font-size:15px; font-weight:800; color:#1a2a6c; margin-bottom:6px;">■ 이 시험을 통해 키우려는 역량 (목표)</div>
      <div style="font-size:13.5px; color:#333; line-height:1.7;">${competencies}</div>
    </div>

    <div style="margin-bottom:26px;">
      <div style="font-size:15px; font-weight:800; color:#1a2a6c; margin-bottom:6px;">■ 합격 기준</div>
      <div style="font-size:13.5px; color:#333; line-height:1.7;">${passingCriteria}</div>
    </div>

    <div style="background:#f6f8ff; border:1px solid #dce3f7; border-radius:12px; padding:18px 20px;">
      <div style="font-size:15px; font-weight:800; color:#1a2a6c; line-height:1.8;">
        위 ${esc(d.name)} 님은 본 자격이 평가하는 항목과 합격 기준을 모두 충족하여
        <br>AIAT ${d.gradeLabel} 자격을 취득하였음을 증명합니다.
      </div>
      <div style="margin-top:10px; font-size:13px; color:#666; font-family:'Cormorant Garamond',serif;">
        This document certifies that the holder has met all evaluation criteria and passing standards of this qualification.
      </div>
    </div>

    <div style="margin-top:30px; text-align:center;">
      <div style="font-size:16px; font-weight:700; color:#222;">${esc(d.issuedDateKo)}</div>
      <div style="margin-top:8px; font-size:15px; font-weight:800; color:#1a2a6c;">AIAT 운영위원회 · Crowny AI 자격증</div>
    </div>
  </div>`;
}

export default function CertificateViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<"loading" | "ok" | "expired" | "error">("loading");
  const [errMsg, setErrMsg] = useState("");
  const [expireAt, setExpireAt] = useState("");
  const [html, setHtml] = useState("");
  const [explainHtml, setExplainHtml] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth/login"); return; }
    (async () => {
      try {
        const { getFirebaseAuth } = await import("@/lib/firebase");
        const token = await getFirebaseAuth().currentUser?.getIdToken();
        const res = await fetch("/api/certificates/cert-data", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ issuanceId: id }),
        });
        const d = await res.json();
        if (!res.ok) { setErrMsg(d.error || "불러오기 실패"); setState("error"); return; }
        setExpireAt(d.expireAt || "");
        if (d.expired) { setState("expired"); return; }
        setHtml(buildCertHtml(d.data));
        setExplainHtml(buildExplainHtml(d.data));
        setState("ok");
      } catch {
        setErrMsg("불러오는 중 오류가 발생했습니다."); setState("error");
      }
    })();
  }, [id, user, authLoading, router]);

  if (authLoading || state === "loading") {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-muted-foreground">합격증을 불러오는 중...</div>;
  }
  if (state === "error") {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center"><h1 className="text-xl font-bold mb-2">합격증을 볼 수 없습니다</h1><p className="text-muted-foreground">{errMsg}</p></div>;
  }
  if (state === "expired") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold mb-2">보관 기간이 만료되었습니다</h1>
        <p className="text-muted-foreground">합격증은 발급일로부터 1개월간 보관됩니다. 재발급이 필요하면 자격증 발급 페이지를 이용해주세요.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Google Fonts (필요 글자만 로드) */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Noto+Sans+KR:wght@400;500;700;900&family=Noto+Serif+KR:wght@700&display=swap"
      />
      <style>{`
        @media print {
          body { margin: 0; background: #fff; }
          /* 인쇄 시 사이트 전역 헤더·푸터·내비 숨김 (합격증만 출력) */
          header, footer, nav { display: none !important; }
          .no-print { display: none !important; }
          .cert-print-area { box-shadow: none !important; margin: 0 auto !important; }
          /* 합격증 모서리 삼각 장식은 인쇄/PDF에서만 숨김 (화면에서는 표시) */
          .cert-corner { display: none !important; }
          /* 자격 설명 페이지는 새 페이지로 */
          .cert-page-2 { break-before: page; page-break-before: always; margin-top: 0 !important; }
          @page { size: 700px 960px; margin: 0; }
        }
        /* 배경 그라데이션·색이 인쇄/PDF에 그대로 나오도록 강제 */
        .cert-print-area, .cert-print-area * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      `}</style>

      <div className="no-print max-w-[660px] mx-auto px-4 mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{expireAt && `보관 만료: ${expireAt}`}</div>
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition">
          <Download className="w-4 h-4" /> PDF로 다운로드 / 인쇄
        </button>
      </div>
      <p className="no-print text-center text-xs text-muted-foreground mb-4">다운로드 창에서 &quot;대상: PDF로 저장&quot;을 선택하면 PDF로 받을 수 있습니다.</p>

      <div className="cert-print-area mx-auto" style={{ width: 660, fontFamily: "'Noto Sans KR', sans-serif" }} dangerouslySetInnerHTML={{ __html: html }} />
      <div className="cert-print-area cert-page-2 mx-auto mt-6" style={{ width: 660, fontFamily: "'Noto Sans KR', sans-serif" }} dangerouslySetInnerHTML={{ __html: explainHtml }} />
    </div>
  );
}
