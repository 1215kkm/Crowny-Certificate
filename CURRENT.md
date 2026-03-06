# 현재 작업 상태 (자동 업데이트)

> 이 파일은 매 작업 후 업데이트됩니다.
> 최종 업데이트: 2026-03-06

---

## 1. 규칙 준수 확인

| 규칙 | 상태 | 비고 |
|------|------|------|
| 브랜치: `claude/ai-certification-provider-hB5GX` | ✅ | 올바른 브랜치에서 작업 중 |
| DB: Prisma → Firebase Firestore | ✅ 완료 | firebase.ts, firebase-admin.ts, firestore.ts 생성 |
| 인증: NextAuth → Firebase Auth | ✅ 완료 | firebase-auth.ts, auth-context.tsx 생성, login/register 수정 |
| 결제: PortOne → 토스페이먼츠 | ✅ 완료 | toss-payments.ts 생성, payment 페이지 수정 |
| 기존 파일 삭제 전 백업 | ✅ | git 이력으로 보존 |
| 빌드 통과 | ✅ | `npm run build` 성공 (23 pages) |

---

## 2. 작업 이력

| # | 작업 내용 | 상태 | 일시 |
|---|----------|------|------|
| 0 | 코드베이스 분석 및 계획 수립 | ✅ 완료 | 2026-03-06 |
| 1 | Firebase 설정 파일 생성 (firebase.ts, firebase-admin.ts) | ✅ 완료 | 2026-03-06 |
| 2 | Firestore 컬렉션 타입 정의 (firestore.ts) | ✅ 완료 | 2026-03-06 |
| 3 | 인증 시스템 교체 (Firebase Auth + AuthContext) | ✅ 완료 | 2026-03-06 |
| 4 | 토스페이먼츠 직접 연동 (결제/승인/취소 API) | ✅ 완료 | 2026-03-06 |
| 5 | Prisma/NextAuth/PortOne 파일 삭제 | ✅ 완료 | 2026-03-06 |
| 6 | 의존성 정리 및 빌드 확인 | ✅ 완료 | 2026-03-06 |
| 7 | Step 5: 전체 페이지 Firestore 연동 (13개 파일) | ✅ 완료 | 2026-03-06 |

---

## 3. 오류/이슈 추적

| # | 오류 내용 | 상태 | 해결 방법 |
|---|----------|------|----------|
| 1 | Firebase Admin SDK 빌드 시 초기화 오류 | ✅ 해결 | Proxy를 이용한 지연 초기화 적용 |
| 2 | TypeScript Record<string,unknown> 타입 캐스팅 오류 | ✅ 해결 | `as unknown as Record` 이중 캐스팅 |
| 3 | Firebase Client SDK 빌드 시 auth/invalid-api-key | ✅ 해결 | getFirebaseAuth() 함수형 지연 초기화 + typeof window 체크 |

---

## 4. 변경된 파일 목록

### 새로 생성
- `src/lib/firebase.ts` — Firebase 클라이언트 SDK 초기화 (지연 로딩)
- `src/lib/firebase-admin.ts` — Firebase Admin SDK (Proxy 기반 지연 초기화)
- `src/lib/firestore.ts` — Firestore 컬렉션 타입 정의 + CRUD 헬퍼
- `src/lib/firebase-auth.ts` — Firebase Auth 유틸 (로그인, 회원가입, Google)
- `src/lib/firebase-storage.ts` — Firebase Storage 유틸
- `src/lib/toss-payments.ts` — 토스페이먼츠 서버 API (승인/취소)
- `src/lib/grade-utils.ts` — 등급 매핑, 시간 포맷, 상태 매핑 유틸리티
- `src/contexts/auth-context.tsx` — Firebase Auth React Context
- `src/app/api/payments/cancel/route.ts` — 결제 취소 API
- `src/app/api/exams/submit/route.ts` — 시험 제출 + 서버 채점 API
- `src/app/payment/success/page.tsx` — 결제 성공 페이지
- `src/app/payment/fail/page.tsx` — 결제 실패 페이지
- `plan-print.html` — 프린트용 HTML 계획서
- `CURRENT.md` — 작업 상태 추적 파일
- `PLAN.md` — 작업 계획 문서

### 수정됨 (Step 1~4)
- `src/app/layout.tsx` — AuthProvider 래핑 추가
- `src/app/auth/login/page.tsx` — Firebase Auth 로그인 + Google 로그인
- `src/app/auth/register/page.tsx` — Firebase Auth 회원가입
- `src/components/layout/header.tsx` — useAuth() 연동, 로그인 상태 표시
- `src/app/payment/page.tsx` — 토스페이먼츠 결제위젯 연동
- `src/app/api/auth/register/route.ts` — Firebase Admin SDK로 교체
- `src/app/api/certificates/issue/route.ts` — Firestore + 토큰 인증
- `src/app/api/certificates/verify/route.ts` — Firestore 조회
- `src/app/api/payments/verify/route.ts` — 토스페이먼츠 승인 API
- `package.json` — Firebase/토스 추가, Prisma/NextAuth 제거
- `.env.example` — Firebase + 토스페이먼츠 환경변수
- `.gitignore` — Firebase 로그 파일 추가

### 수정됨 (Step 5: 페이지 Firestore 연동)
- `src/app/courses/page.tsx` — 데모 → Firestore 쿼리 + 로딩/빈 상태
- `src/app/courses/[id]/page.tsx` — 데모 → 서브컬렉션 레슨 목록 + 동적 가격
- `src/app/exams/page.tsx` — 데모 → 활성 시험 목록 + certificateTypes 조인
- `src/app/exams/[id]/take/page.tsx` — 데모 → DB 문제 로드 + 서버 API 채점
- `src/app/certificates/page.tsx` — 정적 → 합격 시험 기반 동적 발급 폼
- `src/app/certificates/verify/page.tsx` — CRN- 하드코딩 → 실제 API 호출
- `src/app/mypage/page.tsx` — 데모 → 수강/시험/인증서 Firestore 쿼리
- `src/app/admin/page.tsx` — 데모 통계 → 실시간 컬렉션 카운트
- `src/app/admin/courses/page.tsx` — 데모 → Firestore CRUD + 수강생 카운트
- `src/app/admin/exams/page.tsx` — 데모 → Firestore CRUD + 채점 대기
- `src/app/admin/certificates/page.tsx` — 데모 → 상태별 통계 + 상태 변경

### 삭제됨
- `prisma/schema.prisma` — Prisma 스키마
- `src/lib/db.ts` — Prisma 클라이언트
- `src/lib/auth.ts` — NextAuth 설정
- `src/lib/payment.ts` — PortOne 결제 유틸
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth API 라우트

---

## 5. 다음 작업

**전체 구현 완료!** 모든 Step(1~6) + 페이지 Firestore 연동이 완료되었습니다.

- [x] 강의 페이지 (courses/, courses/[id]/) Firestore 연동
- [x] 시험 페이지 (exams/, exams/[id]/take/) Firestore 연동
- [x] 마이페이지 (mypage/) Firestore 연동
- [x] 관리자 페이지 (admin/) Firestore CRUD 연동
- [x] 인증서 페이지 (certificates/) Firestore 연동
- [x] 시험 제출 API (/api/exams/submit) 서버 채점

**추가 개선 가능 사항 (선택):**
- [ ] Firebase 콘솔에서 테스트 데이터 입력 후 동작 확인
- [ ] Firestore Security Rules 설정
- [ ] Firebase Storage Security Rules 설정
- [ ] Resend 이메일 알림 연동 (인증서 발급 시)
- [ ] 실물 인증서 PDF 생성 + Storage 업로드 연동
