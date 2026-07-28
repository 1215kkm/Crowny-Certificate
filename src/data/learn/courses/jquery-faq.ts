import type { Course } from "../types";

/**
 * jQuery 2호 — 「접었다 펴는 질문 목록(FAQ)」
 *
 * 1호는 「하나를 찾아 바꾸기」였다면, 2호는 「여러 개를 한꺼번에 다루기」.
 * 질문이 5개여도 코드는 한 번만 쓴다는 것을 배운다.
 */

const HTML_1 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>자주 묻는 질문</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="wrap">
      <h1>자주 묻는 질문</h1>

      <div class="faq">
        <button class="question">이 앱은 무료인가요?</button>
        <div class="answer">네, 처음부터 끝까지 무료예요.</div>
      </div>

      <div class="faq">
        <button class="question">회원가입을 해야 하나요?</button>
        <div class="answer">아니요, 바로 쓰실 수 있어요.</div>
      </div>
    </div>
  </body>
</html>
`;

const CSS_1 = `body {
  margin: 0;
  padding: 40px 16px;
  background: #f8fafc;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  color: #1f2937;
}

.wrap {
  max-width: 460px;
  margin: 0 auto;
}

h1 {
  font-size: 24px;
  text-align: center;
  color: #334155;
}

.faq {
  background: #ffffff;
  border-radius: 12px;
  margin-bottom: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.06);
}

.question {
  width: 100%;
  text-align: left;
  padding: 16px;
  border: none;
  background: none;
  font-size: 15px;
  font-weight: bold;
  color: #334155;
  cursor: pointer;
  font-family: inherit;
}

.answer {
  padding: 0 16px 16px;
  color: #64748b;
  line-height: 1.7;
  font-size: 14px;
}
`;

const HTML_2 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>자주 묻는 질문</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="wrap">
      <h1>자주 묻는 질문</h1>

      <div class="faq">
        <button class="question">이 앱은 무료인가요?</button>
        <div class="answer">네, 처음부터 끝까지 무료예요.</div>
      </div>

      <div class="faq">
        <button class="question">회원가입을 해야 하나요?</button>
        <div class="answer">아니요, 바로 쓰실 수 있어요.</div>
      </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="app.js"></script>
  </body>
</html>
`;

const APP_1 = `$(function () {
  console.log("jQuery 준비 끝!");
});
`;

const CSS_2 = `body {
  margin: 0;
  padding: 40px 16px;
  background: #f8fafc;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  color: #1f2937;
}

.wrap {
  max-width: 460px;
  margin: 0 auto;
}

h1 {
  font-size: 24px;
  text-align: center;
  color: #334155;
}

.faq {
  background: #ffffff;
  border-radius: 12px;
  margin-bottom: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.06);
}

.question {
  width: 100%;
  text-align: left;
  padding: 16px;
  border: none;
  background: none;
  font-size: 15px;
  font-weight: bold;
  color: #334155;
  cursor: pointer;
  font-family: inherit;
}

.answer {
  display: none;
  padding: 0 16px 16px;
  color: #64748b;
  line-height: 1.7;
  font-size: 14px;
}
`;

const APP_2 = `$(function () {
  $(".question").click(function () {
    $(this).next(".answer").slideToggle(200);
  });
});
`;

const HTML_3 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>자주 묻는 질문</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="wrap">
      <h1>자주 묻는 질문</h1>

      <div class="faq">
        <button class="question">이 앱은 무료인가요? <span class="arrow">▾</span></button>
        <div class="answer">네, 처음부터 끝까지 무료예요.</div>
      </div>

      <div class="faq">
        <button class="question">회원가입을 해야 하나요? <span class="arrow">▾</span></button>
        <div class="answer">아니요, 바로 쓰실 수 있어요.</div>
      </div>

      <div class="faq">
        <button class="question">폰에서도 되나요? <span class="arrow">▾</span></button>
        <div class="answer">네, 폰과 컴퓨터 모두에서 잘 나와요.</div>
      </div>

      <div class="faq">
        <button class="question">만든 걸 친구에게 보낼 수 있나요? <span class="arrow">▾</span></button>
        <div class="answer">네, 링크만 보내면 친구도 바로 볼 수 있어요.</div>
      </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="app.js"></script>
  </body>
</html>
`;

const CSS_3 = `body {
  margin: 0;
  padding: 40px 16px;
  background: #f8fafc;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  color: #1f2937;
}

.wrap {
  max-width: 460px;
  margin: 0 auto;
}

h1 {
  font-size: 24px;
  text-align: center;
  color: #334155;
}

.faq {
  background: #ffffff;
  border-radius: 12px;
  margin-bottom: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.06);
}

.question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  text-align: left;
  padding: 16px;
  border: none;
  background: none;
  font-size: 15px;
  font-weight: bold;
  color: #334155;
  cursor: pointer;
  font-family: inherit;
}

.arrow {
  color: #94a3b8;
  transition: transform 0.2s;
}

.question.open .arrow {
  transform: rotate(180deg);
  color: #0ea5e9;
}

.question.open {
  color: #0ea5e9;
}

.answer {
  display: none;
  padding: 0 16px 16px;
  color: #64748b;
  line-height: 1.7;
  font-size: 14px;
}
`;

const APP_3 = `$(function () {
  $(".question").click(function () {
    $(this).toggleClass("open");
    $(this).next(".answer").slideToggle(200);
  });
});
`;

const APP_FINAL = `$(function () {
  $(".question").click(function () {
    var isOpen = $(this).hasClass("open");

    // 다른 질문은 모두 닫는다
    $(".question").removeClass("open");
    $(".answer").slideUp(200);

    // 닫혀 있던 것을 눌렀으면 그것만 연다
    if (!isOpen) {
      $(this).addClass("open");
      $(this).next(".answer").slideDown(200);
    }
  });
});
`;

export const jqueryFaqCourse: Course = {
  id: "jquery-faq",
  track: "jquery",
  title: "접었다 펴는 질문 목록",
  subtitle: "질문이 4개여도 코드는 한 번만 — jQuery 로 여러 개 다루기",
  level: "왕초보",
  duration: "약 55분",
  pages: ["질문 목록"],
  template: "static",

  stages: [
    {
      id: "topic",
      no: 1,
      title: "주제 정하기",
      summary: "왜 「접었다 펴는 질문 목록」을 만드는지 알아봐요",
      tier: "free",
      goal: "무엇을 만들지 한 문장으로 말할 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "이번에 만들 것은 「자주 묻는 질문(FAQ)」 목록이에요. 질문을 누르면 답이 스르륵 펼쳐지고, 다시 누르면 접힙니다.",
        },
        {
          kind: "why",
          text: "이 모양은 거의 모든 웹사이트에 있어요. 쇼핑몰 배송 안내, 학교 홈페이지 공지, 앱 도움말… 한 번 만들어 두면 계속 씁니다.",
        },
        {
          kind: "why",
          text: "그리고 여기서 아주 중요한 걸 배웁니다. 질문이 4개여도 코드는 **한 번만** 씁니다. 앞 코스에서 하나씩 이름표를 붙여 찾았다면, 이번엔 「같은 종류를 한꺼번에」 다뤄요.",
        },
        {
          kind: "what",
          text: "이번에 배울 것 — 여러 개를 한 번에 고르기, 눌린 그것만 골라내기($(this)), 바로 옆 것 찾기(next), 접었다 펴기(slideToggle), 이름표 붙였다 떼기(toggleClass).",
        },
        {
          kind: "next",
          text: "다음 단계에서는 만든 뒤 어디에 쓸지 정합니다.",
        },
      ],
      practiceLabel: "아래 문장을 따라 쳐 보세요",
      practiceText:
        "나는 질문을 누르면 답이 펼쳐지고 다시 누르면 접히는 질문 목록을 만든다.",
    },
    {
      id: "promo",
      no: 2,
      title: "홍보 방법 배우기",
      summary: "만든 질문 목록을 어디에 쓸지 정해요",
      tier: "free",
      goal: "만든 것을 쓸 곳 2가지를 고를 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "이건 그 자체로 자랑할 것이라기보다 「어디에 붙여 쓰는 부품」에 가까워요. 그래서 쓸 곳을 미리 정해 두면 좋습니다.",
        },
        {
          kind: "what",
          text: "아래 카드에 쓸 만한 곳을 정리했어요.",
        },
        {
          kind: "tip",
          text: "처음 고르기 좋은 조합은 ①「앞에서 만든 내 페이지에 붙이기」 + ②「과정 정리해 올리기」예요.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 질문을 몇 개 넣을지 정합니다.",
        },
      ],
      cards: [
        {
          title: "① 내가 만든 다른 페이지에 붙이기",
          body: "소개 페이지나 시간표 아래에 질문 목록을 붙입니다.",
          picked: true,
          note: "부품을 옮겨 붙이는 연습이 곧 실력이 됩니다.",
        },
        {
          title: "② 만든 과정 정리해 올리기",
          body: "「질문 4개인데 코드는 한 줄」이라는 점을 보여줍니다.",
          picked: true,
          note: "코드가 줄어드는 이야기는 개발자들에게 특히 잘 먹혀요.",
        },
        {
          title: "③ 동아리·가게 홈페이지에 쓰기",
          body: "실제로 자주 묻는 질문을 넣어 쓰게 합니다.",
          note: "누가 실제로 쓰면 그때부터 진짜 서비스예요.",
        },
        {
          title: "④ 화면 녹화해서 짧은 영상",
          body: "스르륵 접히고 펴지는 모습은 영상이 잘 어울립니다.",
          note: "움직임은 캡처로 전달이 안 됩니다.",
        },
      ],
      practiceLabel: "내가 고른 방법 2가지를 따라 쳐 보세요",
      practiceText:
        "나는 내가 만든 다른 페이지에 붙이기와 만든 과정 정리해 올리기로 이 부품을 쓴다.",
    },
    {
      id: "plan",
      no: 3,
      title: "기획하기",
      summary: "질문을 몇 개, 어떻게 동작하게 할지 정해요",
      tier: "free",
      goal: "질문 개수와 여닫는 규칙을 정할 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "질문 목록에서 가장 중요한 결정은 「여러 개를 동시에 펼 수 있게 할까?」예요. 답에 따라 코드가 달라집니다.",
        },
        {
          kind: "what",
          text: "우리는 「한 번에 하나만」으로 정합니다. 하나를 열면 나머지는 자동으로 닫혀요. 화면이 길어지지 않아서 읽기 편합니다.",
        },
        {
          kind: "what",
          text: "질문은 4개로 잡습니다. 2개는 너무 적어서 연습이 안 되고, 10개는 만들다 지루해져요.",
        },
        {
          kind: "what",
          text: "그리고 열린 질문은 색과 화살표로 표시합니다. 어디가 열려 있는지 눈으로 바로 알 수 있게요.",
        },
        {
          kind: "tip",
          text: "만들 때는 「하나만 열리는」 규칙을 마지막에 넣습니다. 먼저 여닫기부터 되게 하고, 규칙은 그다음이에요.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 색과 모양을 정합니다.",
        },
      ],
      practiceLabel: "우리가 만들 규칙을 따라 쳐 보세요",
      practiceText: `질문 개수: 4개
여닫는 규칙: 한 번에 하나만 열린다
열린 표시: 글자 색 바뀌고 화살표가 뒤집힌다
효과: 스르륵 펼쳐지고 접힌다`,
    },
    {
      id: "design",
      no: 4,
      title: "디자인하기",
      summary: "색과 모양 규칙을 정해요",
      tier: "free",
      goal: "질문 카드의 색·모서리·표시 방법을 정하게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "질문 목록은 「눌러도 되는 것처럼 보여야」 합니다. 그냥 글처럼 보이면 아무도 안 눌러요.",
        },
        {
          kind: "what",
          text: "색은 회색 계열에 파랑 포인트로 갑니다. 기본 글자는 진회색(#334155), 열린 질문만 파랑(#0ea5e9).",
        },
        {
          kind: "what",
          text: "질문마다 흰 카드에 담고 그림자를 살짝 줍니다. 카드가 나뉘어 있으면 「하나씩 누르는 것」으로 보여요.",
        },
        {
          kind: "what",
          text: "오른쪽 끝에 화살표(▾)를 둡니다. 열리면 위로 뒤집혀서 지금 상태를 알려 줍니다.",
        },
        {
          kind: "tip",
          text: "화살표가 돌아가는 것도 CSS 로 부드럽게 합니다(transition). 확 바뀌는 것보다 훨씬 자연스러워요.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 jQuery 를 어떻게 데려올지 정합니다.",
        },
      ],
      practiceLabel: "우리 질문 목록의 디자인 규칙을 따라 쳐 보세요",
      practiceText: `기본 글자: #334155 진회색
열린 질문: #0ea5e9 파랑
배경: #f8fafc / 질문 카드: 흰색 + 옅은 그림자
오른쪽 화살표: 열리면 뒤집힌다`,
    },
    {
      id: "stack",
      no: 5,
      title: "구현 방법 정하기",
      summary: "jQuery 를 어떻게 데려오고 무엇을 쓸지 골라요",
      tier: "free",
      goal: "여러 개를 한 번에 다루는 방법을 알게 됩니다.",
      paragraphs: [
        {
          kind: "what",
          text: "jQuery 는 남이 만든 도구라 먼저 데려와야 합니다. CDN 주소를 <script> 한 줄로 불러와요. 그다음에 내 코드(app.js)를 부릅니다. 순서가 바뀌면 안 돼요.",
        },
        {
          kind: "what",
          text: "이번 코스의 핵심은 $(\".question\") 입니다. 점(.)은 class 를 뜻하고, 이렇게 쓰면 그 이름표가 붙은 것을 **전부** 고릅니다. 4개면 4개 다요.",
        },
        {
          kind: "what",
          text: "그럼 눌린 것만 어떻게 알까요? $(this) 를 씁니다. 「방금 눌린 그것」이라는 뜻이에요. 이 하나로 코드를 한 번만 써도 됩니다.",
        },
        {
          kind: "what",
          text: "답을 찾을 때는 next() 를 씁니다. 「바로 다음에 있는 것」이라는 뜻이에요. 질문 바로 아래가 그 답이니까요.",
        },
        {
          kind: "tip",
          text: "이름표(id)를 하나하나 다르게 붙여서 4번 쓰는 방법도 있어요. 되긴 하지만 질문이 20개가 되면 지옥이 됩니다. 그래서 class 로 묶습니다.",
        },
        {
          kind: "next",
          text: "다음 6단계부터가 진짜 따라하기입니다.",
        },
      ],
      practiceLabel: "이번에 쓸 방법을 따라 쳐 보세요",
      practiceText: `jQuery 데려오기: CDN 주소를 script 한 줄로 (내 코드보다 먼저)
여러 개 한 번에 고르기: 점을 붙여서 class 로 고른다
눌린 것만 고르기: this
바로 아래 답 찾기: next
접었다 펴기: slideToggle`,
    },
    {
      id: "build",
      no: 6,
      title: "따라하기",
      summary: "제가 먼저 만들면, 오른쪽에서 똑같이 따라 만들어요",
      tier: "free",
      goal: "5개 스텝을 거쳐 질문 목록을 완성합니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "설치할 것은 없습니다. jQuery 는 인터넷 주소로 데려오니까요.",
        },
        {
          kind: "what",
          text: "화면 만들기 → jQuery 연결 → 여닫기 → 표시 → 하나만 열리게. 이 순서로 갑니다.",
        },
        {
          kind: "tip",
          text: "중간에 안 되면 「연결이 됐는지」부터 확인하세요. 대부분 script 두 줄 문제입니다.",
        },
        {
          kind: "next",
          text: "스텝이 끝나면 7단계에서 인터넷에 올립니다.",
        },
      ],
    },
    {
      id: "deploy",
      no: 7,
      title: "배포하기",
      summary: "인터넷에 올려서 링크를 만들어요",
      tier: "free",
      goal: "내 질문 목록이 진짜 인터넷 주소를 갖게 됩니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "다 만들었으면 올릴 차례예요.",
        },
        {
          kind: "why",
          text: "배포(deploy)란 내가 만든 파일을 인터넷 어딘가의 컴퓨터에 올려 두는 일이에요.",
        },
        {
          kind: "next",
          text: "주소가 생기면 2단계에서 정한 곳에 붙여 보세요.",
        },
      ],
    },
  ],

  buildSteps: [
    {
      id: "f0",
      title: "1. 질문 두 개로 화면 만들기",
      goal: "이제 질문과 답이 있는 카드를 화면에 띄울 겁니다.",
      why: "움직이게 하기 전에 「무엇이 접힐지」가 화면에 있어야 해요.",
      what: "질문(button)과 답(div)을 한 쌍으로 묶어 카드를 만듭니다. 먼저 두 개만 만들어 봅니다.",
      where: "「내 폴더」의 ＋파일 로 index.html 과 styles.css 를 만들고 코드를 넣으세요.",
      result:
        "질문·답 한 쌍이 든 카드 두 개가 생겼어요. 지금은 답이 다 펼쳐져 있고 눌러도 아무 일이 없습니다. 순서가 중요해요 — 답은 질문 바로 다음에 와야 나중에 next 로 찾을 수 있습니다.",
      next: "다음에는 jQuery 를 데려와 연결할 거예요.",
      files: [
        {
          path: "/index.html",
          action: "create",
          code: HTML_1,
          hint: "질문은 button, 답은 div. 누르는 것은 button 으로 만들어야 키보드로도 눌립니다.",
        },
        {
          path: "/styles.css",
          action: "create",
          code: CSS_1,
          hint: "button 은 기본 모양이 촌스러워서 border: none 으로 지우고 새로 꾸밉니다.",
        },
      ],
    },
    {
      id: "f1",
      title: "2. jQuery 데려와 연결하기",
      goal: "이제 jQuery 를 불러오고 내 코드 파일을 연결할 겁니다.",
      why: "jQuery 는 남이 만든 도구라 내 페이지에 없어요. 인터넷에서 데려와야 $ 를 쓸 수 있습니다.",
      what: "</body> 바로 앞에 <script> 두 줄을 넣습니다. 첫 줄이 jQuery, 둘째 줄이 내 코드예요. app.js 도 만듭니다.",
      where: "index.html 의 </body> 앞에 script 두 줄을 넣고, ＋파일 로 app.js 를 만드세요.",
      result:
        "jQuery 를 CDN 으로 데려오고 app.js 까지 연결했어요. 순서는 항상 jQuery 먼저, 내 코드 나중입니다.",
      next: "다음에는 질문을 누르면 답이 접혔다 펴지게 만들 거예요.",
      files: [
        {
          path: "/index.html",
          action: "edit",
          code: HTML_2,
          hint: "두 줄의 순서를 바꾸면 안 돼요. 도구를 먼저 가져와야 그 도구를 씁니다.",
        },
        {
          path: "/app.js",
          action: "create",
          code: APP_1,
          hint: "$(function () { ... }) 은 「화면이 준비되면 실행해줘」라는 약속이에요.",
        },
      ],
    },
    {
      id: "f2",
      title: "3. 접었다 펴기",
      goal: "이제 질문을 누르면 답이 스르륵 펼쳐지고, 다시 누르면 접힙니다.",
      why: "이 코스의 핵심이에요. 그리고 여기서 「여러 개를 한 번에 다루는」 방법이 처음 나옵니다.",
      what: "CSS 에서 답을 먼저 숨기고(display: none), $(\".question\") 으로 질문 전부를 고른 뒤 $(this).next() 로 눌린 것의 답만 찾아 slideToggle 합니다.",
      where: "styles.css 의 .answer 에 display: none 을 넣고, app.js 를 아래 코드로 바꾸세요.",
      result:
        "질문 2개인데 코드는 한 번만 썼어요! $(\".question\") 이 전부를 고르고, $(this) 가 「눌린 그것」을 집어 주고, next 가 바로 아래 답을 찾습니다. slideToggle 은 열려 있으면 닫고 닫혀 있으면 엽니다.",
      next: "다음에는 질문을 4개로 늘리고 화살표를 붙일 거예요.",
      files: [
        {
          path: "/styles.css",
          action: "edit",
          code: CSS_2,
          hint: "display: none 으로 먼저 숨겨 둡니다. 처음엔 다 접혀 있어야 하니까요.",
        },
        {
          path: "/app.js",
          action: "edit",
          code: APP_2,
          hint: "$(this) 는 「방금 눌린 그것」. 이게 없으면 4개가 한꺼번에 열립니다.",
        },
      ],
    },
    {
      id: "f3",
      title: "4. 질문 늘리고 화살표 붙이기",
      goal: "이제 질문이 4개가 되고, 열린 질문에 파란 색과 뒤집힌 화살표가 표시됩니다.",
      why: "질문을 늘려도 app.js 는 그대로예요. 이게 class 로 묶어 놓은 이유입니다. 그리고 열린 것을 표시해 줘야 지금 상태를 알 수 있어요.",
      what: "질문 2개를 더 넣고 화살표(span)를 붙입니다. app.js 에서는 toggleClass 로 open 이름표를 붙였다 뗍니다.",
      where: "index.html 에 질문 2개를 추가하고, styles.css 와 app.js 도 아래 코드로 바꾸세요.",
      result:
        "질문이 4개로 늘었는데 코드는 한 줄도 안 늘었어요. toggleClass 로 open 이름표를 붙였다 떼면, CSS 가 그 이름표를 보고 색과 화살표를 바꿔 줍니다. 자바스크립트는 이름표만 갈고 꾸미기는 CSS 가 하는 것이 좋은 방식이에요.",
      next: "다음이 마지막입니다. 한 번에 하나만 열리게 만들 거예요.",
      files: [
        {
          path: "/index.html",
          action: "edit",
          code: HTML_3,
          hint: "질문을 아무리 늘려도 app.js 는 그대로예요.",
        },
        {
          path: "/styles.css",
          action: "edit",
          code: CSS_3,
          hint: ".question.open 은 「open 이름표가 붙은 question」이라는 뜻이에요.",
        },
        {
          path: "/app.js",
          action: "edit",
          code: APP_3,
          hint: "toggleClass 는 「있으면 떼고 없으면 붙여줘」입니다.",
        },
      ],
    },
    {
      id: "f4",
      title: "5. 한 번에 하나만 열리게 (마지막!)",
      goal: "이제 하나를 열면 다른 질문들은 자동으로 닫힙니다.",
      why: "다 열어 두면 화면이 길어져서 읽기 불편해요. 실제 사이트들도 대부분 하나만 엽니다.",
      what: "누른 것이 이미 열려 있었는지 먼저 확인하고, 전부 닫은 다음, 닫혀 있던 것이면 그것만 엽니다.",
      where: "app.js 를 통째로 아래 코드로 바꾸세요.",
      result:
        "hasClass 로 눌린 것의 상태를 먼저 기억하고, 전부 닫은 뒤, 원래 닫혀 있었으면 그것만 열게 했어요. 「먼저 상태를 확인하고 → 전부 초기화하고 → 필요한 것만 처리」는 아주 자주 쓰는 순서입니다. 완성!",
      next: "완성! 7단계로 넘어가서 인터넷에 올려 봅시다.",
      files: [
        {
          path: "/app.js",
          action: "edit",
          code: APP_FINAL,
          hint: "🎉 isOpen 을 먼저 저장하는 게 핵심이에요. 전부 닫은 뒤엔 원래 상태를 알 수 없으니까요.",
        },
      ],
    },
  ],

  deploySteps: [
    {
      id: "d1",
      title: "1. 내 코드 내려받기",
      why: "지금 만든 코드는 이 웹페이지 안에만 있어요.",
      actions: [
        "코드 칸 위쪽의 「코드 내려받기」 버튼을 누르세요.",
        "압축을 풀면 index.html, styles.css, app.js 가 보여요.",
        "jQuery 는 인터넷에서 데려오는 것이라 파일에 없습니다.",
      ],
    },
    {
      id: "d2",
      title: "2. 내 컴퓨터에서 열어 보기",
      why: "올리기 전에 잘 도는지 확인합니다.",
      actions: [
        "index.html 을 두 번 눌러 브라우저로 여세요.",
        "질문을 눌러 답이 펼쳐지는지 확인하세요.",
        "하나를 열면 다른 게 닫히는지도 확인하세요.",
      ],
    },
    {
      id: "d3",
      title: "3. 깃허브에 올리기",
      why: "깃허브(GitHub)는 코드를 올려 두는 창고예요.",
      actions: [
        "github.com 에서 계정을 만드세요.",
        "+ → New repository. 이름은 my-faq, Public 으로 Create.",
        "「uploading an existing file」 로 파일 3개를 끌어다 놓고 Commit changes.",
      ],
      link: { label: "깃허브 열기", href: "https://github.com" },
    },
    {
      id: "d4",
      title: "4. Vercel 에 연결하기",
      why: "Vercel 이 깃허브를 보고 인터넷 주소를 만들어 줍니다.",
      actions: [
        "vercel.com 에서 「Continue with GitHub」 로 들어갑니다.",
        "Add New → Project → my-faq 고르고 Import.",
        "설정은 그대로 두고 Deploy.",
        "🎉 주소가 생겼어요.",
      ],
      link: { label: "Vercel 열기", href: "https://vercel.com" },
    },
    {
      id: "d5",
      title: "5. 다른 페이지에 붙여 보기",
      why: "이건 「부품」이라서 다른 곳에 옮겨 쓸 때 진짜 값이 나옵니다.",
      actions: [
        "앞에서 만든 소개 페이지를 여세요.",
        "질문 카드 부분(HTML)과 CSS·app.js 를 그 페이지에 옮겨 붙여 보세요.",
        "질문 내용만 그 페이지에 맞게 바꾸면 끝입니다.",
        "옮겨 붙이기가 되면 이제 어떤 페이지에도 넣을 수 있어요.",
      ],
    },
  ],

  starterFiles: {},
};
