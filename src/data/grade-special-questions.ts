/**
 * 크라우니 AI 자격증 특급 (AI 제품 전주기) 필기 문제 데이터
 * 총 40문항, 100점. correctAnswer는 0-based 인덱스 문자열.
 * - 영역1: 시장조사·기획 (1~10)
 * - 영역2: AI 활용·제작 전략 (11~20)
 * - 영역3: 배포·운영·데이터 (21~30)
 * - 영역4: 마케팅·홍보·성장·윤리 (31~40)
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

export const GRADE_SPECIAL_QUESTIONS: GradeQuestion[] = [
  // 영역1: 시장조사·기획
  { type: "MULTIPLE_CHOICE", content: "제품 기획 전 '시장조사'의 핵심 목적으로 가장 적절한 것은?", options: ["경쟁사 디자인을 그대로 베끼기 위해", "타겟 고객의 실제 니즈·시장 규모·경쟁 상황을 파악하기 위해", "코드를 빨리 작성하기 위해", "서버 비용을 줄이기 위해"], correctAnswer: "1", points: 3, order: 1, explanation: "시장조사는 고객 니즈, 시장 규모, 경쟁 상황을 파악해 제품 방향을 정하는 활동입니다." },
  { type: "MULTIPLE_CHOICE", content: "타겟 고객(페르소나)을 정의하는 이유로 가장 적절한 것은?", options: ["누구에게 어떤 가치를 줄지 명확히 해 기획·마케팅 방향을 잡기 위해", "화면을 화려하게 만들기 위해", "서버를 늘리기 위해", "코드량을 줄이기 위해"], correctAnswer: "0", points: 2, order: 2, explanation: "페르소나는 대상과 가치를 명확히 해 제품·메시지 설계의 기준이 됩니다." },
  { type: "MULTIPLE_CHOICE", content: "MVP(Minimum Viable Product)의 개념으로 올바른 것은?", options: ["모든 기능을 완성한 최종 제품", "핵심 가치를 검증할 수 있는 최소 기능 제품", "마케팅 예산이 가장 큰 제품", "버그가 전혀 없는 제품"], correctAnswer: "1", points: 3, order: 3, explanation: "MVP는 핵심 가치를 빠르게 검증하기 위한 최소 기능 제품입니다." },
  { type: "MULTIPLE_CHOICE", content: "경쟁 분석에서 확인해야 할 항목으로 가장 거리가 먼 것은?", options: ["경쟁 제품의 강점·약점", "가격·핵심 기능", "타겟 고객층", "경쟁사 직원의 개인 연락처"], correctAnswer: "3", points: 2, order: 4, explanation: "경쟁 분석은 강약점·가격·기능·타겟 등을 보며, 개인정보 수집은 부적절합니다." },
  { type: "MULTIPLE_CHOICE", content: "제품 목표(KPI) 설정으로 가장 적절한 것은?", options: ["'잘 되게 한다' 같은 모호한 목표", "'출시 1개월 내 가입자 500명' 처럼 측정 가능한 목표", "목표는 세우지 않는다", "경쟁사가 정해준 목표"], correctAnswer: "1", points: 3, order: 5, explanation: "KPI는 구체적이고 측정 가능해야 성과를 평가할 수 있습니다." },
  { type: "MULTIPLE_CHOICE", content: "고객의 '진짜 문제'를 발견하기 위한 방법으로 적절한 것은?", options: ["추측만으로 결정", "사용자 인터뷰·설문·행동 데이터 분석", "경쟁사 광고만 참고", "아무 조사도 하지 않음"], correctAnswer: "1", points: 2, order: 6, explanation: "인터뷰·설문·데이터로 실제 문제를 검증해야 합니다." },
  { type: "MULTIPLE_CHOICE", content: "AI를 활용한 시장조사 방법으로 적절한 것은?", options: ["AI로 트렌드·리뷰·경쟁 정보를 요약·분석하되 출처를 검증한다", "AI 답변을 검증 없이 그대로 신뢰한다", "AI는 시장조사에 전혀 쓸 수 없다", "허위 데이터를 생성한다"], correctAnswer: "0", points: 3, order: 7, explanation: "AI로 효율적으로 정보를 모으되 환각 가능성이 있어 출처 검증이 필요합니다." },
  { type: "MULTIPLE_CHOICE", content: "기획 단계의 '기대효과' 정의로 가장 적절한 것은?", options: ["제품이 해결할 문제와 사용자/비즈니스가 얻을 이득", "코드 줄 수", "서버 위치", "도메인 가격"], correctAnswer: "0", points: 2, order: 8, explanation: "기대효과는 문제 해결로 사용자·비즈니스가 얻는 가치를 의미합니다." },
  { type: "MULTIPLE_CHOICE", content: "가치 제안(Value Proposition)으로 가장 적절한 것은?", options: ["'우리 제품은 그냥 좋아요'", "'바쁜 직장인이 5분 만에 식단을 짜주는 AI'처럼 대상·문제·해결을 명확히 제시", "경쟁사 슬로건 복사", "기능 나열만"], correctAnswer: "1", points: 3, order: 9, explanation: "가치 제안은 누구의 어떤 문제를 어떻게 해결하는지 명확해야 합니다." },
  { type: "MULTIPLE_CHOICE", content: "기획서에 포함하면 좋은 항목으로 가장 거리가 먼 것은?", options: ["타겟·문제·해결책", "핵심 기능·목표(KPI)", "경쟁 대비 차별점", "임직원 급여 명세"], correctAnswer: "3", points: 2, order: 10, explanation: "기획서는 타겟·문제·해결·기능·목표·차별점 등을 담습니다." },

  // 영역2: AI 활용·제작 전략
  { type: "MULTIPLE_CHOICE", content: "AI 코딩 도구로 제품을 만들 때 바람직한 태도는?", options: ["생성 코드를 검토 없이 배포", "AI로 생산성을 높이되 동작·보안·품질을 직접 검증·수정", "모든 결정을 AI에 위임", "AI를 절대 사용 안 함"], correctAnswer: "1", points: 3, order: 11, explanation: "AI는 강력한 보조 도구지만 최종 검증·책임은 개발자에게 있습니다." },
  { type: "MULTIPLE_CHOICE", content: "여러 AI 도구를 조합해 제품을 만들 때 핵심은?", options: ["용도에 맞는 도구를 선택해 워크플로로 연결", "한 도구만 고집", "도구를 무작위로 사용", "도구를 쓰지 않음"], correctAnswer: "0", points: 2, order: 12, explanation: "기획·디자인·코드·이미지·카피 등 용도별로 적합한 도구를 조합합니다." },
  { type: "MULTIPLE_CHOICE", content: "프롬프트로 원하는 결과를 얻기 위한 방법으로 적절한 것은?", options: ["대상·목표·제약·형식을 구체적으로 명시", "'알아서 해줘'만 입력", "최대한 짧게만", "매번 동일 프롬프트 반복"], correctAnswer: "0", points: 2, order: 13, explanation: "구체적 맥락·제약·형식을 줄수록 품질이 올라갑니다." },
  { type: "MULTIPLE_CHOICE", content: "AI가 생성한 결과물의 사실성·품질을 보장하려면?", options: ["사람이 검토·검증·수정한다", "검증하지 않는다", "길수록 신뢰한다", "유료면 무조건 신뢰"], correctAnswer: "0", points: 3, order: 14, explanation: "AI 결과는 환각·오류가 있을 수 있어 사람의 검증이 필수입니다." },
  { type: "MULTIPLE_CHOICE", content: "AI 기능을 제품에 API로 연동할 때 비용 관리 방법으로 적절한 것은?", options: ["호출량 제한·캐싱·무료 한도 활용", "무제한 호출", "비용을 고려하지 않음", "사용자에게 임의 청구"], correctAnswer: "0", points: 2, order: 15, explanation: "유료 API는 호출량에 비례해 비용이 늘어 제한·캐싱이 필요합니다." },
  { type: "MULTIPLE_CHOICE", content: "디자인 단계에서 가장 중요한 원칙은?", options: ["사용자가 목표를 쉽게 달성하도록 직관적으로 설계", "최대한 많은 색을 사용", "글자를 작게", "기능을 숨김"], correctAnswer: "0", points: 2, order: 16, explanation: "좋은 디자인은 사용성을 높여 사용자가 목표를 쉽게 달성하게 합니다." },
  { type: "MULTIPLE_CHOICE", content: "제품 제작에서 '반복(iteration)'의 의미로 적절한 것은?", options: ["만들고 피드백을 받아 개선하는 과정을 반복", "한 번 만들면 절대 수정 안 함", "기능을 계속 줄임", "코드를 지움"], correctAnswer: "0", points: 2, order: 17, explanation: "제품은 만들고 검증·개선을 반복하며 완성도를 높입니다." },
  { type: "MULTIPLE_CHOICE", content: "다중 사용자 제품에서 데이터를 서버에 저장해야 하는 이유는?", options: ["사용자 간 공유·동기화·기기 변경 대응", "비용을 늘리려고", "느리게 하려고", "이유 없음"], correctAnswer: "0", points: 2, order: 18, explanation: "다중 사용자 데이터는 서버 저장이 있어야 공유·동기화가 됩니다." },
  { type: "MULTIPLE_CHOICE", content: "사용자 입력을 처리할 때 반드시 해야 하는 것은?", options: ["서버에서 검증(validation)", "무조건 신뢰", "그대로 실행", "무시"], correctAnswer: "0", points: 2, order: 19, explanation: "클라이언트 입력은 신뢰할 수 없어 서버 검증이 필요합니다." },
  { type: "MULTIPLE_CHOICE", content: "제품 개발에서 AI 활용 '깊이'가 높다고 볼 수 있는 사례는?", options: ["단순히 로고만 AI로 만든 경우", "기획·콘텐츠·코드·데이터 분석 등 핵심 워크플로에 AI를 통합한 경우", "AI를 전혀 안 쓴 경우", "AI 이름만 언급한 경우"], correctAnswer: "1", points: 3, order: 20, explanation: "AI를 핵심 가치 창출 과정에 통합할수록 활용 깊이가 높습니다." },

  // 영역3: 배포·운영·데이터
  { type: "MULTIPLE_CHOICE", content: "'배포(Deploy)'의 의미로 올바른 것은?", options: ["내 컴퓨터에서만 실행", "호스팅에 올려 누구나 접속 가능하게 공개", "코드 삭제", "이미지 압축"], correctAnswer: "1", points: 3, order: 21, explanation: "배포는 제품을 호스팅에 올려 실제 사용자가 접속하게 하는 과정입니다." },
  { type: "MULTIPLE_CHOICE", content: "API 키·비밀번호 등 민감 정보 처리로 올바른 것은?", options: ["코드에 하드코딩 후 공개", "환경변수/시크릿으로 분리·비공개", "이미지에 적기", "모두에게 공개"], correctAnswer: "1", points: 3, order: 22, explanation: "민감 정보는 환경변수/시크릿으로 분리하고 노출을 막아야 합니다." },
  { type: "MULTIPLE_CHOICE", content: "HTTPS를 사용하는 이유는?", options: ["통신 암호화로 도청·변조 방지", "화면 장식", "이미지 축소", "서버 종료"], correctAnswer: "0", points: 2, order: 23, explanation: "HTTPS는 통신을 암호화해 보안과 신뢰를 확보합니다." },
  { type: "MULTIPLE_CHOICE", content: "출시 후 제품 개선의 기준으로 가장 적절한 것은?", options: ["사용 데이터·피드백을 분석해 개선", "감으로만 결정", "경쟁사만 따라함", "개선하지 않음"], correctAnswer: "0", points: 3, order: 24, explanation: "실사용 데이터와 피드백이 개선의 근거가 됩니다." },
  { type: "MULTIPLE_CHOICE", content: "지표 중 '전환율(Conversion Rate)'의 정의는?", options: ["방문자 중 목표 행동(가입·구매)을 완료한 비율", "총 방문자 수", "이미지 수", "서버 응답시간"], correctAnswer: "0", points: 2, order: 25, explanation: "전환율은 목표 행동 완료자 ÷ 방문자입니다." },
  { type: "MULTIPLE_CHOICE", content: "A/B 테스트의 목적은?", options: ["두 버전을 비교해 성과 좋은 안을 데이터로 선택", "서버 2대 운영", "이미지 2배", "회원 백업"], correctAnswer: "0", points: 2, order: 26, explanation: "A/B 테스트로 더 나은 안을 데이터 기반으로 고릅니다." },
  { type: "MULTIPLE_CHOICE", content: "서비스 안정 운영을 위해 필요한 것으로 가장 거리가 먼 것은?", options: ["로그·오류 모니터링", "정기 백업", "성능 최적화", "사용자 비밀번호 평문 공개"], correctAnswer: "3", points: 3, order: 27, explanation: "모니터링·백업·최적화는 필요하나 비밀번호 공개는 심각한 보안 위반입니다." },
  { type: "MULTIPLE_CHOICE", content: "사용자 입력을 화면에 그대로 출력할 때의 보안 위험은?", options: ["XSS(스크립트 삽입)", "이미지 깨짐", "폰트 변경", "색 반전"], correctAnswer: "0", points: 2, order: 28, explanation: "검증·이스케이프 없이 출력하면 XSS에 노출됩니다." },
  { type: "MULTIPLE_CHOICE", content: "데이터 기반 의사결정으로 적절한 것은?", options: ["지표를 측정·분석해 가설을 검증하고 결정", "데이터를 무시", "한 번의 직감으로 확정", "지표를 조작"], correctAnswer: "0", points: 2, order: 29, explanation: "측정·분석·검증의 반복이 데이터 기반 의사결정입니다." },
  { type: "MULTIPLE_CHOICE", content: "성능을 위해 정적 자원에 할 수 있는 것은?", options: ["압축·캐싱·CDN 활용", "파일을 키움", "캐시 비활성화", "이미지 무한 추가"], correctAnswer: "0", points: 2, order: 30, explanation: "압축·캐싱·CDN으로 로딩 속도와 비용을 개선합니다." },

  // 영역4: 마케팅·홍보·성장·윤리
  { type: "MULTIPLE_CHOICE", content: "제품 홍보(마케팅)의 첫걸음으로 가장 적절한 것은?", options: ["타겟 고객이 모이는 채널을 파악해 메시지를 전달", "아무 채널에나 도배", "홍보하지 않음", "경쟁사 비방"], correctAnswer: "0", points: 3, order: 31, explanation: "타겟이 있는 채널에 맞는 메시지를 전달하는 것이 효과적입니다." },
  { type: "MULTIPLE_CHOICE", content: "'홍보 반응'을 측정하는 지표로 적절한 것은?", options: ["방문자 수·클릭률·가입·전환·피드백", "코드 줄 수", "서버 위치", "도메인 길이"], correctAnswer: "0", points: 3, order: 32, explanation: "방문·클릭·가입·전환·피드백 등으로 시장 반응을 측정합니다." },
  { type: "MULTIPLE_CHOICE", content: "콘텐츠 마케팅에 AI를 활용하는 적절한 방법은?", options: ["타겟에 맞는 콘텐츠 초안을 빠르게 생성하고 사람이 검토·발행", "검증 없이 대량 발행", "타인 콘텐츠 복제", "거짓 후기 생성"], correctAnswer: "0", points: 2, order: 33, explanation: "AI로 효율을 높이되 사실성·품질은 사람이 검토해야 합니다." },
  { type: "MULTIPLE_CHOICE", content: "광고·홍보에서 피해야 할 표현은?", options: ["근거 있는 객관적 수치", "'100% 보장','무조건 1위' 같은 검증 불가 과장", "실제 후기", "명확한 환불 정책"], correctAnswer: "1", points: 3, order: 34, explanation: "검증 불가 과장·허위는 표시광고법 위반 소지가 있습니다." },
  { type: "MULTIPLE_CHOICE", content: "초기 사용자 확보(그로스) 전략으로 적절한 것은?", options: ["타겟 커뮤니티·SNS·추천 등으로 첫 사용자를 모으고 피드백 반영", "사용자를 모으지 않음", "스팸 발송", "허위 계정 생성"], correctAnswer: "0", points: 2, order: 35, explanation: "초기엔 타겟 채널·추천으로 사용자를 모으고 피드백을 빠르게 반영합니다." },
  { type: "MULTIPLE_CHOICE", content: "개인정보를 수집하는 서비스의 원칙으로 옳은 것은?", options: ["목적 고지·동의·최소 수집·적정 파기", "동의 없이 최대 수집", "정보 공개", "무기한 보관"], correctAnswer: "0", points: 3, order: 36, explanation: "개인정보보호법에 따라 목적 고지·동의·최소 수집·파기를 지킵니다." },
  { type: "MULTIPLE_CHOICE", content: "AI 생성 콘텐츠를 마케팅에 쓸 때 유의점은?", options: ["라이선스·저작권·사실성을 확인하고 책임은 사람이 진다", "확인 불필요", "책임은 AI 회사", "무조건 자유 사용"], correctAnswer: "0", points: 3, order: 37, explanation: "라이선스·사실성을 확인하고 게시 책임은 사람에게 있습니다." },
  { type: "MULTIPLE_CHOICE", content: "고객 피드백을 제품에 반영하는 바람직한 흐름은?", options: ["수집 → 분석 → 우선순위 → 개선 → 재검증", "수집만 하고 방치", "무시", "불만 고객 차단"], correctAnswer: "0", points: 2, order: 38, explanation: "피드백은 분석·우선순위·개선·재검증의 순환으로 반영합니다." },
  { type: "MULTIPLE_CHOICE", content: "제품의 지속 성장을 위해 가장 중요한 것은?", options: ["사용자 가치를 지속 제공하며 데이터로 개선", "한 번 출시 후 방치", "광고만 늘림", "기능을 숨김"], correctAnswer: "0", points: 2, order: 39, explanation: "지속적인 가치 제공과 데이터 기반 개선이 성장의 핵심입니다." },
  { type: "MULTIPLE_CHOICE", content: "AI로 제품을 만들고 운영하는 사람의 책임에 대해 옳은 것은?", options: ["기능·보안·개인정보·법규 준수의 최종 책임은 운영자에게 있다", "AI가 책임진다", "사용자가 책임진다", "책임은 없다"], correctAnswer: "0", points: 3, order: 40, explanation: "AI는 도구이며 제품의 최종 책임은 만들고 운영하는 사람에게 있습니다." },
];
