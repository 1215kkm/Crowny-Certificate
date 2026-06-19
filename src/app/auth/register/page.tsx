"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail } from "@/lib/firebase-auth";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [rrnFront, setRrnFront] = useState(""); // 주민번호 앞 6자리
  const [rrnBack, setRrnBack] = useState(""); // 뒤 1자리
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 주민번호 앞 6자리(YYMMDD) + 뒤 1자리 → 생년월일 YYYY-MM-DD
  const rrnToBirthDate = (front: string, back: string): string => {
    if (front.length !== 6) return "";
    const yy = front.slice(0, 2), mm = front.slice(2, 4), dd = front.slice(4, 6);
    const century = ["3", "4", "7", "8"].includes(back) ? "20"
      : ["9", "0"].includes(back) ? "18" : "19";
    return `${century}${yy}-${mm}-${dd}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (!/^\d{6}$/.test(rrnFront) || !/^\d$/.test(rrnBack)) {
      setError("주민등록번호 앞 6자리와 뒷자리 첫 번째 숫자를 정확히 입력해주세요.");
      return;
    }

    const rrn = `${rrnFront}-${rrnBack}`;
    const birthDate = rrnToBirthDate(rrnFront, rrnBack);

    setLoading(true);

    try {
      // 서버(Admin SDK)에서 계정·프로필 생성 (클라이언트 쓰기 규칙 우회)
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          birthDate: birthDate || undefined,
          rrn,
          address: formData.address || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "회원가입 중 오류가 발생했습니다.");
        return;
      }
      // 생성 후 로그인
      await loginWithEmail(formData.email, formData.password);
      router.push("/mypage");
    } catch {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">회원가입</h1>
        <p className="text-center text-muted-foreground mb-8">
          AI 자격증 취득을 위한 첫 걸음
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="홍길동"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              연락처
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="010-0000-0000"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              주소
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="우편 수령 시 사용됩니다 (선택)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              주민등록번호 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                inputMode="numeric"
                value={rrnFront}
                onChange={(e) => setRrnFront(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                placeholder="앞 6자리"
                className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary tracking-widest"
              />
              <span className="text-muted-foreground">-</span>
              <input
                inputMode="numeric"
                value={rrnBack}
                onChange={(e) => setRrnBack(e.target.value.replace(/\D/g, "").slice(0, 1))}
                required
                placeholder="1"
                className="w-14 px-3 py-3 border border-border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-muted-foreground tracking-widest">••••••</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              뒷자리는 첫 번째 숫자만 입력합니다. 생년월일·합격증 인쇄에 사용됩니다.
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="8자 이상"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
            >
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="비밀번호 재입력"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition disabled:opacity-50"
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
          <Link
            href="/auth/login"
            className="text-primary font-medium hover:underline"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
