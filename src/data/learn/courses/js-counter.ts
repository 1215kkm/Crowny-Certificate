import type { Course } from "../types";

/**
 * JavaScript 1호 — 「숫자 세기 버튼」
 *
 * jQuery 코스와 짝을 이룬다. 핵심 메시지:
 *   jQuery 는 남의 도구라 **데려와야** 썼지만,
 *   자바스크립트는 브라우저에 **원래 들어 있어서 데려올 게 없다.**
 */

const HTML_1 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>숫자 세기</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="card">
      <p class="label">지금까지</p>
      <div id="count" class="count">0</div>
      <div class="btn-row">
        <button id="minus" class="btn gray">-1</button>
        <button id="plus" class="btn">+1</button>
      </div>
    </div>
  </body>
</html>
`;

const CSS_1 = `body {
  margin: 0;
  padding: 50px 20px;
  background: #fffbeb;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  text-align: center;
}

.card {
  max-width: 340px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 20px;
  padding: 28px 20px;
  box-shadow: 0 4px 20px rgba(180, 83, 9, 0.12);
}

.label {
  color: #92400e;
  font-size: 14px;
  margin: 0;
}

.count {
  font-size: 64px;
  font-weight: bold;
  color: #b45309;
  line-height: 1.2;
}

.btn-row {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.btn {
  flex: 1;
  padding: 14px 0;
  border: none;
  border-radius: 12px;
  background: #f59e0b;
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.btn.gray {
  background: #e5e7eb;
  color: #6b7280;
}

.btn:hover {
  opacity: 0.9;
}
`;

const HTML_2 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>숫자 세기</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="card">
      <p class="label">지금까지</p>
      <div id="count" class="count">0</div>
      <div class="btn-row">
        <button id="minus" class="btn gray">-1</button>
        <button id="plus" class="btn">+1</button>
      </div>
    </div>

    <script src="app.js"></script>
  </body>
</html>
`;

const APP_1 = `console.log("자바스크립트 준비 끝!");
`;

const APP_2 = `let count = 0;

const countBox = document.getElementById("count");
const plusBtn = document.getElementById("plus");

plusBtn.addEventListener("click", function () {
  count = count + 1;
  countBox.textContent = count;
});
`;

const APP_3 = `let count = 0;

const countBox = document.getElementById("count");
const plusBtn = document.getElementById("plus");
const minusBtn = document.getElementById("minus");

function show() {
  countBox.textContent = count;
}

plusBtn.addEventListener("click", function () {
  count = count + 1;
  show();
});

minusBtn.addEventListener("click", function () {
  if (count > 0) {
    count = count - 1;
  }
  show();
});
`;

const HTML_3 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>숫자 세기</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="card">
      <p class="label">지금까지</p>
      <div id="count" class="count">0</div>
      <p id="message" class="message">버튼을 눌러 보세요</p>
      <div class="btn-row">
        <button id="minus" class="btn gray">-1</button>
        <button id="plus" class="btn">+1</button>
      </div>
      <button id="reset" class="reset-btn">처음부터 다시</button>
    </div>

    <script src="app.js"></script>
  </body>
</html>
`;

const CSS_2 = `body {
  margin: 0;
  padding: 50px 20px;
  background: #fffbeb;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  text-align: center;
}

.card {
  max-width: 340px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 20px;
  padding: 28px 20px;
  box-shadow: 0 4px 20px rgba(180, 83, 9, 0.12);
}

.label {
  color: #92400e;
  font-size: 14px;
  margin: 0;
}

.count {
  font-size: 64px;
  font-weight: bold;
  color: #b45309;
  line-height: 1.2;
}

.message {
  color: #92400e;
  font-size: 14px;
  min-height: 20px;
  margin: 0 0 8px;
}

.btn-row {
  display: flex;
  gap: 10px;
}

.btn {
  flex: 1;
  padding: 14px 0;
  border: none;
  border-radius: 12px;
  background: #f59e0b;
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.btn.gray {
  background: #e5e7eb;
  color: #6b7280;
}

.btn:hover {
  opacity: 0.9;
}

.reset-btn {
  margin-top: 12px;
  border: none;
  background: none;
  color: #a16207;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
}
`;

const APP_FINAL = `let count = 0;

const countBox = document.getElementById("count");
const messageBox = document.getElementById("message");
const plusBtn = document.getElementById("plus");
const minusBtn = document.getElementById("minus");
const resetBtn = document.getElementById("reset");

function show() {
  countBox.textContent = count;

  if (count === 0) {
    messageBox.textContent = "버튼을 눌러 보세요";
  } else if (count < 10) {
    messageBox.textContent = "좋아요, 계속 눌러 보세요";
  } else if (count < 30) {
    messageBox.textContent = "벌써 " + count + "번! 잘하고 있어요";
  } else {
    messageBox.textContent = "대단해요! 🎉";
  }
}

plusBtn.addEventListener("click", function () {
  count = count + 1;
  show();
});

minusBtn.addEventListener("click", function () {
  if (count > 0) {
    count = count - 1;
  }
  show();
});

resetBtn.addEventListener("click", function () {
  count = 0;
  show();
});

show();
`;

export const jsCounterCourse: Course = {
  id: "js-counter",
  track: "javascript",
  title: "숫자 세기 버튼 만들기",
  subtitle: "데려올 것 없이, 브라우저에 원래 있는 자바스크립트로",
  level: "왕초보",
  duration: "약 50분",
  pages: ["숫자 세기"],
  template: "static",

  stages: [
    {
      id: "topic",
      no: 1,
      title: "주제 정하기",
      summary: "왜 「숫자 세기」로 자바스크립트를 시작하는지 알아봐요",
      tier: "free",
      goal: "무엇을 만들지 한 문장으로 말할 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "이번에 만들 것은 「숫자 세기 버튼」이에요. +1 을 누르면 숫자가 올라가고, -1 을 누르면 내려가고, 숫자에 따라 응원 문구가 바뀝니다.",
        },
        {
          kind: "why",
          text: "먼저 중요한 이야기 하나. jQuery 는 남이 만든 도구라서 인터넷에서 **데려와야** 썼죠? 자바스크립트는 다릅니다. **브라우저에 원래 들어 있어요.** 데려올 게 없습니다.",
        },
        {
          kind: "why",
          text: "그래서 이번엔 <script src=\"app.js\"></script> 한 줄만 있으면 됩니다. 내 코드를 부르는 줄 하나뿐이에요. 도구를 가져오는 줄은 필요 없습니다.",
        },
        {
          kind: "what",
          text: "숫자 세기를 고른 이유는 「기억하고, 바꾸고, 보여주기」가 전부 들어 있어서예요. 앱이 하는 일이 결국 이 세 가지입니다.",
        },
        {
          kind: "tip",
          text: "실제로 쓸 데도 많아요. 물 마신 횟수, 운동 횟수, 오늘 읽은 페이지 수… 세는 것은 다 이걸로 만듭니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 만든 뒤 어디에 쓸지 정합니다.",
        },
      ],
      practiceLabel: "아래 문장을 따라 쳐 보세요",
      practiceText:
        "나는 버튼을 누르면 숫자가 오르내리고 응원 문구가 바뀌는 숫자 세기 앱을 만든다.",
    },
    {
      id: "promo",
      no: 2,
      title: "홍보 방법 배우기",
      summary: "만든 것을 어디에 쓸지 정해요",
      tier: "free",
      goal: "만든 것을 쓸 곳 2가지를 고를 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "숫자 세기는 「실제로 매일 쓰는 것」으로 만들 때 값이 나와요. 남에게 자랑하기보다 내가 쓰는 게 먼저입니다.",
        },
        {
          kind: "what",
          text: "아래 카드에 쓸 만한 방법을 정리했어요.",
        },
        {
          kind: "tip",
          text: "처음 고르기 좋은 조합은 ①「내가 매일 쓰는 것으로 바꾸기」 + ②「친구에게 링크 보내기」예요.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 무엇을 넣을지 정합니다.",
        },
      ],
      cards: [
        {
          title: "① 내가 매일 쓰는 것으로 바꾸기",
          body: "「물 마신 횟수」처럼 이름만 바꾸면 바로 내 앱이 됩니다.",
          picked: true,
          note: "직접 쓰기 시작하면 고칠 곳이 저절로 보입니다.",
        },
        {
          title: "② 친구에게 링크 보내기",
          body: "버튼이 있으면 사람은 꼭 눌러 봅니다.",
          picked: true,
          note: "가장 빠른 피드백이에요.",
        },
        {
          title: "③ 화면 녹화해서 짧은 영상",
          body: "숫자가 올라가고 문구가 바뀌는 10초 영상.",
          note: "문구가 바뀌는 지점이 재미 포인트입니다.",
        },
        {
          title: "④ 만든 과정 정리해 올리기",
          body: "「jQuery 없이 만들어 봤다」는 관점으로 씁니다.",
          note: "같은 걸 두 방법으로 만들어 본 사람은 드물어요.",
        },
      ],
      practiceLabel: "내가 고른 방법 2가지를 따라 쳐 보세요",
      practiceText:
        "나는 내가 매일 쓰는 것으로 바꾸기와 친구에게 링크 보내기로 내 앱을 쓴다.",
    },
    {
      id: "plan",
      no: 3,
      title: "기획하기",
      summary: "무엇을 넣고 무엇을 뺄지 정해요",
      tier: "free",
      goal: "화면에 넣을 것과 규칙을 적을 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "세는 앱에서 가장 중요한 결정은 「0보다 작아질 수 있는가」예요. 물 마신 횟수가 -3 이면 이상하잖아요.",
        },
        {
          kind: "what",
          text: "우리는 0 밑으로 안 내려가게 막습니다. -1 을 눌러도 0이면 그대로 0이에요.",
        },
        {
          kind: "what",
          text: "화면에 넣을 것은 5개 — 안내 문구, 큰 숫자, 응원 문구, +1/-1 버튼, 처음부터 다시 버튼.",
        },
        {
          kind: "what",
          text: "응원 문구는 숫자에 따라 4단계로 바뀝니다. 0 / 1~9 / 10~29 / 30 이상.",
        },
        {
          kind: "tip",
          text: "「처음부터 다시」는 꼭 넣으세요. 잘못 누른 걸 되돌릴 수 없으면 사람은 불안해서 안 씁니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 색과 크기를 정합니다.",
        },
      ],
      practiceLabel: "우리가 만들 규칙을 따라 쳐 보세요",
      practiceText: `화면에 넣을 것: 큰 숫자 / 응원 문구 / 플러스 마이너스 버튼 / 처음부터 다시
규칙: 0보다 작아지지 않는다
응원 문구: 0 / 1~9 / 10~29 / 30 이상 네 단계
안 넣을 것: 저장 기능, 여러 개 세기, 기록 보기`,
    },
    {
      id: "design",
      no: 4,
      title: "디자인하기",
      summary: "색과 크기 규칙을 정해요",
      tier: "free",
      goal: "숫자·버튼의 색과 크기를 정하게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "이 앱의 주인공은 숫자예요. 숫자가 가장 커야 합니다.",
        },
        {
          kind: "what",
          text: "숫자는 64px 로 아주 크게. 멀리서도 보이고, 누를 때마다 확 바뀌는 게 눈에 들어와야 합니다.",
        },
        {
          kind: "what",
          text: "색은 주황·노랑 계열. 메인 주황(#f59e0b), 진한 갈색(#b45309), 배경은 연한 노랑(#fffbeb).",
        },
        {
          kind: "what",
          text: "+1 은 진한 주황, -1 은 회색으로 합니다. 주로 누르는 버튼을 더 눈에 띄게 하는 방법이에요.",
        },
        {
          kind: "tip",
          text: "「처음부터 다시」는 밑줄 친 작은 글씨로 둡니다. 실수로 누르면 안 되는 것은 일부러 덜 눈에 띄게 만들어요.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 자바스크립트를 어떻게 쓸지 정합니다.",
        },
      ],
      practiceLabel: "우리 앱의 디자인 규칙을 따라 쳐 보세요",
      practiceText: `메인색: #f59e0b (주황)
진한색: #b45309 / 배경: #fffbeb (연한 노랑)
숫자 크기: 64px 아주 크게
플러스 버튼은 진하게, 마이너스는 회색
처음부터 다시는 작은 밑줄 글씨`,
    },
    {
      id: "stack",
      no: 5,
      title: "구현 방법 정하기",
      summary: "자바스크립트를 어떻게 쓸지 골라요",
      tier: "free",
      goal: "jQuery 와 무엇이 다른지 설명할 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "what",
          text: "가장 큰 차이 — 자바스크립트는 **데려올 게 없습니다.** 브라우저에 원래 들어 있어요. jQuery 는 남이 만든 도구라 CDN 주소로 데려와야 했지만, 자바스크립트는 그럴 필요가 없습니다.",
        },
        {
          kind: "what",
          text: "그래서 <script> 는 한 줄이에요. <script src=\"app.js\"></script> — 내 코드를 부르는 줄 하나뿐입니다.",
        },
        {
          kind: "what",
          text: "찾는 방법도 다릅니다. jQuery 는 $(\"#count\") 였는데, 자바스크립트는 document.getElementById(\"count\") 예요. 길지만 뜻이 그대로 보입니다 — 「문서에서 count 라는 id 를 가진 것을 가져와」.",
        },
        {
          kind: "what",
          text: "글자를 바꿀 때는 .textContent = \"바꿀 글자\" 를 씁니다. jQuery 의 .text(\"...\") 와 같은 일이에요.",
        },
        {
          kind: "tip",
          text: "그럼 jQuery 는 왜 쓸까요? 예전엔 브라우저마다 코드가 달라서 jQuery 가 꼭 필요했어요. 지금은 자바스크립트만으로도 충분해서, 새로 만드는 곳은 대부분 자바스크립트를 씁니다. 다만 예전에 만든 사이트에 jQuery 가 많아서 읽을 줄은 알아야 해요.",
        },
        {
          kind: "next",
          text: "다음 6단계부터가 진짜 따라하기입니다.",
        },
      ],
      practiceLabel: "자바스크립트와 jQuery 의 차이를 따라 쳐 보세요",
      practiceText: `자바스크립트: 브라우저에 원래 있다. 데려올 필요 없음
jQuery: 남이 만든 도구라 CDN 으로 데려와야 함
찾기: document.getElementById 로 찾는다
글자 바꾸기: textContent 에 넣는다
누를 때: addEventListener 로 정한다`,
    },
    {
      id: "build",
      no: 6,
      title: "따라하기",
      summary: "제가 먼저 만들면, 오른쪽에서 똑같이 따라 만들어요",
      tier: "free",
      goal: "5개 스텝을 거쳐 숫자 세기 앱을 완성합니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "설치도 없고 데려올 도구도 없습니다. 파일 3개면 끝나요.",
        },
        {
          kind: "tip",
          text: "안 될 때는 브라우저 개발자도구의 콘솔을 보세요. 자바스크립트는 어디가 틀렸는지 콘솔에 적어 줍니다.",
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
      summary: "인터넷에 올려서 친구에게 보내요",
      tier: "free",
      goal: "내 앱이 진짜 인터넷 주소를 갖게 됩니다.",
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
          text: "주소가 생기면 폰 홈 화면에 추가해서 매일 써 보세요.",
        },
      ],
    },
  ],

  buildSteps: [
    {
      id: "c0",
      title: "1. 화면 먼저 만들기",
      goal: "이제 큰 숫자와 +1 / -1 버튼이 있는 카드를 띄울 겁니다.",
      why: "움직이게 하기 전에 「무엇이 바뀔지」가 화면에 있어야 해요.",
      what: "index.html 에 숫자와 버튼을 만들고 styles.css 로 꾸밉니다. 바뀔 곳에는 id 이름표를 붙여 둡니다.",
      where: "「내 폴더」의 ＋파일 로 index.html 과 styles.css 를 만들고 코드를 넣으세요.",
      result:
        "숫자 0 과 버튼 두 개가 있는 카드가 만들어졌어요. 아직 눌러도 아무 일이 없습니다. 바뀔 자리(count)와 누를 것(plus·minus)에 id 를 미리 붙여 뒀어요.",
      next: "다음에는 자바스크립트 파일을 연결할 거예요.",
      files: [
        {
          path: "/index.html",
          action: "create",
          code: HTML_1,
          hint: 'id="count" 는 이름표예요. 이 이름으로 찾아서 숫자를 바꿉니다.',
        },
        {
          path: "/styles.css",
          action: "create",
          code: CSS_1,
          hint: "숫자를 64px 로 크게. 이 앱의 주인공이니까요.",
        },
      ],
    },
    {
      id: "c1",
      title: "2. 자바스크립트 파일 연결하기",
      goal: "이제 app.js 를 만들어 연결할 겁니다. 데려올 도구는 없어요.",
      why: "여기가 jQuery 와 다른 점이에요. jQuery 는 도구를 먼저 데려와야 해서 <script> 가 두 줄이었죠. 자바스크립트는 브라우저에 원래 있으니 내 코드 한 줄만 부르면 됩니다.",
      what: "</body> 바로 앞에 <script src=\"app.js\"></script> 한 줄을 넣고, app.js 를 만듭니다.",
      where: "index.html 의 </body> 앞에 script 한 줄을 넣고, ＋파일 로 app.js 를 만드세요.",
      result:
        "script 한 줄로 연결이 끝났어요. CDN 주소도, 도구를 가져오는 줄도 없습니다 — 자바스크립트는 브라우저에 원래 들어 있으니까요. </body> 앞에 두는 이유는 화면이 다 그려진 뒤에 코드가 돌게 하려는 거예요.",
      next: "다음에는 +1 버튼을 누르면 숫자가 올라가게 만들 거예요.",
      files: [
        {
          path: "/index.html",
          action: "edit",
          code: HTML_2,
          hint: "jQuery 코스에서는 이 자리에 두 줄이 있었어요. 여기선 한 줄이면 끝입니다.",
        },
        {
          path: "/app.js",
          action: "create",
          code: APP_1,
          hint: "console.log 는 개발자도구 콘솔에 글을 찍어 보는 것이에요. 연결됐는지 확인용입니다.",
        },
      ],
    },
    {
      id: "c2",
      title: "3. +1 버튼 만들기",
      goal: "이제 +1 을 누르면 숫자가 하나씩 올라갑니다.",
      why: "「기억하고, 바꾸고, 보여주기」가 여기서 다 나와요. count 가 기억, +1 이 바꾸기, textContent 가 보여주기입니다.",
      what: "let count 로 숫자를 기억하고, getElementById 로 화면 요소를 찾고, addEventListener 로 누를 때 할 일을 정합니다.",
      where: "app.js 를 통째로 아래 코드로 바꾸세요.",
      result:
        "버튼을 누르면 숫자가 올라가요! let 은 「바뀔 수 있는 값」, const 는 「안 바뀌는 값」입니다. addEventListener(\"click\", ...) 은 「눌렸을 때 이걸 해줘」라는 뜻이에요.",
      next: "다음에는 -1 버튼을 만들 거예요.",
      files: [
        {
          path: "/app.js",
          action: "edit",
          code: APP_2,
          hint: "count 는 바뀌니까 let, 화면 요소는 안 바뀌니까 const 로 씁니다.",
        },
      ],
    },
    {
      id: "c3",
      title: "4. -1 버튼과 0 아래 막기",
      goal: "이제 -1 로 숫자를 내릴 수 있고, 0보다 작아지지 않습니다.",
      why: "세는 앱에서 음수가 나오면 이상해요. 그리고 화면 바꾸는 코드가 두 곳에 생기니, 한 곳으로 모아야 합니다.",
      what: "show 라는 함수를 만들어 화면 바꾸기를 한곳에 모으고, if 로 0보다 클 때만 빼게 합니다.",
      where: "app.js 를 통째로 아래 코드로 바꾸세요.",
      result:
        "show 함수로 화면 바꾸는 일을 한곳에 모았어요. 같은 코드를 두 번 쓰지 않게 됩니다. if (count > 0) 으로 0 아래는 막았고요 — 규칙을 코드로 옮기는 첫 연습입니다.",
      next: "다음이 마지막입니다. 응원 문구와 초기화 버튼을 넣을 거예요.",
      files: [
        {
          path: "/app.js",
          action: "edit",
          code: APP_3,
          hint: "function show() 처럼 이름을 붙여 두면 필요할 때마다 show() 로 부를 수 있어요.",
        },
      ],
    },
    {
      id: "c4",
      title: "5. 응원 문구와 초기화 (마지막!)",
      goal: "이제 숫자에 따라 문구가 바뀌고, 처음부터 다시 버튼이 생깁니다.",
      why: "숫자만 있으면 심심해요. 문구가 바뀌면 계속 누르고 싶어집니다. 그리고 되돌릴 방법이 있어야 마음 편히 씁니다.",
      what: "if / else if 로 숫자 구간마다 다른 문구를 넣고, 초기화 버튼을 답니다. 맨 아래에서 show() 를 한 번 불러 처음 화면도 맞춥니다.",
      where: "index.html 에 문구와 버튼을 넣고, styles.css 와 app.js 도 바꾸세요.",
      result:
        "if / else if 로 숫자 구간마다 문구가 바뀌고, 초기화 버튼까지 생겨 앱이 완성됐어요. 맨 아래 show() 한 줄이 처음 화면도 규칙대로 맞춰 줍니다. 데려온 도구 없이 브라우저에 원래 있는 자바스크립트만으로 다 만들었습니다!",
      next: "완성! 7단계로 넘어가서 인터넷에 올려 봅시다.",
      files: [
        {
          path: "/index.html",
          action: "edit",
          code: HTML_3,
          hint: "문구 자리와 초기화 버튼을 추가했어요.",
        },
        {
          path: "/styles.css",
          action: "edit",
          code: CSS_2,
          hint: "min-height 를 준 이유 — 문구 길이가 달라져도 카드가 안 들썩이게요.",
        },
        {
          path: "/app.js",
          action: "edit",
          code: APP_FINAL,
          hint: "🎉 맨 마지막 줄의 show() — 이걸 빼먹으면 처음 화면에 문구가 안 나옵니다.",
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
        "자바스크립트는 브라우저에 있는 것이라 따로 받을 파일이 없습니다.",
      ],
    },
    {
      id: "d2",
      title: "2. 내 컴퓨터에서 열어 보기",
      why: "올리기 전에 잘 도는지 확인합니다.",
      actions: [
        "index.html 을 두 번 눌러 브라우저로 여세요.",
        "버튼을 눌러 숫자가 오르내리는지 확인하세요.",
        "인터넷이 끊겨 있어도 잘 돌아갑니다. 데려오는 도구가 없으니까요.",
      ],
    },
    {
      id: "d3",
      title: "3. 깃허브에 올리기",
      why: "깃허브(GitHub)는 코드를 올려 두는 창고예요.",
      actions: [
        "github.com 에서 계정을 만드세요.",
        "+ → New repository. 이름은 my-counter, Public 으로 Create.",
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
        "Add New → Project → my-counter 고르고 Import.",
        "설정은 그대로 두고 Deploy.",
        "🎉 주소가 생겼어요.",
      ],
      link: { label: "Vercel 열기", href: "https://vercel.com" },
    },
    {
      id: "d5",
      title: "5. 내 것으로 바꿔 쓰기",
      why: "2단계에서 정한 대로 실제로 쓰는 순간이에요.",
      actions: [
        "생긴 주소를 폰 홈 화면에 추가하세요.",
        "「지금까지」를 「물 마신 횟수」처럼 내 것으로 바꿔 보세요.",
        "응원 문구도 내 말투로 바꿔 보세요.",
        "며칠 써 보고 불편한 곳이 있으면 그게 다음에 만들 기능입니다.",
      ],
    },
  ],

  starterFiles: {},
};
