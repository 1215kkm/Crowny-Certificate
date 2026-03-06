# Firebase 전환 + 토스페이먼츠 직접 연동 계획

> 최종 업데이트: 2026-03-06
> 브랜치: `claude/ai-certification-provider-hB5GX`

---

## 변경 요약

| 항목 | 현재 (변경 전) | 변경 후 |
|------|--------------|--------|
| DB | PostgreSQL + Prisma ORM | **Firebase Firestore** |
| 인증 | NextAuth.js (직접 구현) | **Firebase Authentication** |
| 파일저장 | 미구현 (S3 예정) | **Firebase Storage** (PDF, 이미지) |
| 결제 | PortOne V2 | **토스페이먼츠 직접 연동** |
| 강의 영상 | 미구현 | **YouTube 비공개 링크** (Storage 절약) |

---

## Step 1: Firebase 설정 파일 추가 [🔄 진행 중]

### 삭제할 파일
- `prisma/schema.prisma` (Prisma 스키마)
- `prisma/seed.ts` (시드 스크립트)
- `src/lib/db.ts` (Prisma 클라이언트)
- `src/lib/auth.ts` (NextAuth 설정)
- `src/app/api/auth/[...nextauth]/route.ts` (NextAuth API)

### 새로 생성할 파일
- `src/lib/firebase.ts` — Firebase 앱 초기화 (client)
- `src/lib/firebase-admin.ts` — Firebase Admin SDK (server)
- `src/lib/firestore.ts` — Firestore 컬렉션 헬퍼 + 타입 정의
- `src/lib/firebase-auth.ts` — Firebase Auth 유틸 (로그인, 회원가입, 소셜)
- `src/lib/firebase-storage.ts` — Storage 업로드/다운로드 유틸
- `src/contexts/auth-context.tsx` — Firebase Auth 상태 관리 (React Context)

### 수정할 파일
- `package.json` — prisma 제거, firebase/firebase-admin 추가
- `.env.example` — Firebase 설정값으로 교체
- `.gitignore` — Firebase 관련 추가

---

## Step 2: Firestore 컬렉션 구조 설계 [⬜ 대기]

```
users/{userId}
  ├── email, name, phone, address, role, createdAt
  └── (Firebase Auth UID를 문서 ID로 사용)

certificateTypes/{typeId}
  ├── name, grade, description, examFormat
  ├── price, coursePrice, certPrice, passingScore, duration
  └── isActive

courses/{courseId}
  ├── title, description, thumbnailUrl, certificateTypeId
  ├── totalDuration, lessonCount, isPublished
  └── lessons (서브컬렉션)
      └── {lessonId}: title, videoUrl, duration, order, isFree

enrollments/{enrollmentId}
  ├── userId, courseId, progress, completedAt, paymentId
  └── lessonProgresses (서브컬렉션)
      └── {lessonId}: completed, watchedSec

exams/{examId}
  ├── certificateTypeId, title, scheduledDate, duration
  ├── registrationStart, registrationEnd, isActive
  └── questions (서브컬렉션)
      └── {questionId}: type, content, options, correctAnswer, points

examSubmissions/{submissionId}
  ├── userId, examId, status, score, passed
  ├── startedAt, submittedAt, gradedAt
  └── answers (서브컬렉션)
      └── {questionId}: answer, fileUrl, points, isCorrect

payments/{paymentId}
  ├── userId, type, amount, method, status
  ├── tossOrderId, tossPaymentKey (토스페이먼츠 전용)
  ├── receiptUrl, refundedAt
  └── createdAt

certificateIssuances/{issuanceId}
  ├── userId, certificateTypeId, issueNumber (unique)
  ├── deliveryMethod, pdfUrl, mailingAddress
  ├── status, qrCodeUrl
  └── issuedAt, createdAt
```

---

## Step 3: 인증 시스템 Firebase Auth로 교체 [⬜ 대기]

### 변경 내용
- NextAuth.js 완전 제거
- Firebase Auth 사용: 이메일/비밀번호, Google, 카카오, 네이버
- `AuthContext`로 전역 인증 상태 관리
- 서버 API에서는 Firebase Admin SDK로 토큰 검증

### 수정 대상 페이지
- `src/app/auth/login/page.tsx` → Firebase signInWithEmailAndPassword
- `src/app/auth/register/page.tsx` → Firebase createUserWithEmailAndPassword
- `src/app/api/auth/register/route.ts` → Firestore에 사용자 프로필 저장
- `src/components/layout/header.tsx` → AuthContext에서 로그인 상태 표시
- `src/app/layout.tsx` → AuthProvider 래핑

---

## Step 4: 결제 시스템 토스페이먼츠 직접 연동 [⬜ 대기]

### 삭제할 파일
- `src/lib/payment.ts` (PortOne 유틸)

### 새로 생성할 파일
- `src/lib/toss-payments.ts` — 토스페이먼츠 서버 API 유틸 (결제 승인, 취소)
- `src/app/api/payments/confirm/route.ts` — 결제 승인 API (토스 리다이렉트 후)
- `src/app/api/payments/cancel/route.ts` — 결제 취소(환불) API
- `src/app/payment/success/page.tsx` — 결제 성공 페이지
- `src/app/payment/fail/page.tsx` — 결제 실패 페이지

### 수정 대상
- `src/app/payment/page.tsx` — 토스페이먼츠 결제위젯 SDK 연동
- `src/app/api/payments/verify/route.ts` → confirm으로 교체
- `.env.example` — 토스페이먼츠 클라이언트키, 시크릿키 추가

### 토스페이먼츠 연동 흐름
```
1. 프론트: 토스페이먼츠 결제위젯 SDK 로드
2. 사용자: 결제 수단 선택 → 결제 요청
3. 토스: 인증 완료 → successUrl로 리다이렉트 (paymentKey, orderId, amount)
4. 서버: /api/payments/confirm에서 토스 승인 API 호출 (시크릿키 사용)
5. 서버: 승인 성공 → Firestore에 결제 정보 저장
6. 프론트: 결제 완료 페이지 표시
```

---

## Step 5: 나머지 페이지 Firestore 연동 [⬜ 대기]

### 강의 시스템
- `src/app/courses/page.tsx` → Firestore에서 강의 목록 조회
- `src/app/courses/[id]/page.tsx` → Firestore에서 강의 상세 + 레슨 목록

### 시험 시스템
- `src/app/exams/page.tsx` → Firestore에서 시험 목록 조회
- `src/app/exams/[id]/take/page.tsx` → 시험 응시 결과를 Firestore에 저장

### 인증서 시스템
- `src/app/api/certificates/issue/route.ts` → Firestore에 발급 기록 저장
- `src/app/api/certificates/verify/route.ts` → Firestore에서 인증번호 조회

### 마이페이지
- `src/app/mypage/page.tsx` → Firestore에서 사용자별 수강/시험/인증서 조회

### 관리자
- `src/app/admin/` 하위 모든 페이지 → Firestore CRUD 연동

---

## Step 6: 정리 및 테스트 [⬜ 대기]

### 제거할 의존성
- `@prisma/client`, `prisma`
- `next-auth`
- `bcryptjs`, `@types/bcryptjs`
- `tsx`

### 추가할 의존성
- `firebase` (클라이언트 SDK)
- `firebase-admin` (서버 Admin SDK)
- `@tosspayments/tosspayments-sdk` (토스페이먼츠 결제위젯)

---

## 환경변수 (.env.example)

```
# Firebase (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (Server)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# 토스페이먼츠
NEXT_PUBLIC_TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=

# Email (Resend)
RESEND_API_KEY=
```
