import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-lg text-white">
              Crowny AI 자격증
            </span>
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
            <li>이메일: support@crowny.co.kr</li>
            <li>전화: 02-0000-0000</li>
            <li>운영시간: 평일 09:00~18:00</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-700 text-sm text-center">
        <p>&copy; {new Date().getFullYear()} Crowny Certificate. All rights reserved.</p>
        <p className="mt-1">
          등록 민간자격 | 주무부처: 과학기술정보통신부 | 등록번호: 준비중
        </p>
      </div>
    </footer>
  );
}
