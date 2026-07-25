import type { Course } from "../types";

/**
 * 샘플 1호 — React 로 만드는 「나의 할 일 앱」 (3페이지).
 *
 * 페이지: 할 일 / 통계 / 소개
 * 1~5단계는 읽고 따라 치는 학습, 6단계는 실제로 파일을 만들며 따라하기, 7단계는 배포.
 */

/* ────────────────────────────────────────────────────────────
 * 1단계에서 명령어를 실행하면 생기는 파일들.
 *
 * 실제로 `npm create vite` 가 만들어 주는 뼈대와 같은 역할이다.
 * 학생은 이걸 손으로 만들지 않는다 — 도구가 만들어 준다는 걸 몸으로 겪게 한다.
 * ──────────────────────────────────────────────────────────── */
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

/* ────────────────────────────────────────────────────────────
 * 따라하기 스텝마다 쓰이는 "완성 코드" 조각들
 * (각 스텝의 files.code 는 그 스텝이 끝났을 때의 파일 전체 내용)
 * ──────────────────────────────────────────────────────────── */

const CSS_BASIC = `body {
  margin: 0;
  background: #f5f0ff;
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
  color: #7030d4;
}
`;

const CSS_FULL = `body {
  margin: 0;
  background: #f5f0ff;
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
  color: #7030d4;
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
  border: 1px solid #dccafd;
  background: #ffffff;
  color: #7030d4;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
}

.nav-btn.on {
  background: #8a38f5;
  border-color: #8a38f5;
  color: #ffffff;
  font-weight: bold;
}

/* 페이지 상자 */
.page {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(138, 56, 245, 0.08);
}

/* 입력창 */
.input-row {
  display: flex;
  gap: 8px;
}

.input {
  flex: 1;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
}

.add-btn {
  padding: 12px 18px;
  border: none;
  border-radius: 10px;
  background: #8a38f5;
  color: #ffffff;
  font-size: 15px;
  cursor: pointer;
}

/* 할 일 목록 */
.todo-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
}

.todo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 4px;
  border-bottom: 1px solid #f3f4f6;
}

.todo label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.todo.done span {
  text-decoration: line-through;
  color: #9ca3af;
}

.del-btn {
  border: none;
  background: none;
  color: #d53a6b;
  font-size: 14px;
  cursor: pointer;
}

.empty {
  text-align: center;
  color: #9ca3af;
  padding: 24px 0;
}

/* 통계 */
.stat-row {
  display: flex;
  gap: 8px;
  margin: 16px 0;
}

.stat {
  flex: 1;
  background: #f5f0ff;
  border-radius: 12px;
  padding: 14px 0;
  text-align: center;
}

.stat b {
  display: block;
  font-size: 26px;
  color: #7030d4;
}

.stat span {
  font-size: 13px;
  color: #6b7280;
}

.bar {
  height: 12px;
  background: #ede4fe;
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(135deg, #8a38f5 0%, #d53a6b 100%);
  transition: width 0.3s;
}

.percent {
  text-align: center;
  font-weight: bold;
  color: #7030d4;
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

const ABOUT_PAGE = `export default function AboutPage() {
  return (
    <div className="page">
      <h2>이 앱은요</h2>
      <p>할 일을 적고, 다 하면 체크하는 앱이에요.</p>
      <ul className="about-list">
        <li>할 일을 적을 수 있어요</li>
        <li>다 한 일은 체크할 수 있어요</li>
        <li>몇 개나 했는지 볼 수 있어요</li>
      </ul>
      <p className="made-by">만든 사람: 나 🙋</p>
    </div>
  );
}
`;

const NAV = `export default function Nav({ page, setPage }) {
  const menus = [
    { id: "todo", name: "할 일" },
    { id: "stats", name: "통계" },
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

const APP_STEP1 = `export default function App() {
  return (
    <div className="app">
      <h1>나의 할 일 앱</h1>
      <p>여기에 하나씩 만들어 볼 거예요!</p>
    </div>
  );
}
`;

const APP_STEP4 = `import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <div className="app">
      <h1>나의 할 일 앱</h1>
      <AboutPage />
    </div>
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
      <h1>나의 할 일 앱</h1>
      <Nav page={page} setPage={setPage} />
      {page === "about" && <AboutPage />}
    </div>
  );
}
`;

const APP_STEP7 = `import { useState } from "react";
import Nav from "./components/Nav";
import TodoPage from "./pages/TodoPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  const [page, setPage] = useState("todo");

  return (
    <div className="app">
      <h1>나의 할 일 앱</h1>
      <Nav page={page} setPage={setPage} />
      {page === "todo" && <TodoPage />}
      {page === "about" && <AboutPage />}
    </div>
  );
}
`;

const APP_STEP9 = `import { useState } from "react";
import Nav from "./components/Nav";
import TodoPage from "./pages/TodoPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  const [page, setPage] = useState("todo");
  const [todos, setTodos] = useState([]);

  function addTodo(text) {
    const newTodo = { id: Date.now(), text: text, done: false };
    setTodos([...todos, newTodo]);
  }

  return (
    <div className="app">
      <h1>나의 할 일 앱</h1>
      <Nav page={page} setPage={setPage} />
      {page === "todo" && <TodoPage todos={todos} addTodo={addTodo} />}
      {page === "about" && <AboutPage />}
    </div>
  );
}
`;

const APP_STEP11 = `import { useState } from "react";
import Nav from "./components/Nav";
import TodoPage from "./pages/TodoPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  const [page, setPage] = useState("todo");
  const [todos, setTodos] = useState([]);

  function addTodo(text) {
    const newTodo = { id: Date.now(), text: text, done: false };
    setTodos([...todos, newTodo]);
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  }

  return (
    <div className="app">
      <h1>나의 할 일 앱</h1>
      <Nav page={page} setPage={setPage} />
      {page === "todo" && (
        <TodoPage todos={todos} addTodo={addTodo} toggleTodo={toggleTodo} />
      )}
      {page === "about" && <AboutPage />}
    </div>
  );
}
`;

const APP_STEP12 = `import { useState } from "react";
import Nav from "./components/Nav";
import TodoPage from "./pages/TodoPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  const [page, setPage] = useState("todo");
  const [todos, setTodos] = useState([]);

  function addTodo(text) {
    const newTodo = { id: Date.now(), text: text, done: false };
    setTodos([...todos, newTodo]);
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  }

  function removeTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  return (
    <div className="app">
      <h1>나의 할 일 앱</h1>
      <Nav page={page} setPage={setPage} />
      {page === "todo" && (
        <TodoPage
          todos={todos}
          addTodo={addTodo}
          toggleTodo={toggleTodo}
          removeTodo={removeTodo}
        />
      )}
      {page === "about" && <AboutPage />}
    </div>
  );
}
`;

const APP_FINAL = `import { useState } from "react";
import Nav from "./components/Nav";
import TodoPage from "./pages/TodoPage";
import StatsPage from "./pages/StatsPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  const [page, setPage] = useState("todo");
  const [todos, setTodos] = useState([]);

  function addTodo(text) {
    const newTodo = { id: Date.now(), text: text, done: false };
    setTodos([...todos, newTodo]);
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  }

  function removeTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  return (
    <div className="app">
      <h1>나의 할 일 앱</h1>
      <Nav page={page} setPage={setPage} />
      {page === "todo" && (
        <TodoPage
          todos={todos}
          addTodo={addTodo}
          toggleTodo={toggleTodo}
          removeTodo={removeTodo}
        />
      )}
      {page === "stats" && <StatsPage todos={todos} />}
      {page === "about" && <AboutPage />}
    </div>
  );
}
`;

const TODO_STEP7 = `export default function TodoPage() {
  return (
    <div className="page">
      <h2>오늘 할 일</h2>
    </div>
  );
}
`;

const TODO_STEP8 = `import { useState } from "react";

export default function TodoPage() {
  const [text, setText] = useState("");

  return (
    <div className="page">
      <div className="input-row">
        <input
          className="input"
          value={text}
          placeholder="오늘 할 일을 적어 보세요"
          onChange={(e) => setText(e.target.value)}
        />
        <button className="add-btn">추가</button>
      </div>
      <p className="empty">지금 적은 글: {text}</p>
    </div>
  );
}
`;

const TODO_STEP9 = `import { useState } from "react";

export default function TodoPage({ todos, addTodo }) {
  const [text, setText] = useState("");

  function handleAdd() {
    if (text.trim() === "") return;
    addTodo(text);
    setText("");
  }

  return (
    <div className="page">
      <div className="input-row">
        <input
          className="input"
          value={text}
          placeholder="오늘 할 일을 적어 보세요"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button className="add-btn" onClick={handleAdd}>
          추가
        </button>
      </div>
      <p className="empty">지금까지 {todos.length}개 담았어요</p>
    </div>
  );
}
`;

const TODO_STEP10 = `import { useState } from "react";

export default function TodoPage({ todos, addTodo }) {
  const [text, setText] = useState("");

  function handleAdd() {
    if (text.trim() === "") return;
    addTodo(text);
    setText("");
  }

  return (
    <div className="page">
      <div className="input-row">
        <input
          className="input"
          value={text}
          placeholder="오늘 할 일을 적어 보세요"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button className="add-btn" onClick={handleAdd}>
          추가
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo">
            <span>{todo.text}</span>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p className="empty">아직 할 일이 없어요 🙂</p>}
    </div>
  );
}
`;

const TODO_STEP11 = `import { useState } from "react";

export default function TodoPage({ todos, addTodo, toggleTodo }) {
  const [text, setText] = useState("");

  function handleAdd() {
    if (text.trim() === "") return;
    addTodo(text);
    setText("");
  }

  return (
    <div className="page">
      <div className="input-row">
        <input
          className="input"
          value={text}
          placeholder="오늘 할 일을 적어 보세요"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button className="add-btn" onClick={handleAdd}>
          추가
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.done ? "todo done" : "todo"}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
            </label>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p className="empty">아직 할 일이 없어요 🙂</p>}
    </div>
  );
}
`;

const TODO_FINAL = `import { useState } from "react";

export default function TodoPage({ todos, addTodo, toggleTodo, removeTodo }) {
  const [text, setText] = useState("");

  function handleAdd() {
    if (text.trim() === "") return;
    addTodo(text);
    setText("");
  }

  return (
    <div className="page">
      <div className="input-row">
        <input
          className="input"
          value={text}
          placeholder="오늘 할 일을 적어 보세요"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button className="add-btn" onClick={handleAdd}>
          추가
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.done ? "todo done" : "todo"}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
            </label>
            <button className="del-btn" onClick={() => removeTodo(todo.id)}>
              삭제
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p className="empty">아직 할 일이 없어요 🙂</p>}
    </div>
  );
}
`;

const STATS_PAGE = `export default function StatsPage({ todos }) {
  const total = todos.length;
  const doneCount = todos.filter((todo) => todo.done).length;
  const left = total - doneCount;
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  return (
    <div className="page">
      <h2>나의 기록</h2>

      <div className="stat-row">
        <div className="stat">
          <b>{total}</b>
          <span>전체</span>
        </div>
        <div className="stat">
          <b>{doneCount}</b>
          <span>끝냈어요</span>
        </div>
        <div className="stat">
          <b>{left}</b>
          <span>남았어요</span>
        </div>
      </div>

      <div className="bar">
        <div className="bar-fill" style={{ width: percent + "%" }} />
      </div>
      <p className="percent">{percent}% 완료!</p>
    </div>
  );
}
`;

/* ────────────────────────────────────────────────────────────
 * 코스 본체
 * ──────────────────────────────────────────────────────────── */
export const reactTodoCourse: Course = {
  id: "react-todo",
  track: "react",
  title: "나의 할 일 앱 만들기",
  subtitle: "React 로 3페이지짜리 진짜 앱을 처음부터 끝까지",
  level: "왕초보",
  duration: "약 90분",
  pages: ["할 일", "통계", "소개"],
  template: "react",

  /* ── 1~5단계 ─────────────────────────────────────────── */
  stages: [
    {
      id: "topic",
      no: 1,
      title: "주제 정하기",
      summary: "왜 「할 일 앱」으로 정했는지 알아봐요",
      tier: "free",
      goal: "무엇을 만들지 한 문장으로 말할 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "이번에 우리가 만들 것은 「나의 할 일 앱」이에요. 오늘 해야 할 일을 적고, 다 하면 체크하고, 몇 개나 했는지 보여주는 앱입니다.",
        },
        {
          kind: "why",
          text: "왜 하필 할 일 앱일까요? 첫째, 누구나 이미 써 봤기 때문이에요. 만들 물건이 머릿속에 그려져야 코드가 안 무섭습니다.",
        },
        {
          kind: "why",
          text: "둘째, 프로그램의 기본 4가지가 전부 들어 있어요. 만들기(추가), 보여주기(목록), 고치기(체크), 지우기(삭제). 이 네 가지를 영어로 CRUD(크러드 — Create·Read·Update·Delete)라고 불러요. 세상 대부분의 앱이 결국 이 네 개예요.",
        },
        {
          kind: "what",
          text: "셋째, 화면이 3개로 자연스럽게 나뉘어요. 「할 일」 화면, 「통계」 화면, 「소개」 화면. 페이지를 옮겨 다니는 법까지 한 번에 배울 수 있습니다.",
        },
        {
          kind: "tip",
          text: "주제를 고를 때 좋은 기준 — ① 내가 진짜 쓰고 싶은가 ② 화면이 3개 안쪽인가 ③ 남한테 한 문장으로 설명되는가. 세 개 다 O 면 좋은 첫 주제예요.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 이걸 만들고 나서 어떻게 알릴지, 즉 홍보하는 방법을 먼저 배울 거예요. 만들기 전에 알리는 법을 아는 게 순서가 맞거든요.",
        },
      ],
      practiceLabel: "아래 문장을 따라 쳐 보세요 — 이게 우리의 목표 한 줄이에요",
      practiceText:
        "나는 오늘 할 일을 적고, 다 하면 체크하고, 몇 개 했는지 볼 수 있는 앱을 만든다.",
    },

    {
      id: "promo",
      no: 2,
      title: "홍보 방법 배우기",
      summary: "만들기 전에 「어떻게 알릴지」부터 정해요",
      tier: "free",
      goal: "내 앱을 사람들에게 알리는 방법 8가지를 알고, 그중 2가지를 고를 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "많은 사람이 앱을 다 만들고 나서야 「이제 어떻게 알리지?」를 고민해요. 순서가 거꾸로예요. 알릴 방법을 먼저 정하면, 만들 때 그 방법에 맞게 만들 수 있거든요.",
        },
        {
          kind: "what",
          text: "예를 들어 인스타그램으로 알릴 생각이라면, 앱 화면이 예뻐야 하고 캡처했을 때 한눈에 뭔지 알아야 해요. 그럼 처음부터 「캡처가 잘 나오는 화면」으로 만들게 됩니다.",
        },
        {
          kind: "what",
          text: "돈 안 드는 방법부터 봅시다. 아래 카드에 8가지를 정리해 뒀어요. 사람의 마음이 어떻게 움직이는지가 각각 다릅니다.",
        },
        {
          kind: "tip",
          text: "왕초보가 처음 고르기 좋은 조합은 ①「친구 10명에게 직접 보여주기」 + ②「만드는 과정 기록해서 올리기」예요. 둘 다 공짜이고, 완성 전부터 시작할 수 있습니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 이미 세상에 있는 비슷한 앱들과 우리 앱을 비교해서, 「우리만의 한 가지」를 정할 거예요.",
        },
      ],
      cards: [
        {
          title: "① 친구 10명에게 직접 보여주기",
          body: "가장 빠르고 확실한 방법. 링크를 보내고 옆에서 쓰는 걸 지켜보세요. 어디서 헤매는지 5분이면 다 보입니다.",
          picked: true,
          note: "심리 레버 — 사람은 아는 사람이 권하면 일단 열어 봅니다. 광고보다 100배 셉니다.",
        },
        {
          title: "② 만드는 과정 기록해서 올리기",
          body: "완성작이 아니라 '만드는 중'을 올립니다. 3일차 화면, 5일차 화면… 사람들은 결과보다 과정에 더 붙습니다.",
          picked: true,
          note: "심리 레버 — 미완성은 다음 편이 궁금해집니다. 완성작은 한 번 보고 끝나요.",
        },
        {
          title: "③ 커뮤니티에 글 올리기",
          body: "디스콰이엇, 커리어리, 클리앙 같은 곳에 '왕초보가 만든 첫 앱' 으로 올립니다.",
          note: "제목에 '왕초보', '처음' 을 넣으면 응원 댓글이 붙습니다.",
        },
        {
          title: "④ 인스타그램 / 스레드",
          body: "앱 화면을 캡처해서 카드 3~5장으로. 첫 장에 결과, 둘째 장부터 과정.",
          note: "돈 안 쓰는 홍보 중 도달이 가장 넓습니다.",
        },
        {
          title: "⑤ 유튜브 쇼츠 / 릴스",
          body: "30초 안에 '이거 내가 만들었어요' → 화면 녹화 → 링크. 말 없이 자막만으로도 됩니다.",
          note: "짧은 영상은 알고리즘이 알아서 퍼뜨려 줍니다.",
        },
        {
          title: "⑥ 검색에 걸리게 하기 (SEO)",
          body: "SEO(에스이오 — 검색 엔진 최적화)는 구글·네이버에서 검색했을 때 내 사이트가 위에 뜨게 만드는 일이에요. 제목·설명 글을 잘 적어 두는 것부터 시작합니다.",
          note: "느리지만 한 번 걸리면 계속 들어옵니다.",
        },
        {
          title: "⑦ 학교·동아리에서 발표",
          body: "만든 걸 직접 보여주는 자리. 질문이 나오면 그게 다음에 고칠 목록입니다.",
          note: "피드백 밀도가 가장 높은 방법.",
        },
        {
          title: "⑧ 광고 (돈 쓰기)",
          body: "인스타·구글에 돈을 내고 노출. CPC(씨피씨 — 클릭 한 번당 드는 돈)가 한국 인스타 기준 대략 ₩300~800.",
          note: "맨 마지막에 씁니다. 앞의 7개를 다 해 보고도 부족할 때만.",
        },
      ],
      practiceLabel: "내가 고른 홍보 방법 2가지를 따라 쳐 보세요",
      // 따라 칠 문장에는 원문자(①②)·특수기호를 쓰지 않는다.
      // 한글 자판으로 바로 안 나와서 초등학생이 여기서 막힌다.
      practiceText:
        "나는 친구 10명에게 직접 보여주기와 만드는 과정 기록해서 올리기로 내 앱을 알린다.",
    },

    {
      id: "plan",
      no: 3,
      title: "기획하기",
      summary: "이미 있는 앱들과 비교해서 「우리만의 한 가지」를 정해요",
      tier: "free",
      goal: "화면 3개와 기능 4개를 종이에 적을 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "기획이란 어려운 말 같지만, 결국 「무엇을 만들고, 무엇을 안 만들지 정하는 일」이에요. 안 만들 걸 정하는 게 더 중요합니다.",
        },
        {
          kind: "what",
          text: "먼저 세상에 이미 있는 할 일 앱들을 봅시다. 아래 카드에 4개를 비교해 뒀어요. 다들 좋은 앱이지만, 왕초보가 처음 만들기엔 기능이 너무 많습니다.",
        },
        {
          kind: "what",
          text: "우리만의 한 가지는 「초등학생도 5초 안에 쓸 수 있게」예요. 로그인 없음, 설정 없음, 버튼 크게. 이것만 지키면 우리 앱은 존재 이유가 생깁니다.",
        },
        {
          kind: "what",
          text: "만들 화면은 3개로 못 박습니다. ①할 일 — 적고 체크하고 지우는 곳. ②통계 — 몇 개 했는지 보는 곳. ③소개 — 이 앱이 뭔지 알려주는 곳.",
        },
        {
          kind: "what",
          text: "만들 기능도 4개로 못 박습니다. 할 일 추가 / 목록 보기 / 완료 체크 / 삭제. 딱 여기까지. 알림, 날짜, 사진, 공유는 전부 「나중에」 칸으로 보냅니다.",
        },
        {
          kind: "tip",
          text: "왕초보가 가장 많이 실패하는 이유 1등이 「기능을 너무 많이 넣어서」예요. 기능 4개짜리 완성작이, 기능 20개짜리 미완성보다 100배 낫습니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 이 3개 화면을 어떻게 예쁘게 만들지, 디자인하는 방법 3가지를 비교해 볼 거예요.",
        },
      ],
      cards: [
        {
          title: "Todoist (투두이스트)",
          body: "세계에서 제일 유명한 할 일 앱. 날짜·반복·태그·협업까지 다 됩니다.",
          note: "너무 많아서 초등학생은 첫 화면에서 멈춥니다. 우리가 안 따라갈 방향.",
        },
        {
          title: "아이폰 「미리 알림」",
          body: "아이폰에 기본으로 들어 있음. 간단하고 빠릅니다.",
          note: "아이폰에만 있어요. 우리는 웹으로 만들어서 폰·PC 어디서든 되게 합니다.",
        },
        {
          title: "노션 (Notion)",
          body: "표·문서·할 일을 한 곳에서. 어른들이 많이 씁니다.",
          note: "배우는 데만 며칠 걸려요. 우리는 배울 게 0이어야 합니다.",
        },
        {
          title: "🎯 우리 앱 — 「나의 할 일」",
          body: "로그인 없음. 설정 없음. 열면 바로 적을 수 있음. 버튼 크고 글자 큼.",
          picked: true,
          note: "우리만의 한 가지 = 「초등학생도 5초 안에」. 이거 하나만 남기고 다 버립니다.",
        },
      ],
      practiceLabel: "우리가 만들 화면과 기능을 따라 쳐 보세요",
      practiceText: `화면 3개: 할 일 / 통계 / 소개
기능 4개: 추가 / 목록 보기 / 완료 체크 / 삭제
우리만의 한 가지: 초등학생도 5초 안에 쓸 수 있게
나중에 할 것: 알림, 날짜, 사진, 친구와 공유`,
    },

    {
      id: "design",
      no: 4,
      title: "디자인하기",
      summary: "화면을 예쁘게 만드는 3가지 방법을 비교해요",
      tier: "free",
      goal: "디자인을 정하는 3가지 길을 알고, 그중 하나를 골라 색과 모양을 정하게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "디자인은 「예쁘게」가 아니라 「헷갈리지 않게」예요. 버튼이 버튼처럼 생겼고, 중요한 게 크면 그게 좋은 디자인입니다.",
        },
        {
          kind: "what",
          text: "디자인을 정하는 길은 크게 3가지예요. 아래 카드에서 비교해 보세요. 왕초보에게는 첫 번째 방법을 추천합니다.",
        },
        {
          kind: "what",
          text: "우리 앱의 색은 보라색(#8a38f5)을 메인으로, 분홍색(#d53a6b)을 포인트로 씁니다. 배경은 아주 연한 보라(#f5f0ff). 색은 3개면 충분해요. 4개 넘어가면 촌스러워집니다.",
        },
        {
          kind: "what",
          text: "모서리는 둥글게. 버튼은 10px, 카드는 16px 둥글립니다. 각진 것보다 둥근 게 친근해 보여요.",
        },
        {
          kind: "what",
          text: "글자는 16px 밑으로 내려가지 않게 합니다. 어른들은 12px 도 읽지만, 초등학생과 어르신은 못 읽어요. 우리 앱은 최소 15px 입니다.",
        },
        {
          kind: "tip",
          text: "GPT 에게 디자인을 물어볼 때 좋은 질문법 — 「할 일 앱 만드는데 메인색 보라 #8a38f5 쓸 거야. 어울리는 포인트색이랑 배경색 3개만 hex 코드로 알려줘」. 이렇게 구체적으로 물으면 바로 쓸 수 있는 답이 나옵니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 이 디자인을 무슨 코드로, 어느 서버에 올려서 만들지를 정할 거예요.",
        },
      ],
      cards: [
        {
          title: "① 레퍼런스 + GPT 함께 쓰기 ⭐추천",
          body: "마음에 드는 앱 화면을 3개 캡처해서 GPT 에게 보여주고 「이런 느낌으로, 내 앱에 맞게 색과 크기를 정해줘」 라고 부탁합니다. 레퍼런스(reference)는 참고 자료라는 뜻이에요.",
          picked: true,
          note: "가장 빠르고 실패가 적어요. 눈으로 본 게 있으니 GPT 답도 헛돌지 않습니다.",
        },
        {
          title: "② GPT 만 쓰기",
          body: "참고 자료 없이 말로만 부탁합니다. 「초등학생용 할 일 앱 디자인해줘」.",
          note: "빠르지만 뻔한 결과가 나옵니다. 어떤 느낌을 원하는지 내가 모를 때만 쓰세요.",
        },
        {
          title: "③ 피그마(Figma) 만 쓰기",
          body: "피그마는 디자이너들이 쓰는 무료 그림 도구예요. 화면을 직접 그려 보고 코드로 옮깁니다.",
          note: "가장 정확하지만 피그마 배우는 데 시간이 듭니다. 두 번째 앱부터 추천.",
        },
      ],
      practiceLabel: "우리 앱의 디자인 규칙을 따라 쳐 보세요",
      practiceText: `메인색: #8a38f5 (보라)
포인트색: #d53a6b (분홍)
배경색: #f5f0ff (아주 연한 보라)
버튼 모서리: 10px / 카드 모서리: 16px
가장 작은 글자: 15px`,
    },

    {
      id: "stack",
      no: 5,
      title: "구현 방법 정하기",
      summary: "무슨 코드로, 어느 서버에 올릴지 골라요",
      tier: "free",
      goal: "React 와 Vercel 을 고른 이유를 남에게 설명할 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "같은 앱도 만드는 방법이 여러 가지예요. 요리로 치면 「무슨 재료로, 어느 주방에서」를 정하는 단계입니다.",
        },
        {
          kind: "what",
          text: "먼저 무슨 코드로 만들지. 우리는 React(리액트)를 씁니다. React 는 페이스북이 만든 도구인데, 화면을 「부품」으로 쪼개서 만들게 해 줘요. 버튼 부품, 목록 부품… 이렇게 나누면 고치기가 훨씬 쉽습니다.",
        },
        {
          kind: "what",
          text: "React 의 진짜 장점은 「데이터가 바뀌면 화면이 알아서 바뀐다」는 거예요. 할 일을 하나 추가하면, 목록도 통계도 우리가 안 시켜도 저절로 새로 그려집니다.",
        },
        {
          kind: "what",
          text: "다음은 어디에 올릴지. 만든 앱을 인터넷에 올려서 남들도 볼 수 있게 하는 걸 배포(deploy, 디플로이)라고 해요. 우리는 Vercel(버셀)을 씁니다.",
        },
        {
          kind: "what",
          text: "Vercel 을 고른 이유 — 공짜이고, 깃허브에 코드만 올리면 자동으로 인터넷 주소가 생기고, 주소(도메인)도 붙일 수 있어요. 실제로 지금 보고 있는 이 사이트(kaiat.co.kr)도 Vercel 에 올라가 있습니다.",
        },
        {
          kind: "tip",
          text: "고를 때 기준은 딱 3개예요. ① 공짜인가 ② 한국어 자료가 많은가 ③ 나중에 회사에서도 쓰는가. React + Vercel 은 셋 다 O 입니다.",
        },
        {
          kind: "next",
          text: "여기까지가 준비 단계예요. 다음 6단계부터가 진짜 「따라하기」입니다. 제가 먼저 파일을 하나 만들면, CEO 님이 오른쪽에서 똑같이 만드는 방식이에요.",
        },
      ],
      cards: [
        {
          title: "🎯 React (리액트) ⭐우리 선택",
          body: "화면을 부품으로 쪼개서 만듭니다. 데이터가 바뀌면 화면이 저절로 바뀝니다.",
          picked: true,
          note: "한국 채용 공고에 가장 많이 나오는 이름. 배워 두면 계속 씁니다.",
        },
        {
          title: "순수 HTML + JavaScript",
          body: "도구 없이 맨손으로. 배울 게 제일 적습니다.",
          note: "화면이 3개만 넘어가도 코드가 엉킵니다. 첫 연습으로만 좋아요.",
        },
        {
          title: "Vue (뷰)",
          body: "React 와 비슷한데 문법이 조금 더 쉽다는 평이 있어요.",
          note: "좋은 도구지만 한국 회사 수요는 React 가 훨씬 많습니다.",
        },
        {
          title: "🎯 Vercel (버셀) ⭐우리 선택",
          body: "코드를 깃허브에 올리면 자동으로 인터넷 주소를 만들어 주는 서버. 개인은 무료.",
          picked: true,
          note: "kaiat.co.kr 도 여기서 돌아갑니다. 도메인 연결도 클릭 몇 번.",
        },
        {
          title: "Netlify (넷리파이)",
          body: "Vercel 과 거의 같은 서비스. 역시 무료.",
          note: "둘 중 아무거나 써도 됩니다. 한국어 자료는 Vercel 이 조금 더 많아요.",
        },
        {
          title: "GitHub Pages (깃허브 페이지스)",
          body: "깃허브가 직접 주는 무료 웹 공간.",
          note: "완전 무료지만 설정이 조금 까다롭고, 서버 기능은 못 씁니다.",
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
      goal: "13개 스텝을 거쳐 3페이지짜리 할 일 앱을 완성합니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "여기서부터가 진짜입니다. 제가 왼쪽에서 파일을 하나 만들고 설명하면, CEO 님은 오른쪽에서 똑같은 파일을 만들고 코드를 칩니다.",
        },
        {
          kind: "what",
          text: "화면 오른쪽 끝(4번칸)에는 지금 만든 앱이 실시간으로 돌아갑니다. 코드를 고치면 바로 바뀌어요. 「새 창으로 열기」를 누르면 크게 볼 수도 있습니다.",
        },
        {
          kind: "tip",
          text: "직접 치는 게 제일 잘 남습니다. 하지만 너무 길면 「복사해서 붙여넣기」 버튼을 눌러도 괜찮아요. 중요한 건 멈추지 않는 거예요.",
        },
        {
          kind: "next",
          text: "13개 스텝이 끝나면 7단계에서 인터넷에 올려서 친구에게 링크를 보낼 겁니다.",
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
          text: "다 만들었으면 이제 세상에 내놓을 차례예요. 내 컴퓨터에서만 도는 앱과, 친구가 링크로 열어 보는 앱은 완전히 다른 물건입니다.",
        },
        {
          kind: "why",
          text: "배포(deploy)란 내가 만든 파일들을 인터넷 어딘가의 컴퓨터(=서버)에 올려 두는 일이에요. 그러면 누구나 주소만 알면 열어 볼 수 있습니다.",
        },
        {
          kind: "what",
          text: "우리는 5단계에서 정한 대로 Vercel 에 올립니다. 깃허브(GitHub)에 코드를 올리고, Vercel 이 그걸 가져가서 주소를 만들어 주는 순서예요.",
        },
        {
          kind: "tip",
          text: "겁먹지 마세요. 아래 5개 스텝을 순서대로 누르기만 하면 됩니다. 카드 하나가 5분 안쪽이에요.",
        },
        {
          kind: "next",
          text: "주소가 생기면 2단계에서 정한 홍보 방법대로 친구 10명에게 보내 보세요. 그게 진짜 마지막 단계입니다.",
        },
      ],
    },
  ],

  /* ── 6단계 따라하기 스텝 13개 ────────────────────────── */
  buildSteps: [
    {
      id: "s0",
      title: "1. 프로젝트 만들기 (설치)",
      goal: "빈 폴더에 React 앱의 뼈대 파일들이 한 번에 생깁니다.",
      why: "React 앱은 파일을 하나하나 손으로 만들지 않아요. 준비물이 너무 많거든요. 그래서 「뼈대를 만들어 주는 도구」에게 시킵니다. 집을 지을 때 기초 공사를 기계가 하는 것과 같아요.",
      what: "터미널(명령 프롬프트)에 명령어 네 줄을 칩니다. npm 은 필요한 부품을 인터넷에서 받아다 깔아 주는 프로그램이에요. 한 줄을 치고 엔터를 누를 때마다 무엇이 생기는지 눈으로 확인하세요.",
      where: "오른쪽 「내 차례」 칸의 검은 터미널 상자에 한 줄씩 칩니다. 한 줄을 다 치고 엔터를 누르면 그 줄이 만드는 것이 아래 「내 폴더」에 하나씩 나타납니다.",
      next: "도구가 만들어 준 App.js 안에는 연습용 코드(Hello React)가 들어 있어요. 다음 단계에서 그걸 우리 앱 코드로 바꿉니다.",
      prereq: {
        reassure:
          "연습 시 준비물은 없어요. 오른쪽 검은 입력창은 터미널을 흉내 내는 겁니다.",
        moreTitle: "진짜 내 컴퓨터에서 직접 해보려면?",
        more: [
          {
            label: "1) Node.js 깔기",
            body: "nodejs.org 에 가서 「LTS」라고 적힌 버튼을 눌러 받은 뒤, 다음-다음 눌러 설치하면 돼요. npm 은 여기 같이 들어 있어서 따로 안 깔아도 됩니다.",
          },
          {
            label: "2) 터미널 열기",
            body: "윈도우는 시작 버튼 옆 검색창에 cmd 를 치고 엔터. 맥은 ⌘+스페이스(스포트라이트)에 terminal 을 치고 엔터하면 검은 창이 떠요.",
          },
          {
            label: "3) 잘 깔렸는지 확인",
            body: "그 검은 창에 node -v 를 치고 엔터. v20.11.0 처럼 숫자가 나오면 준비 끝! 이제 위 명령어들을 진짜로 쳐볼 수 있어요.",
          },
        ],
      },
      scaffold: {
        note: "실제 컴퓨터에서도 이 네 줄을 위에서부터 차례로 칩니다. 여기서도 똑같이 한 줄씩 쳐 보세요.",
        lines: [
          {
            text: "npm create vite@latest my-todo-app -- --template react",
            does: "「my-todo-app 이라는 폴더를 만들고, 그 안에 React 앱 뼈대를 깔아 줘」라는 뜻이에요. vite(비트)는 뼈대를 만들어 주는 도구 이름입니다.",
            output: [
              "React 뼈대를 만드는 중…",
              "my-todo-app 폴더를 만들었어요.",
              "파일 3개를 넣었어요.",
            ],
            creates: ["/index.js", "/App.js", "/styles.css"],
            bubble:
              "방금 그 명령어로 파일 3개가 생겼어요! 아래 「내 폴더」에 index.js · App.js · styles.css 가 보이죠?",
          },
          {
            text: "cd my-todo-app",
            does: "방금 만든 폴더 안으로 들어가는 명령이에요. cd 는 change directory(폴더 바꾸기)의 줄임말입니다. 여기 들어가야 다음 명령이 이 앱에 걸립니다.",
            output: [
              "이제 my-todo-app 폴더 안에서 일합니다.",
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
              "node_modules 라는 부품 상자가 생겼어요. 열어 볼 일은 없어요.",
            ],
            effect: "install",
            bubble:
              "리액트 개발에 필요한 부품 파일 214개를 받아왔어요! node_modules 라는 상자에 담겨서 「내 폴더」 목록엔 안 보이지만, 앱은 이 부품들로 돌아가요.",
          },
          {
            text: "npm run dev",
            does: "앱에 전원을 켜는 명령이에요. 주소가 뜨면 그 주소로 내 앱을 볼 수 있습니다. 끄기 전까지 계속 켜 둡니다.",
            output: [
              "앱을 켜는 중…",
              "준비 완료 (412ms)",
              "주소: http://localhost:5173/",
            ],
            effect: "serve",
            bubble:
              "앱에 전원이 켜졌어요! 이제 오른쪽 「미리보기」 화면이 시작돼요 → 코드를 고칠 때마다 저기가 같이 바뀝니다.",
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
          hint: "도구가 넣어 준 연습용 코드예요. 내가 쓴 게 아니고, 다음 단계에서 지우고 우리 코드를 넣습니다.",
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
      id: "s1",
      title: "2. 첫 화면 띄우기",
      goal: "오른쪽 미리보기에 「나의 할 일 앱」이라는 제목이 뜹니다.",
      why: "코딩은 항상 「일단 뭐라도 화면에 뜨게」부터 시작해요. 화면이 뜨면 연결이 잘 됐다는 뜻이고, 그때부터 마음이 편해집니다.",
      what: "앞 단계에서 도구가 만들어 준 App.js 를 열어서, 안에 있던 연습용 코드(Hello React)를 지우고 우리 앱 코드로 바꿉니다.",
      where: "왼쪽 파일 목록에서 App.js 를 누르고, 안에 있던 내용을 전부 지운 다음 새 코드를 넣으세요. 여기서부터가 진짜 「내가 쓰는 코드」예요.",
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
      id: "s2",
      title: "3. 색 입히기",
      goal: "배경이 연보라색이 되고 제목이 보라색으로 바뀝니다.",
      why: "4단계에서 정한 색 규칙을 코드로 옮기는 일이에요. 디자인은 나중에 하는 게 아니라 처음부터 같이 갑니다.",
      what: "styles.css 파일에 배경색, 글꼴, 제목 색을 적습니다. CSS(씨에스에스)는 화면을 꾸미는 언어예요.",
      where: "왼쪽 파일 목록에서 styles.css 를 누르고, 아래 코드를 전부 넣으세요.",
      next: "다음에는 첫 번째 페이지인 「소개」 화면을 만들 거예요.",
      files: [
        {
          path: "/styles.css",
          action: "edit",
          code: CSS_BASIC,
          hint: "className=\"app\" 이라고 쓴 곳이 CSS 의 .app 과 연결돼요. 점(.)은 「이름표」라는 뜻입니다.",
        },
      ],
    },
    {
      id: "s3",
      title: "4. pages 폴더와 소개 페이지 만들기",
      goal: "AboutPage.js 라는 새 파일이 pages 폴더 안에 생깁니다.",
      why: "화면이 3개니까 파일도 3개예요. 파일이 늘어나면 폴더로 정리해야 나중에 안 헤맵니다. 지금 습관을 들여 둡시다.",
      what: "src 안에 pages 라는 폴더를 만들고, 그 안에 AboutPage.js 파일을 만듭니다.",
      where: "오른쪽 「내 폴더」 영역에서 폴더 추가 버튼을 눌러 pages 를 만들고, 그 안에 AboutPage.js 파일을 추가한 뒤 코드를 넣으세요.",
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
      id: "s4",
      title: "5. 소개 페이지 불러오기",
      goal: "미리보기에 소개 페이지 내용이 나타납니다.",
      why: "파일을 만들기만 하면 화면에 안 나와요. 「이 부품을 여기다 붙여줘」라고 말해 줘야 합니다. 그게 import(임포트 — 불러오기)예요.",
      what: "App.js 맨 위에 import 한 줄을 넣고, 화면 안에 <AboutPage /> 를 붙입니다.",
      where: "App.js 파일 맨 첫 줄에 import 를 넣고, <h1> 아래에 <AboutPage /> 를 넣으세요.",
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
      id: "s5",
      title: "6. 메뉴 버튼 만들기",
      goal: "「할 일 / 통계 / 소개」 버튼 3개가 나란히 생깁니다.",
      why: "화면 3개를 오갈 방법이 있어야죠. 메뉴는 여러 화면에서 똑같이 쓰이니까 따로 부품으로 빼 둡니다.",
      what: "components 폴더를 만들고 Nav.js 파일을 만듭니다. Nav 는 navigation(내비게이션 — 길 안내)의 줄임말이에요.",
      where: "src 안에 components 폴더를 만들고, 그 안에 Nav.js 를 추가한 뒤 코드를 넣으세요. CSS 도 함께 채웁니다.",
      next: "다음에는 이 버튼을 눌렀을 때 실제로 화면이 바뀌게 만들 거예요.",
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
          hint: "앞으로 쓸 꾸미기 코드를 미리 다 넣어 둡니다. 부품을 만들 때마다 예쁘게 나올 거예요.",
        },
      ],
    },
    {
      id: "s6",
      title: "7. 버튼 누르면 화면 바뀌게 하기",
      goal: "메뉴를 누르면 눌린 버튼에 보라색이 칠해집니다.",
      why: "여기서 React 의 핵심인 상태(state, 스테이트)를 처음 씁니다. 상태란 「지금 어떤 상황인지 기억하는 메모지」예요.",
      what: "App.js 에서 useState 로 지금 보고 있는 페이지 이름을 기억하게 하고, 그 값을 Nav 에 넘겨줍니다.",
      where: "App.js 맨 위에 import { useState } 를 넣고, 함수 안 첫 줄에 useState 를 씁니다.",
      next: "다음에는 진짜 주인공인 「할 일」 페이지를 만들 거예요.",
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
      id: "s7",
      title: "8. 할 일 페이지 만들기",
      goal: "「할 일」 버튼을 누르면 「오늘 할 일」이라는 빈 화면이 뜹니다.",
      why: "큰 걸 한 번에 만들면 어디가 틀렸는지 못 찾아요. 껍데기부터 만들고 안을 채웁니다.",
      what: "pages 폴더에 TodoPage.js 를 만들고, App.js 에서 불러옵니다.",
      where: "pages 폴더 안에 TodoPage.js 를 추가하고, App.js 의 import 와 화면 부분을 고치세요.",
      next: "다음에는 이 빈 화면에 글자를 적는 입력창을 넣을 거예요.",
      files: [
        {
          path: "/pages/TodoPage.js",
          action: "create",
          code: TODO_STEP7,
          hint: "일단 제목만. 안은 다음 스텝부터 하나씩 채웁니다.",
        },
        {
          path: "/App.js",
          action: "edit",
          code: APP_STEP7,
          hint: "처음 켰을 때 「할 일」 화면이 보이도록 useState(\"todo\") 로 바꿨어요.",
        },
      ],
    },
    {
      id: "s8",
      title: "9. 입력창 만들기",
      goal: "글자를 치면 아래에 친 글자가 그대로 따라 나옵니다.",
      why: "입력창은 「내가 친 글자를 앱이 알고 있어야」 쓸모가 있어요. 그래서 여기도 상태(useState)를 씁니다.",
      what: "TodoPage.js 에 입력창과 추가 버튼을 넣고, 친 글자를 text 라는 상태에 담습니다.",
      where: "TodoPage.js 를 통째로 아래 코드로 바꾸세요.",
      next: "다음에는 추가 버튼을 눌렀을 때 그 글자가 목록에 쌓이게 만들 거예요.",
      files: [
        {
          path: "/pages/TodoPage.js",
          action: "edit",
          code: TODO_STEP8,
          hint: "onChange 는 「글자가 바뀔 때마다」 라는 뜻. 한 글자 칠 때마다 실행됩니다.",
        },
      ],
    },
    {
      id: "s9",
      title: "10. 할 일 담기",
      goal: "추가 버튼을 누르면 「지금까지 N개 담았어요」의 숫자가 올라갑니다.",
      why: "할 일 목록은 통계 화면에서도 써야 해요. 여러 화면이 같이 쓰는 값은 위쪽(App.js)에 두는 게 규칙입니다.",
      what: "App.js 에 todos 라는 목록 상태와 addTodo 함수를 만들고, TodoPage 에 내려 줍니다.",
      where: "App.js 를 먼저 고치고, 그 다음 TodoPage.js 를 고치세요. 순서가 중요합니다.",
      next: "다음에는 담긴 할 일들을 화면에 목록으로 보여줄 거예요.",
      files: [
        {
          path: "/App.js",
          action: "edit",
          code: APP_STEP9,
          hint: "[...todos, newTodo] 는 「원래 있던 것들 뒤에 새것 하나 붙이기」라는 뜻이에요.",
        },
        {
          path: "/pages/TodoPage.js",
          action: "edit",
          code: TODO_STEP9,
          hint: "{ todos, addTodo } 처럼 중괄호로 받는 걸 props(프롭스 — 위에서 내려준 값)라고 불러요.",
        },
      ],
    },
    {
      id: "s10",
      title: "11. 목록 보여주기",
      goal: "추가한 할 일들이 줄줄이 목록으로 나타납니다.",
      why: "드디어 앱처럼 보이는 순간이에요. 여기서 map 을 한 번 더 씁니다. 목록을 화면으로 바꾸는 건 항상 map 이에요.",
      what: "TodoPage.js 에서 todos 를 map 으로 돌면서 <li> 를 하나씩 만듭니다.",
      where: "TodoPage.js 를 통째로 아래 코드로 바꾸세요.",
      next: "다음에는 다 한 일에 체크할 수 있게 만들 거예요.",
      files: [
        {
          path: "/pages/TodoPage.js",
          action: "edit",
          code: TODO_STEP10,
          hint: "key={todo.id} 는 React 가 목록을 구분하는 이름표예요. 빼먹으면 경고가 뜹니다.",
        },
      ],
    },
    {
      id: "s11",
      title: "12. 완료 체크하기",
      goal: "체크박스를 누르면 글자에 취소선이 그어집니다.",
      why: "다 한 일에 줄이 쫙 그어지는 그 맛이 할 일 앱의 전부예요. 기능 4개 중 3번째, 「고치기」입니다.",
      what: "App.js 에 toggleTodo 함수를 만들고, TodoPage 에 체크박스를 답니다.",
      where: "App.js 먼저, 그 다음 TodoPage.js 순서로 고치세요.",
      next: "다음에는 필요 없어진 할 일을 지우는 삭제 버튼을 만들 거예요.",
      files: [
        {
          path: "/App.js",
          action: "edit",
          code: APP_STEP11,
          hint: "toggle(토글)은 「껐다 켰다 뒤집기」라는 뜻이에요. !todo.done 의 느낌표가 뒤집는 표시입니다.",
        },
        {
          path: "/pages/TodoPage.js",
          action: "edit",
          code: TODO_STEP11,
          hint: "done 이 true 면 className 에 done 이 붙고, CSS 가 취소선을 그어 줍니다.",
        },
      ],
    },
    {
      id: "s12",
      title: "13. 삭제하기",
      goal: "삭제 버튼을 누르면 그 할 일이 사라집니다.",
      why: "기능 4개 중 마지막, 「지우기」예요. 이걸로 CRUD 가 완성됩니다.",
      what: "App.js 에 removeTodo 함수를 만들고, 목록 오른쪽에 삭제 버튼을 답니다.",
      where: "App.js 먼저, 그 다음 TodoPage.js 순서로 고치세요.",
      next: "다음이 마지막입니다. 세 번째 페이지인 「통계」를 만들 거예요.",
      files: [
        {
          path: "/App.js",
          action: "edit",
          code: APP_STEP12,
          hint: "filter 는 「조건에 맞는 것만 남기기」예요. 지울 것만 빼고 나머지를 남깁니다.",
        },
        {
          path: "/pages/TodoPage.js",
          action: "edit",
          code: TODO_FINAL,
          hint: "이걸로 할 일 페이지는 완성입니다!",
        },
      ],
    },
    {
      id: "s13",
      title: "14. 통계 페이지 만들기 (마지막!)",
      goal: "「통계」 버튼을 누르면 전체·완료·남은 개수와 진행 막대가 나옵니다.",
      why: "같은 데이터를 다른 방식으로 보여주는 연습이에요. 숫자를 세고, 퍼센트를 계산하고, 막대로 그립니다.",
      what: "pages 폴더에 StatsPage.js 를 만들고, App.js 에서 todos 를 넘겨 줍니다.",
      where: "StatsPage.js 를 새로 만들고, App.js 의 import 와 화면 부분을 마지막으로 고치세요.",
      next: "완성! 7단계로 넘어가서 인터넷에 올려 봅시다.",
      files: [
        {
          path: "/pages/StatsPage.js",
          action: "create",
          code: STATS_PAGE,
          hint: "Math.round 는 반올림. 66.6% 를 67% 로 만들어 줍니다.",
        },
        {
          path: "/App.js",
          action: "edit",
          code: APP_FINAL,
          hint: "🎉 이걸로 3페이지짜리 앱이 완성됐어요!",
        },
      ],
    },
  ],

  /* ── 7단계 배포 ──────────────────────────────────────── */
  deploySteps: [
    {
      id: "d1",
      title: "1. 내 코드 내려받기",
      why: "지금 만든 코드는 이 웹페이지 안에만 있어요. 인터넷에 올리려면 먼저 내 컴퓨터로 가져와야 합니다.",
      actions: [
        "3번칸 위쪽의 「전체 코드 내려받기」 버튼을 누르세요.",
        "다운로드 폴더에 my-todo-app.zip 이 생깁니다.",
        "압축을 풀어 두세요. 폴더 안에 App.js, styles.css 등이 보이면 성공이에요.",
      ],
    },
    {
      id: "d2",
      title: "2. 깃허브 계정 만들기",
      why: "깃허브(GitHub)는 전 세계 개발자들이 코드를 올려 두는 창고예요. Vercel 이 여기서 코드를 가져갑니다.",
      actions: [
        "github.com 에 들어가서 Sign up 을 누르세요.",
        "이메일·비밀번호를 직접 입력해 계정을 만듭니다. (비밀번호는 남에게 보여주지 마세요)",
        "가입이 끝나면 오른쪽 위 + 버튼 → New repository 를 누르세요.",
        "이름은 my-todo-app, Public 으로 두고 Create repository.",
      ],
      link: { label: "깃허브 열기", href: "https://github.com" },
    },
    {
      id: "d3",
      title: "3. 코드 올리기",
      why: "만든 파일들을 깃허브 창고에 넣는 단계예요. 명령어가 무서우면 화면에 끌어다 놓는 방법도 있습니다.",
      actions: [
        "쉬운 방법 — 방금 만든 저장소 화면에서 「uploading an existing file」 링크를 누르고, 압축 푼 파일들을 끌어다 놓으세요.",
        "익숙해지면 아래 명령어로 하는 게 빠릅니다. 폴더에서 터미널을 열고 한 줄씩 붙여넣기 하세요.",
        "맨 마지막 줄의 주소는 본인 저장소 주소로 바꿔야 합니다.",
      ],
      command: `git init
git add .
git commit -m "첫 커밋"
git branch -M main
git remote add origin https://github.com/내아이디/my-todo-app.git
git push -u origin main`,
    },
    {
      id: "d4",
      title: "4. Vercel 에 연결하기",
      why: "이제 Vercel 이 깃허브 창고를 지켜보다가, 코드가 올라오면 자동으로 인터넷 주소를 만들어 줍니다.",
      actions: [
        "vercel.com 에 들어가 「Continue with GitHub」 로 들어갑니다.",
        "Add New → Project 를 누르세요.",
        "방금 만든 my-todo-app 저장소를 고르고 Import.",
        "설정은 건드리지 말고 Deploy 를 누르세요. 1~2분 기다립니다.",
        "🎉 축하합니다! my-todo-app.vercel.app 같은 주소가 생겼어요.",
      ],
      link: { label: "Vercel 열기", href: "https://vercel.com" },
    },
    {
      id: "d5",
      title: "5. 친구에게 보내기",
      why: "2단계에서 정한 홍보 방법을 실제로 실행하는 순간이에요. 여기까지 해야 진짜 끝입니다.",
      actions: [
        "생긴 주소를 복사하세요.",
        "친구 10명에게 보내고, 옆에서 쓰는 모습을 지켜보세요.",
        "어디서 멈칫하는지 적어 두세요. 그게 다음에 고칠 목록입니다.",
        "만드는 과정 캡처를 모아 카드 3~5장으로 올려 보세요.",
      ],
    },
  ],

  // 빈 폴더에서 시작한다. 파일은 1단계에서 명령어를 실행해야 생긴다.
  // (파일이 미리 놓여 있으면 "이건 어디서 온 거지?" 하고 학생이 막힌다)
  starterFiles: {},
};
