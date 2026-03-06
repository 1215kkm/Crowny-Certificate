"use client";

import { useState } from "react";

export default function AdminSetupPage() {
  const [email, setEmail] = useState("rute20002@gmail.com");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(`✅ ${data.message}`);
      } else {
        setResult(`❌ ${data.error}`);
      }
    } catch {
      setResult("❌ 요청 실패. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4 p-8 border border-border rounded-xl bg-card">
        <h1 className="text-2xl font-bold mb-6 text-center">관리자 설정</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background"
          />
        </div>
        <button
          onClick={handleSetup}
          disabled={loading || !email}
          className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "처리 중..." : "관리자로 설정"}
        </button>
        {result && (
          <p className="mt-4 text-center text-sm">{result}</p>
        )}
      </div>
    </div>
  );
}
