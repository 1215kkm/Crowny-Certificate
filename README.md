# Crowny-Certificate

AI 자격증 부여 온라인 플랫폼 - **Crowny AI 활용 자격증**

## 개요

AI 활용 능력을 검증하는 민간자격증 발급 플랫폼입니다. 온라인 강의, 시험, 인증서 발급까지 한 곳에서 제공합니다.

## 자격증 등급 체계

| 등급 | 명칭 | 시험 형식 | 시험 시간 |
|------|------|----------|----------|
| 3급 | AI 기초 활용 | 객관식 40문항 + 실습 2개 | 60분 |
| 2급 | AI UI 제작 | 실기 시험 (화면 녹화) | 120분 |
| 1급 | AI 풀스택 제작 | 프로젝트 제출 + 코드 리뷰 | 7일 |
| 특급 | AI 문제해결 | 실무 과제 해결 (해커톤) | 48시간 |

## 주요 기능

- 회원가입/로그인 (이메일, 소셜 로그인)
- 등급별 온라인 강의 (LMS)
- 온라인 시험 (CBT) - 객관식 자동 채점, 실기 과제 제출
- 결제 시스템 (PortOne/토스페이먼츠 연동)
- 인증서 발급 (PDF 디지털 + 실물 우편 배송)
- 인증서 진위 확인 (QR 코드 + 인증번호)
- 관리자 대시보드

## 기술 스택

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL, Prisma ORM
- **Auth**: NextAuth.js
- **Payment**: PortOne V2
- **PDF**: @react-pdf/renderer
- **Email**: Resend

## 시작하기

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일을 편집하여 필요한 값을 입력하세요

# DB 마이그레이션
npx prisma db push

# 시드 데이터 입력
npm run db:seed

# 개발 서버 실행
npm run dev
```

## 프로젝트 구조

```
src/
├── app/
│   ├── (auth)/          # 로그인, 회원가입
│   ├── courses/         # 강의 목록 및 수강
│   ├── exams/           # 시험 신청 및 응시
│   ├── certificates/    # 인증서 신청 및 발급
│   ├── payment/         # 결제
│   ├── mypage/          # 마이페이지
│   ├── admin/           # 관리자 대시보드
│   └── api/             # API Routes
├── components/          # 공통 컴포넌트
├── lib/                 # 유틸리티 (DB, 결제, PDF 등)
└── types/               # TypeScript 타입
```

## 민간자격 등록 정보

- 등록 기관: 한국직업능력연구원 (pqi.or.kr)
- 주무부처: 과학기술정보통신부
- 등록 상태: 준비 중
