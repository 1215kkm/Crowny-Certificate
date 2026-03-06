"use client";

import { useState } from "react";

export default function CertificateVerifyPage() {
  const [issueNumber, setIssueNumber] = useState("");
  const [result, setResult] = useState<"valid" | "invalid" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 데모: 실제로는 API에서 검증
    await new Promise((r) => setTimeout(r, 1000));
    setResult(issueNumber.startsWith("CRN-") ? "valid" : "invalid");
    setLoading(false);
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

      {result === "valid" && (
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
              <span className="font-medium">인증번호:</span> {issueNumber}
            </div>
            <div>
              <span className="font-medium">자격명:</span> Crowny AI 활용 자격증
              3급
            </div>
            <div>
              <span className="font-medium">취득자:</span> 홍길동
            </div>
            <div>
              <span className="font-medium">발급일:</span> 2026년 3월 1일
            </div>
          </div>
        </div>
      )}

      {result === "invalid" && (
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
