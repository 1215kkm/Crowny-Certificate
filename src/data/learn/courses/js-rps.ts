import type { Course } from "../types";

/**
 * JavaScript 2호 — 「가위바위보 게임」
 *
 * 1호가 「누르면 숫자가 바뀐다」였다면, 2호는 「컴퓨터가 판단한다」.
 * 무작위 고르기, 승부 규칙을 코드로 옮기기, 점수 세기를 배운다.
 */

const HTML_1 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>가위바위보</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="card">
      <h1>가위바위보</h1>

      <div class="hands">
        <div class="hand">
          <div class="hand-label">나</div>
          <div id="my-hand" class="hand-emoji">❔</div>
        </div>
        <div class="vs">VS</div>
        <div class="hand">
          <div class="hand-label">컴퓨터</div>
          <div id="com-hand" class="hand-emoji">❔</div>
        </div>
      </div>

      <div id="result" class="result">무엇을 낼까요?</div>

      <div class="btn-row">
        <button class="btn" data-hand="가위">✌️</button>
        <button class="btn" data-hand="바위">✊</button>
        <button class="btn" data-hand="보">🖐️</button>
      </div>
    </div>

    <script src="app.js"></script>
  </body>
</html>
`;

const CSS_1 = `body {
  margin: 0;
  padding: 40px 20px;
  background: #f5f3ff;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  text-align: center;
}

.card {
  max-width: 380px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 20px;
  padding: 24px 20px;
  box-shadow: 0 4px 20px rgba(109, 40, 217, 0.12);
}

h1 {
  font-size: 22px;
  color: #6d28d9;
  margin-top: 0;
}

.hands {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 16px 0;
}

.hand {
  flex: 1;
}

.hand-label {
  font-size: 13px;
  color: #7c3aed;
  font-weight: bold;
}

.hand-emoji {
  font-size: 52px;
  line-height: 1.3;
}

.vs {
  font-size: 13px;
  font-weight: bold;
  color: #a78bfa;
}

.result {
  min-height: 28px;
  font-size: 17px;
  font-weight: bold;
  color: #6d28d9;
  margin-bottom: 14px;
}

.btn-row {
  display: flex;
  gap: 8px;
}

.btn {
  flex: 1;
  padding: 14px 0;
  border: 2px solid #ddd6fe;
  border-radius: 14px;
  background: #ffffff;
  font-size: 28px;
  cursor: pointer;
}

.btn:hover {
  background: #f5f3ff;
  border-color: #8b5cf6;
}
`;

const APP_1 = `console.log("자바스크립트 준비 끝!");
`;

const APP_2 = `const HANDS = ["가위", "바위", "보"];
const EMOJI = { 가위: "✌️", 바위: "✊", 보: "🖐️" };

const myHandBox = document.getElementById("my-hand");
const comHandBox = document.getElementById("com-hand");
const resultBox = document.getElementById("result");
const buttons = document.querySelectorAll(".btn");

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const myHand = button.dataset.hand;
    myHandBox.textContent = EMOJI[myHand];
    resultBox.textContent = myHand + " 를 냈어요!";
  });
});
`;

const APP_3 = `const HANDS = ["가위", "바위", "보"];
const EMOJI = { 가위: "✌️", 바위: "✊", 보: "🖐️" };

const myHandBox = document.getElementById("my-hand");
const comHandBox = document.getElementById("com-hand");
const resultBox = document.getElementById("result");
const buttons = document.querySelectorAll(".btn");

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const myHand = button.dataset.hand;

    // 0, 1, 2 중 하나를 아무거나 고른다
    const comIndex = Math.floor(Math.random() * 3);
    const comHand = HANDS[comIndex];

    myHandBox.textContent = EMOJI[myHand];
    comHandBox.textContent = EMOJI[comHand];
    resultBox.textContent = myHand + " vs " + comHand;
  });
});
`;

const APP_4 = `const HANDS = ["가위", "바위", "보"];
const EMOJI = { 가위: "✌️", 바위: "✊", 보: "🖐️" };

const myHandBox = document.getElementById("my-hand");
const comHandBox = document.getElementById("com-hand");
const resultBox = document.getElementById("result");
const buttons = document.querySelectorAll(".btn");

function judge(myHand, comHand) {
  if (myHand === comHand) {
    return "비겼어요 🤝";
  }
  if (
    (myHand === "가위" && comHand === "보") ||
    (myHand === "바위" && comHand === "가위") ||
    (myHand === "보" && comHand === "바위")
  ) {
    return "이겼어요! 🎉";
  }
  return "졌어요 😢";
}

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const myHand = button.dataset.hand;
    const comIndex = Math.floor(Math.random() * 3);
    const comHand = HANDS[comIndex];

    myHandBox.textContent = EMOJI[myHand];
    comHandBox.textContent = EMOJI[comHand];
    resultBox.textContent = judge(myHand, comHand);
  });
});
`;

const HTML_2 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>가위바위보</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="card">
      <h1>가위바위보</h1>

      <div class="score-row">
        <span class="score win">이김 <b id="win-count">0</b></span>
        <span class="score draw">비김 <b id="draw-count">0</b></span>
        <span class="score lose">짐 <b id="lose-count">0</b></span>
      </div>

      <div class="hands">
        <div class="hand">
          <div class="hand-label">나</div>
          <div id="my-hand" class="hand-emoji">❔</div>
        </div>
        <div class="vs">VS</div>
        <div class="hand">
          <div class="hand-label">컴퓨터</div>
          <div id="com-hand" class="hand-emoji">❔</div>
        </div>
      </div>

      <div id="result" class="result">무엇을 낼까요?</div>

      <div class="btn-row">
        <button class="btn" data-hand="가위">✌️</button>
        <button class="btn" data-hand="바위">✊</button>
        <button class="btn" data-hand="보">🖐️</button>
      </div>

      <button id="reset" class="reset-btn">점수 지우기</button>
    </div>

    <script src="app.js"></script>
  </body>
</html>
`;

const CSS_2 = `body {
  margin: 0;
  padding: 40px 20px;
  background: #f5f3ff;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  text-align: center;
}

.card {
  max-width: 380px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 20px;
  padding: 24px 20px;
  box-shadow: 0 4px 20px rgba(109, 40, 217, 0.12);
}

h1 {
  font-size: 22px;
  color: #6d28d9;
  margin-top: 0;
}

.score-row {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

.score {
  flex: 1;
  padding: 8px 0;
  border-radius: 10px;
  font-size: 12px;
  color: #6b7280;
  background: #f9fafb;
}

.score b {
  display: block;
  font-size: 17px;
  margin-top: 2px;
}

.score.win {
  background: #ecfdf5;
  color: #047857;
}

.score.draw {
  background: #f3f4f6;
}

.score.lose {
  background: #fef2f2;
  color: #b91c1c;
}

.hands {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 16px 0;
}

.hand {
  flex: 1;
}

.hand-label {
  font-size: 13px;
  color: #7c3aed;
  font-weight: bold;
}

.hand-emoji {
  font-size: 52px;
  line-height: 1.3;
}

.vs {
  font-size: 13px;
  font-weight: bold;
  color: #a78bfa;
}

.result {
  min-height: 28px;
  font-size: 17px;
  font-weight: bold;
  color: #6d28d9;
  margin-bottom: 14px;
}

.btn-row {
  display: flex;
  gap: 8px;
}

.btn {
  flex: 1;
  padding: 14px 0;
  border: 2px solid #ddd6fe;
  border-radius: 14px;
  background: #ffffff;
  font-size: 28px;
  cursor: pointer;
}

.btn:hover {
  background: #f5f3ff;
  border-color: #8b5cf6;
}

.reset-btn {
  margin-top: 14px;
  border: none;
  background: none;
  color: #7c3aed;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
}
`;

const APP_FINAL = `const HANDS = ["가위", "바위", "보"];
const EMOJI = { 가위: "✌️", 바위: "✊", 보: "🖐️" };

const myHandBox = document.getElementById("my-hand");
const comHandBox = document.getElementById("com-hand");
const resultBox = document.getElementById("result");
const winBox = document.getElementById("win-count");
const drawBox = document.getElementById("draw-count");
const loseBox = document.getElementById("lose-count");
const buttons = document.querySelectorAll(".btn");
const resetBtn = document.getElementById("reset");

let win = 0;
let draw = 0;
let lose = 0;

function judge(myHand, comHand) {
  if (myHand === comHand) {
    return "draw";
  }
  if (
    (myHand === "가위" && comHand === "보") ||
    (myHand === "바위" && comHand === "가위") ||
    (myHand === "보" && comHand === "바위")
  ) {
    return "win";
  }
  return "lose";
}

function showScore() {
  winBox.textContent = win;
  drawBox.textContent = draw;
  loseBox.textContent = lose;
}

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const myHand = button.dataset.hand;
    const comIndex = Math.floor(Math.random() * 3);
    const comHand = HANDS[comIndex];

    myHandBox.textContent = EMOJI[myHand];
    comHandBox.textContent = EMOJI[comHand];

    const result = judge(myHand, comHand);

    if (result === "win") {
      win = win + 1;
      resultBox.textContent = "이겼어요! 🎉";
    } else if (result === "draw") {
      draw = draw + 1;
      resultBox.textContent = "비겼어요 🤝";
    } else {
      lose = lose + 1;
      resultBox.textContent = "졌어요 😢";
    }

    showScore();
  });
});

resetBtn.addEventListener("click", function () {
  win = 0;
  draw = 0;
  lose = 0;
  showScore();
  myHandBox.textContent = "❔";
  comHandBox.textContent = "❔";
  resultBox.textContent = "무엇을 낼까요?";
});

showScore();
`;

export const jsRpsCourse: Course = {
  id: "js-rps",
  track: "javascript",
  title: "가위바위보 게임 만들기",
  subtitle: "컴퓨터가 무작위로 내고, 승부를 판단하고, 점수를 세기",
  level: "왕초보",
  duration: "약 60분",
  pages: ["가위바위보"],
  template: "static",

  stages: [
    {
      id: "topic",
      no: 1,
      title: "주제 정하기",
      summary: "왜 「가위바위보」로 판단을 배우는지 알아봐요",
      tier: "free",
      goal: "무엇을 만들지 한 문장으로 말할 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "이번에 만들 것은 「가위바위보 게임」이에요. 내가 하나를 내면 컴퓨터도 아무거나 내고, 누가 이겼는지 판단하고, 점수를 셉니다.",
        },
        {
          kind: "why",
          text: "앞 코스에서는 「누르면 숫자가 바뀐다」였어요. 이번엔 한 걸음 더 갑니다. 컴퓨터가 **스스로 고르고**, **규칙에 따라 판단**해요.",
        },
        {
          kind: "why",
          text: "가위바위보를 고른 이유는 규칙이 아주 짧아서예요. 이기는 경우가 딱 3가지뿐이라, 「규칙을 코드로 옮기는 법」을 배우기에 딱 좋습니다.",
        },
        {
          kind: "what",
          text: "이번에 배울 것 — 아무거나 고르기(Math.random), 여러 버튼을 한 번에 다루기, 규칙을 if 로 옮기기, 결과에 따라 점수 세기.",
        },
        {
          kind: "tip",
          text: "「판단」이 들어가면 그때부터 프로그램이라고 부를 만해요. 여기까지 오면 간단한 게임은 다 만들 수 있습니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 만든 뒤 어디에 쓸지 정합니다.",
        },
      ],
      practiceLabel: "아래 문장을 따라 쳐 보세요",
      practiceText:
        "나는 컴퓨터와 가위바위보를 하고 승부를 판단해 점수를 세는 게임을 만든다.",
    },
    {
      id: "promo",
      no: 2,
      title: "홍보 방법 배우기",
      summary: "만든 게임을 어떻게 알릴지 정해요",
      tier: "free",
      goal: "게임을 알릴 방법 2가지를 고를 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "게임은 「해 봐」 한마디면 끝이에요. 설명이 거의 필요 없는 게 게임의 장점입니다.",
        },
        {
          kind: "what",
          text: "아래 카드에 방법을 정리했어요.",
        },
        {
          kind: "tip",
          text: "처음 고르기 좋은 조합은 ①「친구와 점수 대결하기」 + ②「화면 녹화 영상 올리기」예요.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 게임 규칙을 정합니다.",
        },
      ],
      cards: [
        {
          title: "① 친구와 점수 대결하기",
          body: "「10번 해서 몇 번 이겼는지 캡처해서 보내」 하고 겨룹니다.",
          picked: true,
          note: "심리 레버 — 겨루기가 붙으면 사람은 한 번 더 합니다.",
        },
        {
          title: "② 화면 녹화 영상 올리기",
          body: "10초 안에 이기고 지는 게 다 보입니다.",
          picked: true,
          note: "게임은 움직임이 전부라 영상이 가장 잘 맞아요.",
        },
        {
          title: "③ 커뮤니티에 올리기",
          body: "「처음 만든 게임」으로 올리면 응원 댓글이 붙습니다.",
          note: "코드 조언까지 받으면 이득이 두 배입니다.",
        },
        {
          title: "④ 규칙을 바꿔서 새 버전 만들기",
          body: "가위바위보를 묵찌빠나 홀짝으로 바꿔 봅니다.",
          note: "규칙만 바꾸면 새 게임이 됩니다. 응용 연습으로 최고예요.",
        },
      ],
      practiceLabel: "내가 고른 방법 2가지를 따라 쳐 보세요",
      practiceText:
        "나는 친구와 점수 대결하기와 화면 녹화 영상 올리기로 내 게임을 알린다.",
    },
    {
      id: "plan",
      no: 3,
      title: "기획하기",
      summary: "게임 규칙과 화면을 정해요",
      tier: "free",
      goal: "승부 규칙과 화면에 넣을 것을 적을 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "게임을 만들 때는 규칙을 먼저 종이에 적어야 해요. 머릿속으로만 하면 코드 쓰다가 꼭 빠뜨립니다.",
        },
        {
          kind: "what",
          text: "이기는 경우는 딱 3가지예요. 가위가 보를 이기고, 바위가 가위를 이기고, 보가 바위를 이깁니다. 같으면 비김, 나머지는 모두 짐.",
        },
        {
          kind: "what",
          text: "화면에 넣을 것 — 내 손과 컴퓨터 손, 결과 문구, 가위바위보 버튼 3개, 점수판(이김·비김·짐), 점수 지우기.",
        },
        {
          kind: "what",
          text: "만드는 순서도 정합니다. ①내 손 표시 → ②컴퓨터가 아무거나 내기 → ③승부 판단 → ④점수 세기. 하나씩 확인하며 갑니다.",
        },
        {
          kind: "tip",
          text: "「이기는 경우만 적고 나머지는 짐」으로 하면 규칙이 짧아져요. 지는 경우 3개를 또 적을 필요가 없습니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 색과 모양을 정합니다.",
        },
      ],
      practiceLabel: "우리 게임의 규칙을 따라 쳐 보세요",
      practiceText: `이기는 경우 3가지: 가위는 보를, 바위는 가위를, 보는 바위를 이긴다
같으면 비김, 나머지는 모두 짐
화면에 넣을 것: 두 손 / 결과 문구 / 버튼 3개 / 점수판 / 점수 지우기
만드는 순서: 내 손 표시 - 컴퓨터 내기 - 승부 판단 - 점수 세기`,
    },
    {
      id: "design",
      no: 4,
      title: "디자인하기",
      summary: "색과 모양 규칙을 정해요",
      tier: "free",
      goal: "손·버튼·점수판의 색과 크기를 정하게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "게임 화면은 「지금 무슨 일이 일어났는지」가 한눈에 보여야 해요. 그래서 손 그림이 커야 합니다.",
        },
        {
          kind: "what",
          text: "색은 보라 계열. 메인 보라(#8b5cf6), 진한 보라(#6d28d9), 배경은 아주 연한 보라(#f5f3ff).",
        },
        {
          kind: "what",
          text: "손 그림은 52px 로 크게, 가운데에 VS 를 둡니다. 왼쪽이 나, 오른쪽이 컴퓨터예요.",
        },
        {
          kind: "what",
          text: "점수판은 세 칸으로 나누고 색을 다르게 합니다. 이김은 초록, 비김은 회색, 짐은 빨강. 색만 봐도 상태를 알 수 있어요.",
        },
        {
          kind: "tip",
          text: "결과 문구 자리도 높이를 미리 잡아 두세요. 안 그러면 문구가 바뀔 때마다 버튼이 위아래로 움직입니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 무엇으로 만들지 정합니다.",
        },
      ],
      practiceLabel: "우리 게임의 디자인 규칙을 따라 쳐 보세요",
      practiceText: `메인색: #8b5cf6 (보라)
진한색: #6d28d9 / 배경: #f5f3ff
손 그림: 52px 크게, 가운데 VS
점수판: 이김 초록 / 비김 회색 / 짐 빨강
결과 문구 자리는 높이를 미리 잡아 둔다`,
    },
    {
      id: "stack",
      no: 5,
      title: "구현 방법 정하기",
      summary: "무엇으로 만들지 골라요",
      tier: "free",
      goal: "무작위 고르기와 여러 버튼 다루는 법을 알게 됩니다.",
      paragraphs: [
        {
          kind: "what",
          text: "이번에도 자바스크립트만 씁니다. 브라우저에 원래 있으니 데려올 게 없어요. <script src=\"app.js\"></script> 한 줄이면 끝입니다.",
        },
        {
          kind: "what",
          text: "컴퓨터가 아무거나 고르게 하려면 Math.random() 을 씁니다. 0 이상 1 미만의 숫자를 아무거나 주는 기능이에요. 여기에 3을 곱하고 소수점을 버리면 0·1·2 중 하나가 나옵니다.",
        },
        {
          kind: "what",
          text: "버튼이 3개인데 코드는 한 번만 씁니다. querySelectorAll 로 버튼 전부를 고르고 forEach 로 하나씩 돌면서 같은 일을 시켜요.",
        },
        {
          kind: "what",
          text: "그럼 어느 버튼을 눌렀는지는 어떻게 알까요? 버튼에 data-hand=\"가위\" 처럼 정보를 붙여 두고, 코드에서 button.dataset.hand 로 꺼내 씁니다.",
        },
        {
          kind: "tip",
          text: "Math.floor 는 소수점을 버리는 기능이에요. 2.7 → 2, 0.3 → 0. 「내림」이라고 부릅니다.",
        },
        {
          kind: "next",
          text: "다음 6단계부터가 진짜 따라하기입니다.",
        },
      ],
      practiceLabel: "이번에 쓸 방법을 따라 쳐 보세요",
      practiceText: `자바스크립트: 브라우저에 원래 있어서 데려올 것 없음
아무거나 고르기: Math.random 에 3을 곱하고 Math.floor 로 내림
버튼 전부 고르기: querySelectorAll
하나씩 돌기: forEach
버튼에 붙인 정보 꺼내기: dataset`,
    },
    {
      id: "build",
      no: 6,
      title: "따라하기",
      summary: "제가 먼저 만들면, 오른쪽에서 똑같이 따라 만들어요",
      tier: "free",
      goal: "5개 스텝을 거쳐 가위바위보 게임을 완성합니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "설치도 없고 데려올 도구도 없습니다. 파일 3개면 끝나요.",
        },
        {
          kind: "what",
          text: "내 손 표시 → 컴퓨터 내기 → 승부 판단 → 점수 세기 순서로 하나씩 확인하며 갑니다.",
        },
        {
          kind: "tip",
          text: "컴퓨터가 무작위로 내니까 같은 버튼을 눌러도 결과가 매번 달라요. 여러 번 눌러 보면서 확인하세요.",
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
      summary: "인터넷에 올려서 친구와 겨뤄요",
      tier: "free",
      goal: "내 게임이 진짜 인터넷 주소를 갖게 됩니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "다 만들었으면 친구가 해 볼 수 있게 올릴 차례예요.",
        },
        {
          kind: "why",
          text: "배포(deploy)란 내가 만든 파일을 인터넷 어딘가의 컴퓨터에 올려 두는 일이에요.",
        },
        {
          kind: "next",
          text: "주소가 생기면 친구와 점수 대결을 해 보세요.",
        },
      ],
    },
  ],

  buildSteps: [
    {
      id: "r0",
      title: "1. 화면 만들고 파일 연결하기",
      goal: "이제 두 손과 버튼 3개가 있는 게임판을 띄울 겁니다.",
      why: "게임도 화면부터예요. 무엇이 바뀔지가 먼저 있어야 코드를 붙일 수 있습니다.",
      what: "index.html 에 게임판을 만들고, styles.css 로 꾸미고, app.js 를 연결합니다. 버튼에는 data-hand 로 무엇을 내는지 붙여 둡니다.",
      where: "「내 폴더」의 ＋파일 로 index.html, styles.css, app.js 세 개를 만들고 코드를 넣으세요.",
      result:
        "게임판이 만들어졌어요. 버튼에 data-hand=\"가위\" 처럼 정보를 붙여 둔 게 핵심입니다 — 나중에 어느 버튼을 눌렀는지 이걸로 알아냅니다. script 는 여전히 한 줄이에요, 데려올 도구가 없으니까요.",
      next: "다음에는 버튼을 누르면 내 손이 표시되게 만들 거예요.",
      files: [
        {
          path: "/index.html",
          action: "create",
          code: HTML_1,
          hint: 'data-hand="가위" 는 내가 붙인 정보예요. 화면엔 안 보이고 코드에서만 씁니다.',
        },
        {
          path: "/styles.css",
          action: "create",
          code: CSS_1,
          hint: "손 그림을 52px 로 크게. 게임에서 가장 먼저 보여야 하니까요.",
        },
        {
          path: "/app.js",
          action: "create",
          code: APP_1,
          hint: "연결됐는지 확인용 한 줄. 개발자도구 콘솔에 찍힙니다.",
        },
      ],
    },
    {
      id: "r1",
      title: "2. 버튼 3개 한 번에 다루기",
      goal: "이제 버튼을 누르면 내가 낸 손이 화면에 나옵니다.",
      why: "버튼이 3개인데 코드를 3번 쓰면 나중에 5개가 되면 5번 써야 해요. 한 번만 쓰는 방법을 배웁니다.",
      what: "querySelectorAll 로 버튼 전부를 고르고, forEach 로 하나씩 돌면서 같은 일을 붙입니다. 누른 버튼의 정보는 dataset 으로 꺼냅니다.",
      where: "app.js 를 통째로 아래 코드로 바꾸세요.",
      result:
        "버튼 3개에 코드를 한 번만 써서 붙였어요. querySelectorAll 이 전부를 고르고, forEach 가 하나씩 돌고, button.dataset.hand 가 「이 버튼은 무엇인지」를 알려 줍니다. EMOJI[myHand] 처럼 대괄호로 짝을 찾는 방법도 나왔어요.",
      next: "다음에는 컴퓨터도 아무거나 내게 만들 거예요.",
      files: [
        {
          path: "/app.js",
          action: "edit",
          code: APP_2,
          hint: 'EMOJI 는 짝을 적어 둔 것이에요. EMOJI["가위"] 라고 하면 ✌️ 가 나옵니다.',
        },
      ],
    },
    {
      id: "r2",
      title: "3. 컴퓨터가 아무거나 내기",
      goal: "이제 내가 낼 때마다 컴퓨터도 무작위로 하나를 냅니다.",
      why: "상대가 있어야 게임이 돼요. 컴퓨터가 매번 다른 걸 내야 재미있습니다.",
      what: "Math.random() 으로 0~1 사이 아무 숫자를 받고, 3을 곱한 뒤 Math.floor 로 내림해서 0·1·2 중 하나를 만듭니다. 그 번호로 HANDS 에서 손을 꺼냅니다.",
      where: "app.js 를 통째로 아래 코드로 바꾸세요.",
      result:
        "컴퓨터가 무작위로 손을 내요! Math.random() * 3 은 0 이상 3 미만, 거기에 Math.floor 로 소수점을 버리면 0·1·2 가 나옵니다. 같은 버튼을 여러 번 눌러 보면 컴퓨터 손이 매번 다른 걸 확인할 수 있어요.",
      next: "다음에는 누가 이겼는지 판단하게 만들 거예요.",
      files: [
        {
          path: "/app.js",
          action: "edit",
          code: APP_3,
          hint: "Math.floor(Math.random() * 3) 은 「0,1,2 중 하나 뽑기」예요. 통째로 외워도 됩니다.",
        },
      ],
    },
    {
      id: "r3",
      title: "4. 누가 이겼는지 판단하기",
      goal: "이제 이겼는지, 졌는지, 비겼는지 결과가 나옵니다.",
      why: "여기가 이 게임의 핵심이에요. 3단계에서 종이에 적은 규칙을 그대로 코드로 옮깁니다.",
      what: "judge 라는 함수를 만듭니다. 같으면 비김, 이기는 3가지 경우면 이김, 나머지는 짐. 순서대로 확인하면 짧게 끝나요.",
      where: "app.js 를 통째로 아래 코드로 바꾸세요.",
      result:
        "규칙을 judge 함수 하나에 담았어요. 같은지 먼저 보고, 이기는 3가지를 확인하고, 나머지는 전부 짐. || 는 「또는」이라는 뜻이라 세 경우 중 하나만 맞아도 이깁니다. 판단하는 부분을 함수로 빼 두면 나중에 규칙만 고치기 쉬워요.",
      next: "다음이 마지막입니다. 점수를 세는 판을 붙일 거예요.",
      files: [
        {
          path: "/app.js",
          action: "edit",
          code: APP_4,
          hint: "=== 는 「같다」, || 는 「또는」, && 는 「그리고」예요.",
        },
      ],
    },
    {
      id: "r4",
      title: "5. 점수 세기 (마지막!)",
      goal: "이제 이기고 지고 비긴 횟수가 점수판에 쌓입니다.",
      why: "한 판만 하고 끝나면 심심해요. 점수가 쌓이면 「한 판 더」 하게 됩니다.",
      what: "점수판을 화면에 넣고, 결과에 따라 win·draw·lose 를 하나씩 올립니다. 점수 지우기 버튼도 답니다.",
      where: "index.html 에 점수판을, styles.css 에 점수판 꾸밈을, app.js 에 점수 세기를 넣으세요.",
      result:
        "결과에 따라 점수가 쌓이고 색으로 구분돼 게임이 완성됐어요. judge 가 이제 문구 대신 win·draw·lose 를 돌려주고, 그걸 보고 점수도 올리고 문구도 정합니다 — 판단과 표시를 나눈 거예요. 무작위 고르기, 규칙 판단, 점수 세기까지 다 만들었습니다!",
      next: "완성! 7단계로 넘어가서 인터넷에 올려 봅시다.",
      files: [
        {
          path: "/index.html",
          action: "edit",
          code: HTML_2,
          hint: "점수판 세 칸과 점수 지우기 버튼을 추가했어요.",
        },
        {
          path: "/styles.css",
          action: "edit",
          code: CSS_2,
          hint: "이김 초록·비김 회색·짐 빨강. 색만 봐도 상태를 압니다.",
        },
        {
          path: "/app.js",
          action: "edit",
          code: APP_FINAL,
          hint: "🎉 judge 가 문구 대신 win/draw/lose 를 돌려주게 바꿨어요. 판단과 표시를 나누면 고치기 쉬워집니다.",
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
      ],
    },
    {
      id: "d2",
      title: "2. 내 컴퓨터에서 열어 보기",
      why: "올리기 전에 잘 도는지 확인합니다.",
      actions: [
        "index.html 을 두 번 눌러 브라우저로 여세요.",
        "여러 번 눌러 컴퓨터가 매번 다른 걸 내는지 확인하세요.",
        "점수가 제대로 쌓이는지도 보세요.",
      ],
    },
    {
      id: "d3",
      title: "3. 깃허브에 올리기",
      why: "깃허브(GitHub)는 코드를 올려 두는 창고예요.",
      actions: [
        "github.com 에서 계정을 만드세요.",
        "+ → New repository. 이름은 my-rps, Public 으로 Create.",
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
        "Add New → Project → my-rps 고르고 Import.",
        "설정은 그대로 두고 Deploy.",
        "🎉 주소가 생겼어요.",
      ],
      link: { label: "Vercel 열기", href: "https://vercel.com" },
    },
    {
      id: "d5",
      title: "5. 친구와 겨루기",
      why: "2단계에서 정한 대로 실제로 알리는 순간이에요.",
      actions: [
        "생긴 주소를 친구에게 보내세요.",
        "「10판 해서 점수 캡처해서 보내」 하고 겨뤄 보세요.",
        "규칙을 묵찌빠나 홀짝으로 바꿔 새 버전을 만들어 보세요.",
        "규칙만 바꾸면 새 게임이 됩니다 — judge 함수만 고치면 돼요.",
      ],
    },
  ],

  starterFiles: {},
};
