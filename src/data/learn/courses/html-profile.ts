import type { Course } from "../types";

/**
 * HTML 1호 — 「나를 소개하는 한 장 페이지」
 *
 * 설치도 없고 명령어도 없다. 파일 두 개만 만들면 바로 화면이 뜬다.
 * HTML 이 「글의 뼈대」, CSS 가 「꾸미기」라는 걸 몸으로 익히는 것이 목표.
 */

const HTML_1 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>나를 소개합니다</title>
  </head>
  <body>
    <h1>안녕하세요, 저는 강코딩이에요</h1>
  </body>
</html>
`;

const HTML_2 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>나를 소개합니다</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <h1>안녕하세요, 저는 강코딩이에요</h1>
  </body>
</html>
`;

const CSS_1 = `body {
  margin: 0;
  padding: 40px 20px;
  background: #eef2ff;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  text-align: center;
}

h1 {
  font-size: 26px;
  color: #4338ca;
}
`;

const HTML_3 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>나를 소개합니다</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="card">
      <div class="face">🙋</div>
      <h1>안녕하세요, 저는 강코딩이에요</h1>
      <p>웹사이트 만드는 걸 배우고 있어요.</p>
    </div>
  </body>
</html>
`;

const CSS_2 = `body {
  margin: 0;
  padding: 40px 20px;
  background: #eef2ff;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  text-align: center;
}

.card {
  max-width: 420px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 20px;
  padding: 28px 20px;
  box-shadow: 0 4px 20px rgba(67, 56, 202, 0.12);
}

.face {
  font-size: 60px;
}

h1 {
  font-size: 24px;
  color: #4338ca;
  margin: 8px 0;
}

p {
  color: #4b5563;
  line-height: 1.7;
}
`;

const HTML_4 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>나를 소개합니다</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="card">
      <div class="face">🙋</div>
      <h1>안녕하세요, 저는 강코딩이에요</h1>
      <p>웹사이트 만드는 걸 배우고 있어요.</p>

      <h2>좋아하는 것</h2>
      <ul class="like-list">
        <li>🍕 피자 먹기</li>
        <li>🎮 게임 하기</li>
        <li>💻 코딩 배우기</li>
      </ul>
    </div>
  </body>
</html>
`;

const CSS_3 = `body {
  margin: 0;
  padding: 40px 20px;
  background: #eef2ff;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  text-align: center;
}

.card {
  max-width: 420px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 20px;
  padding: 28px 20px;
  box-shadow: 0 4px 20px rgba(67, 56, 202, 0.12);
}

.face {
  font-size: 60px;
}

h1 {
  font-size: 24px;
  color: #4338ca;
  margin: 8px 0;
}

h2 {
  font-size: 17px;
  color: #4338ca;
  margin-top: 24px;
}

p {
  color: #4b5563;
  line-height: 1.7;
}

.like-list {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
}

.like-list li {
  background: #eef2ff;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 8px;
  font-size: 15px;
}
`;

const HTML_5 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>나를 소개합니다</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="card">
      <div class="face">🙋</div>
      <h1>안녕하세요, 저는 강코딩이에요</h1>
      <p>웹사이트 만드는 걸 배우고 있어요.</p>

      <h2>좋아하는 것</h2>
      <ul class="like-list">
        <li>🍕 피자 먹기</li>
        <li>🎮 게임 하기</li>
        <li>💻 코딩 배우기</li>
      </ul>

      <h2>연락하기</h2>
      <a class="mail-btn" href="mailto:me@example.com">메일 보내기</a>
    </div>
  </body>
</html>
`;

const CSS_FINAL = `body {
  margin: 0;
  padding: 40px 20px;
  background: #eef2ff;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  text-align: center;
}

.card {
  max-width: 420px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 20px;
  padding: 28px 20px;
  box-shadow: 0 4px 20px rgba(67, 56, 202, 0.12);
}

.face {
  font-size: 60px;
}

h1 {
  font-size: 24px;
  color: #4338ca;
  margin: 8px 0;
}

h2 {
  font-size: 17px;
  color: #4338ca;
  margin-top: 24px;
}

p {
  color: #4b5563;
  line-height: 1.7;
}

.like-list {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
}

.like-list li {
  background: #eef2ff;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 8px;
  font-size: 15px;
}

.mail-btn {
  display: inline-block;
  margin-top: 10px;
  padding: 12px 22px;
  background: #6366f1;
  color: #ffffff;
  border-radius: 999px;
  text-decoration: none;
  font-weight: bold;
}

.mail-btn:hover {
  background: #4338ca;
}
`;

export const htmlProfileCourse: Course = {
  id: "html-profile",
  track: "html",
  title: "나를 소개하는 페이지 만들기",
  subtitle: "설치 없이, 파일 두 개로 만드는 첫 웹페이지",
  level: "왕초보",
  duration: "약 40분",
  pages: ["인사", "좋아하는 것", "연락하기"],
  template: "static",

  stages: [
    {
      id: "topic",
      no: 1,
      title: "주제 정하기",
      summary: "왜 「나를 소개하는 페이지」로 시작하는지 알아봐요",
      tier: "free",
      goal: "무엇을 만들지 한 문장으로 말할 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "이번에 만들 것은 「나를 소개하는 한 장짜리 웹페이지」예요. 이름과 인사, 좋아하는 것 목록, 메일 보내기 버튼이 들어갑니다.",
        },
        {
          kind: "why",
          text: "웹을 처음 배울 때 이걸 먼저 만드는 이유가 있어요. 내 이야기라서 무슨 내용을 넣을지 고민이 없거든요. 코딩만 신경 쓰면 됩니다.",
        },
        {
          kind: "why",
          text: "그리고 HTML 은 설치할 게 하나도 없어요. 파일을 만들면 그 순간 화면이 뜹니다. 프로그램을 깔다가 지쳐서 그만두는 일이 없어요.",
        },
        {
          kind: "what",
          text: "이번에 배울 두 가지 — HTML 은 「무엇을 쓸지」(뼈대), CSS 는 「어떻게 보일지」(꾸미기). 웹은 이 둘로 만들어집니다.",
        },
        {
          kind: "tip",
          text: "완성되면 진짜 인터넷 주소가 생깁니다. 자기소개 링크 하나 있으면 어디에든 쓸 데가 있어요.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 만든 뒤에 어떻게 알릴지를 정합니다.",
        },
      ],
      practiceLabel: "아래 문장을 따라 쳐 보세요 — 우리의 목표 한 줄이에요",
      practiceText:
        "나는 이름과 인사, 좋아하는 것, 메일 버튼이 있는 한 장짜리 소개 페이지를 만든다.",
    },
    {
      id: "promo",
      no: 2,
      title: "홍보 방법 배우기",
      summary: "만든 페이지를 어디에 쓸지 정해요",
      tier: "free",
      goal: "내 소개 페이지를 어디에 쓸지 2가지를 고를 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "소개 페이지는 「알린다」기보다 「쓸 데를 만든다」에 가까워요. 링크 하나가 여러 곳에서 나를 대신 설명해 줍니다.",
        },
        {
          kind: "what",
          text: "아래 카드에 쓸 만한 곳을 정리했어요. 어디에 붙일지 미리 정하면, 만들 때 그곳에 맞게 만들 수 있습니다.",
        },
        {
          kind: "tip",
          text: "처음 고르기 좋은 조합은 ①「인스타 프로필 링크에 넣기」 + ②「친구에게 보내기」예요. 둘 다 공짜이고 바로 됩니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 페이지에 무엇을 넣을지 정합니다.",
        },
      ],
      cards: [
        {
          title: "① 인스타·유튜브 프로필 링크",
          body: "프로필에 링크 한 줄. 누르면 내 소개가 뜹니다.",
          picked: true,
          note: "심리 레버 — 「직접 만든 페이지」는 그 자체로 눈길을 끕니다.",
        },
        {
          title: "② 친구에게 보내기",
          body: "완성 즉시 친구에게 보내고 반응을 봅니다.",
          picked: true,
          note: "가장 빠른 피드백. 어디가 안 읽히는지 바로 나옵니다.",
        },
        {
          title: "③ 학교·동아리 소개에 쓰기",
          body: "발표나 지원서에 링크를 넣습니다.",
          note: "종이보다 기억에 남습니다.",
        },
        {
          title: "④ 나중에 포트폴리오로 키우기",
          body: "만든 것들이 늘어나면 이 페이지에 하나씩 붙입니다.",
          note: "첫 페이지가 나중엔 내 작업 목록이 됩니다.",
        },
      ],
      practiceLabel: "내가 고른 방법 2가지를 따라 쳐 보세요",
      practiceText:
        "나는 인스타 프로필 링크에 넣기와 친구에게 보내기로 내 소개 페이지를 쓴다.",
    },
    {
      id: "plan",
      no: 3,
      title: "기획하기",
      summary: "무엇을 넣고 무엇을 뺄지 정해요",
      tier: "free",
      goal: "페이지에 넣을 것 3덩어리를 적을 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "소개 페이지에서 가장 흔한 실수는 「너무 많이 쓰기」예요. 길면 아무도 안 읽습니다.",
        },
        {
          kind: "what",
          text: "우리는 3덩어리로 못 박습니다. ①인사 — 누구인지 한 줄. ②좋아하는 것 — 3개. ③연락하기 — 버튼 하나.",
        },
        {
          kind: "what",
          text: "안 넣을 것도 정합니다 — 긴 자기소개서, 학력, 여러 장의 사진. 한 화면을 넘기지 않는 것이 목표예요.",
        },
        {
          kind: "tip",
          text: "「스크롤 없이 다 보이면 성공」이라고 생각하세요. 폰에서 한 화면 반 안쪽이면 좋습니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 색과 모양을 정합니다.",
        },
      ],
      practiceLabel: "우리가 넣을 것을 따라 쳐 보세요",
      practiceText: `넣을 것 3덩어리: 인사 / 좋아하는 것 3개 / 연락하기 버튼
안 넣을 것: 긴 자기소개서, 학력, 사진 여러 장
목표: 폰에서 한 화면 반 안쪽`,
    },
    {
      id: "design",
      no: 4,
      title: "디자인하기",
      summary: "색과 모양 규칙을 정해요",
      tier: "free",
      goal: "우리 페이지의 색·모서리·글자 크기를 정하게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "디자인은 「예쁘게」가 아니라 「읽기 편하게」예요. 글자가 크고 여백이 넉넉하면 그것만으로 좋아 보입니다.",
        },
        {
          kind: "what",
          text: "색은 남색 계열로 갑니다. 메인 남색(#6366f1), 진한 남색(#4338ca), 배경은 아주 연한 남색(#eef2ff).",
        },
        {
          kind: "what",
          text: "가운데에 흰 카드를 하나 놓고 그 안에 다 넣습니다. 배경과 카드가 나뉘면 내용이 또렷해 보여요.",
        },
        {
          kind: "what",
          text: "모서리는 아주 둥글게(20px), 버튼은 알약 모양(999px). 둥글수록 친근합니다.",
        },
        {
          kind: "tip",
          text: "여백이 디자인의 절반이에요. 글자를 줄이는 게 어려우면 여백만 늘려도 훨씬 나아 보입니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 무엇으로 만들고 어디에 올릴지 정합니다.",
        },
      ],
      practiceLabel: "우리 페이지의 디자인 규칙을 따라 쳐 보세요",
      practiceText: `메인색: #6366f1 (남색)
진한색: #4338ca
배경색: #eef2ff (연한 남색)
카드 모서리: 20px / 버튼: 알약 모양
가운데 흰 카드 하나에 다 담기`,
    },
    {
      id: "stack",
      no: 5,
      title: "구현 방법 정하기",
      summary: "무엇으로 만들고 어디에 올릴지 골라요",
      tier: "free",
      goal: "HTML·CSS 가 무엇인지 설명할 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "what",
          text: "이번엔 HTML 과 CSS 만 씁니다. HTML(에이치티엠엘)은 「무엇을 쓸지」를 적는 언어예요. 제목, 문단, 목록, 버튼처럼 내용의 종류를 정합니다.",
        },
        {
          kind: "what",
          text: "CSS(씨에스에스)는 「어떻게 보일지」를 적는 언어입니다. 색, 크기, 여백, 모서리를 정해요. HTML 이 뼈대라면 CSS 는 옷입니다.",
        },
        {
          kind: "what",
          text: "둘은 파일을 나눠서 씁니다. index.html 과 styles.css. 나눠 두면 내용을 고칠 때와 꾸밈을 고칠 때가 안 섞여요.",
        },
        {
          kind: "why",
          text: "설치는 없습니다. 브라우저가 HTML 과 CSS 를 원래 읽을 줄 알거든요. 파일만 만들면 바로 화면이 뜹니다.",
        },
        {
          kind: "what",
          text: "올리는 곳은 Vercel(버셀). 공짜이고 깃허브에 올리면 자동으로 인터넷 주소를 만들어 줍니다.",
        },
        {
          kind: "next",
          text: "여기까지가 준비예요. 다음 6단계부터가 진짜 따라하기입니다.",
        },
      ],
      practiceLabel: "우리가 고른 구현 방법을 따라 쳐 보세요",
      practiceText: `HTML: 무엇을 쓸지 (뼈대)
CSS: 어떻게 보일지 (꾸미기)
파일 2개: index.html / styles.css
설치할 것: 없음
서버: Vercel (무료)`,
    },
    {
      id: "build",
      no: 6,
      title: "따라하기",
      summary: "제가 먼저 만들면, 오른쪽에서 똑같이 따라 만들어요",
      tier: "free",
      goal: "8개 스텝을 거쳐 소개 페이지를 완성합니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "여기서부터가 진짜입니다. 설치도 명령어도 없어요. 파일을 만들고 코드를 치면 바로 화면이 뜹니다.",
        },
        {
          kind: "what",
          text: "미리보기 창에 지금 만든 페이지가 그대로 나옵니다. 코드를 고치면 바로 바뀌어요.",
        },
        {
          kind: "tip",
          text: "태그를 칠 때 Tab 키를 눌러 보세요. h1 을 치고 Tab 을 누르면 <h1></h1> 이 한 번에 나옵니다.",
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
      goal: "내 소개 페이지가 진짜 인터넷 주소를 갖게 됩니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "다 만들었으면 세상에 내놓을 차례예요. 링크가 생기면 어디든 붙일 수 있습니다.",
        },
        {
          kind: "why",
          text: "배포(deploy)란 내가 만든 파일을 인터넷 어딘가의 컴퓨터(=서버)에 올려 두는 일이에요.",
        },
        {
          kind: "tip",
          text: "HTML 페이지는 특히 배포가 쉬워요. 만들 게 없어서 올리면 바로 끝납니다.",
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
      id: "h0",
      title: "1. index.html 만들기",
      goal: "이제 웹페이지 파일을 만들어 화면에 첫 글자를 띄울 겁니다.",
      why: "웹페이지는 index.html 이라는 파일에서 시작해요. 브라우저가 제일 먼저 찾는 이름이라서 이렇게 짓습니다.",
      what: "index.html 파일을 만들고 기본 뼈대를 적습니다. <html>, <head>, <body> 세 덩어리가 항상 들어가요.",
      where: "오른쪽 「내 폴더」의 ＋파일 을 눌러 index.html 을 만들고, 아래 코드를 넣으세요.",
      result:
        "index.html 하나로 화면에 글자가 떴어요. 설치도 명령어도 없이 파일 하나면 웹페이지가 된다는 걸 확인했습니다.",
      next: "다음에는 색을 입히기 위해 CSS 파일을 만들 거예요.",
      files: [
        {
          path: "/index.html",
          action: "create",
          code: HTML_1,
          hint: "<head> 는 보이지 않는 정보(제목·설정), <body> 는 화면에 보이는 내용이에요.",
        },
      ],
    },
    {
      id: "h1",
      title: "2. CSS 파일 만들고 연결하기",
      goal: "이제 배경색이 연한 남색으로, 제목이 남색으로 바뀝니다.",
      why: "꾸미기는 HTML 안에 섞지 않고 따로 파일로 뺍니다. 나중에 고칠 때 훨씬 편해요.",
      what: "styles.css 를 만들고, index.html 의 <head> 안에 <link> 한 줄로 연결합니다. 연결하지 않으면 CSS 는 아무 일도 하지 않아요.",
      where: "＋파일 로 styles.css 를 만든 뒤, index.html 의 <head> 안에 <link> 줄을 넣으세요.",
      result:
        "styles.css 를 만들고 <link> 로 연결해서 색이 입혀졌어요. 파일을 만드는 것과 연결하는 것은 다른 일이라는 걸 확인했습니다.",
      next: "다음에는 내용을 카드 안에 담을 거예요.",
      files: [
        {
          path: "/styles.css",
          action: "create",
          code: CSS_1,
          hint: "body 는 화면 전체를 뜻해요. 여기에 배경색과 글꼴을 정합니다.",
        },
        {
          path: "/index.html",
          action: "edit",
          code: HTML_2,
          hint: '<link rel="stylesheet" href="styles.css" /> 이 한 줄이 CSS 를 데려옵니다.',
        },
      ],
    },
    {
      id: "h2",
      title: "3. 카드 안에 담기",
      goal: "이제 내용이 가운데 흰 카드 안에 들어가고, 얼굴과 소개 문장이 생깁니다.",
      why: "글이 배경 위에 그냥 있으면 허전해요. 흰 상자 하나에 담기만 해도 훨씬 정돈돼 보입니다.",
      what: "<div class=\"card\"> 로 내용을 감싸고, 얼굴 이모지와 소개 문장을 넣습니다. div 는 「덩어리로 묶는 상자」예요.",
      where: "index.html 의 <body> 안을 통째로 바꾸고, styles.css 도 아래 코드로 바꾸세요.",
      result:
        "div 로 내용을 묶고 CSS 에서 .card 를 꾸며 흰 카드가 생겼어요. class 이름표로 HTML 과 CSS 를 연결하는 방법을 배웠습니다.",
      next: "다음에는 좋아하는 것 목록을 넣을 거예요.",
      files: [
        {
          path: "/index.html",
          action: "edit",
          code: HTML_3,
          hint: 'class="card" 가 이름표예요. CSS 에서는 점을 붙여 .card 로 부릅니다.',
        },
        {
          path: "/styles.css",
          action: "edit",
          code: CSS_2,
          hint: "box-shadow 는 그림자예요. 살짝만 줘도 카드가 떠 보입니다.",
        },
      ],
    },
    {
      id: "h3",
      title: "4. 좋아하는 것 목록 넣기",
      goal: "이제 좋아하는 것 3개가 목록으로 나옵니다.",
      why: "여러 개를 나열할 때는 문장으로 쭉 쓰지 않고 목록을 씁니다. 눈으로 세기 쉬워요.",
      what: "<ul> 안에 <li> 를 넣습니다. ul 은 목록 상자, li 는 목록 한 줄이에요.",
      where: "index.html 의 카드 안, 소개 문장 아래에 목록을 넣고 styles.css 도 바꾸세요.",
      result:
        "ul 과 li 로 좋아하는 것 3개를 목록으로 만들었어요. CSS 로 점(•)을 없애고 상자 모양으로 꾸며서 버튼처럼 보이게 했습니다.",
      next: "다음에는 연락하기 버튼을 만들 거예요.",
      files: [
        {
          path: "/index.html",
          action: "edit",
          code: HTML_4,
          hint: "<h2> 는 작은 제목이에요. <h1> 다음으로 큰 제목입니다.",
        },
        {
          path: "/styles.css",
          action: "edit",
          code: CSS_3,
          hint: "list-style: none 은 목록 앞의 점을 없애는 것이에요.",
        },
      ],
    },
    {
      id: "h4",
      title: "5. 연락하기 버튼 만들기 (마지막!)",
      goal: "이제 누르면 메일 쓰기가 열리는 버튼이 생깁니다.",
      why: "소개만 있고 연락할 방법이 없으면 아쉬워요. 버튼 하나면 충분합니다.",
      what: "<a> 태그로 링크를 만듭니다. href 에 mailto: 를 쓰면 메일 앱이 열려요.",
      where: "index.html 카드 맨 아래에 버튼을 넣고, styles.css 를 마지막으로 바꾸세요.",
      result:
        "a 태그로 메일 버튼을 만들고 알약 모양으로 꾸며 페이지가 완성됐어요. 인사·좋아하는 것·연락하기까지 계획한 3덩어리를 전부 만들었습니다!",
      next: "완성! 7단계로 넘어가서 인터넷에 올려 봅시다.",
      files: [
        {
          path: "/index.html",
          action: "edit",
          code: HTML_5,
          hint: "메일 주소는 본인 것으로 바꿔도 돼요. mailto: 뒤에 적으면 됩니다.",
        },
        {
          path: "/styles.css",
          action: "edit",
          code: CSS_FINAL,
          hint: "🎉 :hover 는 마우스를 올렸을 때예요. 색이 진해지면 눌러도 된다는 신호가 됩니다.",
        },
      ],
    },
  ],

  deploySteps: [
    {
      id: "d1",
      title: "1. 내 코드 내려받기",
      why: "지금 만든 코드는 이 웹페이지 안에만 있어요. 인터넷에 올리려면 먼저 내 컴퓨터로 가져와야 합니다.",
      actions: [
        "코드 칸 위쪽의 「코드 내려받기」 버튼을 누르세요.",
        "다운로드 폴더에 zip 파일이 생깁니다.",
        "압축을 풀면 index.html 과 styles.css 가 보여요.",
      ],
    },
    {
      id: "d2",
      title: "2. 내 컴퓨터에서 먼저 열어 보기",
      why: "HTML 은 서버 없이도 열려요. 올리기 전에 잘 되는지 확인할 수 있습니다.",
      actions: [
        "압축 푼 폴더에서 index.html 을 두 번 누르세요.",
        "브라우저가 열리면서 내가 만든 페이지가 뜹니다.",
        "여기서 잘 나오면 인터넷에 올려도 똑같이 나옵니다.",
      ],
    },
    {
      id: "d3",
      title: "3. 깃허브에 올리기",
      why: "깃허브(GitHub)는 코드를 올려 두는 창고예요. Vercel 이 여기서 코드를 가져갑니다.",
      actions: [
        "github.com 에서 Sign up 으로 계정을 만드세요.",
        "오른쪽 위 + → New repository. 이름은 my-profile, Public 으로 Create.",
        "「uploading an existing file」 을 누르고 index.html·styles.css 를 끌어다 놓으세요.",
        "아래 Commit changes 를 누르면 끝입니다.",
      ],
      link: { label: "깃허브 열기", href: "https://github.com" },
    },
    {
      id: "d4",
      title: "4. Vercel 에 연결하기",
      why: "이제 Vercel 이 깃허브 창고를 보고 인터넷 주소를 만들어 줍니다.",
      actions: [
        "vercel.com 에서 「Continue with GitHub」 로 들어갑니다.",
        "Add New → Project 를 누르세요.",
        "my-profile 저장소를 고르고 Import.",
        "설정은 건드리지 말고 Deploy. 1분쯤 기다립니다.",
        "🎉 my-profile.vercel.app 같은 주소가 생겼어요.",
      ],
      link: { label: "Vercel 열기", href: "https://vercel.com" },
    },
    {
      id: "d5",
      title: "5. 링크 쓰기",
      why: "2단계에서 정한 곳에 실제로 붙이는 순간이에요.",
      actions: [
        "생긴 주소를 복사하세요.",
        "인스타·유튜브 프로필 링크에 넣어 보세요.",
        "친구에게 보내고 어떤 부분을 먼저 읽는지 지켜보세요.",
        "고치고 싶은 곳이 생기면 다시 만들면 됩니다.",
      ],
    },
  ],

  starterFiles: {},
};
