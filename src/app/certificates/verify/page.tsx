"use client";

import { useState } from "react";

interface VerifyResult {
  valid: boolean;
  certificate?: {
    issueNumber: string;
    certificateName: string;
    grade: string;
    recipientName: string;
    issuedAt: string;
    status: string;
  };
}

export default function CertificateVerifyPage() {
  const [issueNumber, setIssueNumber] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/certificates/verify?issueNumber=${encodeURIComponent(issueNumber)}`);
      const data = await res.json();

      if (res.ok && data.valid) {
        setResult({ valid: true, certificate: data.certificate });
      } else {
        setResult({ valid: false });
      }
    } catch {
      setResult({ valid: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-center">인증서 진위 확인</h1>
      <p className="text-center text-muted-foreground mb-8">
        인증서에 기재된 인증번호 또는 QR 코드를 통해 진위 여부를 확인합니다.
      </p>

      <form onSubmit={handleVerify} className="space-y-4 mb-8">
        <div>
          <label
            htmlFor="issueNumber"
            className="block text-sm font-medium mb-1"
          >
            인증번호
          </label>
          <input
            id="issueNumber"
            type="text"
            value={issueNumber}
            onChange={(e) => {
              setIssueNumber(e.target.value);
              setResult(null);
            }}
            placeholder="CRN-2026-XXXXXX"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition disabled:opacity-50"
        >
          {loading ? "확인 중..." : "진위 확인"}
        </button>
      </form>

      {result?.valid && result.certificate && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-green-800">
              유효한 인증서입니다
            </h2>
          </div>
          <div className="space-y-2 text-sm text-green-700">
            <div>
              <span className="font-medium">인증번호:</span> {result.certificate.issueNumber}
            </div>
            <div>
              <span className="font-medium">자격명:</span> {result.certificate.certificateName}
            </div>
            <div>
              <span className="font-medium">취득자:</span> {result.certificate.recipientName}
            </div>
            <div>
              <span className="font-medium">발급일:</span> {result.certificate.issuedAt}
            </div>
          </div>
        </div>
      )}

      {result && !result.valid && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-800">
                유효하지 않은 인증번호입니다
              </h2>
              <p className="text-sm text-red-600">
                인증번호를 다시 확인해주세요.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
