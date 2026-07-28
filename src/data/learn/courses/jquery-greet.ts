import type { Course } from "../types";

/**
 * jQuery 1호 — 「눌러서 바뀌는 인사 카드」
 *
 * jQuery 는 남이 만든 도구라서 **먼저 데려와야(연결해야) 쓸 수 있다.**
 * 이 코스는 그 「연결」부터 시작한다. 연결이 안 되면 아무것도 안 된다는 것을
 * 눈으로 겪게 하는 것이 1번 스텝의 목적.
 */

const HTML_1 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>인사 카드</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="card">
      <div class="face">👋</div>
      <h1 id="greet">안녕하세요!</h1>
      <button id="hello-btn" class="btn">인사 바꾸기</button>
    </div>
  </body>
</html>
`;

const CSS_1 = `body {
  margin: 0;
  padding: 50px 20px;
  background: #fdf2f8;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  text-align: center;
}

.card {
  max-width: 380px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 20px;
  padding: 30px 20px;
  box-shadow: 0 4px 20px rgba(219, 39, 119, 0.12);
}

.face {
  font-size: 60px;
}

h1 {
  font-size: 22px;
  color: #be185d;
  min-height: 30px;
}

.btn {
  margin-top: 8px;
  padding: 12px 22px;
  border: none;
  border-radius: 999px;
  background: #ec4899;
  color: #ffffff;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
}

.btn:hover {
  background: #be185d;
}
`;

const HTML_2 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>인사 카드</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="card">
      <div class="face">👋</div>
      <h1 id="greet">안녕하세요!</h1>
      <button id="hello-btn" class="btn">인사 바꾸기</button>
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

const APP_2 = `$(function () {
  $("#hello-btn").click(function () {
    $("#greet").text("반가워요!");
  });
});
`;

const APP_3 = `$(function () {
  var greetings = [
    "안녕하세요!",
    "반가워요!",
    "좋은 하루 보내세요!",
    "오늘도 화이팅!",
    "또 만나요!",
  ];
  var index = 0;

  $("#hello-btn").click(function () {
    index = index + 1;
    if (index >= greetings.length) {
      index = 0;
    }
    $("#greet").text(greetings[index]);
  });
});
`;

const APP_4 = `$(function () {
  var greetings = [
    "안녕하세요!",
    "반가워요!",
    "좋은 하루 보내세요!",
    "오늘도 화이팅!",
    "또 만나요!",
  ];
  var faces = ["👋", "😊", "🌤️", "💪", "🙌"];
  var index = 0;

  $("#hello-btn").click(function () {
    index = index + 1;
    if (index >= greetings.length) {
      index = 0;
    }
    $("#greet").text(greetings[index]);
    $(".face").text(faces[index]);
  });
});
`;

const APP_FINAL = `$(function () {
  var greetings = [
    "안녕하세요!",
    "반가워요!",
    "좋은 하루 보내세요!",
    "오늘도 화이팅!",
    "또 만나요!",
  ];
  var faces = ["👋", "😊", "🌤️", "💪", "🙌"];
  var index = 0;

  $("#hello-btn").click(function () {
    index = index + 1;
    if (index >= greetings.length) {
      index = 0;
    }

    $("#greet").fadeOut(200, function () {
      $("#greet").text(greetings[index]).fadeIn(200);
    });

    $(".face").text(faces[index]);
    $(".card").css("background", index % 2 === 0 ? "#ffffff" : "#fff1f7");
  });
});
`;

export const jqueryGreetCourse: Course = {
  id: "jquery-greet",
  track: "jquery",
  title: "눌러서 바뀌는 인사 카드",
  subtitle: "jQuery 를 데려와 버튼 하나로 글자·얼굴 바꾸기",
  level: "왕초보",
  duration: "약 50분",
  pages: ["인사 카드"],
  template: "static",

  stages: [
    {
      id: "topic",
      no: 1,
      title: "주제 정하기",
      summary: "왜 「인사 카드」로 jQuery 를 시작하는지 알아봐요",
      tier: "free",
      goal: "무엇을 만들지 한 문장으로 말할 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "이번에 만들 것은 「눌러서 바뀌는 인사 카드」예요. 버튼을 누를 때마다 인사말과 얼굴 그림이 바뀝니다.",
        },
        {
          kind: "why",
          text: "HTML 로 만든 페이지는 가만히 있어요. 글자가 바뀌거나 뭔가 움직이려면 자바스크립트가 필요합니다. jQuery(제이쿼리)는 그 자바스크립트를 짧게 쓰게 해 주는 도구예요.",
        },
        {
          kind: "why",
          text: "그런데 jQuery 는 남이 만든 도구라서, 쓰기 전에 먼저 데려와야 합니다. 이걸 「연결한다」고 해요. 연결을 안 하면 아무것도 안 됩니다. 그래서 이 코스는 연결부터 시작합니다.",
        },
        {
          kind: "what",
          text: "이번에 배울 것 — jQuery 데려오기, 버튼 눌렀을 때 실행하기, 글자 바꾸기, 목록에서 하나씩 꺼내 쓰기, 사라졌다 나타나는 효과.",
        },
        {
          kind: "tip",
          text: "「버튼을 누르면 뭔가 바뀐다」는 앱의 시작이에요. 이것만 되면 나머지는 응용입니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 만든 뒤 어디에 쓸지 정합니다.",
        },
      ],
      practiceLabel: "아래 문장을 따라 쳐 보세요",
      practiceText:
        "나는 버튼을 누르면 인사말과 얼굴이 바뀌는 카드를 jQuery 로 만든다.",
    },
    {
      id: "promo",
      no: 2,
      title: "홍보 방법 배우기",
      summary: "만든 카드를 어디에 쓸지 정해요",
      tier: "free",
      goal: "만든 것을 쓸 곳 2가지를 고를 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "「움직이는 것」은 캡처보다 영상이 잘 먹혀요. 누르면 바뀌는 걸 보여줘야 재미가 전해집니다.",
        },
        {
          kind: "what",
          text: "아래 카드에 쓸 만한 방법을 정리했어요.",
        },
        {
          kind: "tip",
          text: "처음 고르기 좋은 조합은 ①「화면 녹화해서 짧은 영상 올리기」 + ②「친구에게 링크 보내기」예요.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 무엇을 넣을지 정합니다.",
        },
      ],
      cards: [
        {
          title: "① 화면 녹화해서 짧은 영상",
          body: "버튼을 눌러 바뀌는 10초 영상. 폰 기본 화면 녹화면 충분합니다.",
          picked: true,
          note: "움직이는 것은 영상이 아니면 전달이 안 됩니다.",
        },
        {
          title: "② 친구에게 링크 보내기",
          body: "「눌러 봐」 한마디면 끝. 누르는 재미가 있어서 반응이 옵니다.",
          picked: true,
          note: "버튼이 있는 페이지는 사람이 꼭 눌러 봅니다.",
        },
        {
          title: "③ 생일·기념일 카드로 쓰기",
          body: "인사말을 그 사람 맞춤으로 바꿔서 링크를 보냅니다.",
          note: "직접 만든 카드는 산 것보다 오래 기억됩니다.",
        },
        {
          title: "④ 만든 과정 정리해 올리기",
          body: "「연결이 안 돼서 헤맨 이야기」가 특히 잘 읽힙니다.",
          note: "같은 데서 막히는 사람이 아주 많거든요.",
        },
      ],
      practiceLabel: "내가 고른 방법 2가지를 따라 쳐 보세요",
      practiceText:
        "나는 화면 녹화해서 짧은 영상 올리기와 친구에게 링크 보내기로 내 카드를 알린다.",
    },
    {
      id: "plan",
      no: 3,
      title: "기획하기",
      summary: "무엇을 넣고 무엇을 뺄지 정해요",
      tier: "free",
      goal: "카드에 넣을 것과 바뀔 것을 적을 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "처음 만드는 「움직이는 페이지」는 바뀌는 것을 적게 잡아야 해요. 많이 바꾸려 하면 어디가 틀렸는지 못 찾습니다.",
        },
        {
          kind: "what",
          text: "화면에 넣을 것은 3개 — 얼굴 그림, 인사말, 버튼. 이게 전부입니다.",
        },
        {
          kind: "what",
          text: "버튼을 누르면 바뀌는 것도 3개 — 인사말, 얼굴, 카드 배경색. 순서대로 하나씩 붙여 나갑니다.",
        },
        {
          kind: "what",
          text: "인사말은 5개를 준비해서 돌아가며 보여줍니다. 마지막까지 가면 다시 처음으로 돌아와요.",
        },
        {
          kind: "tip",
          text: "「하나 만들고 확인, 또 하나 만들고 확인」이 가장 빠릅니다. 세 개를 한꺼번에 만들면 셋 다 안 될 때 원인을 못 찾아요.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 색과 모양을 정합니다.",
        },
      ],
      practiceLabel: "우리가 만들 것을 따라 쳐 보세요",
      practiceText: `화면에 넣을 것: 얼굴 그림 / 인사말 / 버튼
버튼을 누르면 바뀔 것: 인사말, 얼굴, 카드 배경색
인사말 개수: 5개 (끝나면 다시 처음으로)
안 넣을 것: 입력창, 여러 화면, 저장 기능`,
    },
    {
      id: "design",
      no: 4,
      title: "디자인하기",
      summary: "색과 모양 규칙을 정해요",
      tier: "free",
      goal: "카드의 색·모서리·버튼 모양을 정하게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "누르는 것이 주인공인 페이지에서는 버튼이 가장 눈에 띄어야 해요.",
        },
        {
          kind: "what",
          text: "색은 분홍 계열로 갑니다. 메인 분홍(#ec4899), 진한 분홍(#be185d), 배경은 아주 연한 분홍(#fdf2f8).",
        },
        {
          kind: "what",
          text: "버튼은 알약 모양(999px)에 진한 분홍. 마우스를 올리면 더 진해지게 해서 「누르는 것」임을 알려 줍니다.",
        },
        {
          kind: "what",
          text: "얼굴 그림은 크게(60px). 이 카드에서 가장 먼저 보이는 것이라 크게 갑니다.",
        },
        {
          kind: "tip",
          text: "글자가 바뀌는 자리는 높이를 미리 잡아 두세요(min-height). 안 그러면 짧은 인사말과 긴 인사말에서 카드 크기가 들썩입니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 jQuery 를 어떻게 데려올지 정합니다.",
        },
      ],
      practiceLabel: "우리 카드의 디자인 규칙을 따라 쳐 보세요",
      practiceText: `메인색: #ec4899 (분홍)
진한색: #be185d
배경색: #fdf2f8 (연한 분홍)
버튼: 알약 모양, 마우스 올리면 진해짐
얼굴 그림: 60px 크게`,
    },
    {
      id: "stack",
      no: 5,
      title: "구현 방법 정하기",
      summary: "jQuery 를 어떻게 데려올지 골라요",
      tier: "free",
      goal: "jQuery 를 연결하는 방법과 $ 기호의 뜻을 알게 됩니다.",
      paragraphs: [
        {
          kind: "what",
          text: "jQuery 는 남이 만들어 둔 자바스크립트 도구예요. 내 컴퓨터에 없으니 인터넷에서 데려와야 합니다.",
        },
        {
          kind: "what",
          text: "데려오는 방법은 두 가지예요. ①CDN(씨디엔) — 인터넷 주소로 바로 불러오기. ②내려받아서 파일로 넣기. 우리는 ①을 씁니다. 한 줄이면 끝나거든요.",
        },
        {
          kind: "what",
          text: "연결하면 $ 라는 기호를 쓸 수 있게 됩니다. $ 는 「화면에서 찾아줘」라는 뜻이에요. $(\"#greet\") 는 「greet 이라는 이름표가 붙은 것을 찾아줘」입니다.",
        },
        {
          kind: "why",
          text: "순서가 중요해요. jQuery 를 먼저 데려오고, 그다음에 내 코드를 불러와야 합니다. 순서가 바뀌면 「$ 가 뭔지 모른다」는 오류가 납니다.",
        },
        {
          kind: "tip",
          text: "그래서 <script> 두 줄은 항상 </body> 바로 앞에 씁니다. 화면이 다 그려진 뒤에 코드가 도는 게 안전해요.",
        },
        {
          kind: "next",
          text: "다음 6단계부터가 진짜 따라하기입니다. 1번 스텝이 바로 「연결」이에요.",
        },
      ],
      practiceLabel: "jQuery 연결 방법을 따라 쳐 보세요",
      practiceText: `jQuery: 남이 만든 도구라서 먼저 데려와야 쓴다
데려오는 법: CDN 주소를 script 한 줄로
순서: jQuery 먼저, 내 코드 나중
쓰는 법: $ 는 화면에서 찾아줘 라는 뜻
위치: body 가 끝나기 바로 앞`,
    },
    {
      id: "build",
      no: 6,
      title: "따라하기",
      summary: "제가 먼저 만들면, 오른쪽에서 똑같이 따라 만들어요",
      tier: "free",
      goal: "6개 스텝을 거쳐 인사 카드를 완성합니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "설치할 것은 없습니다. jQuery 는 인터넷 주소로 데려오니까요.",
        },
        {
          kind: "what",
          text: "1번 스텝에서 화면부터 만들고, 2번 스텝에서 jQuery 를 연결합니다. 연결 전에는 버튼을 눌러도 아무 일이 안 일어나요.",
        },
        {
          kind: "tip",
          text: "안 될 때는 대부분 ① 연결 줄이 빠졌거나 ② 이름표(#greet)를 잘못 썼거나 ③ 순서가 바뀐 경우예요.",
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
      goal: "내 카드가 진짜 인터넷 주소를 갖게 됩니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "다 만들었으면 친구가 눌러 볼 수 있게 올릴 차례예요.",
        },
        {
          kind: "why",
          text: "배포(deploy)란 내가 만든 파일을 인터넷 어딘가의 컴퓨터에 올려 두는 일이에요.",
        },
        {
          kind: "tip",
          text: "jQuery 는 인터넷에서 데려오는 것이라 따로 올릴 필요가 없어요. 내 파일 3개만 올리면 됩니다.",
        },
        {
          kind: "next",
          text: "주소가 생기면 친구에게 보내 보세요.",
        },
      ],
    },
  ],

  buildSteps: [
    {
      id: "q0",
      title: "1. 화면 먼저 만들기",
      goal: "이제 얼굴·인사말·버튼이 있는 카드를 화면에 띄울 겁니다.",
      why: "움직이는 걸 만들기 전에 「무엇이 움직일지」가 화면에 있어야 해요. 그래서 HTML 부터 만듭니다.",
      what: "index.html 에 카드를 만들고 styles.css 로 꾸밉니다. 바뀔 곳에는 이름표(id)를 미리 붙여 둡니다.",
      where: "「내 폴더」의 ＋파일 로 index.html 과 styles.css 를 만들고 코드를 넣으세요.",
      result:
        "카드 화면이 만들어졌어요. 아직 버튼을 눌러도 아무 일이 없습니다 — 움직이게 할 코드가 없으니까요. 바뀔 자리에는 id 이름표를 미리 붙여 뒀습니다.",
      next: "다음에는 jQuery 를 데려와 연결할 거예요.",
      files: [
        {
          path: "/index.html",
          action: "create",
          code: HTML_1,
          hint: 'id="greet" 는 이름표예요. 나중에 이 이름으로 찾아서 글자를 바꿉니다.',
        },
        {
          path: "/styles.css",
          action: "create",
          code: CSS_1,
          hint: "min-height 를 준 이유 — 인사말 길이가 달라져도 카드가 안 들썩이게 하려고요.",
        },
      ],
    },
    {
      id: "q1",
      title: "2. jQuery 데려와 연결하기",
      goal: "이제 jQuery 를 불러오고, 내 코드 파일을 연결할 겁니다.",
      why: "jQuery 는 남이 만든 도구라 내 페이지에 없어요. 인터넷에서 데려와야 $ 를 쓸 수 있습니다. 이걸 안 하면 그다음이 전부 안 돼요.",
      what: "</body> 바로 앞에 <script> 두 줄을 넣습니다. 첫 줄이 jQuery, 둘째 줄이 내 코드(app.js)예요. 그리고 app.js 를 만듭니다.",
      where: "index.html 의 </body> 앞에 script 두 줄을 넣고, ＋파일 로 app.js 를 만드세요.",
      result:
        "jQuery 를 CDN 으로 데려오고 내 코드(app.js)까지 연결했어요. 순서가 중요합니다 — jQuery 가 먼저, 내 코드가 나중이어야 $ 를 알아봅니다. $(function(){}) 은 「화면이 다 준비되면 실행해줘」라는 뜻이에요.",
      next: "다음에는 버튼을 눌렀을 때 글자가 바뀌게 만들 거예요.",
      files: [
        {
          path: "/index.html",
          action: "edit",
          code: HTML_2,
          hint: "두 줄의 순서를 바꾸면 안 돼요. 도구를 먼저 가져와야 그 도구를 쓸 수 있습니다.",
        },
        {
          path: "/app.js",
          action: "create",
          code: APP_1,
          hint: "$(function () { ... }) 안에 코드를 씁니다. 화면이 준비된 뒤에 실행하라는 약속이에요.",
        },
      ],
    },
    {
      id: "q2",
      title: "3. 버튼 누르면 글자 바꾸기",
      goal: "이제 버튼을 누르면 인사말이 「반가워요!」로 바뀝니다.",
      why: "「누르면 바뀐다」가 이 코스의 핵심이에요. 딱 한 번만 바뀌는 것부터 만들어 확인합니다.",
      what: "$(\"#hello-btn\").click(...) 으로 버튼을 누를 때 할 일을 정하고, $(\"#greet\").text(...) 로 글자를 바꿉니다.",
      where: "app.js 를 통째로 아래 코드로 바꾸세요.",
      result:
        "버튼을 누르면 인사말이 바뀌어요! click 은 「눌렀을 때」, text 는 「글자를 이걸로 바꿔줘」입니다. 드디어 화면이 움직이기 시작했습니다.",
      next: "다음에는 누를 때마다 다른 인사말이 나오게 만들 거예요.",
      files: [
        {
          path: "/app.js",
          action: "edit",
          code: APP_2,
          hint: '$("#hello-btn") 의 # 은 「id 이름표로 찾아줘」라는 뜻이에요.',
        },
      ],
    },
    {
      id: "q3",
      title: "4. 누를 때마다 다른 인사말",
      goal: "이제 누를 때마다 인사말 5개가 차례로 나오고, 끝나면 처음으로 돌아갑니다.",
      why: "한 번만 바뀌면 재미가 없어요. 여러 개를 준비해 두고 차례로 꺼내 쓰는 게 진짜 쓸모입니다.",
      what: "인사말 5개를 배열(목록)로 만들고, index 라는 번호를 하나씩 올려 가며 꺼냅니다. 마지막을 넘으면 0으로 되돌립니다.",
      where: "app.js 를 통째로 아래 코드로 바꾸세요.",
      result:
        "배열에 인사말 5개를 담고 번호를 올려 가며 꺼내 썼어요. 마지막까지 가면 0으로 돌려서 계속 돌아갑니다. 목록과 번호로 순서를 다루는 기본형입니다.",
      next: "다음에는 얼굴 그림도 같이 바뀌게 만들 거예요.",
      files: [
        {
          path: "/app.js",
          action: "edit",
          code: APP_3,
          hint: "greetings[0] 은 첫 번째, greetings[1] 은 두 번째예요. 번호는 0부터 셉니다.",
        },
      ],
    },
    {
      id: "q4",
      title: "5. 얼굴 그림도 같이 바꾸기",
      goal: "이제 인사말과 함께 얼굴 그림도 바뀝니다.",
      why: "같은 방법을 하나 더 적용해 보는 단계예요. 배열을 하나 더 만들고 같은 번호로 꺼내면 둘이 짝을 맞춥니다.",
      what: "faces 배열을 추가하고, 클릭할 때 $(\".face\").text(...) 로 얼굴도 바꿉니다.",
      where: "app.js 를 통째로 아래 코드로 바꾸세요.",
      result:
        "얼굴 배열을 추가해 같은 번호로 꺼내 썼어요. 인사말과 얼굴이 짝을 맞춰 함께 바뀝니다. 클래스는 $(\".face\") 처럼 점으로 찾는다는 것도 확인했습니다.",
      next: "다음이 마지막입니다. 부드럽게 바뀌는 효과를 넣을 거예요.",
      files: [
        {
          path: "/app.js",
          action: "edit",
          code: APP_4,
          hint: '$(".face") 의 점(.)은 「class 이름표로 찾아줘」예요. # 는 id, . 는 class 입니다.',
        },
      ],
    },
    {
      id: "q5",
      title: "6. 부드럽게 바뀌게 하기 (마지막!)",
      goal: "이제 인사말이 스르륵 사라졌다 나타나고, 카드 배경색도 번갈아 바뀝니다.",
      why: "확 바뀌는 것보다 스르륵 바뀌는 게 훨씬 좋아 보여요. jQuery 가 가장 잘하는 일이 바로 이런 효과입니다.",
      what: "fadeOut 으로 사라지게 하고, 사라진 뒤에 글자를 바꾸고 fadeIn 으로 다시 나타냅니다. css 로 배경색도 바꿉니다.",
      where: "app.js 를 통째로 아래 코드로 바꾸세요.",
      result:
        "fadeOut·fadeIn 으로 부드러운 효과를 넣고 배경색까지 번갈아 바뀌게 해서 카드가 완성됐어요. jQuery 를 데려오고, 찾고, 바꾸고, 움직이는 것까지 다 해 봤습니다!",
      next: "완성! 7단계로 넘어가서 인터넷에 올려 봅시다.",
      files: [
        {
          path: "/app.js",
          action: "edit",
          code: APP_FINAL,
          hint: "🎉 fadeOut 뒤의 function 은 「다 사라지고 나면 이걸 해줘」예요. 순서를 지키는 방법입니다.",
        },
      ],
    },
  ],

  deploySteps: [
    {
      id: "d1",
      title: "1. 내 코드 내려받기",
      why: "지금 만든 코드는 이 웹페이지 안에만 있어요. 먼저 내 컴퓨터로 가져와야 합니다.",
      actions: [
        "코드 칸 위쪽의 「코드 내려받기」 버튼을 누르세요.",
        "압축을 풀면 index.html, styles.css, app.js 가 보여요.",
        "jQuery 는 인터넷에서 데려오는 것이라 파일에 없습니다. 정상이에요.",
      ],
    },
    {
      id: "d2",
      title: "2. 내 컴퓨터에서 열어 보기",
      why: "올리기 전에 잘 도는지 확인합니다.",
      actions: [
        "index.html 을 두 번 눌러 브라우저로 여세요.",
        "버튼을 눌러 인사말이 바뀌는지 확인하세요.",
        "안 바뀌면 인터넷 연결을 확인하세요. jQuery 를 인터넷에서 가져오니까요.",
      ],
    },
    {
      id: "d3",
      title: "3. 깃허브에 올리기",
      why: "깃허브(GitHub)는 코드를 올려 두는 창고예요.",
      actions: [
        "github.com 에서 계정을 만드세요.",
        "+ → New repository. 이름은 my-greet-card, Public 으로 Create.",
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
        "Add New → Project → my-greet-card 고르고 Import.",
        "설정은 그대로 두고 Deploy.",
        "🎉 주소가 생겼어요.",
      ],
      link: { label: "Vercel 열기", href: "https://vercel.com" },
    },
    {
      id: "d5",
      title: "5. 친구에게 보내기",
      why: "2단계에서 정한 대로 실제로 알리는 순간이에요.",
      actions: [
        "생긴 주소를 복사하세요.",
        "친구에게 「눌러 봐」 하고 보내세요.",
        "폰 화면 녹화로 10초 영상을 만들어 올려 보세요.",
        "인사말을 그 사람 맞춤으로 바꿔서 보내면 더 좋아합니다.",
      ],
    },
  ],

  starterFiles: {},
};
