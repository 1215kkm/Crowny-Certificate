/**
 * 크라우니 AI 자격증 1급 (AI 풀스택 - 앱 제작·배포) 시험 문제 데이터
 *
 * 총 40문항, 100점 만점
 * - 영역1: 앱·웹 개발 기초 (1~10)
 * - 영역2: 인증·데이터·다중 사용자 (11~20)
 * - 영역3: 점수·랭킹·AI·미디어 (21~30)
 * - 영역4: 배포·보안·윤리 (31~40)
 *
 * correctAnswer는 0-based 인덱스 문자열(3급/2급 데이터·채점 로직과 동일 규칙).
 */

export interface GradeQuestion {
  type: "MULTIPLE_CHOICE";
  content: string;
  options: string[];
  correctAnswer: string;
  points: number;
  order: number;
  explanation: string;
}

export const GRADE_1_QUESTIONS: GradeQuestion[] = [
  // ===================== 영역 1: 앱·웹 개발 기초 =====================
  {
    type: "MULTIPLE_CHOICE",
    content: "웹 애플리케이션에서 '프론트엔드'와 '백엔드'의 역할을 올바르게 설명한 것은?",
    options: [
      "프론트엔드는 서버 로직, 백엔드는 화면 UI를 담당한다",
      "프론트엔드는 사용자가 보는 화면·상호작용, 백엔드는 서버·데이터 처리·로직을 담당한다",
      "둘 다 동일하며 구분이 없다",
      "프론트엔드는 데이터베이스, 백엔드는 CSS를 담당한다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 1,
    explanation:
      "프론트엔드는 사용자가 보는 화면과 상호작용을, 백엔드는 서버에서의 데이터 처리·비즈니스 로직·DB 연동을 담당합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "클라이언트-서버 구조에 대한 설명으로 가장 적절한 것은?",
    options: [
      "클라이언트가 요청(Request)을 보내면 서버가 응답(Response)을 반환한다",
      "서버가 먼저 클라이언트에게 무작위로 데이터를 보낸다",
      "클라이언트와 서버는 통신하지 않는다",
      "서버는 화면을 그리는 역할만 한다",
    ],
    correctAnswer: "0",
    points: 2,
    order: 2,
    explanation:
      "클라이언트가 요청을 보내면 서버가 처리 후 응답을 돌려주는 요청-응답 모델이 웹의 기본 구조입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "API(Application Programming Interface)란 무엇인가?",
    options: [
      "이미지 파일 형식의 하나",
      "프로그램끼리 정해진 규약으로 데이터를 주고받기 위한 인터페이스",
      "웹 브라우저의 한 종류",
      "데이터베이스 백업 파일",
    ],
    correctAnswer: "1",
    points: 3,
    order: 3,
    explanation:
      "API는 소프트웨어 간에 정해진 규칙(요청 형식·응답 형식)으로 기능과 데이터를 주고받게 해주는 인터페이스입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "데이터베이스(DB)의 역할로 가장 적절한 것은?",
    options: [
      "사용자 화면을 디자인한다",
      "데이터를 구조적으로 저장·조회·수정·삭제할 수 있게 관리한다",
      "이메일을 발송한다",
      "이미지를 생성한다",
    ],
    correctAnswer: "1",
    points: 2,
    order: 4,
    explanation:
      "데이터베이스는 데이터를 체계적으로 저장하고 조회·수정·삭제(CRUD)할 수 있게 관리하는 시스템입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "CRUD가 의미하는 것으로 올바른 것은?",
    options: [
      "Create, Read, Update, Delete (생성·조회·수정·삭제)",
      "Copy, Run, Undo, Deploy",
      "Cache, Render, Upload, Download",
      "Click, Resize, Update, Drag",
    ],
    correctAnswer: "0",
    points: 2,
    order: 5,
    explanation:
      "CRUD는 데이터의 기본 조작인 Create(생성), Read(조회), Update(수정), Delete(삭제)를 의미합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "HTTP 상태 코드 중 '요청 성공'을 의미하는 것은?",
    options: ["404", "200", "500", "302"],
    correctAnswer: "1",
    points: 2,
    order: 6,
    explanation:
      "200은 요청 성공, 404는 리소스 없음, 500은 서버 오류를 의미합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "JSON(JavaScript Object Notation)에 대한 설명으로 올바른 것은?",
    options: [
      "이미지 압축 알고리즘이다",
      "키-값 쌍으로 데이터를 표현하는 경량 데이터 교환 형식이다",
      "프로그래밍 언어의 한 종류이다",
      "데이터베이스 서버 이름이다",
    ],
    correctAnswer: "1",
    points: 2,
    order: 7,
    explanation:
      "JSON은 키-값 구조로 데이터를 표현하는 가벼운 데이터 교환 형식으로, API 통신에 널리 사용됩니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "AI 코딩 도구(예: Claude, GitHub Copilot, Cursor)를 앱 개발에 활용하는 바람직한 방법은?",
    options: [
      "AI가 생성한 코드를 검토 없이 그대로 배포한다",
      "AI로 코드 초안·디버깅을 보조받되, 동작과 보안을 직접 검증·수정한다",
      "AI에게 모든 의사결정을 위임한다",
      "AI 코드는 절대 사용하지 않는다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 8,
    explanation:
      "AI 코딩 도구는 생산성을 높여주지만, 생성된 코드의 동작·보안·품질은 개발자가 직접 검증하고 수정해야 합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "버전 관리 시스템(Git)의 주요 목적으로 가장 적절한 것은?",
    options: [
      "이미지를 편집한다",
      "소스 코드의 변경 이력을 기록·관리하고 협업과 되돌리기를 지원한다",
      "서버 비용을 결제한다",
      "데이터베이스를 대체한다",
    ],
    correctAnswer: "1",
    points: 2,
    order: 9,
    explanation:
      "Git은 코드 변경 이력을 관리하여 협업, 버전 추적, 이전 상태 복원 등을 가능하게 합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "반응형(Responsive) 앱 UI를 만드는 이유로 가장 적절한 것은?",
    options: [
      "PC에서만 잘 보이게 하기 위해",
      "다양한 화면 크기(모바일·태블릿·PC)에서 사용성을 유지하기 위해",
      "서버 부하를 늘리기 위해",
      "이미지 용량을 키우기 위해",
    ],
    correctAnswer: "1",
    points: 2,
    order: 10,
    explanation:
      "반응형 UI는 기기마다 다른 화면 크기에서도 일관된 사용성을 제공하기 위해 필요합니다.",
  },

  // ===================== 영역 2: 인증·데이터·다중 사용자 =====================
  {
    type: "MULTIPLE_CHOICE",
    content: "회원가입/로그인 같은 '인증(Authentication)'의 핵심 목적은?",
    options: [
      "사용자가 누구인지 확인하는 것",
      "이미지를 압축하는 것",
      "서버 속도를 높이는 것",
      "화면 색상을 바꾸는 것",
    ],
    correctAnswer: "0",
    points: 3,
    order: 11,
    explanation:
      "인증은 '사용자가 본인이 맞는지' 신원을 확인하는 과정입니다. (권한 확인은 인가/Authorization)",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "사용자 비밀번호를 서버에 저장할 때 올바른 방법은?",
    options: [
      "평문(그대로) 텍스트로 저장한다",
      "해시(암호화)하여 저장하고 원문은 저장하지 않는다",
      "이메일 제목에 적어둔다",
      "이미지로 변환해 저장한다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 12,
    explanation:
      "비밀번호는 단방향 해시로 저장해야 하며, 평문 저장은 유출 시 치명적입니다. (대부분 인증 서비스가 이를 자동 처리)",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "여러 사용자가 동시에 사용하는 앱에서 '서버에 데이터를 저장'해야 하는 이유는?",
    options: [
      "각 사용자의 데이터를 공유·동기화하고 기기가 바뀌어도 유지하기 위해",
      "서버 비용을 늘리기 위해",
      "브라우저를 느리게 하기 위해",
      "데이터를 숨기기 위해",
    ],
    correctAnswer: "0",
    points: 3,
    order: 13,
    explanation:
      "다중 사용자 앱은 데이터를 서버(DB)에 저장해야 사용자 간 공유·동기화가 되고, 기기·세션이 바뀌어도 데이터가 유지됩니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "글쓰기·댓글처럼 사용자가 만든 콘텐츠를 다룰 때 권한(인가) 설계로 올바른 것은?",
    options: [
      "누구나 타인의 글을 수정·삭제할 수 있게 한다",
      "작성자 본인(또는 관리자)만 자신의 글을 수정·삭제할 수 있게 한다",
      "로그인하지 않아도 모든 글을 삭제할 수 있게 한다",
      "권한은 고려할 필요가 없다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 14,
    explanation:
      "콘텐츠 수정·삭제는 작성자 본인이나 관리자로 권한을 제한해야 데이터 무결성과 보안이 유지됩니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "실시간으로 여러 사용자에게 데이터 변경을 반영하려 할 때 적합한 방식은?",
    options: [
      "정적 HTML 파일만 사용한다",
      "실시간 DB·웹소켓 등 변경 사항을 구독(subscribe)해 즉시 반영하는 기술을 사용한다",
      "사용자가 직접 새로고침할 때까지 아무 것도 하지 않는다(불가피한 유일한 방법)",
      "데이터를 저장하지 않는다",
    ],
    correctAnswer: "1",
    points: 2,
    order: 15,
    explanation:
      "실시간 동기화는 실시간 데이터베이스나 웹소켓 등으로 변경을 구독하여 모든 사용자 화면에 즉시 반영할 수 있습니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "사용자 입력(폼 데이터)을 서버에서 처리할 때 반드시 해야 할 것은?",
    options: [
      "입력값을 무조건 신뢰한다",
      "입력값을 검증(validation)하고 신뢰하지 않는다",
      "검증 없이 DB에 저장한다",
      "입력값을 화면에 그대로 실행한다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 16,
    explanation:
      "클라이언트 입력은 신뢰할 수 없으므로 서버에서 반드시 검증해야 부정 입력·공격을 막을 수 있습니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "로그인 상태를 유지하기 위해 일반적으로 사용하는 것은?",
    options: [
      "세션/토큰(예: JWT) 등 인증 상태 정보",
      "이미지 파일",
      "CSS 스타일",
      "폰트 파일",
    ],
    correctAnswer: "0",
    points: 2,
    order: 17,
    explanation:
      "로그인 상태는 세션이나 토큰(JWT 등)으로 유지하며, 이후 요청에 이를 첨부해 사용자를 식별합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "데이터를 조회할 때 '모든 데이터를 한 번에 불러오기'가 문제될 수 있는 이유는?",
    options: [
      "데이터가 많아지면 느려지고 비용·부하가 커진다",
      "데이터가 사라지기 때문",
      "항상 가장 좋은 방법이라 문제가 없다",
      "이미지가 깨지기 때문",
    ],
    correctAnswer: "0",
    points: 2,
    order: 18,
    explanation:
      "데이터가 많아지면 전체 로딩은 성능 저하·비용 증가를 유발하므로, 페이지네이션·쿼리 제한이 필요합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "여러 사용자가 참여하는 앱에서 '각 사용자별 데이터'를 구분하는 일반적인 방법은?",
    options: [
      "사용자 고유 ID(uid)를 데이터에 함께 저장해 소유자를 식별한다",
      "모든 데이터를 한 사용자 것으로 본다",
      "데이터를 구분하지 않는다",
      "이미지 파일명으로만 구분한다",
    ],
    correctAnswer: "0",
    points: 2,
    order: 19,
    explanation:
      "각 데이터에 작성자/소유자의 사용자 ID를 저장하면 사용자별 데이터 구분·권한 제어가 가능합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "오프라인 저장(localStorage)만 사용하고 서버를 쓰지 않을 때의 한계는?",
    options: [
      "다른 사용자와 데이터 공유·비교가 불가능하고 기기가 바뀌면 사라진다",
      "한계가 전혀 없다",
      "서버보다 항상 안전하다",
      "여러 사용자 순위 비교가 더 쉬워진다",
    ],
    correctAnswer: "0",
    points: 3,
    order: 20,
    explanation:
      "localStorage는 해당 브라우저에만 저장되어 사용자 간 공유·순위 비교가 불가능하고 기기 변경 시 유지되지 않습니다. 다중 사용자 기능엔 서버가 필요합니다.",
  },

  // ===================== 영역 3: 점수·랭킹·AI·미디어 =====================
  {
    type: "MULTIPLE_CHOICE",
    content: "여러 사용자의 점수를 비교(랭킹/리더보드)하려면 점수를 어디에 저장해야 하는가?",
    options: [
      "각자 브라우저에만 저장",
      "서버(DB)에 저장하여 모든 사용자 점수를 모아 비교",
      "이미지 파일에 저장",
      "저장하지 않는다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 21,
    explanation:
      "랭킹·점수 비교는 모든 사용자의 점수를 서버(DB)에 모아야 가능합니다. 로컬 저장으로는 비교할 수 없습니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "리더보드(순위표)를 구현할 때 일반적으로 필요한 처리는?",
    options: [
      "점수를 내림차순으로 정렬해 상위 N명을 보여준다",
      "점수를 무작위로 섞어 보여준다",
      "점수를 숨긴다",
      "점수를 항상 0으로 만든다",
    ],
    correctAnswer: "0",
    points: 2,
    order: 22,
    explanation:
      "리더보드는 점수를 내림차순 정렬하여 상위권을 노출하는 것이 기본입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "게임 점수가 '클라이언트(브라우저)에서만 계산되어 서버로 전송'될 때의 보안 위험은?",
    options: [
      "사용자가 점수를 조작해 거짓 점수를 보낼 수 있다",
      "위험이 전혀 없다",
      "점수가 자동으로 암호화된다",
      "서버 비용이 0이 된다",
    ],
    correctAnswer: "0",
    points: 3,
    order: 23,
    explanation:
      "클라이언트 값은 조작될 수 있으므로, 중요한 점수는 서버 검증을 거치거나 핵심 로직을 서버에서 처리하는 것이 안전합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "앱에 AI로 생성한 이미지를 활용할 때 권장되는 방식은?",
    options: [
      "생성한 이미지를 적절히 최적화해 사용하고 라이선스를 확인한다",
      "원본 초대형 이미지를 그대로 넣어 로딩을 느리게 한다",
      "타인의 이미지를 무단 복제한다",
      "이미지는 절대 쓰지 않는다",
    ],
    correctAnswer: "0",
    points: 2,
    order: 24,
    explanation:
      "AI 생성 이미지는 용량 최적화 후 사용하고, 사용 도구의 라이선스(상업적 이용 가능 여부)를 확인해야 합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "웹 앱에서 배경음악·버튼 효과음을 넣을 때 고려할 점으로 가장 적절한 것은?",
    options: [
      "사용자 동의 없이 큰 소리로 자동 재생한다",
      "사용자가 켜고 끌 수 있게 하고, 브라우저 자동재생 정책을 고려한다",
      "소리는 무조건 자동 재생되어야 한다",
      "음소거 기능은 두면 안 된다",
    ],
    correctAnswer: "1",
    points: 2,
    order: 25,
    explanation:
      "소리는 사용자 제어(켜기/끄기·음량)를 제공하고, 다수 브라우저의 자동재생 제한 정책을 고려해 사용자 상호작용 후 재생하는 것이 좋습니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "게임 점수 카운트 기능에서 '점수 상태(state)'를 다루는 올바른 개념은?",
    options: [
      "점수는 상태로 관리하고 이벤트(정답·클릭 등) 발생 시 갱신한다",
      "점수는 새로고침할 때만 1씩 증가한다",
      "점수는 이미지로만 표현한다",
      "점수는 변경할 수 없다",
    ],
    correctAnswer: "0",
    points: 2,
    order: 26,
    explanation:
      "점수는 애플리케이션 상태로 관리하며, 특정 이벤트가 발생할 때 상태를 갱신하고 화면에 반영합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "여러 사람이 함께 쓰는 채팅/커뮤니티 앱에서 부적절 콘텐츠에 대한 대응으로 적절한 것은?",
    options: [
      "신고·차단·삭제 등 운영(모더레이션) 기능을 마련한다",
      "어떤 글도 관리하지 않는다",
      "모든 사용자를 강제 탈퇴시킨다",
      "콘텐츠를 무제한 방치한다",
    ],
    correctAnswer: "0",
    points: 3,
    order: 27,
    explanation:
      "다중 사용자 서비스는 신고·차단·삭제 등 모더레이션 수단을 갖춰 건전한 환경과 법적 책임을 관리해야 합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "AI 이미지 생성 기능을 앱에 직접 연동(API)할 때 비용 측면에서 유의할 점은?",
    options: [
      "호출량에 따라 비용이 발생할 수 있어 사용량 제한·캐싱을 고려한다",
      "API는 항상 무료이므로 고려할 필요 없다",
      "호출할수록 비용이 줄어든다",
      "비용은 사용자만 부담한다",
    ],
    correctAnswer: "0",
    points: 2,
    order: 28,
    explanation:
      "유료 AI API는 호출량에 비례해 비용이 발생하므로 요청 제한, 캐싱, 무료 한도 활용 등으로 비용을 관리해야 합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "다수의 사용자가 동시에 같은 데이터를 수정할 때 발생할 수 있는 문제는?",
    options: [
      "동시성 충돌(한 사용자의 변경이 다른 변경을 덮어쓰는 등)",
      "문제가 전혀 없다",
      "데이터가 자동으로 두 배가 된다",
      "서버가 빨라진다",
    ],
    correctAnswer: "0",
    points: 3,
    order: 29,
    explanation:
      "동시 수정은 충돌(덮어쓰기)을 일으킬 수 있어 트랜잭션·낙관적 잠금 등으로 데이터 일관성을 보장해야 합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "게임/앱의 사용자 경험(UX)을 높이는 요소로 가장 거리가 먼 것은?",
    options: [
      "직관적인 화면과 빠른 반응",
      "명확한 피드백(점수·효과음 등)",
      "의미 없이 복잡하고 느린 로딩",
      "모바일에서의 편한 조작",
    ],
    correctAnswer: "2",
    points: 2,
    order: 30,
    explanation:
      "직관성·빠른 반응·명확한 피드백·모바일 편의는 UX를 높이지만, 불필요한 복잡함과 느린 로딩은 UX를 떨어뜨립니다.",
  },

  // ===================== 영역 4: 배포·보안·윤리 =====================
  {
    type: "MULTIPLE_CHOICE",
    content: "'배포(Deploy)'의 의미로 가장 적절한 것은?",
    options: [
      "코드를 내 컴퓨터에서만 실행하는 것",
      "만든 앱을 서버/호스팅에 올려 누구나 접속할 수 있게 공개하는 것",
      "코드를 삭제하는 것",
      "이미지를 압축하는 것",
    ],
    correctAnswer: "1",
    points: 3,
    order: 31,
    explanation:
      "배포는 완성한 앱을 호스팅 서비스에 올려 실제 사용자가 인터넷으로 접속할 수 있게 공개하는 과정입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "API 키·비밀번호 같은 민감한 값을 다루는 올바른 방법은?",
    options: [
      "소스 코드에 그대로 하드코딩해 공개 저장소에 올린다",
      "환경변수(.env)나 시크릿으로 분리하고 공개 저장소에 노출하지 않는다",
      "이미지에 적어둔다",
      "모든 사용자에게 보여준다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 32,
    explanation:
      "비밀 키는 환경변수/시크릿으로 분리하고 코드·공개 저장소에 노출하지 않아야 유출 사고를 막을 수 있습니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "배포한 웹 앱에서 HTTPS를 사용하는 이유는?",
    options: [
      "통신을 암호화해 데이터 도청·변조를 방지하기 위해",
      "화면을 더 예쁘게 만들기 위해",
      "이미지 용량을 줄이기 위해",
      "서버를 끄기 위해",
    ],
    correctAnswer: "0",
    points: 2,
    order: 33,
    explanation:
      "HTTPS는 클라이언트-서버 통신을 암호화하여 도청·변조를 방지하고 사용자 신뢰를 확보합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "개인정보(이름·연락처 등)를 수집하는 앱이 지켜야 할 원칙으로 적절한 것은?",
    options: [
      "수집 목적 고지와 동의를 받고 최소한으로 수집한다",
      "동의 없이 최대한 많이 수집한다",
      "수집한 정보를 공개한다",
      "보관 기간을 무제한으로 둔다",
    ],
    correctAnswer: "0",
    points: 3,
    order: 34,
    explanation:
      "개인정보보호법에 따라 목적 고지·동의, 최소 수집, 적정 보관·파기 원칙을 지켜야 합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "배포 후 앱에 오류가 생겼을 때 원인 파악에 도움이 되는 것은?",
    options: [
      "로그(서버/콘솔 로그)와 오류 메시지를 확인한다",
      "아무 것도 보지 않고 코드를 모두 지운다",
      "사용자에게만 책임을 묻는다",
      "오류를 무시한다",
    ],
    correctAnswer: "0",
    points: 2,
    order: 35,
    explanation:
      "로그와 오류 메시지는 문제의 위치·원인을 알려주므로 디버깅의 출발점입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "사용자가 입력한 내용을 화면에 그대로 출력할 때 발생할 수 있는 보안 취약점은?",
    options: [
      "XSS(크로스 사이트 스크립팅) 등 악성 스크립트 삽입",
      "이미지 깨짐",
      "폰트 변경",
      "색상 반전",
    ],
    correctAnswer: "0",
    points: 3,
    order: 36,
    explanation:
      "사용자 입력을 검증·이스케이프 없이 출력하면 XSS 공격에 노출될 수 있으므로 적절한 처리(이스케이프)가 필요합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "AI가 생성한 코드를 그대로 배포하기 전에 반드시 해야 할 일은?",
    options: [
      "동작 테스트와 보안·오류 검토를 사람이 수행한다",
      "검토 없이 즉시 배포한다",
      "주석만 삭제한다",
      "파일명만 바꾼다",
    ],
    correctAnswer: "0",
    points: 3,
    order: 37,
    explanation:
      "AI 생성 코드도 버그·보안 취약점이 있을 수 있어 배포 전 테스트와 사람의 검토가 필수입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "여러 사람이 쓰는 서비스의 데이터 백업에 대한 설명으로 올바른 것은?",
    options: [
      "데이터 손실에 대비해 정기적으로 백업한다",
      "백업은 필요 없다",
      "백업은 사용자가 알아서 한다",
      "백업하면 데이터가 사라진다",
    ],
    correctAnswer: "0",
    points: 2,
    order: 38,
    explanation:
      "장애·실수로 인한 데이터 손실에 대비해 정기 백업과 복구 전략을 마련해야 합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "배포한 앱의 성능을 위해 이미지·정적 파일에 대해 할 수 있는 최적화는?",
    options: [
      "압축·캐싱·CDN 활용 등으로 로딩 속도를 개선한다",
      "파일을 최대한 크게 만든다",
      "캐시를 비활성화한다",
      "이미지를 무한히 추가한다",
    ],
    correctAnswer: "0",
    points: 2,
    order: 39,
    explanation:
      "정적 자원은 압축·캐싱·CDN 등으로 전송량과 지연을 줄여 성능과 사용자 경험을 개선합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "AI를 활용해 앱을 만들고 배포하는 개발자의 책임에 대해 올바른 것은?",
    options: [
      "AI가 만들었으므로 개발자는 책임이 없다",
      "기능·보안·개인정보·법규 준수 등 최종 책임은 배포한 개발자에게 있다",
      "책임은 AI 회사에만 있다",
      "사용자에게만 책임이 있다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 40,
    explanation:
      "AI는 도구이며, 배포한 서비스의 동작·보안·개인정보·법규 준수에 대한 최종 책임은 개발자(사업자)에게 있습니다.",
  },
];
