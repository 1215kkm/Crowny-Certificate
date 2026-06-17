/**
 * 크라우니 AI 자격증 3급 (AI 기초 활용) 시험 문제 데이터
 *
 * 총 40문항, 100점 만점
 * - AI 기본 개념 (1~8번): 8문항
 * - AI 도구 활용 (9~20번): 12문항
 * - 프롬프트 엔지니어링 (21~32번): 12문항
 * - AI 윤리 및 실무 (33~40번): 8문항
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

export const GRADE_3_QUESTIONS: GradeQuestion[] = [
  // =============================================
  // 영역 1: AI 기본 개념 (문항 1~8)
  // =============================================
  {
    type: "MULTIPLE_CHOICE",
    content: "인공지능(AI)의 가장 정확한 정의는 무엇인가?",
    options: [
      "인간의 모든 능력을 완벽히 복제한 기계",
      "인간의 학습, 추론, 판단 등 지적 능력을 컴퓨터로 구현하는 기술",
      "데이터를 저장하고 검색하는 데이터베이스 시스템",
      "인터넷에 연결된 모든 스마트 기기",
    ],
    correctAnswer: "1",
    points: 2,
    order: 1,
    explanation:
      "인공지능(AI)은 인간의 학습, 추론, 판단, 자연어 이해 등 지적 능력을 컴퓨터 시스템으로 구현하는 기술 분야입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "머신러닝(Machine Learning)에 대한 설명으로 가장 올바른 것은?",
    options: [
      "사람이 모든 규칙을 직접 프로그래밍하는 방식이다",
      "데이터로부터 패턴을 학습하여 스스로 성능을 향상시키는 AI의 한 분야이다",
      "딥러닝과 완전히 동일한 개념이다",
      "텍스트 데이터만 처리할 수 있는 기술이다",
    ],
    correctAnswer: "1",
    points: 2,
    order: 2,
    explanation:
      "머신러닝은 명시적 프로그래밍 없이 데이터에서 패턴을 학습하여 예측이나 결정을 내리는 AI의 하위 분야입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "딥러닝(Deep Learning)의 핵심 구조는 무엇인가?",
    options: [
      "의사결정 트리(Decision Tree)",
      "인공신경망(Artificial Neural Network)",
      "관계형 데이터베이스",
      "선형 회귀 모델",
    ],
    correctAnswer: "1",
    points: 3,
    order: 3,
    explanation:
      "딥러닝은 여러 층의 인공신경망을 사용하여 데이터의 복잡한 패턴을 학습하는 머신러닝의 하위 분야입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "생성형 AI(Generative AI)에 대한 설명으로 올바르지 않은 것은?",
    options: [
      "텍스트, 이미지, 음악 등 새로운 콘텐츠를 생성할 수 있다",
      "학습한 데이터의 패턴을 기반으로 새로운 결과물을 만든다",
      "항상 100% 정확한 정보만 생성한다",
      "ChatGPT, DALL-E, Midjourney 등이 대표적인 예시이다",
    ],
    correctAnswer: "2",
    points: 3,
    order: 4,
    explanation:
      "생성형 AI는 새로운 콘텐츠를 생성하지만, 항상 정확한 정보를 생성하는 것은 아닙니다. 할루시네이션 등으로 잘못된 정보를 생성할 수 있습니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "대규모 언어 모델(LLM)에 대한 설명으로 가장 적절한 것은?",
    options: [
      "소량의 데이터로 학습한 번역 전용 모델이다",
      "방대한 텍스트 데이터를 학습하여 자연어를 이해하고 생성하는 AI 모델이다",
      "이미지 인식만 가능한 컴퓨터 비전 모델이다",
      "수학 연산만 수행하는 계산 모델이다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 5,
    explanation:
      "LLM은 인터넷 등에서 수집한 방대한 텍스트 데이터를 학습하여 자연어를 이해하고, 문맥에 맞는 텍스트를 생성할 수 있는 대규모 AI 모델입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "지도 학습(Supervised Learning)에 해당하는 것은?",
    options: [
      "레이블이 없는 데이터에서 군집을 찾는 것",
      "정답 레이블이 포함된 데이터로 모델을 학습시키는 것",
      "보상과 벌칙을 통해 학습하는 것",
      "어떤 데이터도 필요하지 않은 학습 방법",
    ],
    correctAnswer: "1",
    points: 2,
    order: 6,
    explanation:
      "지도 학습은 입력 데이터와 정답(레이블)이 쌍으로 주어진 데이터셋을 사용하여 모델을 훈련시키는 방법입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "AI, 머신러닝, 딥러닝의 관계를 올바르게 설명한 것은?",
    options: [
      "세 가지는 모두 같은 개념이다",
      "딥러닝이 가장 넓은 개념이고 AI가 그 하위 개념이다",
      "AI가 가장 넓은 개념이고, 그 안에 머신러닝, 머신러닝 안에 딥러닝이 포함된다",
      "머신러닝이 가장 넓은 개념이고 AI는 딥러닝의 하위 개념이다",
    ],
    correctAnswer: "2",
    points: 3,
    order: 7,
    explanation:
      "AI는 가장 넓은 범주이며, 머신러닝은 AI의 한 분야, 딥러닝은 머신러닝의 한 분야로 포함 관계를 이루고 있습니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "자연어 처리(NLP)가 활용되는 사례로 가장 적절한 것은?",
    options: [
      "자율주행 자동차의 장애물 인식",
      "챗봇의 사용자 질문 이해 및 응답 생성",
      "공장 로봇의 물리적 조립 작업",
      "기상 데이터를 이용한 날씨 시뮬레이션",
    ],
    correctAnswer: "1",
    points: 2,
    order: 8,
    explanation:
      "자연어 처리(NLP)는 인간의 언어를 컴퓨터가 이해하고 처리하는 기술로, 챗봇, 번역, 감정 분석 등에 활용됩니다.",
  },

  // =============================================
  // 영역 2: AI 도구 활용 (문항 9~20)
  // =============================================
  {
    type: "MULTIPLE_CHOICE",
    content: "ChatGPT를 개발한 회사는 어디인가?",
    options: ["Google", "OpenAI", "Meta", "Anthropic"],
    correctAnswer: "1",
    points: 2,
    order: 9,
    explanation:
      "ChatGPT는 OpenAI에서 개발한 대화형 AI 서비스로, GPT 시리즈 모델을 기반으로 합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "Claude AI를 개발한 회사는 어디인가?",
    options: ["OpenAI", "Google DeepMind", "Anthropic", "Microsoft"],
    correctAnswer: "2",
    points: 2,
    order: 10,
    explanation:
      "Claude는 Anthropic에서 개발한 AI 어시스턴트로, 안전성과 유용성을 중시하는 것이 특징입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "Google의 대화형 AI 서비스 이름은 무엇인가?",
    options: ["Copilot", "Claude", "Gemini", "Llama"],
    correctAnswer: "2",
    points: 2,
    order: 11,
    explanation:
      "Gemini(제미나이)는 Google에서 개발한 멀티모달 AI 모델이자 대화형 AI 서비스입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "Microsoft Copilot의 주요 특징으로 가장 적절한 것은?",
    options: [
      "이미지 생성만 가능한 도구이다",
      "Microsoft 365 등 업무 도구에 통합되어 업무 생산성을 높여준다",
      "오프라인에서만 작동하는 AI이다",
      "코딩만 지원하는 전문 개발 도구이다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 12,
    explanation:
      "Microsoft Copilot은 Word, Excel, PowerPoint 등 Microsoft 365 앱에 통합되어 문서 작성, 데이터 분석 등 업무를 AI로 지원합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "Midjourney와 DALL-E의 공통점은 무엇인가?",
    options: [
      "음악을 생성하는 AI 도구이다",
      "코드를 자동으로 작성해주는 도구이다",
      "텍스트 설명을 기반으로 이미지를 생성하는 AI 도구이다",
      "동영상 편집을 위한 AI 도구이다",
    ],
    correctAnswer: "2",
    points: 2,
    order: 13,
    explanation:
      "Midjourney와 DALL-E는 모두 텍스트 프롬프트를 입력하면 해당 설명에 맞는 이미지를 생성하는 이미지 생성 AI입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "ChatGPT에서 '새 대화(New Chat)'를 시작하면 어떤 일이 발생하는가?",
    options: [
      "이전 대화 내용이 영구적으로 삭제된다",
      "이전 대화의 맥락을 기억하지 못하는 새로운 대화가 시작된다",
      "이전 대화 내용이 자동으로 요약되어 전달된다",
      "모든 설정이 초기화된다",
    ],
    correctAnswer: "1",
    points: 2,
    order: 14,
    explanation:
      "새 대화를 시작하면 AI는 이전 대화의 맥락을 참조하지 않으며, 완전히 새로운 대화로 시작됩니다. 이전 대화 기록은 별도로 저장됩니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "AI 챗봇에게 긴 문서의 내용을 요약해달라고 할 때 가장 효과적인 방법은?",
    options: [
      "문서 전체를 한 번에 복사하여 붙여넣는다",
      "요약의 목적, 원하는 길이, 핵심 키워드를 명시하고 문서를 제공한다",
      "'요약해줘'라고만 입력한다",
      "문서 제목만 알려주고 요약을 요청한다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 15,
    explanation:
      "요약의 목적, 분량, 중점 사항 등을 구체적으로 명시할수록 AI가 더 정확하고 유용한 요약을 생성할 수 있습니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "AI 도구를 사용하여 이메일 초안을 작성할 때 가장 적절한 접근 방식은?",
    options: [
      "AI가 생성한 내용을 검토 없이 그대로 발송한다",
      "AI에게 수신자, 목적, 톤을 알려주고 생성된 초안을 검토 후 수정한다",
      "AI에게 '이메일 써줘'라고만 요청한다",
      "AI를 사용하지 않고 처음부터 직접 작성한다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 16,
    explanation:
      "AI 도구 활용 시 구체적인 맥락을 제공하고, 생성된 결과를 반드시 검토하고 필요에 맞게 수정하는 것이 바람직합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "다음 중 AI 이미지 생성 도구가 아닌 것은?",
    options: ["DALL-E", "Midjourney", "Stable Diffusion", "GitHub Copilot"],
    correctAnswer: "3",
    points: 2,
    order: 17,
    explanation:
      "GitHub Copilot은 코드 작성을 보조하는 AI 도구입니다. DALL-E, Midjourney, Stable Diffusion은 모두 이미지 생성 AI 도구입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "ChatGPT와 Claude의 공통 기능으로 올바른 것은?",
    options: [
      "실시간 인터넷 검색이 기본 기능으로 항상 포함된다",
      "자연어 대화를 통한 질의응답, 글 작성, 코드 생성 등을 지원한다",
      "두 서비스 모두 동일한 회사에서 개발했다",
      "오직 영어로만 대화할 수 있다",
    ],
    correctAnswer: "1",
    points: 2,
    order: 18,
    explanation:
      "ChatGPT와 Claude 모두 자연어 기반의 대화형 AI로 질의응답, 글 작성, 요약, 코드 생성 등 다양한 작업을 지원합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "AI 코딩 도구(예: GitHub Copilot)의 주요 기능은 무엇인가?",
    options: [
      "컴퓨터의 하드웨어를 자동으로 업그레이드한다",
      "코드 작성 시 자동 완성, 코드 제안, 버그 수정 등을 지원한다",
      "프로그래밍 언어를 새로 만들어낸다",
      "컴퓨터 바이러스를 자동으로 제거한다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 19,
    explanation:
      "AI 코딩 도구는 개발자가 코드를 작성할 때 코드 자동 완성, 함수 제안, 버그 탐지 등을 통해 개발 생산성을 높여줍니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "AI 도구에 파일을 첨부하여 분석을 요청할 때 주의할 점은?",
    options: [
      "파일 크기에 제한이 없으므로 자유롭게 업로드한다",
      "민감한 개인정보나 기밀 정보가 포함된 파일은 업로드하지 않도록 주의한다",
      "모든 AI 도구는 파일 내용을 영구 저장하지 않으므로 안전하다",
      "PDF 파일만 업로드할 수 있다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 20,
    explanation:
      "AI 도구에 파일을 업로드할 때는 개인정보보호법 등에 따라 민감 정보나 기밀 자료가 포함되지 않도록 주의해야 합니다.",
  },

  // =============================================
  // 영역 3: 프롬프트 엔지니어링 (문항 21~32)
  // =============================================
  {
    type: "MULTIPLE_CHOICE",
    content: "프롬프트 엔지니어링이란 무엇인가?",
    options: [
      "AI 하드웨어를 설계하는 공학 분야",
      "AI 모델에게 원하는 결과를 얻기 위해 입력(프롬프트)을 설계하고 최적화하는 기술",
      "프로그래밍 언어를 새로 개발하는 작업",
      "AI 모델의 소스 코드를 직접 수정하는 작업",
    ],
    correctAnswer: "1",
    points: 2,
    order: 21,
    explanation:
      "프롬프트 엔지니어링은 AI 모델에게 최적의 결과를 얻기 위해 입력 텍스트(프롬프트)를 체계적으로 설계하고 개선하는 기술입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "제로샷(Zero-shot) 프롬프팅에 대한 설명으로 올바른 것은?",
    options: [
      "예시를 여러 개 제공한 후 답변을 요청하는 방식",
      "예시 없이 바로 질문이나 지시를 하는 방식",
      "AI 모델을 처음부터 다시 학습시키는 방식",
      "이미지와 텍스트를 동시에 입력하는 방식",
    ],
    correctAnswer: "1",
    points: 3,
    order: 22,
    explanation:
      "제로샷 프롬프팅은 별도의 예시를 제공하지 않고 직접 질문이나 지시를 내리는 방식으로, AI의 기존 학습된 지식에 의존합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "퓨샷(Few-shot) 프롬프팅의 장점은 무엇인가?",
    options: [
      "토큰 사용량이 항상 줄어든다",
      "예시를 통해 AI가 원하는 답변의 형식과 스타일을 더 잘 이해할 수 있다",
      "AI 모델의 학습 데이터를 변경할 수 있다",
      "실시간 인터넷 검색이 가능해진다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 23,
    explanation:
      "퓨샷 프롬프팅은 몇 가지 예시를 제공하여 AI가 원하는 출력 형식, 스타일, 패턴을 학습하게 함으로써 더 정확한 결과를 유도합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "사고의 연쇄(Chain-of-Thought, CoT) 프롬프팅이란?",
    options: [
      "여러 개의 AI 모델을 연결하여 사용하는 기법",
      "AI에게 단계적으로 추론 과정을 거치도록 유도하는 프롬프트 기법",
      "대화를 여러 번 반복하여 답변을 개선하는 방법",
      "프롬프트를 암호화하여 전송하는 보안 기법",
    ],
    correctAnswer: "1",
    points: 3,
    order: 24,
    explanation:
      "Chain-of-Thought 프롬프팅은 '단계별로 생각해보세요'와 같이 AI에게 추론 과정을 명시적으로 거치도록 유도하여 복잡한 문제의 정확도를 높이는 기법입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "역할 프롬프팅(Role Prompting)의 예시로 적절한 것은?",
    options: [
      "'답변을 영어로 해주세요'",
      "'당신은 10년 경력의 마케팅 전문가입니다. 이 제품의 마케팅 전략을 제안해주세요.'",
      "'이 문장을 요약해주세요'",
      "'다음 단어의 뜻을 알려주세요'",
    ],
    correctAnswer: "1",
    points: 2,
    order: 25,
    explanation:
      "역할 프롬프팅은 AI에게 특정 전문가나 인물의 역할을 부여하여 해당 관점에서 답변하도록 유도하는 기법입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "좋은 프롬프트의 조건으로 가장 거리가 먼 것은?",
    options: [
      "구체적이고 명확한 지시를 포함한다",
      "원하는 출력 형식을 지정한다",
      "가능한 한 모호하고 추상적으로 작성한다",
      "필요한 맥락과 배경 정보를 제공한다",
    ],
    correctAnswer: "2",
    points: 2,
    order: 26,
    explanation:
      "좋은 프롬프트는 구체적이고 명확해야 합니다. 모호하고 추상적인 프롬프트는 원하지 않는 결과를 초래할 수 있습니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "다음 프롬프트 중 가장 효과적인 것은?",
    options: [
      "'마케팅에 대해 알려줘'",
      "'SNS 마케팅 초보자를 위한 Instagram 릴스 콘텐츠 기획 방법을 3단계로 설명해주세요'",
      "'좋은 글 써줘'",
      "'뭔가 재미있는 거 알려줘'",
    ],
    correctAnswer: "1",
    points: 2,
    order: 27,
    explanation:
      "대상(초보자), 주제(Instagram 릴스), 형식(3단계), 목적(콘텐츠 기획)이 구체적으로 명시된 프롬프트가 가장 효과적입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "AI 답변의 품질이 낮을 때 취할 수 있는 가장 적절한 조치는?",
    options: [
      "같은 프롬프트를 반복해서 입력한다",
      "프롬프트를 더 구체적으로 수정하거나, 맥락을 추가하여 다시 요청한다",
      "AI 도구를 다른 것으로 교체한다",
      "AI에게 '더 잘 대답해'라고 요청한다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 28,
    explanation:
      "AI 답변의 품질을 개선하려면 프롬프트를 더 구체적으로 수정하거나, 맥락, 예시, 원하는 형식 등을 추가하여 반복적으로 개선하는 것이 효과적입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "프롬프트에서 '출력 형식 지정'의 예시로 적절한 것은?",
    options: [
      "'자세히 설명해줘'",
      "'답변을 표 형식으로 작성하고, 각 항목에 장단점을 포함해주세요'",
      "'빨리 답변해줘'",
      "'한국어로 대답해'",
    ],
    correctAnswer: "1",
    points: 2,
    order: 29,
    explanation:
      "출력 형식 지정은 표, 목록, 단계별 설명 등 원하는 답변의 구조와 포함 요소를 명시하는 것을 말합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "복잡한 보고서를 AI로 작성할 때 가장 효과적인 프롬프트 전략은?",
    options: [
      "한 번의 프롬프트로 전체 보고서를 완성하도록 요청한다",
      "보고서의 각 섹션을 나누어 단계적으로 작성을 요청한다",
      "보고서 제목만 입력하고 나머지는 AI에게 맡긴다",
      "가능한 한 짧은 프롬프트를 사용한다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 30,
    explanation:
      "복잡한 작업은 여러 단계로 나누어 요청하는 것이 효과적입니다. 각 섹션별로 구체적인 지시를 하면 더 높은 품질의 결과를 얻을 수 있습니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "프롬프트에 '제약 조건'을 추가하는 이유는 무엇인가?",
    options: [
      "AI의 처리 속도를 높이기 위해서",
      "AI의 답변 범위를 좁혀서 더 관련성 높고 정확한 결과를 얻기 위해서",
      "AI 모델의 학습 데이터를 변경하기 위해서",
      "다른 사용자의 접근을 차단하기 위해서",
    ],
    correctAnswer: "1",
    points: 2,
    order: 31,
    explanation:
      "제약 조건(글자 수 제한, 특정 관점, 대상 독자 등)을 추가하면 AI의 답변 범위가 좁아져 더 목적에 맞는 결과를 얻을 수 있습니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "다음 중 프롬프트 작성의 '반복적 개선(Iterative Refinement)' 방법에 해당하는 것은?",
    options: [
      "처음 작성한 프롬프트를 절대 수정하지 않는다",
      "AI의 응답을 확인하고, 부족한 부분을 보완하여 프롬프트를 수정 후 재요청한다",
      "여러 AI 도구에 동시에 같은 질문을 한다",
      "프롬프트를 영어로만 작성한다",
    ],
    correctAnswer: "1",
    points: 2,
    order: 32,
    explanation:
      "반복적 개선은 AI의 응답 결과를 평가하고 프롬프트를 수정하여 다시 요청하는 과정을 반복함으로써 점진적으로 원하는 결과에 가까워지는 방법입니다.",
  },

  // =============================================
  // 영역 4: AI 윤리 및 실무 (문항 33~40)
  // =============================================
  {
    type: "MULTIPLE_CHOICE",
    content:
      "AI 할루시네이션(Hallucination)이란 무엇인가?",
    options: [
      "AI가 사용자의 질문을 거부하는 현상",
      "AI가 사실이 아닌 정보를 마치 사실인 것처럼 자신 있게 생성하는 현상",
      "AI의 응답 속도가 느려지는 현상",
      "AI가 같은 답변을 반복하는 현상",
    ],
    correctAnswer: "1",
    points: 3,
    order: 33,
    explanation:
      "할루시네이션은 AI가 학습 데이터에 없거나 사실과 다른 정보를 마치 사실인 것처럼 확신을 가지고 생성하는 현상으로, AI 활용 시 반드시 주의해야 합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "AI가 생성한 콘텐츠의 저작권에 대한 설명으로 가장 적절한 것은?",
    options: [
      "AI가 생성한 모든 콘텐츠는 자동으로 사용자에게 저작권이 귀속된다",
      "AI 생성 콘텐츠의 저작권은 아직 법적으로 명확하지 않은 부분이 많으며, 국가별로 다를 수 있다",
      "AI 생성 콘텐츠에는 어떤 경우에도 저작권이 인정되지 않는다",
      "AI가 생성한 콘텐츠의 저작권은 항상 AI 회사에 귀속된다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 34,
    explanation:
      "AI 생성 콘텐츠의 저작권은 전 세계적으로 논의 중인 이슈로, 국가와 상황에 따라 다른 법적 해석이 적용될 수 있습니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content: "AI 편향(Bias)에 대한 설명으로 올바른 것은?",
    options: [
      "최신 AI 모델에서는 편향이 완전히 제거되었다",
      "학습 데이터에 존재하는 편향이 AI의 결과에 반영될 수 있다",
      "AI 편향은 이미지 생성 AI에서만 발생한다",
      "편향은 AI 기술의 장점 중 하나이다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 35,
    explanation:
      "AI는 학습 데이터에 포함된 편향을 그대로 학습할 수 있으며, 이는 성별, 인종, 나이 등에 대한 불공정한 결과로 이어질 수 있습니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "업무에서 AI를 활용할 때 가장 중요한 원칙은?",
    options: [
      "AI의 답변을 항상 그대로 사용한다",
      "AI는 보조 도구로 활용하고, 최종 판단과 책임은 사람에게 있다",
      "모든 업무를 AI에게 완전히 위임한다",
      "AI 사용 사실을 항상 비밀로 한다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 36,
    explanation:
      "AI는 강력한 보조 도구이지만, 결과물에 대한 최종 검토, 판단, 책임은 반드시 사람이 져야 합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "AI에게 개인정보를 입력할 때 주의해야 하는 이유는?",
    options: [
      "AI가 개인정보를 악의적으로 사용하기 때문이다",
      "입력된 데이터가 모델 학습에 사용되거나 서버에 저장될 수 있기 때문이다",
      "AI는 개인정보를 처리할 수 없기 때문이다",
      "개인정보를 입력하면 AI의 성능이 저하되기 때문이다",
    ],
    correctAnswer: "1",
    points: 2,
    order: 37,
    explanation:
      "AI 서비스에 입력한 데이터는 서비스 제공자의 정책에 따라 모델 학습이나 서비스 개선에 사용될 수 있으므로 개인정보 입력에 주의가 필요합니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "AI가 생성한 정보의 신뢰성을 높이기 위한 방법으로 가장 적절한 것은?",
    options: [
      "AI가 자신 있게 답변하면 무조건 신뢰한다",
      "AI의 답변을 공신력 있는 출처와 교차 검증한다",
      "같은 질문을 여러 번 하여 동일한 답변이 나오면 신뢰한다",
      "유료 AI 서비스의 답변은 항상 정확하므로 검증이 불필요하다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 38,
    explanation:
      "AI 답변의 정확성을 확인하려면 공신력 있는 자료나 원본 출처와 교차 검증하는 것이 가장 신뢰할 수 있는 방법입니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "AI 기술의 한계에 대한 설명으로 올바르지 않은 것은?",
    options: [
      "학습 데이터 이후의 최신 정보를 알지 못할 수 있다",
      "복잡한 수학 계산에서 오류를 범할 수 있다",
      "AI는 인간의 감정을 완벽하게 이해하고 공감할 수 있다",
      "문맥을 잘못 이해하여 부적절한 답변을 생성할 수 있다",
    ],
    correctAnswer: "2",
    points: 2,
    order: 39,
    explanation:
      "현재 AI는 인간의 감정을 진정으로 이해하거나 공감하지 못합니다. 텍스트 패턴을 분석하여 감정을 추측할 수는 있지만, 실제 감정적 이해와는 다릅니다.",
  },
  {
    type: "MULTIPLE_CHOICE",
    content:
      "직장에서 AI 도구를 사용할 때 지켜야 할 윤리적 원칙으로 가장 적절한 것은?",
    options: [
      "AI가 작성한 결과물을 자신의 창작물이라고 주장한다",
      "회사의 AI 사용 정책을 준수하고, 기밀 정보를 AI에 입력하지 않으며, AI 활용 사실을 적절히 밝힌다",
      "AI를 사용한 사실을 동료에게 숨기고 자신의 능력처럼 보이게 한다",
      "회사의 모든 문서를 AI에 업로드하여 분석한다",
    ],
    correctAnswer: "1",
    points: 3,
    order: 40,
    explanation:
      "직장에서 AI를 사용할 때는 회사의 AI 사용 정책 준수, 기밀 정보 보호, AI 활용 사실의 적절한 공개 등 윤리적 원칙을 지키는 것이 중요합니다.",
  },
];
