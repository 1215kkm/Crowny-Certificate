import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/logo_footer.png"
              alt="KAIAT (Korea AI Ability Test)"
              width={302}
              height={302}
              className="h-9 w-9"
            />
            <span className="font-bold text-lg text-white">KAIAT</span>
          </div>
          <p className="text-sm">
            AI 활용 능력을 검증하는
            <br />
            온라인 자격증 플랫폼
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white mb-3">자격증</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/exams?grade=3급" className="hover:text-white transition">
                3급 - AI 기초 활용
              </Link>
            </li>
            <li>
              <Link href="/exams?grade=2급" className="hover:text-white transition">
                2급 - AI UI 제작
              </Link>
            </li>
            <li>
              <Link href="/exams?grade=1급" className="hover:text-white transition">
                1급 - AI 풀스택
              </Link>
            </li>
            <li>
              <Link href="/exams?grade=특급" className="hover:text-white transition">
                특급 - AI 문제해결
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-white mb-3">이용 안내</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/courses" className="hover:text-white transition">
                강의 목록
              </Link>
            </li>
            <li>
              <Link href="/exams" className="hover:text-white transition">
                시험 일정
              </Link>
            </li>
            <li>
              <Link href="/certificates" className="hover:text-white transition">
                인증서 발급
              </Link>
            </li>
            <li>
              <Link href="/certificates/verify" className="hover:text-white transition">
                인증서 진위 확인
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-white mb-3">고객 지원</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/inquiries" className="hover:text-white transition">
                문의하기
              </Link>
            </li>
            <li>이메일: rute20002@gmail.com</li>
            <li>운영시간: 평일 09:00~18:00</li>
            <li>
              <a
                href="https://kaiat.co.kr"
                className="hover:text-white transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                kaiat.co.kr
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-10 pt-6 border-t border-gray-700 text-sm text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-3">
          <Link href="/terms" className="hover:text-white transition font-medium">이용약관</Link>
          <span className="text-gray-600">|</span>
          <Link href="/privacy" className="hover:text-white transition font-medium">개인정보처리방침</Link>
          <span className="text-gray-600">|</span>
          <Link href="/inquiries" className="hover:text-white transition">문의하기</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} AI 역량평가원(KAIAT). All rights reserved.</p>
        <p className="mt-1 text-gray-400">
          발급·운영: AI 역량평가원(KAIAT · Korea AI Ability Test)
        </p>
        <p className="mt-1 text-xs text-gray-500">
          본 자격은 국가공인 자격 또는 등록 민간자격이 아닌, 운영기관이 자체 발급하는 자격입니다. (민간자격 등록 준비 중)
        </p>
      </div>
    </footer>
  );
}
