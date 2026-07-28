import type { Course } from "../types";

/**
 * 샘플 2호 — React 로 만드는 「오늘의 기분 일기」 (3페이지).
 *
 * 페이지: 오늘 / 기록 / 소개
 * 난이도는 1호(할 일 앱)와 비슷하다. 대신 다루는 것이 조금 다르다.
 *  - 버튼으로 값 고르기(기분 선택)
 *  - 두 값을 한 덩어리로 저장하기(기분 + 한 줄)
 *  - 목록을 거꾸로 보여주기(최근 것부터)
 */

const SCAFFOLD: Record<string, string> = {
  "/index.js": `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
`,
  "/App.js": `export default function App() {
  return (
    <div className="App">
      <h1>Hello React</h1>
      <p>Edit App.js and save to reload.</p>
    </div>
  );
}
`,
  "/styles.css": `.App {
  font-family: sans-serif;
  text-align: center;
}
`,
};

/* ── 꾸미기 ───────────────────────────────────────── */

const CSS_BASIC = `body {
  margin: 0;
  background: #fff7ed;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
}

.app {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px 60px;
}

h1 {
  font-size: 24px;
  text-align: center;
  color: #c2410c;
}
`;

const CSS_FULL = `body {
  margin: 0;
  background: #fff7ed;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  color: #1f2937;
}

.app {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px 60px;
}

h1 {
  font-size: 24px;
  text-align: center;
  color: #c2410c;
}

/* 위쪽 메뉴 */
.nav {
  display: flex;
  gap: 8px;
  margin: 16px 0;
}

.nav-btn {
  flex: 1;
  padding: 10px 0;
  border: 1px solid #fed7aa;
  background: #ffffff;
  color: #c2410c;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
}

.nav-btn.on {
  background: #f97316;
  border-color: #f97316;
  color: #ffffff;
  font-weight: bold;
}

/* 페이지 상자 */
.page {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(249, 115, 22, 0.1);
}

/* 기분 고르기 */
.mood-row {
  display: flex;
  gap: 8px;
  margin: 12px 0 16px;
}

.mood-btn {
  flex: 1;
  padding: 12px 0;
  font-size: 28px;
  border: 1px solid #fed7aa;
  background: #fffbf6;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.15s;
}

.mood-btn.on {
  background: #ffedd5;
  border-color: #f97316;
  transform: translateY(-3px);
}

.input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
}

.save-btn {
  width: 100%;
  margin-top: 10px;
  padding: 13px 0;
  border: none;
  border-radius: 10px;
  background: #f97316;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

/* 기록 목록 */
.diary-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
}

.diary {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 4px;
  border-bottom: 1px solid #f3f4f6;
}

.diary-face {
  font-size: 26px;
}

.diary-text {
  flex: 1;
}

.diary-date {
  display: block;
  font-size: 12px;
  color: #9ca3af;
}

.del-btn {
  border: none;
  background: none;
  color: #dc2626;
  font-size: 14px;
  cursor: pointer;
}

.empty {
  text-align: center;
  color: #9ca3af;
  padding: 24px 0;
}

/* 소개 */
.about-list {
  padding-left: 20px;
  line-height: 1.9;
}

.made-by {
  text-align: right;
  color: #6b7280;
}
`;

/* ── 코드 조각 ─────────────────────────────────────── */

const APP_STEP1 = `export default function App() {
  return (
    <div className="app">
      <h1>오늘의 기분 일기</h1>
      <p>여기에 하나씩 만들어 볼 거예요!</p>
    </div>
  );
}
`;

const ABOUT_PAGE = `export default function AboutPage() {
  return (
    <div className="page">
      <h2>이 앱은요</h2>
      <p>오늘 기분을 고르고, 한 줄로 남기는 앱이에요.</p>
      <ul className="about-list">
        <li>기분을 얼굴로 고를 수 있어요</li>
        <li>한 줄 메모를 같이 적어요</li>
        <li>지난 기록을 모아 볼 수 있어요</li>
      </ul>
      <p className="made-by">만든 사람: 나 🙋</p>
    </div>
  );
}
`;

const APP_STEP4 = `import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <div className="app">
      <h1>오늘의 기분 일기</h1>
      <AboutPage />
    </div>
  );
}
`;

const NAV = `export default function Nav({ page, setPage }) {
  const menus = [
    { id: "today", name: "오늘" },
    { id: "list", name: "기록" },
    { id: "about", name: "소개" },
  ];

  return (
    <nav className="nav">
      {menus.map((menu) => (
        <button
          key={menu.id}
          className={page === menu.id ? "nav-btn on" : "nav-btn"}
          onClick={() => setPage(menu.id)}
        >
          {menu.name}
        </button>
      ))}
    </nav>
  );
}
`;

const APP_STEP6 = `import { useState } from "react";
import Nav from "./components/Nav";
import AboutPage from "./pages/AboutPage";

export default function App() {
  const [page, setPage] = useState("about");

  return (
    <div className="app">
      <h1>오늘의 기분 일기</h1>
      <Nav page={page} setPage={setPage} />
      {page === "about" && <AboutPage />}
    </div>
  );
}
`;

const TODAY_STEP7 = `export default function TodayPage() {
  return (
    <div className="page">
      <h2>오늘 기분은 어때요?</h2>
    </div>
  );
}
`;

const APP_STEP7 = `import { useState } from "react";
import Nav from "./components/Nav";
import TodayPage from "./pages/TodayPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  const [page, setPage] = useState("today");

  return (
    <div className="app">
      <h1>오늘의 기분 일기</h1>
      <Nav page={page} setPage={setPage} />
      {page === "today" && <TodayPage />}
      {page === "about" && <AboutPage />}
    </div>
  );
}
`;

const TODAY_STEP8 = `import { useState } from "react";

const MOODS = ["😀", "🙂", "😐", "😢", "😡"];

export default function TodayPage() {
  const [mood, setMood] = useState("");

  return (
    <div className="page">
      <h2>오늘 기분은 어때요?</h2>

      <div className="mood-row">
        {MOODS.map((face) => (
          <button
            key={face}
            className={mood === face ? "mood-btn on" : "mood-btn"}
            onClick={() => setMood(face)}
          >
            {face}
          </button>
        ))}
      </div>

      <p className="empty">고른 기분: {mood}</p>
    </div>
  );
}
`;

const TODAY_STEP9 = `import { useState } from "react";

const MOODS = ["😀", "🙂", "😐", "😢", "😡"];

export default function TodayPage() {
  const [mood, setMood] = useState("");
  const [text, setText] = useState("");

  return (
    <div className="page">
      <h2>오늘 기분은 어때요?</h2>

      <div className="mood-row">
        {MOODS.map((face) => (
          <button
            key={face}
            className={mood === face ? "mood-btn on" : "mood-btn"}
            onClick={() => setMood(face)}
          >
            {face}
          </button>
        ))}
      </div>

      <input
        className="input"
        value={text}
        placeholder="오늘 어땠는지 한 줄로 적어 보세요"
        onChange={(e) => setText(e.target.value)}
      />

      <button className="save-btn">저장하기</button>
    </div>
  );
}
`;

const APP_STEP10 = `import { useState } from "react";
import Nav from "./components/Nav";
import TodayPage from "./pages/TodayPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  const [page, setPage] = useState("today");
  const [diaries, setDiaries] = useState([]);

  function addDiary(mood, text) {
    const newDiary = {
      id: Date.now(),
      mood: mood,
      text: text,
      date: new Date().toLocaleDateString(),
    };
    setDiaries([newDiary, ...diaries]);
  }

  return (
    <div className="app">
      <h1>오늘의 기분 일기</h1>
      <Nav page={page} setPage={setPage} />
      {page === "today" && <TodayPage addDiary={addDiary} />}
      {page === "about" && <AboutPage />}
    </div>
  );
}
`;

const TODAY_STEP10 = `import { useState } from "react";

const MOODS = ["😀", "🙂", "😐", "😢", "😡"];

export default function TodayPage({ addDiary }) {
  const [mood, setMood] = useState("");
  const [text, setText] = useState("");

  function handleSave() {
    if (mood === "") return;
    addDiary(mood, text);
    setMood("");
    setText("");
  }

  return (
    <div className="page">
      <h2>오늘 기분은 어때요?</h2>

      <div className="mood-row">
        {MOODS.map((face) => (
          <button
            key={face}
            className={mood === face ? "mood-btn on" : "mood-btn"}
            onClick={() => setMood(face)}
          >
            {face}
          </button>
        ))}
      </div>

      <input
        className="input"
        value={text}
        placeholder="오늘 어땠는지 한 줄로 적어 보세요"
        onChange={(e) => setText(e.target.value)}
      />

      <button className="save-btn" onClick={handleSave}>
        저장하기
      </button>
    </div>
  );
}
`;

const LIST_PAGE = `export default function ListPage({ diaries }) {
  return (
    <div className="page">
      <h2>지난 기록</h2>

      <ul className="diary-list">
        {diaries.map((diary) => (
          <li key={diary.id} className="diary">
            <span className="diary-face">{diary.mood}</span>
            <span className="diary-text">
              {diary.text}
              <span className="diary-date">{diary.date}</span>
            </span>
          </li>
        ))}
      </ul>

      {diaries.length === 0 && (
        <p className="empty">아직 적은 기록이 없어요 🙂</p>
      )}
    </div>
  );
}
`;

const APP_STEP11 = `import { useState } from "react";
import Nav from "./components/Nav";
import TodayPage from "./pages/TodayPage";
import ListPage from "./pages/ListPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  const [page, setPage] = useState("today");
  const [diaries, setDiaries] = useState([]);

  function addDiary(mood, text) {
    const newDiary = {
      id: Date.now(),
      mood: mood,
      text: text,
      date: new Date().toLocaleDateString(),
    };
    setDiaries([newDiary, ...diaries]);
  }

  return (
    <div className="app">
      <h1>오늘의 기분 일기</h1>
      <Nav page={page} setPage={setPage} />
      {page === "today" && <TodayPage addDiary={addDiary} />}
      {page === "list" && <ListPage diaries={diaries} />}
      {page === "about" && <AboutPage />}
    </div>
  );
}
`;

const APP_STEP12 = `import { useState } from "react";
import Nav from "./components/Nav";
import TodayPage from "./pages/TodayPage";
import ListPage from "./pages/ListPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  const [page, setPage] = useState("today");
  const [diaries, setDiaries] = useState([]);

  function addDiary(mood, text) {
    const newDiary = {
      id: Date.now(),
      mood: mood,
      text: text,
      date: new Date().toLocaleDateString(),
    };
    setDiaries([newDiary, ...diaries]);
  }

  function removeDiary(id) {
    setDiaries(diaries.filter((diary) => diary.id !== id));
  }

  return (
    <div className="app">
      <h1>오늘의 기분 일기</h1>
      <Nav page={page} setPage={setPage} />
      {page === "today" && <TodayPage addDiary={addDiary} />}
      {page === "list" && (
        <ListPage diaries={diaries} removeDiary={removeDiary} />
      )}
      {page === "about" && <AboutPage />}
    </div>
  );
}
`;

const LIST_STEP12 = `export default function ListPage({ diaries, removeDiary }) {
  return (
    <div className="page">
      <h2>지난 기록</h2>

      <ul className="diary-list">
        {diaries.map((diary) => (
          <li key={diary.id} className="diary">
            <span className="diary-face">{diary.mood}</span>
            <span className="diary-text">
              {diary.text}
              <span className="diary-date">{diary.date}</span>
            </span>
            <button
              className="del-btn"
              onClick={() => removeDiary(diary.id)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>

      {diaries.length === 0 && (
        <p className="empty">아직 적은 기록이 없어요 🙂</p>
      )}
    </div>
  );
}
`;

const LIST_FINAL = `export default function ListPage({ diaries, removeDiary }) {
  const best = diaries.filter((diary) => diary.mood === "😀").length;

  return (
    <div className="page">
      <h2>지난 기록</h2>
      <p className="empty">
        모두 {diaries.length}개 · 기분 좋은 날 {best}개
      </p>

      <ul className="diary-list">
        {diaries.map((diary) => (
          <li key={diary.id} className="diary">
            <span className="diary-face">{diary.mood}</span>
            <span className="diary-text">
              {diary.text}
              <span className="diary-date">{diary.date}</span>
            </span>
            <button
              className="del-btn"
              onClick={() => removeDiary(diary.id)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>

      {diaries.length === 0 && (
        <p className="empty">아직 적은 기록이 없어요 🙂</p>
      )}
    </div>
  );
}
`;

/* ────────────────────────────────────────────────────────────
 * 코스 본체
 * ──────────────────────────────────────────────────────────── */
export const reactMoodCourse: Course = {
  id: "react-mood",
  track: "react",
  title: "오늘의 기분 일기 만들기",
  subtitle: "얼굴로 기분을 고르고 한 줄로 남기는 3페이지 앱",
  level: "왕초보",
  duration: "약 80분",
  pages: ["오늘", "기록", "소개"],
  template: "react",

  stages: [
    {
      id: "topic",
      no: 1,
      title: "주제 정하기",
      summary: "왜 「기분 일기」로 정했는지 알아봐요",
      tier: "free",
      goal: "무엇을 만들지 한 문장으로 말할 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "이번에 만들 것은 「오늘의 기분 일기」예요. 얼굴 버튼으로 오늘 기분을 고르고, 한 줄을 적어 남기고, 지난 기록을 모아 보는 앱입니다.",
        },
        {
          kind: "why",
          text: "왜 기분 일기일까요? 첫째, 쓸 내용이 아주 짧아요. 긴 글을 쓰는 앱은 만들기도 어렵고 쓰기도 부담스럽습니다. 한 줄이면 누구나 씁니다.",
        },
        {
          kind: "why",
          text: "둘째, 프로그램의 기본이 다 들어 있어요. 고르기(선택), 적기(입력), 쌓기(저장), 보기(목록), 지우기(삭제). 앱 대부분이 결국 이 다섯 가지입니다.",
        },
        {
          kind: "what",
          text: "셋째, 화면이 3개로 자연스럽게 나뉘어요. 「오늘」 화면, 「기록」 화면, 「소개」 화면. 페이지를 오가는 방법까지 한 번에 익힙니다.",
        },
        {
          kind: "tip",
          text: "첫 앱 주제를 고르는 기준 — ① 내가 매일 쓸 만한가 ② 화면이 3개 안쪽인가 ③ 한 문장으로 설명되는가. 셋 다 O 면 좋은 주제예요.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 만들고 나서 어떻게 알릴지, 홍보 방법부터 정합니다. 만들기 전에 알릴 방법을 아는 게 순서예요.",
        },
      ],
      practiceLabel: "아래 문장을 따라 쳐 보세요 — 우리의 목표 한 줄이에요",
      practiceText:
        "나는 오늘 기분을 얼굴로 고르고, 한 줄을 적어 남기고, 지난 기록을 볼 수 있는 앱을 만든다.",
    },

    {
      id: "promo",
      no: 2,
      title: "홍보 방법 배우기",
      summary: "만들기 전에 「어떻게 알릴지」부터 정해요",
      tier: "free",
      goal: "내 앱을 알리는 방법을 알고, 그중 2가지를 고를 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "다 만들고 나서 「이제 어떻게 알리지?」를 고민하면 늦습니다. 알릴 방법을 먼저 정하면, 만들 때 그 방법에 맞게 만들 수 있어요.",
        },
        {
          kind: "what",
          text: "기분 일기는 특히 「기록이 쌓인 화면」이 잘 먹힙니다. 한 달치 기분이 이모지로 죽 늘어선 화면은 그 자체로 볼거리예요. 그래서 기록 화면을 예쁘게 만들 겁니다.",
        },
        {
          kind: "what",
          text: "아래 카드에 방법 6가지를 정리했어요. 각각 사람의 마음을 다르게 건드립니다.",
        },
        {
          kind: "tip",
          text: "처음 고르기 좋은 조합은 ①「30일 기록 챌린지 올리기」 + ②「친구에게 링크 보내기」예요. 둘 다 공짜이고 완성 전부터 시작할 수 있습니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 이미 있는 비슷한 앱들과 비교해서 「우리만의 한 가지」를 정합니다.",
        },
      ],
      cards: [
        {
          title: "① 30일 기록 챌린지 올리기",
          body: "내 앱으로 30일 동안 기분을 기록하고, 그 화면을 매주 올립니다.",
          picked: true,
          note: "심리 레버 — 사람은 쌓여 가는 것을 보면 결말이 궁금해집니다.",
        },
        {
          title: "② 친구에게 링크 보내기",
          body: "완성 즉시 친구 10명에게 링크를 보내고 옆에서 쓰는 걸 봅니다.",
          picked: true,
          note: "어디서 헤매는지 5분이면 다 보입니다. 광고보다 훨씬 셉니다.",
        },
        {
          title: "③ 인스타그램 / 스레드",
          body: "이모지가 늘어선 기록 화면을 캡처해 카드 3~5장으로.",
          note: "그림이 예쁜 앱은 캡처 한 장이 설명보다 낫습니다.",
        },
        {
          title: "④ 커뮤니티에 글 올리기",
          body: "디스콰이엇·커리어리 같은 곳에 「처음 만든 앱」으로 올립니다.",
          note: "제목에 '처음'을 넣으면 응원 댓글이 붙습니다.",
        },
        {
          title: "⑤ 검색에 걸리게 하기 (SEO)",
          body: "SEO(에스이오 — 검색 엔진 최적화)는 검색했을 때 위에 뜨게 만드는 일이에요. 제목·설명을 잘 적는 것부터 시작합니다.",
          note: "느리지만 한 번 걸리면 계속 들어옵니다.",
        },
        {
          title: "⑥ 광고 (돈 쓰기)",
          body: "돈을 내고 노출합니다. CPC(씨피씨 — 클릭 한 번당 드는 돈)가 한국 인스타 기준 대략 ₩300~800.",
          note: "맨 마지막에 씁니다. 앞의 다섯을 다 해 보고도 부족할 때만.",
        },
      ],
      practiceLabel: "내가 고른 홍보 방법 2가지를 따라 쳐 보세요",
      practiceText:
        "나는 30일 기록 챌린지 올리기와 친구에게 링크 보내기로 내 앱을 알린다.",
    },

    {
      id: "plan",
      no: 3,
      title: "기획하기",
      summary: "이미 있는 앱들과 비교해 「우리만의 한 가지」를 정해요",
      tier: "free",
      goal: "화면 3개와 기능 4개를 종이에 적을 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "기획은 결국 「무엇을 만들고, 무엇을 안 만들지 정하는 일」이에요. 안 만들 것을 정하는 쪽이 더 중요합니다.",
        },
        {
          kind: "what",
          text: "세상에 이미 있는 기록 앱들을 봅시다. 아래 카드에 비교해 뒀어요. 다들 좋은 앱이지만 처음 만들기엔 기능이 너무 많습니다.",
        },
        {
          kind: "what",
          text: "우리만의 한 가지는 「3초 안에 기록 끝」이에요. 얼굴 한 번, 한 줄, 저장. 로그인도 설정도 없습니다.",
        },
        {
          kind: "what",
          text: "만들 화면은 3개로 못 박습니다. ①오늘 — 고르고 적는 곳. ②기록 — 지난 것을 보는 곳. ③소개 — 이 앱이 뭔지 알려주는 곳.",
        },
        {
          kind: "what",
          text: "기능도 4개로 못 박습니다. 기분 고르기 / 한 줄 저장 / 목록 보기 / 삭제. 사진, 날씨, 알림, 달력은 전부 「나중에」로 보냅니다.",
        },
        {
          kind: "tip",
          text: "처음 만들 때 가장 많이 실패하는 이유가 「기능을 너무 많이 넣어서」예요. 기능 4개짜리 완성작이 기능 20개짜리 미완성보다 낫습니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 이 3개 화면을 어떻게 꾸밀지 정합니다.",
        },
      ],
      cards: [
        {
          title: "노션 (Notion)",
          body: "표·문서·기록을 한 곳에서. 어른들이 많이 씁니다.",
          note: "배우는 데만 며칠 걸려요. 우리는 배울 게 0이어야 합니다.",
        },
        {
          title: "아이폰 「일기」 앱",
          body: "사진·위치까지 자동으로 붙는 일기장.",
          note: "아이폰에만 있어요. 우리는 웹으로 만들어 어디서든 되게 합니다.",
        },
        {
          title: "종이 다이어리",
          body: "가장 자유롭고, 쓰는 맛이 있습니다.",
          note: "찾아보기가 어렵고 들고 다녀야 해요. 우리는 링크 하나면 끝.",
        },
        {
          title: "🎯 우리 앱 — 「오늘의 기분」",
          body: "얼굴 고르고 한 줄 적고 저장. 3초면 끝납니다.",
          picked: true,
          note: "우리만의 한 가지 = 「3초 안에 기록 끝」. 이거 하나만 남기고 다 버립니다.",
        },
      ],
      practiceLabel: "우리가 만들 화면과 기능을 따라 쳐 보세요",
      practiceText: `화면 3개: 오늘 / 기록 / 소개
기능 4개: 기분 고르기 / 한 줄 저장 / 목록 보기 / 삭제
우리만의 한 가지: 3초 안에 기록 끝
나중에 할 것: 사진, 날씨, 알림, 달력`,
    },

    {
      id: "design",
      no: 4,
      title: "디자인하기",
      summary: "색과 크기 규칙을 정해요",
      tier: "free",
      goal: "우리 앱의 색·모서리·글자 크기를 정하게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "디자인은 「예쁘게」가 아니라 「헷갈리지 않게」예요. 누를 것이 눌러 보이고, 중요한 게 크면 좋은 디자인입니다.",
        },
        {
          kind: "what",
          text: "기분 일기는 따뜻한 느낌이 어울려요. 그래서 주황을 메인으로 씁니다. 메인 주황(#f97316), 진한 주황(#c2410c), 배경은 아주 연한 살구색(#fff7ed).",
        },
        {
          kind: "what",
          text: "색은 3개면 충분합니다. 4개가 넘어가면 촌스러워져요. 우리 앱은 주황 계열 3개로 끝냅니다.",
        },
        {
          kind: "what",
          text: "얼굴 버튼은 크게 만듭니다. 글자 28px. 손가락으로 누르는 것이라 작으면 바로 짜증이 나요.",
        },
        {
          kind: "what",
          text: "모서리는 둥글게. 버튼은 10~12px, 카드는 16px. 각진 것보다 둥근 게 친근합니다. 가장 작은 글자는 12px(날짜)로 제한합니다.",
        },
        {
          kind: "tip",
          text: "GPT 에게 물을 땐 구체적으로 — 「기분 일기 앱인데 메인색 주황 #f97316 쓸 거야. 어울리는 배경색이랑 진한색 hex 코드로 알려줘」. 이러면 바로 쓸 수 있는 답이 나옵니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 무슨 코드로, 어디에 올릴지 정합니다.",
        },
      ],
      practiceLabel: "우리 앱의 디자인 규칙을 따라 쳐 보세요",
      practiceText: `메인색: #f97316 (주황)
진한색: #c2410c (진한 주황)
배경색: #fff7ed (연한 살구)
버튼 모서리: 10px / 카드 모서리: 16px
얼굴 버튼 글자: 28px`,
    },

    {
      id: "stack",
      no: 5,
      title: "구현 방법 정하기",
      summary: "무슨 코드로, 어느 서버에 올릴지 골라요",
      tier: "free",
      goal: "React 와 Vercel 을 고른 이유를 설명할 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "같은 앱도 만드는 방법이 여럿이에요. 요리로 치면 「무슨 재료로, 어느 주방에서」를 정하는 단계입니다.",
        },
        {
          kind: "what",
          text: "코드는 React(리액트)를 씁니다. 화면을 「부품」으로 쪼개 만들 수 있어서, 메뉴 부품·기록 부품처럼 나눠 두면 고치기가 쉬워요.",
        },
        {
          kind: "what",
          text: "React 의 진짜 장점은 「데이터가 바뀌면 화면이 알아서 바뀐다」는 겁니다. 기록을 하나 저장하면 목록도 개수도 저절로 새로 그려져요.",
        },
        {
          kind: "what",
          text: "올리는 곳은 Vercel(버셀). 공짜이고, 깃허브에 코드만 올리면 자동으로 인터넷 주소가 생깁니다. 지금 보고 있는 이 사이트도 Vercel 에 올라가 있어요.",
        },
        {
          kind: "tip",
          text: "고르는 기준은 3개 — ① 공짜인가 ② 한국어 자료가 많은가 ③ 나중에 회사에서도 쓰는가. React + Vercel 은 셋 다 O 입니다.",
        },
        {
          kind: "next",
          text: "여기까지가 준비 단계예요. 다음 6단계부터가 진짜 따라하기입니다.",
        },
      ],
      practiceLabel: "우리가 고른 구현 방법을 따라 쳐 보세요",
      practiceText: `코드: React (화면을 부품으로 쪼갤 수 있어서)
서버: Vercel (무료 + 깃허브 올리면 자동 배포)
저장: 브라우저 안에만 (로그인 없이 쓰려고)`,
    },

    {
      id: "build",
      no: 6,
      title: "따라하기",
      summary: "제가 먼저 만들면, 오른쪽에서 똑같이 따라 만들어요",
      tier: "free",
      goal: "12개 스텝을 거쳐 3페이지짜리 기분 일기 앱을 완성합니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "여기서부터가 진짜입니다. 제가 왼쪽에서 파일을 만들고 설명하면, 오른쪽에서 똑같은 파일을 만들고 코드를 칩니다.",
        },
        {
          kind: "what",
          text: "미리보기 창에는 지금 만든 앱이 실시간으로 돌아갑니다. 코드를 고치면 바로 바뀌어요.",
        },
        {
          kind: "tip",
          text: "직접 치는 게 제일 잘 남습니다. 너무 길면 「붙여넣기」를 눌러도 괜찮아요. 중요한 건 멈추지 않는 겁니다.",
        },
        {
          kind: "next",
          text: "스텝이 끝나면 7단계에서 인터넷에 올려 친구에게 링크를 보냅니다.",
        },
      ],
    },

    {
      id: "deploy",
      no: 7,
      title: "배포하기",
      summary: "인터넷에 올려서 친구에게 링크를 보내요",
      tier: "free",
      goal: "내 앱이 진짜 인터넷 주소를 갖게 됩니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "다 만들었으면 세상에 내놓을 차례예요. 내 컴퓨터에서만 도는 앱과, 친구가 링크로 여는 앱은 완전히 다른 물건입니다.",
        },
        {
          kind: "why",
          text: "배포(deploy)란 내가 만든 파일을 인터넷 어딘가의 컴퓨터(=서버)에 올려 두는 일이에요. 그러면 주소만 알면 누구나 열 수 있습니다.",
        },
        {
          kind: "what",
          text: "5단계에서 정한 대로 Vercel 에 올립니다. 깃허브에 코드를 올리고, Vercel 이 그걸 가져가 주소를 만들어 주는 순서예요.",
        },
        {
          kind: "tip",
          text: "겁먹지 마세요. 아래 5개 카드를 순서대로 따라 하면 됩니다. 하나가 5분 안쪽이에요.",
        },
        {
          kind: "next",
          text: "주소가 생기면 2단계에서 정한 홍보 방법대로 친구에게 보내 보세요.",
        },
      ],
    },
  ],

  /* ── 6단계 따라하기 스텝 12개 ────────────────────── */
  buildSteps: [
    {
      id: "m0",
      title: "1. 프로젝트 만들기 (설치)",
      goal: "이제 빈 폴더에 React 앱의 뼈대 파일들을 한 번에 만들 겁니다.",
      why: "React 앱은 파일을 하나하나 손으로 만들지 않아요. 준비물이 너무 많거든요. 그래서 「뼈대를 만들어 주는 도구」에게 시킵니다.",
      what: "터미널(명령 프롬프트)에 명령어 네 줄을 칩니다. npm 은 필요한 부품을 인터넷에서 받아다 깔아 주는 프로그램이에요. 한 줄씩 치면서 무엇이 생기는지 눈으로 확인하세요.",
      where: "오른쪽 「내 차례」 칸의 검은 터미널 상자에 한 줄씩 칩니다. 엔터를 누르면 그 줄이 만드는 것이 「내 폴더」에 하나씩 나타납니다.",
      result:
        "명령어 네 줄로 React 앱의 뼈대 파일(index.js·App.js·styles.css)과 부품들을 자동으로 깔고 앱까지 켰어요. 손으로 파일 하나 안 만들었는데 시작 준비가 끝났습니다.",
      next: "도구가 만들어 준 App.js 안에는 연습용 코드가 들어 있어요. 다음 단계에서 우리 앱 코드로 바꿉니다.",
      prereq: {
        reassure:
          "연습 시 준비물은 없어요. 오른쪽 검은 입력창은 터미널을 흉내 내는 겁니다.",
        moreTitle: "진짜 내 컴퓨터에서 직접 해보려면?",
        more: [
          {
            label: "1) Node.js 깔기",
            body: "nodejs.org 에서 「LTS」 버튼을 눌러 받은 뒤 다음-다음 눌러 설치하면 돼요. npm 은 같이 들어 있습니다.",
          },
          {
            label: "2) 터미널 열기",
            body: "윈도우는 검색창에 cmd, 맥은 ⌘+스페이스에 terminal 을 치고 엔터하면 검은 창이 떠요.",
          },
          {
            label: "3) 잘 깔렸는지 확인",
            body: "그 창에 node -v 를 치고 엔터. 숫자가 나오면 준비 끝입니다.",
          },
        ],
      },
      scaffold: {
        note: "실제 컴퓨터에서도 이 네 줄을 위에서부터 차례로 칩니다.",
        lines: [
          {
            text: "npm create vite@latest my-mood-app -- --template react",
            does: "「my-mood-app 이라는 폴더를 만들고, 그 안에 React 앱 뼈대를 깔아 줘」라는 뜻이에요. vite(비트)는 뼈대를 만들어 주는 도구 이름입니다.",
            output: [
              "React 뼈대를 만드는 중…",
              "my-mood-app 폴더를 만들었어요.",
              "파일 3개를 넣었어요.",
            ],
            creates: ["/index.js", "/App.js", "/styles.css"],
            bubble:
              "방금 그 명령어로 파일 3개가 생겼어요! 「내 폴더」에 index.js · App.js · styles.css 가 보이죠? 생성된 파일을 클릭하면 소스코드를 확인할 수 있어요.",
          },
          {
            text: "cd my-mood-app",
            does: "방금 만든 폴더 안으로 들어가는 명령이에요. cd 는 change directory(폴더 바꾸기)의 줄임말입니다.",
            output: [
              "이제 my-mood-app 폴더 안에서 일합니다.",
              "생기는 파일은 없어요. 자리만 옮긴 거예요.",
            ],
            bubble:
              "방금은 폴더 안으로 들어온 것뿐이에요. 새로 생긴 파일은 없어요 — 작업할 자리만 옮긴 거예요.",
          },
          {
            text: "npm install",
            does: "앱이 돌아가려면 남이 만들어 둔 부품이 잔뜩 필요해요. 그 부품들을 인터넷에서 받아다 깔아 주는 명령입니다.",
            output: [
              "부품을 내려받는 중…",
              "부품 214개를 깔았어요.",
              "node_modules 라는 부품 상자가 생겼어요.",
            ],
            effect: "install",
            bubble:
              "리액트 개발에 필요한 부품 파일 214개를 받아왔어요! node_modules 라는 상자에 담겨서 「내 폴더」 목록엔 안 보이지만, 앱은 이 부품들로 돌아가요.",
          },
          {
            text: "npm run dev",
            does: "앱에 전원을 켜는 명령이에요. 주소가 뜨면 그 주소로 내 앱을 볼 수 있습니다.",
            output: [
              "앱을 켜는 중…",
              "준비 완료 (398ms)",
              "주소: http://localhost:5173/",
            ],
            effect: "serve",
            bubble:
              "앱에 전원이 켜졌어요! 이제 「미리보기」 화면이 시작돼요 → 코드를 고칠 때마다 저기가 같이 바뀝니다.",
          },
        ],
      },
      files: [
        {
          path: "/index.js",
          action: "create",
          code: SCAFFOLD["/index.js"],
          hint: "앱을 화면에 처음 붙이는 파일. 도구가 만들어 준 거라 당분간 건드릴 일이 없어요.",
        },
        {
          path: "/App.js",
          action: "create",
          code: SCAFFOLD["/App.js"],
          hint: "도구가 넣어 준 연습용 코드예요. 다음 단계에서 지우고 우리 코드를 넣습니다.",
        },
        {
          path: "/styles.css",
          action: "create",
          code: SCAFFOLD["/styles.css"],
          hint: "꾸미기 파일. 역시 도구가 기본만 넣어 둔 상태예요.",
        },
      ],
    },
    {
      id: "m1",
      title: "2. 첫 화면 띄우기",
      goal: "이제 미리보기에 「오늘의 기분 일기」라는 제목을 띄울 겁니다.",
      why: "코딩은 항상 「일단 뭐라도 화면에 뜨게」부터 시작해요. 화면이 뜨면 연결이 잘 됐다는 뜻입니다.",
      what: "도구가 만들어 준 App.js 를 열어서, 안에 있던 연습용 코드를 지우고 우리 앱 코드로 바꿉니다.",
      where: "오른쪽 「내 폴더」의 파일 목록에서 App.js 를 누르고, 안에 있던 내용을 전부 지운 다음 새 코드를 넣으세요.",
      result:
        "App.js 의 연습용 코드를 지우고 우리 코드로 바꿔서, 화면에 「오늘의 기분 일기」 제목이 떴어요. 여기서부터가 진짜 내가 쓴 코드입니다.",
      next: "다음에는 이 밋밋한 화면에 색을 입힐 거예요.",
      files: [
        {
          path: "/App.js",
          action: "edit",
          code: APP_STEP1,
          hint: "function 앞의 export default 는 「이 부품을 밖에서 쓸 수 있게 내보낸다」는 뜻이에요.",
        },
      ],
    },
    {
      id: "m2",
      title: "3. 색 입히기",
      goal: "이제 배경을 연한 살구색으로, 제목을 주황색으로 바꿀 겁니다.",
      why: "4단계에서 정한 색 규칙을 코드로 옮기는 일이에요. 디자인은 나중이 아니라 처음부터 같이 갑니다.",
      what: "styles.css 에 배경색, 글꼴, 제목 색을 적습니다. CSS(씨에스에스)는 화면을 꾸미는 언어예요.",
      where: "오른쪽 「내 폴더」의 파일 목록에서 styles.css 를 누르고, 아래 코드를 전부 넣으세요.",
      result:
        "styles.css 에 색과 글꼴을 적어서, 밋밋하던 화면이 우리 앱의 색(살구 배경·주황 제목)으로 바뀌었어요.",
      next: "다음에는 첫 번째 페이지인 「소개」 화면을 만들 거예요.",
      files: [
        {
          path: "/styles.css",
          action: "edit",
          code: CSS_BASIC,
          hint: 'className="app" 이라고 쓴 곳이 CSS 의 .app 과 연결돼요. 점(.)은 「이름표」라는 뜻입니다.',
        },
      ],
    },
    {
      id: "m3",
      title: "4. pages 폴더와 소개 페이지 만들기",
      goal: "이제 pages 폴더 안에 AboutPage.js 라는 새 파일을 만들 겁니다.",
      why: "화면이 3개니까 파일도 3개예요. 파일이 늘면 폴더로 정리해야 나중에 안 헤맵니다.",
      what: "pages 라는 폴더를 만들고, 그 안에 AboutPage.js 파일을 만듭니다.",
      where: "「내 폴더」에서 폴더 추가 버튼으로 pages 를 만들고, 폴더 옆 ＋파일 로 AboutPage.js 를 추가한 뒤 코드를 넣으세요.",
      result:
        "pages 폴더를 만들고 그 안에 소개 페이지 파일(AboutPage.js)을 만들었어요. 화면이 늘어날 때 폴더로 정리하는 습관의 시작입니다.",
      next: "다음에는 방금 만든 소개 페이지를 App.js 에서 불러올 거예요.",
      createFolders: ["/pages"],
      files: [
        {
          path: "/pages/AboutPage.js",
          action: "create",
          code: ABOUT_PAGE,
          hint: "파일 이름 첫 글자는 대문자로! React 는 대문자로 시작하는 것만 「부품」으로 알아봅니다.",
        },
      ],
    },
    {
      id: "m4",
      title: "5. 소개 페이지 불러오기",
      goal: "이제 미리보기에 소개 페이지 내용을 띄울 겁니다.",
      why: "파일을 만들기만 하면 화면에 안 나와요. 「이 부품을 여기다 붙여줘」라고 말해 줘야 합니다. 그게 import(임포트 — 불러오기)예요.",
      what: "App.js 맨 위에 import 한 줄을 넣고, 화면 안에 <AboutPage /> 를 붙입니다.",
      where: "App.js 파일 맨 첫 줄에 import 를 넣고, <h1> 아래에 <AboutPage /> 를 넣으세요.",
      result:
        "App.js 에서 import 로 소개 페이지를 불러와 화면에 붙였어요. 파일은 만들기만 하면 안 나오고, 불러와야 보인다는 걸 확인했습니다.",
      next: "다음에는 페이지를 갈아 끼울 수 있게 위쪽 메뉴 버튼을 만들 거예요.",
      files: [
        {
          path: "/App.js",
          action: "edit",
          code: APP_STEP4,
          hint: "./pages/AboutPage 에서 점 하나(.)는 「지금 이 폴더」라는 뜻이에요.",
        },
      ],
    },
    {
      id: "m5",
      title: "6. 메뉴 버튼 만들기",
      goal: "이제 「오늘 / 기록 / 소개」 버튼 3개를 나란히 만들 겁니다.",
      why: "화면 3개를 오갈 방법이 있어야죠. 메뉴는 여러 화면에서 똑같이 쓰이니까 따로 부품으로 빼 둡니다.",
      what: "components 폴더를 만들고 Nav.js 파일을 만듭니다. Nav 는 navigation(내비게이션 — 길 안내)의 줄임말이에요.",
      where: "components 폴더를 만들고 그 안에 Nav.js 를 추가한 뒤 코드를 넣으세요. CSS 도 함께 채웁니다.",
      result:
        "components 폴더에 Nav 부품을 만들어 「오늘 / 기록 / 소개」 버튼 3개가 나란히 생겼어요. 여러 화면에서 다시 쓸 메뉴를 부품으로 빼 뒀습니다.",
      next: "다음에는 이 버튼을 눌렀을 때 화면이 바뀌게 만들 거예요.",
      createFolders: ["/components"],
      files: [
        {
          path: "/components/Nav.js",
          action: "create",
          code: NAV,
          hint: "map 은 「목록을 하나씩 돌면서 화면을 만든다」는 뜻이에요. 메뉴 3개를 손으로 3번 안 쓰고 한 번에 만듭니다.",
        },
        {
          path: "/styles.css",
          action: "edit",
          code: CSS_FULL,
          hint: "앞으로 쓸 꾸미기 코드를 미리 다 넣어 둡니다. 부품을 만들 때마다 예쁘게 나와요.",
        },
      ],
    },
    {
      id: "m6",
      title: "7. 버튼 누르면 화면 바뀌게 하기",
      goal: "이제 메뉴를 누르면 눌린 버튼에 주황색이 칠해지게 할 겁니다.",
      why: "여기서 React 의 핵심인 상태(state, 스테이트)를 처음 씁니다. 상태란 「지금 어떤 상황인지 기억하는 메모지」예요.",
      what: "App.js 에서 useState 로 지금 보고 있는 페이지 이름을 기억하게 하고, 그 값을 Nav 에 넘겨줍니다.",
      where: "App.js 맨 위에 import { useState } 를 넣고, 함수 안 첫 줄에 useState 를 씁니다.",
      result:
        "useState 로 지금 보는 페이지를 기억하게 하고 Nav 에 넘겨줘서, 버튼을 누르면 그 버튼에 색이 칠해져요. React 의 핵심인 상태(state)를 처음 써 봤습니다.",
      next: "다음에는 주인공인 「오늘」 페이지를 만들 거예요.",
      files: [
        {
          path: "/App.js",
          action: "edit",
          code: APP_STEP6,
          hint: "const [page, setPage] — page 는 지금 값, setPage 는 값을 바꾸는 버튼이라고 생각하세요.",
        },
      ],
    },
    {
      id: "m7",
      title: "8. 오늘 페이지 만들기",
      goal: "이제 「오늘」 버튼을 누르면 「오늘 기분은 어때요?」 화면이 뜨게 할 겁니다.",
      why: "큰 걸 한 번에 만들면 어디가 틀렸는지 못 찾아요. 껍데기부터 만들고 안을 채웁니다.",
      what: "pages 폴더에 TodayPage.js 를 만들고, App.js 에서 불러옵니다.",
      where: "pages 폴더 옆 ＋파일 로 TodayPage.js 를 추가하고, App.js 의 import 와 화면 부분을 고치세요.",
      result:
        "TodayPage 껍데기를 만들고 App 에서 불러와서, 「오늘」 버튼을 누르면 그 화면이 떠요. 큰 기능을 껍데기부터 만드는 방식을 익혔습니다.",
      next: "다음에는 이 화면에 얼굴 버튼을 넣을 거예요.",
      files: [
        {
          path: "/pages/TodayPage.js",
          action: "create",
          code: TODAY_STEP7,
          hint: "일단 제목만. 안은 다음 스텝부터 하나씩 채웁니다.",
        },
        {
          path: "/App.js",
          action: "edit",
          code: APP_STEP7,
          hint: '처음 켰을 때 「오늘」 화면이 보이도록 useState("today") 로 바꿨어요.',
        },
      ],
    },
    {
      id: "m8",
      title: "9. 기분 고르기 만들기",
      goal: "이제 얼굴 버튼을 누르면 그 얼굴이 골라지게 할 겁니다.",
      why: "「여러 개 중 하나 고르기」는 앱에서 아주 많이 나와요. 고른 값을 상태에 담아 두면 화면이 알아서 그 값을 따라갑니다.",
      what: "얼굴 5개를 목록으로 두고 map 으로 버튼을 만든 뒤, 누른 얼굴을 mood 상태에 담습니다.",
      where: "TodayPage.js 를 통째로 아래 코드로 바꾸세요.",
      result:
        "얼굴 목록을 map 으로 버튼으로 만들고, 누른 얼굴을 mood 상태에 담았어요. 고른 버튼만 색이 바뀌는 것도 상태 덕분입니다.",
      next: "다음에는 한 줄 적는 입력창과 저장 버튼을 넣을 거예요.",
      files: [
        {
          path: "/pages/TodayPage.js",
          action: "edit",
          code: TODAY_STEP8,
          hint: "MOODS 는 얼굴 5개짜리 목록이에요. 화면에 쓸 값은 이렇게 위에 모아 두면 고치기 편합니다.",
        },
      ],
    },
    {
      id: "m9",
      title: "10. 한 줄 적기와 저장 버튼",
      goal: "이제 한 줄 입력창과 저장 버튼을 화면에 넣을 겁니다.",
      why: "기분만으로는 나중에 봤을 때 기억이 안 나요. 짧은 한 줄이 붙어야 기록이 됩니다.",
      what: "입력창을 넣고 친 글자를 text 상태에 담습니다. 저장 버튼도 자리만 먼저 만들어 둡니다.",
      where: "TodayPage.js 를 통째로 아래 코드로 바꾸세요.",
      result:
        "입력창과 저장 버튼을 넣고, 친 글자를 text 상태에 담았어요. 이제 화면에 필요한 것은 다 갖췄고 저장 기능만 남았습니다.",
      next: "다음에는 저장 버튼을 눌렀을 때 실제로 기록이 쌓이게 만들 거예요.",
      files: [
        {
          path: "/pages/TodayPage.js",
          action: "edit",
          code: TODAY_STEP9,
          hint: "onChange 는 「글자가 바뀔 때마다」라는 뜻. 한 글자 칠 때마다 실행됩니다.",
        },
      ],
    },
    {
      id: "m10",
      title: "11. 기록 저장하기",
      goal: "이제 저장 버튼을 누르면 기분과 한 줄이 하나로 묶여 쌓이게 할 겁니다.",
      why: "기록 목록은 「기록」 화면에서도 써야 해요. 여러 화면이 같이 쓰는 값은 위쪽(App.js)에 두는 게 규칙입니다.",
      what: "App.js 에 diaries 목록과 addDiary 함수를 만들고, TodayPage 에 내려 줍니다.",
      where: "App.js 를 먼저 고치고, 그 다음 TodayPage.js 를 고치세요. 순서가 중요합니다.",
      result:
        "App 에 diaries 목록과 addDiary 를 만들어 TodayPage 에 내려주고, 저장을 누르면 기분·한 줄·날짜가 한 덩어리로 쌓여요. 새것을 앞에 붙여서 최근 기록이 위로 옵니다.",
      next: "다음에는 쌓인 기록을 보여주는 「기록」 화면을 만들 거예요.",
      files: [
        {
          path: "/App.js",
          action: "edit",
          code: APP_STEP10,
          hint: "[newDiary, ...diaries] 는 「새것을 맨 앞에 붙이기」예요. 그래서 최근 기록이 위에 옵니다.",
        },
        {
          path: "/pages/TodayPage.js",
          action: "edit",
          code: TODAY_STEP10,
          hint: "{ addDiary } 처럼 중괄호로 받는 걸 props(프롭스 — 위에서 내려준 값)라고 불러요.",
        },
      ],
    },
    {
      id: "m11",
      title: "12. 기록 페이지 만들기",
      goal: "이제 「기록」 버튼을 누르면 지난 기록이 목록으로 나오게 할 겁니다.",
      why: "쌓기만 하고 볼 수 없으면 소용이 없어요. 목록을 화면으로 바꾸는 건 언제나 map 입니다.",
      what: "pages 폴더에 ListPage.js 를 만들고, App.js 에서 diaries 를 넘겨 줍니다.",
      where: "pages 폴더 옆 ＋파일 로 ListPage.js 를 만들고, App.js 의 import 와 화면 부분을 고치세요.",
      result:
        "ListPage 를 만들어 diaries 를 map 으로 그려서, 저장한 기록이 얼굴·한 줄·날짜와 함께 줄줄이 나타나요. 드디어 앱처럼 보이기 시작했습니다.",
      next: "다음에는 필요 없어진 기록을 지우는 삭제 버튼을 만들 거예요.",
      files: [
        {
          path: "/pages/ListPage.js",
          action: "create",
          code: LIST_PAGE,
          hint: "key={diary.id} 는 React 가 목록을 구분하는 이름표예요. 빼먹으면 경고가 뜹니다.",
        },
        {
          path: "/App.js",
          action: "edit",
          code: APP_STEP11,
          hint: "화면이 3개가 됐어요. page 값에 따라 셋 중 하나만 보입니다.",
        },
      ],
    },
    {
      id: "m12",
      title: "13. 삭제하기",
      goal: "이제 삭제 버튼을 누르면 그 기록이 사라지게 할 겁니다.",
      why: "잘못 적은 기록을 지울 수 없으면 답답해요. 지우기까지 돼야 기록 앱이 완성됩니다.",
      what: "App.js 에 removeDiary 함수를 만들고, 목록 오른쪽에 삭제 버튼을 답니다.",
      where: "App.js 먼저, 그 다음 ListPage.js 순서로 고치세요.",
      result:
        "removeDiary 로 그 기록만 걸러내는 삭제 버튼을 달아서, 누르면 사라져요. 이걸로 만들기·보기·지우기가 다 됐습니다.",
      next: "다음이 마지막입니다. 기록을 한눈에 세어 주는 줄을 넣을 거예요.",
      files: [
        {
          path: "/App.js",
          action: "edit",
          code: APP_STEP12,
          hint: "filter 는 「조건에 맞는 것만 남기기」예요. 지울 것만 빼고 나머지를 남깁니다.",
        },
        {
          path: "/pages/ListPage.js",
          action: "edit",
          code: LIST_STEP12,
          hint: "삭제 버튼에 그 기록의 id 를 넘겨줘야 어떤 걸 지울지 알 수 있어요.",
        },
      ],
    },
    {
      id: "m13",
      title: "14. 개수 세어 보여주기 (마지막!)",
      goal: "이제 기록이 모두 몇 개인지, 기분 좋은 날은 몇 개인지 보여줄 겁니다.",
      why: "숫자 하나가 붙으면 앱이 갑자기 그럴듯해져요. 같은 데이터를 다른 방식으로 보여주는 연습이기도 합니다.",
      what: "ListPage 에서 filter 로 「😀 인 기록」만 세어 화면 위에 표시합니다.",
      where: "ListPage.js 를 통째로 아래 코드로 바꾸세요.",
      result:
        "filter 로 기분 좋은 날을 세어 전체 개수와 함께 보여줘서 3페이지 앱이 완성됐어요. 저장·목록·삭제·세기까지 전부 직접 만들었습니다!",
      next: "완성! 7단계로 넘어가서 인터넷에 올려 봅시다.",
      files: [
        {
          path: "/pages/ListPage.js",
          action: "edit",
          code: LIST_FINAL,
          hint: "🎉 filter 로 걸러낸 다음 .length 로 개수를 셉니다.",
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
        "압축을 풀어 두세요. 폴더 안에 App.js, styles.css 등이 보이면 성공이에요.",
      ],
    },
    {
      id: "d2",
      title: "2. 깃허브 계정 만들기",
      why: "깃허브(GitHub)는 전 세계 개발자들이 코드를 올려 두는 창고예요. Vercel 이 여기서 코드를 가져갑니다.",
      actions: [
        "github.com 에 들어가서 Sign up 을 누르세요.",
        "이메일·비밀번호로 계정을 만듭니다.",
        "가입이 끝나면 오른쪽 위 + 버튼 → New repository 를 누르세요.",
        "이름은 my-mood-app, Public 으로 두고 Create repository.",
      ],
      link: { label: "깃허브 열기", href: "https://github.com" },
    },
    {
      id: "d3",
      title: "3. 코드 올리기",
      why: "만든 파일들을 깃허브 창고에 넣는 단계예요. 명령어가 무서우면 끌어다 놓는 방법도 있습니다.",
      actions: [
        "쉬운 방법 — 저장소 화면에서 「uploading an existing file」 을 누르고 압축 푼 파일들을 끌어다 놓으세요.",
        "익숙해지면 아래 명령어가 빠릅니다. 폴더에서 터미널을 열고 한 줄씩 붙여넣기 하세요.",
        "맨 마지막 줄의 주소는 본인 저장소 주소로 바꿔야 합니다.",
      ],
      command: `git init
git add .
git commit -m "첫 커밋"
git branch -M main
git remote add origin https://github.com/내아이디/my-mood-app.git
git push -u origin main`,
    },
    {
      id: "d4",
      title: "4. Vercel 에 연결하기",
      why: "이제 Vercel 이 깃허브 창고를 지켜보다가, 코드가 올라오면 자동으로 인터넷 주소를 만들어 줍니다.",
      actions: [
        "vercel.com 에 들어가 「Continue with GitHub」 로 들어갑니다.",
        "Add New → Project 를 누르세요.",
        "방금 만든 my-mood-app 저장소를 고르고 Import.",
        "설정은 건드리지 말고 Deploy 를 누르세요. 1~2분 기다립니다.",
        "🎉 축하합니다! my-mood-app.vercel.app 같은 주소가 생겼어요.",
      ],
      link: { label: "Vercel 열기", href: "https://vercel.com" },
    },
    {
      id: "d5",
      title: "5. 친구에게 보내기",
      why: "2단계에서 정한 홍보 방법을 실제로 실행하는 순간이에요.",
      actions: [
        "생긴 주소를 복사하세요.",
        "친구에게 보내고, 옆에서 쓰는 모습을 지켜보세요.",
        "어디서 멈칫하는지 적어 두세요. 그게 다음에 고칠 목록입니다.",
        "30일 기록 챌린지를 시작해 보세요.",
      ],
    },
  ],

  starterFiles: {},
};
