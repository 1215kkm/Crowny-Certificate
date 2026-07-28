import type { Course } from "../types";

/**
 * HTML 2호 — 「우리 반 시간표」
 *
 * 1호(소개 페이지)보다 한 걸음 더. 표(table)를 다루고,
 * 같은 이름표(class)를 여러 곳에 붙여 색을 통일하는 법을 배운다.
 */

const HTML_1 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>우리 반 시간표</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <h1>우리 반 시간표</h1>
  </body>
</html>
`;

const CSS_1 = `body {
  margin: 0;
  padding: 32px 16px;
  background: #f0fdf4;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
}

h1 {
  font-size: 24px;
  text-align: center;
  color: #15803d;
}
`;

const HTML_2 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>우리 반 시간표</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <h1>우리 반 시간표</h1>

    <table class="timetable">
      <thead>
        <tr>
          <th>교시</th>
          <th>월</th>
          <th>화</th>
          <th>수</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1교시</td>
          <td>국어</td>
          <td>수학</td>
          <td>영어</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;

const CSS_2 = `body {
  margin: 0;
  padding: 32px 16px;
  background: #f0fdf4;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
}

h1 {
  font-size: 24px;
  text-align: center;
  color: #15803d;
}

.timetable {
  width: 100%;
  max-width: 520px;
  margin: 20px auto;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 14px rgba(21, 128, 61, 0.1);
}

.timetable th,
.timetable td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #f0fdf4;
  font-size: 15px;
}

.timetable th {
  background: #22c55e;
  color: #ffffff;
  font-size: 14px;
}
`;

const HTML_3 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>우리 반 시간표</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <h1>우리 반 시간표</h1>

    <table class="timetable">
      <thead>
        <tr>
          <th>교시</th>
          <th>월</th>
          <th>화</th>
          <th>수</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="time">1교시</td>
          <td>국어</td>
          <td>수학</td>
          <td>영어</td>
        </tr>
        <tr>
          <td class="time">2교시</td>
          <td>수학</td>
          <td>과학</td>
          <td>국어</td>
        </tr>
        <tr>
          <td class="time">3교시</td>
          <td>체육</td>
          <td>영어</td>
          <td>미술</td>
        </tr>
        <tr>
          <td class="time">4교시</td>
          <td>음악</td>
          <td>사회</td>
          <td>체육</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;

const CSS_3 = `body {
  margin: 0;
  padding: 32px 16px;
  background: #f0fdf4;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
}

h1 {
  font-size: 24px;
  text-align: center;
  color: #15803d;
}

.timetable {
  width: 100%;
  max-width: 520px;
  margin: 20px auto;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 14px rgba(21, 128, 61, 0.1);
}

.timetable th,
.timetable td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #f0fdf4;
  font-size: 15px;
}

.timetable th {
  background: #22c55e;
  color: #ffffff;
  font-size: 14px;
}

.time {
  background: #f0fdf4;
  color: #15803d;
  font-weight: bold;
  font-size: 13px;
}
`;

const HTML_4 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>우리 반 시간표</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <h1>우리 반 시간표</h1>

    <table class="timetable">
      <thead>
        <tr>
          <th>교시</th>
          <th>월</th>
          <th>화</th>
          <th>수</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="time">1교시</td>
          <td>국어</td>
          <td>수학</td>
          <td>영어</td>
        </tr>
        <tr>
          <td class="time">2교시</td>
          <td>수학</td>
          <td>과학</td>
          <td>국어</td>
        </tr>
        <tr>
          <td class="time">3교시</td>
          <td class="fun">체육</td>
          <td>영어</td>
          <td class="fun">미술</td>
        </tr>
        <tr>
          <td class="time">4교시</td>
          <td class="fun">음악</td>
          <td>사회</td>
          <td class="fun">체육</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;

const CSS_4 = `body {
  margin: 0;
  padding: 32px 16px;
  background: #f0fdf4;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
}

h1 {
  font-size: 24px;
  text-align: center;
  color: #15803d;
}

.timetable {
  width: 100%;
  max-width: 520px;
  margin: 20px auto;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 14px rgba(21, 128, 61, 0.1);
}

.timetable th,
.timetable td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #f0fdf4;
  font-size: 15px;
}

.timetable th {
  background: #22c55e;
  color: #ffffff;
  font-size: 14px;
}

.time {
  background: #f0fdf4;
  color: #15803d;
  font-weight: bold;
  font-size: 13px;
}

.fun {
  background: #fef9c3;
  font-weight: bold;
  color: #a16207;
}
`;

const HTML_FINAL = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>우리 반 시간표</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <h1>우리 반 시간표</h1>
    <p class="hint">노란 칸은 내가 제일 좋아하는 시간이에요 🎨</p>

    <table class="timetable">
      <thead>
        <tr>
          <th>교시</th>
          <th>월</th>
          <th>화</th>
          <th>수</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="time">1교시</td>
          <td>국어</td>
          <td>수학</td>
          <td>영어</td>
        </tr>
        <tr>
          <td class="time">2교시</td>
          <td>수학</td>
          <td>과학</td>
          <td>국어</td>
        </tr>
        <tr>
          <td class="time">3교시</td>
          <td class="fun">체육</td>
          <td>영어</td>
          <td class="fun">미술</td>
        </tr>
        <tr>
          <td class="time">4교시</td>
          <td class="fun">음악</td>
          <td>사회</td>
          <td class="fun">체육</td>
        </tr>
      </tbody>
    </table>

    <div class="memo">
      <h2>준비물 메모</h2>
      <ul>
        <li>월요일 — 체육복</li>
        <li>수요일 — 물감, 붓</li>
      </ul>
    </div>
  </body>
</html>
`;

const CSS_FINAL = `body {
  margin: 0;
  padding: 32px 16px;
  background: #f0fdf4;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  color: #1f2937;
}

h1 {
  font-size: 24px;
  text-align: center;
  color: #15803d;
  margin-bottom: 4px;
}

.hint {
  text-align: center;
  font-size: 13px;
  color: #6b7280;
  margin-top: 0;
}

.timetable {
  width: 100%;
  max-width: 520px;
  margin: 20px auto;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 14px rgba(21, 128, 61, 0.1);
}

.timetable th,
.timetable td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #f0fdf4;
  font-size: 15px;
}

.timetable th {
  background: #22c55e;
  color: #ffffff;
  font-size: 14px;
}

.time {
  background: #f0fdf4;
  color: #15803d;
  font-weight: bold;
  font-size: 13px;
}

.fun {
  background: #fef9c3;
  font-weight: bold;
  color: #a16207;
}

.memo {
  max-width: 520px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 14px;
  padding: 16px 20px;
  box-shadow: 0 2px 14px rgba(21, 128, 61, 0.1);
}

.memo h2 {
  font-size: 16px;
  color: #15803d;
  margin-top: 0;
}

.memo ul {
  padding-left: 18px;
  line-height: 1.9;
  margin: 0;
}
`;

export const htmlTimetableCourse: Course = {
  id: "html-timetable",
  track: "html",
  title: "우리 반 시간표 만들기",
  subtitle: "표(table)를 만들고 칸마다 색을 다르게 입히기",
  level: "왕초보",
  duration: "약 45분",
  pages: ["제목", "시간표", "준비물 메모"],
  template: "static",

  stages: [
    {
      id: "topic",
      no: 1,
      title: "주제 정하기",
      summary: "왜 「시간표」로 표를 배우는지 알아봐요",
      tier: "free",
      goal: "무엇을 만들지 한 문장으로 말할 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "이번에 만들 것은 「우리 반 시간표」예요. 요일과 교시가 있는 표를 만들고, 좋아하는 시간에는 다른 색을 칠합니다.",
        },
        {
          kind: "why",
          text: "표(table)는 웹에서 아주 많이 쓰여요. 성적표, 가격표, 배송 조회… 줄과 칸으로 된 것은 전부 표입니다.",
        },
        {
          kind: "why",
          text: "그리고 시간표는 내용을 이미 알고 있어서 좋아요. 무슨 글을 쓸지 고민할 필요 없이 만드는 법만 배우면 됩니다.",
        },
        {
          kind: "what",
          text: "이번에 새로 배울 것 — 표 만들기(table·tr·th·td), 같은 이름표(class)를 여러 칸에 붙여 색을 한 번에 바꾸기.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 만든 뒤 어디에 쓸지 정합니다.",
        },
      ],
      practiceLabel: "아래 문장을 따라 쳐 보세요",
      practiceText:
        "나는 요일과 교시가 있는 시간표를 만들고, 좋아하는 시간에 다른 색을 칠한다.",
    },
    {
      id: "promo",
      no: 2,
      title: "홍보 방법 배우기",
      summary: "만든 시간표를 어디에 쓸지 정해요",
      tier: "free",
      goal: "만든 페이지를 쓸 곳 2가지를 고를 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "시간표는 나만 보는 게 아니라 같은 반 친구들도 봅니다. 링크 하나면 다 같이 볼 수 있어요.",
        },
        {
          kind: "what",
          text: "아래 카드에 쓸 만한 곳을 정리했어요.",
        },
        {
          kind: "tip",
          text: "처음 고르기 좋은 조합은 ①「반 단톡방에 링크 보내기」 + ②「폰 홈 화면에 추가하기」예요.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 표에 무엇을 넣을지 정합니다.",
        },
      ],
      cards: [
        {
          title: "① 반 단톡방에 링크 보내기",
          body: "친구들이 바로 열어 볼 수 있습니다.",
          picked: true,
          note: "「이거 내가 만들었어」 한마디가 가장 센 홍보예요.",
        },
        {
          title: "② 폰 홈 화면에 추가하기",
          body: "브라우저 메뉴에서 홈 화면에 추가하면 앱처럼 됩니다.",
          picked: true,
          note: "매일 여는 페이지가 되면 고칠 곳도 자꾸 보입니다.",
        },
        {
          title: "③ 학교 게시판·동아리에 공유",
          body: "다른 반도 쓰고 싶어 하면 그게 첫 사용자예요.",
          note: "요청이 들어오면 다음에 만들 기능이 정해집니다.",
        },
        {
          title: "④ 만드는 과정 캡처해서 올리기",
          body: "빈 표 → 색 입힌 표로 바뀌는 과정을 나란히 올립니다.",
          note: "전후 비교는 언제나 잘 먹힙니다.",
        },
      ],
      practiceLabel: "내가 고른 방법 2가지를 따라 쳐 보세요",
      practiceText:
        "나는 반 단톡방에 링크 보내기와 폰 홈 화면에 추가하기로 내 시간표를 쓴다.",
    },
    {
      id: "plan",
      no: 3,
      title: "기획하기",
      summary: "표에 무엇을 넣고 무엇을 뺄지 정해요",
      tier: "free",
      goal: "표의 줄과 칸 수를 정할 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "표는 칸이 많아질수록 폰에서 보기 어려워져요. 처음부터 작게 잡는 게 좋습니다.",
        },
        {
          kind: "what",
          text: "우리는 3일(월·화·수) × 4교시로 만듭니다. 5일치를 다 넣으면 폰 화면에서 글자가 너무 작아져요.",
        },
        {
          kind: "what",
          text: "그리고 「좋아하는 시간」에는 노란색을 칠합니다. 표에 정보를 하나 더 얹는 방법이에요.",
        },
        {
          kind: "what",
          text: "마지막에 준비물 메모를 표 아래에 붙입니다. 표에 다 넣으려 하지 않고 따로 두는 게 읽기 편해요.",
        },
        {
          kind: "tip",
          text: "표는 「한 화면에 다 보이는가」로 판단하세요. 옆으로 스크롤해야 하면 칸을 줄이는 게 답입니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 색을 정합니다.",
        },
      ],
      practiceLabel: "우리가 만들 표를 따라 쳐 보세요",
      practiceText: `표 크기: 3일(월 화 수) x 4교시
색으로 표시할 것: 내가 좋아하는 시간
표 아래에 붙일 것: 준비물 메모
안 넣을 것: 5일 전부, 쉬는 시간, 급식 메뉴`,
    },
    {
      id: "design",
      no: 4,
      title: "디자인하기",
      summary: "표의 색 규칙을 정해요",
      tier: "free",
      goal: "표 머리·교시 칸·좋아하는 칸의 색을 정하게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "표에서 색은 장식이 아니라 안내예요. 어디가 제목이고 어디가 내용인지 색으로 구분합니다.",
        },
        {
          kind: "what",
          text: "표 머리(요일)는 진한 초록에 흰 글자. 가장 진하게 해서 「여기가 제목」임을 알립니다.",
        },
        {
          kind: "what",
          text: "교시 칸은 아주 연한 초록. 제목은 아니지만 내용도 아닌 중간이라 연하게 갑니다.",
        },
        {
          kind: "what",
          text: "좋아하는 시간은 노랑(#fef9c3). 초록 계열 사이에 노랑이 하나 있으면 눈이 바로 갑니다.",
        },
        {
          kind: "tip",
          text: "색은 「세 단계」로 생각하세요. 가장 중요(진한 초록) → 보통(흰색) → 표시할 것(노랑). 이러면 색이 늘어나도 안 어지럽습니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 무엇으로 만들지 정합니다.",
        },
      ],
      practiceLabel: "우리 표의 색 규칙을 따라 쳐 보세요",
      practiceText: `표 머리(요일): #22c55e 초록 바탕에 흰 글자
교시 칸: #f0fdf4 아주 연한 초록
좋아하는 시간: #fef9c3 노랑
배경: #f0fdf4 / 제목 글자: #15803d`,
    },
    {
      id: "stack",
      no: 5,
      title: "구현 방법 정하기",
      summary: "무엇으로 만들고 어디에 올릴지 골라요",
      tier: "free",
      goal: "표를 만드는 태그가 무엇인지 알게 됩니다.",
      paragraphs: [
        {
          kind: "what",
          text: "이번에도 HTML 과 CSS 만 씁니다. 설치할 것은 없어요.",
        },
        {
          kind: "what",
          text: "표를 만드는 태그는 네 개예요. <table> 표 전체, <tr> 가로 한 줄, <th> 제목 칸, <td> 내용 칸.",
        },
        {
          kind: "what",
          text: "그리고 <thead>(표 머리)와 <tbody>(표 몸통)로 나눠 씁니다. 나눠 두면 CSS 로 머리만 따로 꾸미기 쉬워요.",
        },
        {
          kind: "tip",
          text: "헷갈릴 땐 이렇게 외우세요. tr = table row(가로줄), td = table data(내용 칸), th = table head(제목 칸).",
        },
        {
          kind: "next",
          text: "다음 6단계부터가 진짜 따라하기입니다.",
        },
      ],
      practiceLabel: "표 태그를 따라 쳐 보세요",
      practiceText: `table: 표 전체를 감싸는 상자
tr: 가로 한 줄 (table row)
th: 제목 칸 (table head)
td: 내용 칸 (table data)
thead 와 tbody 로 머리와 몸통을 나눈다`,
    },
    {
      id: "build",
      no: 6,
      title: "따라하기",
      summary: "제가 먼저 만들면, 오른쪽에서 똑같이 따라 만들어요",
      tier: "free",
      goal: "5개 스텝을 거쳐 시간표를 완성합니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "설치도 명령어도 없습니다. 파일을 만들고 코드를 치면 바로 화면이 뜹니다.",
        },
        {
          kind: "tip",
          text: "표는 줄이 많아서 길어 보이지만, 사실 <tr> 한 줄을 복사해서 내용만 바꾸는 일이 대부분이에요.",
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
      summary: "인터넷에 올려서 반 친구들에게 보내요",
      tier: "free",
      goal: "내 시간표가 진짜 인터넷 주소를 갖게 됩니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "다 만들었으면 반 친구들이 볼 수 있게 올릴 차례예요.",
        },
        {
          kind: "why",
          text: "배포(deploy)란 내가 만든 파일을 인터넷 어딘가의 컴퓨터에 올려 두는 일이에요.",
        },
        {
          kind: "next",
          text: "주소가 생기면 단톡방에 보내 보세요.",
        },
      ],
    },
  ],

  buildSteps: [
    {
      id: "t0",
      title: "1. 파일 두 개 만들기",
      goal: "이제 index.html 과 styles.css 를 만들어 제목을 띄울 겁니다.",
      why: "웹페이지는 언제나 index.html 에서 시작해요. 꾸미기는 따로 파일로 뺍니다.",
      what: "index.html 에 기본 뼈대와 제목을 적고, styles.css 를 만들어 <link> 로 연결합니다.",
      where: "「내 폴더」의 ＋파일 로 index.html 과 styles.css 를 만들고 코드를 넣으세요.",
      result:
        "파일 두 개로 제목이 뜨고 배경색이 입혀졌어요. HTML 은 내용, CSS 는 꾸밈이라는 역할 나누기를 다시 확인했습니다.",
      next: "다음에는 표의 첫 줄을 만들 거예요.",
      files: [
        {
          path: "/index.html",
          action: "create",
          code: HTML_1,
          hint: "<link> 줄이 CSS 를 데려옵니다. 이게 없으면 색이 안 입혀져요.",
        },
        {
          path: "/styles.css",
          action: "create",
          code: CSS_1,
          hint: "body 는 화면 전체를 뜻해요.",
        },
      ],
    },
    {
      id: "t1",
      title: "2. 표 만들기 (첫 줄)",
      goal: "이제 요일 제목 줄과 1교시 줄이 있는 표가 생깁니다.",
      why: "표는 한 번에 다 만들지 않고 한 줄부터 만듭니다. 한 줄이 제대로 나오면 나머지는 복사예요.",
      what: "<table> 안에 <thead>(요일)와 <tbody>(1교시)를 넣습니다. CSS 로 표 모양도 잡습니다.",
      where: "index.html 의 <body> 안에 표를 넣고, styles.css 도 아래 코드로 바꾸세요.",
      result:
        "table·tr·th·td 로 표의 첫 줄을 만들고, CSS 로 초록 머리와 흰 몸통을 입혔어요. border-collapse 로 칸 사이 선도 하나로 붙였습니다.",
      next: "다음에는 나머지 교시 줄을 채울 거예요.",
      files: [
        {
          path: "/index.html",
          action: "edit",
          code: HTML_2,
          hint: "<tr> 하나가 가로 한 줄이에요. 그 안의 <th>·<td> 개수가 칸 수입니다.",
        },
        {
          path: "/styles.css",
          action: "edit",
          code: CSS_2,
          hint: "border-collapse: collapse 는 칸 사이 이중선을 하나로 합치는 것이에요.",
        },
      ],
    },
    {
      id: "t2",
      title: "3. 나머지 교시 채우기",
      goal: "이제 4교시까지 시간표가 다 채워집니다.",
      why: "표는 줄을 늘리는 방식으로 커집니다. <tr> 을 복사해서 내용만 바꾸면 돼요.",
      what: "<tr> 을 3개 더 넣어 2·3·4교시를 만들고, 교시 칸에 class=\"time\" 이름표를 붙입니다.",
      where: "index.html 의 <tbody> 안을 아래 코드로 바꾸고, styles.css 에 .time 을 추가하세요.",
      result:
        "교시 줄 4개가 채워졌어요. 교시 칸마다 같은 이름표(time)를 붙여서, CSS 한 곳만 고치면 네 칸 색이 한 번에 바뀝니다.",
      next: "다음에는 좋아하는 시간에 색을 칠할 거예요.",
      files: [
        {
          path: "/index.html",
          action: "edit",
          code: HTML_3,
          hint: '같은 class="time" 을 네 곳에 붙였어요. 이름표는 여러 곳에 같이 붙일 수 있습니다.',
        },
        {
          path: "/styles.css",
          action: "edit",
          code: CSS_3,
          hint: ".time 하나를 고치면 교시 칸 네 개가 전부 바뀝니다.",
        },
      ],
    },
    {
      id: "t3",
      title: "4. 좋아하는 시간에 색 칠하기",
      goal: "이제 체육·미술·음악 칸이 노란색으로 표시됩니다.",
      why: "표에 정보를 하나 더 얹는 방법이에요. 글자를 늘리지 않고 색으로 알려 줍니다.",
      what: "좋아하는 과목 칸에 class=\"fun\" 을 붙이고, CSS 에서 .fun 을 노란색으로 만듭니다.",
      where: "index.html 에서 체육·미술·음악 칸에 이름표를 붙이고, styles.css 에 .fun 을 추가하세요.",
      result:
        "이름표(fun)를 붙인 칸만 노랗게 바뀌었어요. 같은 td 인데 이름표에 따라 다르게 보이는 것이 CSS 의 핵심입니다.",
      next: "다음이 마지막입니다. 준비물 메모를 붙일 거예요.",
      files: [
        {
          path: "/index.html",
          action: "edit",
          code: HTML_4,
          hint: "이름표는 필요한 칸에만 붙여요. 안 붙은 칸은 원래 모양 그대로입니다.",
        },
        {
          path: "/styles.css",
          action: "edit",
          code: CSS_4,
          hint: "노랑은 초록 사이에서 가장 눈에 띄는 색이라 표시용으로 좋습니다.",
        },
      ],
    },
    {
      id: "t4",
      title: "5. 준비물 메모 붙이기 (마지막!)",
      goal: "이제 표 아래에 준비물 메모 상자가 생깁니다.",
      why: "표에 다 넣으려 하면 칸이 복잡해져요. 성격이 다른 정보는 따로 두는 게 읽기 편합니다.",
      what: "표 아래에 <div class=\"memo\"> 를 만들고 목록을 넣습니다. 표 위에는 안내 한 줄도 넣습니다.",
      where: "index.html 을 통째로 바꾸고, styles.css 도 마지막 코드로 바꾸세요.",
      result:
        "표 아래 메모 상자와 안내 문구까지 넣어 시간표가 완성됐어요. 표(정해진 칸)와 목록(자유로운 글)을 나눠 쓰는 감을 잡았습니다!",
      next: "완성! 7단계로 넘어가서 인터넷에 올려 봅시다.",
      files: [
        {
          path: "/index.html",
          action: "edit",
          code: HTML_FINAL,
          hint: "표는 칸이 정해진 정보에, 목록은 자유로운 정보에 씁니다.",
        },
        {
          path: "/styles.css",
          action: "edit",
          code: CSS_FINAL,
          hint: "🎉 메모 상자도 표와 같은 모서리·그림자를 줘서 한 세트로 보이게 했어요.",
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
        "다운로드 폴더에 zip 파일이 생깁니다.",
        "압축을 풀면 index.html 과 styles.css 가 보여요.",
      ],
    },
    {
      id: "d2",
      title: "2. 내 컴퓨터에서 먼저 열어 보기",
      why: "HTML 은 서버 없이도 열려요. 올리기 전에 확인할 수 있습니다.",
      actions: [
        "압축 푼 폴더에서 index.html 을 두 번 누르세요.",
        "브라우저에 내 시간표가 뜹니다.",
        "폰처럼 좁게 보려면 창을 줄여 보세요.",
      ],
    },
    {
      id: "d3",
      title: "3. 깃허브에 올리기",
      why: "깃허브(GitHub)는 코드를 올려 두는 창고예요. Vercel 이 여기서 가져갑니다.",
      actions: [
        "github.com 에서 계정을 만드세요.",
        "+ → New repository. 이름은 my-timetable, Public 으로 Create.",
        "「uploading an existing file」 로 파일 두 개를 끌어다 놓고 Commit changes.",
      ],
      link: { label: "깃허브 열기", href: "https://github.com" },
    },
    {
      id: "d4",
      title: "4. Vercel 에 연결하기",
      why: "Vercel 이 깃허브를 보고 인터넷 주소를 만들어 줍니다.",
      actions: [
        "vercel.com 에서 「Continue with GitHub」 로 들어갑니다.",
        "Add New → Project → my-timetable 고르고 Import.",
        "설정은 그대로 두고 Deploy. 1분쯤 기다립니다.",
        "🎉 주소가 생겼어요.",
      ],
      link: { label: "Vercel 열기", href: "https://vercel.com" },
    },
    {
      id: "d5",
      title: "5. 친구들에게 보내기",
      why: "2단계에서 정한 대로 실제로 써 보는 순간이에요.",
      actions: [
        "생긴 주소를 복사하세요.",
        "반 단톡방에 보내 보세요.",
        "폰 브라우저 메뉴에서 「홈 화면에 추가」를 해 보세요.",
        "친구가 「이것도 넣어 줘」 하면 그게 다음에 만들 기능입니다.",
      ],
    },
  ],

  starterFiles: {},
};
