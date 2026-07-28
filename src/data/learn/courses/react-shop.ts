import type { Course } from "../types";

/**
 * 샘플 3호 — React 로 만드는 「미니 문구점」 (5페이지).
 *
 * 페이지: 상품 / 장바구니 / 주문 / 후기 / 소개
 * 1·2호보다 한 단계 어렵다. 새로 나오는 것:
 *  - 데이터를 파일로 분리(data/products.js)
 *  - 검색으로 목록 걸러내기
 *  - 같은 상품은 수량만 올리기(장바구니 규칙)
 *  - 합계 금액 계산 · 숫자 콤마 찍기
 *  - 주문하기(폼) → 주문 완료 화면으로 넘기기
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

const CSS_BASIC = `body {
  margin: 0;
  background: #f0f9ff;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
}

.app {
  max-width: 520px;
  margin: 0 auto;
  padding: 24px 16px 60px;
}

h1 {
  font-size: 24px;
  text-align: center;
  color: #0369a1;
}
`;

const CSS_FULL = `body {
  margin: 0;
  background: #f0f9ff;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  color: #1f2937;
}

.app {
  max-width: 520px;
  margin: 0 auto;
  padding: 24px 16px 60px;
}

h1 {
  font-size: 24px;
  text-align: center;
  color: #0369a1;
}

/* 위쪽 메뉴 */
.nav {
  display: flex;
  gap: 6px;
  margin: 16px 0;
}

.nav-btn {
  flex: 1;
  padding: 10px 0;
  border: 1px solid #bae6fd;
  background: #ffffff;
  color: #0369a1;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  position: relative;
}

.nav-btn.on {
  background: #0ea5e9;
  border-color: #0ea5e9;
  color: #ffffff;
  font-weight: bold;
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
  line-height: 18px;
}

.page {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(14, 165, 233, 0.1);
}

.search {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  margin-bottom: 12px;
}

/* 상품 목록 */
.product-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 4px;
  border-bottom: 1px solid #f3f4f6;
}

.product-emoji {
  font-size: 30px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-weight: bold;
}

.product-price {
  display: block;
  font-size: 13px;
  color: #6b7280;
}

.add-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: #0ea5e9;
  color: #fff;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
}

/* 장바구니 */
.qty-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.qty-btn {
  width: 26px;
  height: 26px;
  border: 1px solid #bae6fd;
  background: #fff;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 2px solid #e0f2fe;
  font-size: 17px;
  font-weight: bold;
  color: #0369a1;
}

.order-btn {
  width: 100%;
  margin-top: 12px;
  padding: 13px 0;
  border: none;
  border-radius: 10px;
  background: #0ea5e9;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.order-btn:disabled {
  background: #cbd5e1;
  cursor: default;
}

/* 폼 */
.field {
  margin-bottom: 10px;
}

.field label {
  display: block;
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #0369a1;
}

.field input,
.field textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  font-family: inherit;
}

.done-box {
  text-align: center;
  padding: 24px 0;
}

.done-emoji {
  font-size: 44px;
}

/* 후기 */
.review {
  padding: 12px 4px;
  border-bottom: 1px solid #f3f4f6;
}

.review-name {
  font-weight: bold;
  color: #0369a1;
}

.review-star {
  color: #f59e0b;
}

.empty {
  text-align: center;
  color: #9ca3af;
  padding: 24px 0;
}

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
      <h1>미니 문구점</h1>
      <p>여기에 하나씩 만들어 볼 거예요!</p>
    </div>
  );
}
`;

const PRODUCTS = `export const PRODUCTS = [
  { id: 1, emoji: "✏️", name: "연필 한 자루", price: 500 },
  { id: 2, emoji: "📒", name: "줄공책", price: 2000 },
  { id: 3, emoji: "🖍️", name: "색연필 12색", price: 4500 },
  { id: 4, emoji: "📏", name: "30cm 자", price: 1200 },
  { id: 5, emoji: "✂️", name: "안전 가위", price: 3000 },
  { id: 6, emoji: "🖊️", name: "검정 볼펜", price: 1000 },
];
`;

const PRODUCT_PAGE_1 = `import { PRODUCTS } from "../data/products";

export default function ProductPage() {
  return (
    <div className="page">
      <h2>문구 고르기</h2>

      <ul className="product-list">
        {PRODUCTS.map((item) => (
          <li key={item.id} className="product">
            <span className="product-emoji">{item.emoji}</span>
            <span className="product-info">
              <span className="product-name">{item.name}</span>
              <span className="product-price">{item.price}원</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

const APP_STEP4 = `import ProductPage from "./pages/ProductPage";

export default function App() {
  return (
    <div className="app">
      <h1>미니 문구점</h1>
      <ProductPage />
    </div>
  );
}
`;

const NAV = `export default function Nav({ page, setPage, cartCount }) {
  const menus = [
    { id: "products", name: "상품" },
    { id: "cart", name: "장바구니" },
    { id: "reviews", name: "후기" },
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
          {menu.id === "cart" && cartCount > 0 && (
            <span className="badge">{cartCount}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
`;

const APP_STEP6 = `import { useState } from "react";
import Nav from "./components/Nav";
import ProductPage from "./pages/ProductPage";

export default function App() {
  const [page, setPage] = useState("products");

  return (
    <div className="app">
      <h1>미니 문구점</h1>
      <Nav page={page} setPage={setPage} cartCount={0} />
      {page === "products" && <ProductPage />}
    </div>
  );
}
`;

const PRODUCT_PAGE_SEARCH = `import { useState } from "react";
import { PRODUCTS } from "../data/products";

export default function ProductPage() {
  const [keyword, setKeyword] = useState("");

  const shown = PRODUCTS.filter((item) =>
    item.name.includes(keyword)
  );

  return (
    <div className="page">
      <h2>문구 고르기</h2>

      <input
        className="search"
        value={keyword}
        placeholder="무엇을 찾으세요? (예: 연필)"
        onChange={(e) => setKeyword(e.target.value)}
      />

      <ul className="product-list">
        {shown.map((item) => (
          <li key={item.id} className="product">
            <span className="product-emoji">{item.emoji}</span>
            <span className="product-info">
              <span className="product-name">{item.name}</span>
              <span className="product-price">{item.price}원</span>
            </span>
          </li>
        ))}
      </ul>

      {shown.length === 0 && <p className="empty">찾는 물건이 없어요 🙂</p>}
    </div>
  );
}
`;

const APP_CART = `import { useState } from "react";
import Nav from "./components/Nav";
import ProductPage from "./pages/ProductPage";

export default function App() {
  const [page, setPage] = useState("products");
  const [cart, setCart] = useState([]);

  function addToCart(item) {
    const found = cart.find((line) => line.id === item.id);
    if (found) {
      setCart(
        cart.map((line) =>
          line.id === item.id ? { ...line, qty: line.qty + 1 } : line
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  }

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);

  return (
    <div className="app">
      <h1>미니 문구점</h1>
      <Nav page={page} setPage={setPage} cartCount={cartCount} />
      {page === "products" && <ProductPage addToCart={addToCart} />}
    </div>
  );
}
`;

const PRODUCT_PAGE_ADD = `import { useState } from "react";
import { PRODUCTS } from "../data/products";

export default function ProductPage({ addToCart }) {
  const [keyword, setKeyword] = useState("");

  const shown = PRODUCTS.filter((item) =>
    item.name.includes(keyword)
  );

  return (
    <div className="page">
      <h2>문구 고르기</h2>

      <input
        className="search"
        value={keyword}
        placeholder="무엇을 찾으세요? (예: 연필)"
        onChange={(e) => setKeyword(e.target.value)}
      />

      <ul className="product-list">
        {shown.map((item) => (
          <li key={item.id} className="product">
            <span className="product-emoji">{item.emoji}</span>
            <span className="product-info">
              <span className="product-name">{item.name}</span>
              <span className="product-price">{item.price}원</span>
            </span>
            <button className="add-btn" onClick={() => addToCart(item)}>
              담기
            </button>
          </li>
        ))}
      </ul>

      {shown.length === 0 && <p className="empty">찾는 물건이 없어요 🙂</p>}
    </div>
  );
}
`;

const CART_PAGE = `export default function CartPage({ cart }) {
  return (
    <div className="page">
      <h2>장바구니</h2>

      <ul className="product-list">
        {cart.map((line) => (
          <li key={line.id} className="product">
            <span className="product-emoji">{line.emoji}</span>
            <span className="product-info">
              <span className="product-name">{line.name}</span>
              <span className="product-price">
                {line.price}원 · {line.qty}개
              </span>
            </span>
          </li>
        ))}
      </ul>

      {cart.length === 0 && <p className="empty">아직 담은 게 없어요 🛒</p>}
    </div>
  );
}
`;

const APP_CART_PAGE = `import { useState } from "react";
import Nav from "./components/Nav";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";

export default function App() {
  const [page, setPage] = useState("products");
  const [cart, setCart] = useState([]);

  function addToCart(item) {
    const found = cart.find((line) => line.id === item.id);
    if (found) {
      setCart(
        cart.map((line) =>
          line.id === item.id ? { ...line, qty: line.qty + 1 } : line
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  }

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);

  return (
    <div className="app">
      <h1>미니 문구점</h1>
      <Nav page={page} setPage={setPage} cartCount={cartCount} />
      {page === "products" && <ProductPage addToCart={addToCart} />}
      {page === "cart" && <CartPage cart={cart} />}
    </div>
  );
}
`;

const APP_QTY = `import { useState } from "react";
import Nav from "./components/Nav";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";

export default function App() {
  const [page, setPage] = useState("products");
  const [cart, setCart] = useState([]);

  function addToCart(item) {
    const found = cart.find((line) => line.id === item.id);
    if (found) {
      setCart(
        cart.map((line) =>
          line.id === item.id ? { ...line, qty: line.qty + 1 } : line
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  }

  function changeQty(id, diff) {
    setCart(
      cart
        .map((line) =>
          line.id === id ? { ...line, qty: line.qty + diff } : line
        )
        .filter((line) => line.qty > 0)
    );
  }

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);

  return (
    <div className="app">
      <h1>미니 문구점</h1>
      <Nav page={page} setPage={setPage} cartCount={cartCount} />
      {page === "products" && <ProductPage addToCart={addToCart} />}
      {page === "cart" && <CartPage cart={cart} changeQty={changeQty} />}
    </div>
  );
}
`;

const CART_QTY = `export default function CartPage({ cart, changeQty }) {
  return (
    <div className="page">
      <h2>장바구니</h2>

      <ul className="product-list">
        {cart.map((line) => (
          <li key={line.id} className="product">
            <span className="product-emoji">{line.emoji}</span>
            <span className="product-info">
              <span className="product-name">{line.name}</span>
              <span className="product-price">{line.price}원</span>
            </span>
            <span className="qty-row">
              <button
                className="qty-btn"
                onClick={() => changeQty(line.id, -1)}
              >
                -
              </button>
              {line.qty}
              <button
                className="qty-btn"
                onClick={() => changeQty(line.id, 1)}
              >
                +
              </button>
            </span>
          </li>
        ))}
      </ul>

      {cart.length === 0 && <p className="empty">아직 담은 게 없어요 🛒</p>}
    </div>
  );
}
`;

const CART_TOTAL = `export default function CartPage({ cart, changeQty, goOrder }) {
  const total = cart.reduce(
    (sum, line) => sum + line.price * line.qty,
    0
  );

  return (
    <div className="page">
      <h2>장바구니</h2>

      <ul className="product-list">
        {cart.map((line) => (
          <li key={line.id} className="product">
            <span className="product-emoji">{line.emoji}</span>
            <span className="product-info">
              <span className="product-name">{line.name}</span>
              <span className="product-price">{line.price}원</span>
            </span>
            <span className="qty-row">
              <button
                className="qty-btn"
                onClick={() => changeQty(line.id, -1)}
              >
                -
              </button>
              {line.qty}
              <button
                className="qty-btn"
                onClick={() => changeQty(line.id, 1)}
              >
                +
              </button>
            </span>
          </li>
        ))}
      </ul>

      {cart.length === 0 && <p className="empty">아직 담은 게 없어요 🛒</p>}

      <div className="total-row">
        <span>모두 합쳐서</span>
        <span>{total.toLocaleString()}원</span>
      </div>

      <button
        className="order-btn"
        disabled={cart.length === 0}
        onClick={goOrder}
      >
        주문하기
      </button>
    </div>
  );
}
`;

const APP_ORDER = `import { useState } from "react";
import Nav from "./components/Nav";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import OrderPage from "./pages/OrderPage";

export default function App() {
  const [page, setPage] = useState("products");
  const [cart, setCart] = useState([]);

  function addToCart(item) {
    const found = cart.find((line) => line.id === item.id);
    if (found) {
      setCart(
        cart.map((line) =>
          line.id === item.id ? { ...line, qty: line.qty + 1 } : line
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  }

  function changeQty(id, diff) {
    setCart(
      cart
        .map((line) =>
          line.id === id ? { ...line, qty: line.qty + diff } : line
        )
        .filter((line) => line.qty > 0)
    );
  }

  function finishOrder() {
    setCart([]);
  }

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);

  return (
    <div className="app">
      <h1>미니 문구점</h1>
      <Nav page={page} setPage={setPage} cartCount={cartCount} />
      {page === "products" && <ProductPage addToCart={addToCart} />}
      {page === "cart" && (
        <CartPage
          cart={cart}
          changeQty={changeQty}
          goOrder={() => setPage("order")}
        />
      )}
      {page === "order" && (
        <OrderPage cart={cart} finishOrder={finishOrder} />
      )}
    </div>
  );
}
`;

const ORDER_PAGE = `import { useState } from "react";

export default function OrderPage({ cart, finishOrder }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [done, setDone] = useState(false);

  const total = cart.reduce(
    (sum, line) => sum + line.price * line.qty,
    0
  );

  function handleOrder() {
    if (name.trim() === "" || address.trim() === "") return;
    setDone(true);
    finishOrder();
  }

  if (done) {
    return (
      <div className="page">
        <div className="done-box">
          <div className="done-emoji">🎉</div>
          <h2>주문이 끝났어요!</h2>
          <p>{name}님, 곧 보내 드릴게요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>주문하기</h2>

      <div className="field">
        <label>받는 사람</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="field">
        <label>주소</label>
        <textarea
          rows={2}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="total-row">
        <span>낼 금액</span>
        <span>{total.toLocaleString()}원</span>
      </div>

      <button className="order-btn" onClick={handleOrder}>
        이대로 주문하기
      </button>
    </div>
  );
}
`;

const REVIEW_PAGE = `import { useState } from "react";

export default function ReviewPage({ reviews, addReview }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [star, setStar] = useState(5);

  function handleAdd() {
    if (name.trim() === "" || text.trim() === "") return;
    addReview(name, text, star);
    setName("");
    setText("");
    setStar(5);
  }

  return (
    <div className="page">
      <h2>후기</h2>

      <div className="field">
        <label>이름</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="field">
        <label>한 줄 후기</label>
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </div>

      <div className="field">
        <label>별점 {star}점</label>
        <div className="qty-row">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className="qty-btn"
              onClick={() => setStar(n)}
            >
              {n <= star ? "★" : "☆"}
            </button>
          ))}
        </div>
      </div>

      <button className="order-btn" onClick={handleAdd}>
        후기 남기기
      </button>

      <div>
        {reviews.map((r) => (
          <div key={r.id} className="review">
            <span className="review-name">{r.name}</span>{" "}
            <span className="review-star">
              {"★".repeat(r.star)}
            </span>
            <p>{r.text}</p>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="empty">아직 후기가 없어요 ✍️</p>
        )}
      </div>
    </div>
  );
}
`;

const ABOUT_PAGE = `export default function AboutPage() {
  return (
    <div className="page">
      <h2>이 가게는요</h2>
      <p>공부할 때 필요한 문구만 모아 파는 작은 가게예요.</p>
      <ul className="about-list">
        <li>문구를 골라 장바구니에 담아요</li>
        <li>수량을 바꾸고 합계를 봐요</li>
        <li>주문하고 후기를 남겨요</li>
      </ul>
      <p className="made-by">만든 사람: 나 🙋</p>
    </div>
  );
}
`;

const APP_FINAL = `import { useState } from "react";
import Nav from "./components/Nav";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import OrderPage from "./pages/OrderPage";
import ReviewPage from "./pages/ReviewPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  const [page, setPage] = useState("products");
  const [cart, setCart] = useState([]);
  const [reviews, setReviews] = useState([]);

  function addToCart(item) {
    const found = cart.find((line) => line.id === item.id);
    if (found) {
      setCart(
        cart.map((line) =>
          line.id === item.id ? { ...line, qty: line.qty + 1 } : line
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  }

  function changeQty(id, diff) {
    setCart(
      cart
        .map((line) =>
          line.id === id ? { ...line, qty: line.qty + diff } : line
        )
        .filter((line) => line.qty > 0)
    );
  }

  function finishOrder() {
    setCart([]);
  }

  function addReview(name, text, star) {
    const newReview = { id: Date.now(), name: name, text: text, star: star };
    setReviews([newReview, ...reviews]);
  }

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);

  return (
    <div className="app">
      <h1>미니 문구점</h1>
      <Nav page={page} setPage={setPage} cartCount={cartCount} />
      {page === "products" && <ProductPage addToCart={addToCart} />}
      {page === "cart" && (
        <CartPage
          cart={cart}
          changeQty={changeQty}
          goOrder={() => setPage("order")}
        />
      )}
      {page === "order" && (
        <OrderPage cart={cart} finishOrder={finishOrder} />
      )}
      {page === "reviews" && (
        <ReviewPage reviews={reviews} addReview={addReview} />
      )}
      {page === "about" && <AboutPage />}
    </div>
  );
}
`;

/* ────────────────────────────────────────────────────────────
 * 코스 본체
 * ──────────────────────────────────────────────────────────── */
export const reactShopCourse: Course = {
  id: "react-shop",
  track: "react",
  title: "미니 문구점 만들기",
  subtitle: "장바구니·합계·주문까지 있는 5페이지 쇼핑 앱",
  level: "초보",
  duration: "약 150분",
  pages: ["상품", "장바구니", "주문", "후기", "소개"],
  template: "react",

  stages: [
    {
      id: "topic",
      no: 1,
      title: "주제 정하기",
      summary: "왜 「작은 쇼핑몰」로 정했는지 알아봐요",
      tier: "free",
      goal: "무엇을 만들지 한 문장으로 말할 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "이번에 만들 것은 「미니 문구점」이에요. 문구를 골라 장바구니에 담고, 수량을 바꾸고, 합계를 보고, 주문하고, 후기까지 남기는 5페이지 앱입니다.",
        },
        {
          kind: "why",
          text: "앞 두 앱보다 한 단계 어렵습니다. 이유가 있어요. 장바구니는 「같은 걸 또 담으면 수량만 올린다」처럼 규칙이 있는 데이터를 다뤄야 하거든요. 이게 실제 서비스에서 가장 많이 나오는 모양입니다.",
        },
        {
          kind: "why",
          text: "쇼핑 앱을 한 번 만들어 두면 예약·주문·신청 같은 앱을 거의 같은 방식으로 만들 수 있어요. 이름만 다르지 구조가 같습니다.",
        },
        {
          kind: "what",
          text: "새로 나오는 것 — 상품 데이터를 따로 파일로 빼기, 검색으로 목록 걸러내기, 수량 올리고 내리기, 금액 합계 계산하기, 주문 폼 받고 완료 화면 보여주기.",
        },
        {
          kind: "tip",
          text: "어려워 보이면 이렇게 생각하세요. 앞 앱에서 「목록에 넣고 빼기」를 이미 해 봤어요. 장바구니는 거기에 「수량」과 「금액」이 붙은 것뿐입니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 만들고 나서 어떻게 알릴지부터 정합니다.",
        },
      ],
      practiceLabel: "아래 문장을 따라 쳐 보세요 — 우리의 목표 한 줄이에요",
      practiceText:
        "나는 문구를 골라 담고, 수량을 바꾸고, 합계를 보고, 주문하고, 후기를 남길 수 있는 앱을 만든다.",
    },

    {
      id: "promo",
      no: 2,
      title: "홍보 방법 배우기",
      summary: "만들기 전에 「어떻게 알릴지」부터 정해요",
      tier: "free",
      goal: "쇼핑 앱에 맞는 홍보 방법을 알고, 그중 2가지를 고를 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "쇼핑 앱은 「보여주기」가 특히 중요해요. 물건 목록과 장바구니 화면은 그 자체로 보여줄 거리가 됩니다.",
        },
        {
          kind: "what",
          text: "그리고 쇼핑 앱에는 남들이 잘 안 만드는 장점이 있어요. 포트폴리오로 보여줄 때 「이 사람은 실제 서비스 구조를 안다」는 신호가 됩니다.",
        },
        {
          kind: "what",
          text: "아래 카드에 6가지를 정리했어요. 각각 건드리는 마음이 다릅니다.",
        },
        {
          kind: "tip",
          text: "처음 고르기 좋은 조합은 ①「만드는 과정을 짧은 글로 연재」 + ②「포트폴리오/이력서에 링크 넣기」예요. 둘 다 공짜이고 오래 남습니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 진짜 쇼핑몰들과 비교해 「우리만의 한 가지」를 정합니다.",
        },
      ],
      cards: [
        {
          title: "① 만드는 과정을 짧은 글로 연재",
          body: "「장바구니 만들다 막힌 이야기」처럼 과정을 씁니다. 완성작보다 과정에 사람이 붙어요.",
          picked: true,
          note: "심리 레버 — 남의 시행착오는 내 이야기 같아서 계속 읽게 됩니다.",
        },
        {
          title: "② 포트폴리오·이력서에 링크",
          body: "「직접 만든 쇼핑 앱」 링크 한 줄이면 설명이 필요 없습니다.",
          picked: true,
          note: "쇼핑 구조는 실무와 닮아서 신뢰가 큽니다.",
        },
        {
          title: "③ 인스타그램 / 스레드",
          body: "상품 목록 → 담기 → 합계 → 주문완료 흐름을 카드 4장으로.",
          note: "흐름이 보이는 캡처가 설명보다 강합니다.",
        },
        {
          title: "④ 커뮤니티에 글 올리기",
          body: "디스콰이엇·커리어리 같은 곳에 만든 결과를 올립니다.",
          note: "코드에 대한 조언이 댓글로 붙는 게 진짜 이득이에요.",
        },
        {
          title: "⑤ 유튜브 쇼츠 / 릴스",
          body: "30초 화면 녹화 — 담고, 수량 바꾸고, 주문까지.",
          note: "짧은 영상은 알고리즘이 알아서 퍼뜨려 줍니다.",
        },
        {
          title: "⑥ 광고 (돈 쓰기)",
          body: "돈을 내고 노출합니다. CPC(씨피씨 — 클릭 한 번당 드는 돈)가 한국 인스타 기준 대략 ₩300~800.",
          note: "연습작에는 굳이 쓸 필요 없습니다.",
        },
      ],
      practiceLabel: "내가 고른 홍보 방법 2가지를 따라 쳐 보세요",
      practiceText:
        "나는 만드는 과정을 짧은 글로 연재하기와 포트폴리오에 링크 넣기로 내 앱을 알린다.",
    },

    {
      id: "plan",
      no: 3,
      title: "기획하기",
      summary: "진짜 쇼핑몰과 비교해 「우리만의 한 가지」를 정해요",
      tier: "free",
      goal: "화면 5개와 기능 6개를 종이에 적을 수 있게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "쇼핑몰은 기능을 넣기 시작하면 끝이 없어요. 로그인, 결제, 배송조회, 쿠폰… 그래서 「안 만들 것」을 먼저 정해야 합니다.",
        },
        {
          kind: "what",
          text: "아래 카드에서 진짜 쇼핑몰들과 비교해 보세요. 우리가 따라갈 수 없는 것과, 우리가 더 나은 것이 갈립니다.",
        },
        {
          kind: "what",
          text: "우리만의 한 가지는 「문구만, 6개만」이에요. 고를 게 적으면 고민이 없고, 고민이 없으면 주문이 빨라집니다.",
        },
        {
          kind: "what",
          text: "화면은 5개 — ①상품 ②장바구니 ③주문 ④후기 ⑤소개. 기능은 6개 — 목록 보기 / 검색 / 담기 / 수량 바꾸기 / 합계·주문 / 후기 남기기.",
        },
        {
          kind: "what",
          text: "안 만들 것도 못 박습니다 — 로그인, 진짜 결제, 배송 조회, 쿠폰, 상품 상세 페이지. 전부 「나중에」입니다.",
        },
        {
          kind: "tip",
          text: "진짜 결제는 넣지 않습니다. 돈이 오가는 기능은 사업자 등록과 심사가 필요하고, 연습작에서 흉내만 내는 게 오히려 정직해요.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 색과 크기 규칙을 정합니다.",
        },
      ],
      cards: [
        {
          title: "쿠팡",
          body: "없는 게 없고 다음 날 옵니다.",
          note: "물류 회사예요. 우리가 흉내 낼 영역이 아닙니다.",
        },
        {
          title: "네이버 스마트스토어",
          body: "누구나 가게를 열 수 있는 큰 시장.",
          note: "기능이 너무 많아 처음 만들 구조로는 안 맞습니다.",
        },
        {
          title: "동네 문구점",
          body: "필요한 것만 있고, 주인이 다 압니다.",
          note: "이 느낌이 우리 것과 가장 가깝습니다.",
        },
        {
          title: "🎯 우리 앱 — 「미니 문구점」",
          body: "문구 6개만. 골라 담고 수량 바꾸고 바로 주문.",
          picked: true,
          note: "우리만의 한 가지 = 「문구만, 6개만」. 고를 게 적어서 3초면 담습니다.",
        },
      ],
      practiceLabel: "우리가 만들 화면과 기능을 따라 쳐 보세요",
      practiceText: `화면 5개: 상품 / 장바구니 / 주문 / 후기 / 소개
기능 6개: 목록 보기 / 검색 / 담기 / 수량 바꾸기 / 합계와 주문 / 후기 남기기
우리만의 한 가지: 문구만, 6개만
나중에 할 것: 로그인, 진짜 결제, 배송 조회, 쿠폰`,
    },

    {
      id: "design",
      no: 4,
      title: "디자인하기",
      summary: "색과 크기 규칙을 정해요",
      tier: "free",
      goal: "우리 가게의 색·모서리·글자 크기를 정하게 됩니다.",
      paragraphs: [
        {
          kind: "why",
          text: "쇼핑 화면에서 디자인의 목적은 딱 하나예요. 「담기 버튼이 어디 있는지 헷갈리지 않게」. 예쁜 것보다 이게 먼저입니다.",
        },
        {
          kind: "what",
          text: "문구점이라 깨끗하고 시원한 느낌으로 갑니다. 메인 파랑(#0ea5e9), 진한 파랑(#0369a1), 배경은 아주 연한 하늘색(#f0f9ff).",
        },
        {
          kind: "what",
          text: "누르는 것은 전부 파랑으로 통일합니다. 담기·주문·후기 남기기 모두 같은 파랑이라, 「파란 건 누르는 것」이라는 규칙이 생겨요.",
        },
        {
          kind: "what",
          text: "장바구니 개수는 빨강 동그라미(배지)로 메뉴 위에 띄웁니다. 빨강은 이 앱에서 「지금 뭔가 있다」는 뜻으로만 씁니다.",
        },
        {
          kind: "what",
          text: "금액은 다른 글자보다 크고 진하게. 사람은 쇼핑 화면에서 금액을 가장 먼저 찾습니다.",
        },
        {
          kind: "tip",
          text: "버튼이 눌리는지 안 눌리는지도 색으로 알려 줍니다. 장바구니가 비면 주문 버튼을 회색으로 죽여서, 눌러 보고 실망할 일을 없앱니다.",
        },
        {
          kind: "next",
          text: "다음 단계에서는 무슨 코드로, 어디에 올릴지 정합니다.",
        },
      ],
      practiceLabel: "우리 앱의 디자인 규칙을 따라 쳐 보세요",
      practiceText: `메인색: #0ea5e9 (파랑)
진한색: #0369a1 (진한 파랑)
배경색: #f0f9ff (연한 하늘)
알림 배지: #ef4444 (빨강)
규칙: 파란 것은 누르는 것, 금액은 크고 진하게`,
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
          text: "쇼핑 앱은 화면 하나가 바뀌면 여러 곳이 같이 바뀝니다. 담으면 배지 숫자도, 장바구니 목록도, 합계도 동시에 변해요.",
        },
        {
          kind: "what",
          text: "그래서 React 가 특히 잘 맞습니다. 「데이터가 바뀌면 화면이 알아서 바뀐다」가 React 의 핵심이라, 우리는 장바구니 데이터만 고치면 나머지는 저절로 따라옵니다.",
        },
        {
          kind: "what",
          text: "상품 데이터는 파일 하나(data/products.js)에 모아 둡니다. 나중에 상품을 늘리거나 값을 바꿀 때 그 파일만 고치면 돼요.",
        },
        {
          kind: "what",
          text: "올리는 곳은 Vercel(버셀). 공짜이고 깃허브에 올리면 자동으로 주소가 생깁니다.",
        },
        {
          kind: "tip",
          text: "이 앱에는 서버도 데이터베이스도 없습니다. 주문은 화면에서만 처리해요. 진짜 서버가 필요한 건 그다음 단계의 이야기입니다.",
        },
        {
          kind: "next",
          text: "여기까지가 준비 단계예요. 다음 6단계부터가 진짜 따라하기입니다.",
        },
      ],
      practiceLabel: "우리가 고른 구현 방법을 따라 쳐 보세요",
      practiceText: `코드: React (데이터가 바뀌면 화면이 알아서 바뀌어서)
서버: Vercel (무료 + 깃허브 올리면 자동 배포)
상품 데이터: data 폴더의 파일 하나에 모아 두기
저장: 브라우저 안에만 (로그인 없이 쓰려고)`,
    },

    {
      id: "build",
      no: 6,
      title: "따라하기",
      summary: "제가 먼저 만들면, 오른쪽에서 똑같이 따라 만들어요",
      tier: "free",
      goal: "16개 스텝을 거쳐 5페이지짜리 쇼핑 앱을 완성합니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "여기서부터가 진짜입니다. 앞 앱들보다 스텝이 많지만, 하나하나는 똑같이 작아요.",
        },
        {
          kind: "what",
          text: "미리보기 창에는 지금 만든 앱이 실시간으로 돌아갑니다. 담아 보고 수량도 바꿔 보면서 만드세요.",
        },
        {
          kind: "tip",
          text: "막히면 「비교」 버튼으로 선생님 코드와 뭐가 다른지 보세요. 한 글자 차이로 안 도는 경우가 대부분입니다.",
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
      summary: "인터넷에 올려서 친구에게 링크를 보내요",
      tier: "free",
      goal: "내 앱이 진짜 인터넷 주소를 갖게 됩니다.",
      paragraphs: [
        {
          kind: "goal",
          text: "다 만들었으면 세상에 내놓을 차례예요. 포트폴리오에 넣을 수 있는 링크가 생깁니다.",
        },
        {
          kind: "why",
          text: "배포(deploy)란 내가 만든 파일을 인터넷 어딘가의 컴퓨터(=서버)에 올려 두는 일이에요.",
        },
        {
          kind: "what",
          text: "5단계에서 정한 대로 Vercel 에 올립니다. 깃허브에 코드를 올리고, Vercel 이 가져가 주소를 만들어 줍니다.",
        },
        {
          kind: "tip",
          text: "아래 5개 카드를 순서대로 따라 하면 됩니다. 하나가 5분 안쪽이에요.",
        },
        {
          kind: "next",
          text: "주소가 생기면 2단계에서 정한 대로 포트폴리오에 넣어 보세요.",
        },
      ],
    },
  ],

  /* ── 6단계 따라하기 스텝 16개 ────────────────────── */
  buildSteps: [
    {
      id: "s0",
      title: "1. 프로젝트 만들기 (설치)",
      goal: "이제 빈 폴더에 React 앱의 뼈대 파일들을 한 번에 만들 겁니다.",
      why: "React 앱은 파일을 하나하나 손으로 만들지 않아요. 준비물이 너무 많거든요. 그래서 「뼈대를 만들어 주는 도구」에게 시킵니다.",
      what: "터미널(명령 프롬프트)에 명령어 네 줄을 칩니다. npm 은 필요한 부품을 인터넷에서 받아다 깔아 주는 프로그램이에요.",
      where: "오른쪽 「내 차례」 칸의 검은 터미널 상자에 한 줄씩 칩니다. 엔터를 누르면 그 줄이 만드는 것이 「내 폴더」에 나타납니다.",
      result:
        "명령어 네 줄로 React 앱의 뼈대 파일과 부품들을 자동으로 깔고 앱까지 켰어요. 손으로 파일 하나 안 만들었는데 시작 준비가 끝났습니다.",
      next: "다음 단계에서 도구가 넣어 준 연습용 코드를 우리 가게 코드로 바꿉니다.",
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
            text: "npm create vite@latest my-shop-app -- --template react",
            does: "「my-shop-app 이라는 폴더를 만들고, 그 안에 React 앱 뼈대를 깔아 줘」라는 뜻이에요. vite(비트)는 뼈대를 만들어 주는 도구 이름입니다.",
            output: [
              "React 뼈대를 만드는 중…",
              "my-shop-app 폴더를 만들었어요.",
              "파일 3개를 넣었어요.",
            ],
            creates: ["/index.js", "/App.js", "/styles.css"],
            bubble:
              "방금 그 명령어로 파일 3개가 생겼어요! 「내 폴더」에 index.js · App.js · styles.css 가 보이죠? 생성된 파일을 클릭하면 소스코드를 확인할 수 있어요.",
          },
          {
            text: "cd my-shop-app",
            does: "방금 만든 폴더 안으로 들어가는 명령이에요. cd 는 change directory(폴더 바꾸기)의 줄임말입니다.",
            output: [
              "이제 my-shop-app 폴더 안에서 일합니다.",
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
              "준비 완료 (405ms)",
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
          hint: "앱을 화면에 처음 붙이는 파일. 당분간 건드릴 일이 없어요.",
        },
        {
          path: "/App.js",
          action: "create",
          code: SCAFFOLD["/App.js"],
          hint: "도구가 넣어 준 연습용 코드예요. 다음 단계에서 우리 코드로 바꿉니다.",
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
      goal: "이제 미리보기에 「미니 문구점」이라는 제목을 띄울 겁니다.",
      why: "코딩은 항상 「일단 뭐라도 화면에 뜨게」부터 시작해요. 화면이 뜨면 연결이 잘 됐다는 뜻입니다.",
      what: "App.js 를 열어서 연습용 코드를 지우고 우리 가게 코드로 바꿉니다.",
      where: "오른쪽 「내 폴더」의 파일 목록에서 App.js 를 누르고, 내용을 전부 지운 다음 새 코드를 넣으세요.",
      result:
        "App.js 를 우리 코드로 바꿔서 화면에 「미니 문구점」 제목이 떴어요. 여기서부터가 진짜 내가 쓴 코드입니다.",
      next: "다음에는 이 밋밋한 화면에 색을 입힐 거예요.",
      files: [
        {
          path: "/App.js",
          action: "edit",
          code: APP_STEP1,
          hint: "export default 는 「이 부품을 밖에서 쓸 수 있게 내보낸다」는 뜻이에요.",
        },
      ],
    },
    {
      id: "s2",
      title: "3. 색 입히기",
      goal: "이제 배경을 연한 하늘색으로, 제목을 파란색으로 바꿀 겁니다.",
      why: "4단계에서 정한 색 규칙을 코드로 옮기는 일이에요.",
      what: "styles.css 에 배경색, 글꼴, 제목 색을 적습니다.",
      where: "오른쪽 「내 폴더」의 파일 목록에서 styles.css 를 누르고, 아래 코드를 전부 넣으세요.",
      result:
        "styles.css 에 색과 글꼴을 적어서 화면이 우리 가게 색(하늘 배경·파란 제목)으로 바뀌었어요.",
      next: "다음에는 팔 물건 데이터를 만들 거예요.",
      files: [
        {
          path: "/styles.css",
          action: "edit",
          code: CSS_BASIC,
          hint: 'className="app" 이라고 쓴 곳이 CSS 의 .app 과 연결돼요.',
        },
      ],
    },
    {
      id: "s3",
      title: "4. 상품 데이터 만들기",
      goal: "이제 팔 문구 6개를 데이터 파일로 만들 겁니다.",
      why: "화면 코드 안에 상품을 적으면 나중에 값을 바꿀 때 코드를 헤집어야 해요. 데이터는 따로 파일로 빼 두는 게 규칙입니다.",
      what: "data 폴더를 만들고 products.js 안에 상품 6개를 배열로 적습니다. 배열은 「여러 개를 순서대로 담는 상자」예요.",
      where: "「내 폴더」에서 폴더 추가로 data 를 만들고, 폴더 옆 ＋파일 로 products.js 를 추가한 뒤 코드를 넣으세요.",
      result:
        "상품 6개를 data/products.js 에 모아 뒀어요. 이제 값을 바꾸거나 상품을 늘릴 때 이 파일만 고치면 됩니다. 화면 코드와 데이터를 나누는 첫 연습이에요.",
      next: "다음에는 이 데이터를 화면에 목록으로 뿌릴 거예요.",
      createFolders: ["/data"],
      files: [
        {
          path: "/data/products.js",
          action: "create",
          code: PRODUCTS,
          hint: "export 는 「밖에서 쓸 수 있게 내보내기」. 중괄호 { } 하나가 상품 한 개예요.",
        },
      ],
    },
    {
      id: "s4",
      title: "5. 상품 목록 보여주기",
      goal: "이제 상품 6개를 화면에 목록으로 보여줄 겁니다.",
      why: "데이터를 화면으로 바꾸는 건 언제나 map 이에요. 6개를 손으로 6번 쓰지 않습니다.",
      what: "pages 폴더에 ProductPage.js 를 만들고, products 를 불러와 map 으로 그립니다.",
      where: "pages 폴더를 만들고 ＋파일 로 ProductPage.js 를 추가한 뒤, App.js 에서 불러오세요.",
      result:
        "데이터 파일을 import 해서 map 으로 그려, 문구 6개가 이모지·이름·가격과 함께 목록으로 나왔어요. 데이터를 화면으로 바꾸는 기본형입니다.",
      next: "다음에는 화면을 오갈 메뉴를 만들 거예요.",
      createFolders: ["/pages"],
      files: [
        {
          path: "/pages/ProductPage.js",
          action: "create",
          code: PRODUCT_PAGE_1,
          hint: "../data/products 에서 점 두 개(..)는 「한 칸 위 폴더」라는 뜻이에요.",
        },
        {
          path: "/App.js",
          action: "edit",
          code: APP_STEP4,
          hint: "만든 페이지를 불러와야 화면에 나옵니다.",
        },
      ],
    },
    {
      id: "s5",
      title: "6. 메뉴 버튼 만들기",
      goal: "이제 「상품 / 장바구니 / 후기 / 소개」 버튼 4개를 만들 겁니다.",
      why: "화면이 5개나 되니 오갈 방법이 꼭 필요해요. 메뉴는 모든 화면에서 쓰이니 부품으로 뺍니다.",
      what: "components 폴더에 Nav.js 를 만듭니다. 장바구니 개수를 표시할 자리(배지)도 미리 넣어 둡니다.",
      where: "components 폴더를 만들고 ＋파일 로 Nav.js 를 추가한 뒤 코드를 넣으세요. CSS 도 함께 채웁니다.",
      result:
        "Nav 부품에 메뉴 4개와 장바구니 배지 자리를 만들었어요. 배지는 개수가 0보다 클 때만 보이게 해 뒀습니다.",
      next: "다음에는 버튼을 눌렀을 때 화면이 바뀌게 만들 거예요.",
      createFolders: ["/components"],
      files: [
        {
          path: "/components/Nav.js",
          action: "create",
          code: NAV,
          hint: "cartCount > 0 && ... 는 「개수가 0보다 클 때만 보여줘」라는 뜻이에요.",
        },
        {
          path: "/styles.css",
          action: "edit",
          code: CSS_FULL,
          hint: "앞으로 쓸 꾸미기 코드를 미리 다 넣어 둡니다.",
        },
      ],
    },
    {
      id: "s6",
      title: "7. 버튼 누르면 화면 바뀌게 하기",
      goal: "이제 메뉴를 누르면 눌린 버튼에 파란색이 칠해지게 할 겁니다.",
      why: "여기서 React 의 핵심인 상태(state)를 씁니다. 상태란 「지금 어떤 상황인지 기억하는 메모지」예요.",
      what: "App.js 에서 useState 로 지금 보고 있는 페이지를 기억하고, Nav 에 넘겨줍니다.",
      where: "App.js 맨 위에 import { useState } 를 넣고, 함수 안 첫 줄에 useState 를 씁니다.",
      result:
        "useState 로 페이지를 기억하고 Nav 에 넘겨줘서 메뉴가 작동해요. 아직 상품 화면만 있지만 나머지도 여기에 붙일 겁니다.",
      next: "다음에는 상품을 검색으로 찾을 수 있게 만들 거예요.",
      files: [
        {
          path: "/App.js",
          action: "edit",
          code: APP_STEP6,
          hint: "const [page, setPage] — page 는 지금 값, setPage 는 값을 바꾸는 함수예요.",
        },
      ],
    },
    {
      id: "s7",
      title: "8. 검색으로 걸러내기",
      goal: "이제 검색창에 글자를 치면 그 글자가 든 상품만 남게 할 겁니다.",
      why: "상품이 6개면 필요 없어 보이지만, 60개가 되면 검색이 없으면 못 씁니다. 구조를 미리 잡아 두는 거예요.",
      what: "keyword 상태를 만들고, filter 로 이름에 그 글자가 든 것만 골라 map 으로 그립니다.",
      where: "ProductPage.js 를 통째로 아래 코드로 바꾸세요.",
      result:
        "filter 로 이름에 검색어가 든 상품만 걸러 화면에 그렸어요. 데이터는 그대로 두고 보여줄 것만 고르는 방식입니다. 검색 결과가 없을 때 안내도 넣었어요.",
      next: "다음에는 드디어 장바구니에 담아 볼 거예요.",
      files: [
        {
          path: "/pages/ProductPage.js",
          action: "edit",
          code: PRODUCT_PAGE_SEARCH,
          hint: "includes 는 「그 글자가 들어 있나?」를 물어보는 것이에요.",
        },
      ],
    },
    {
      id: "s8",
      title: "9. 장바구니에 담기",
      goal: "이제 담기 버튼을 누르면 장바구니 배지 숫자가 올라가게 할 겁니다.",
      why: "여기가 이 앱에서 가장 중요한 규칙이에요. 같은 상품을 또 담으면 새로 넣는 게 아니라 수량만 1 올려야 합니다.",
      what: "App.js 에 cart 상태와 addToCart 함수를 만듭니다. 이미 있으면 수량만 올리고, 없으면 새로 넣습니다.",
      where: "App.js 를 먼저 고치고, 그 다음 ProductPage.js 를 고치세요.",
      result:
        "find 로 이미 담긴 상품인지 확인해, 있으면 수량만 올리고 없으면 새로 넣게 만들었어요. reduce 로 전체 개수를 세어 배지에 표시했습니다.",
      next: "다음에는 담은 것을 보여주는 장바구니 화면을 만들 거예요.",
      files: [
        {
          path: "/App.js",
          action: "edit",
          code: APP_CART,
          hint: "reduce 는 「목록을 돌면서 하나의 값으로 합치기」예요. 여기선 수량을 다 더합니다.",
        },
        {
          path: "/pages/ProductPage.js",
          action: "edit",
          code: PRODUCT_PAGE_ADD,
          hint: "onClick={() => addToCart(item)} — 그 줄의 상품을 통째로 넘겨줍니다.",
        },
      ],
    },
    {
      id: "s9",
      title: "10. 장바구니 화면 만들기",
      goal: "이제 「장바구니」 버튼을 누르면 담은 것들이 나오게 할 겁니다.",
      why: "담기만 하고 볼 수 없으면 답답해요. 무엇을 몇 개 담았는지 확인할 곳이 필요합니다.",
      what: "pages 폴더에 CartPage.js 를 만들고, App.js 에서 cart 를 넘겨 줍니다.",
      where: "pages 폴더 옆 ＋파일 로 CartPage.js 를 만들고, App.js 의 import 와 화면 부분을 고치세요.",
      result:
        "CartPage 를 만들어 담은 상품을 이름·가격·수량과 함께 보여줘요. 비어 있을 때 안내 문구도 넣었습니다.",
      next: "다음에는 장바구니에서 수량을 바꿀 수 있게 만들 거예요.",
      files: [
        {
          path: "/pages/CartPage.js",
          action: "create",
          code: CART_PAGE,
          hint: "장바구니 한 줄을 line 이라고 이름 붙였어요. 상품 + 수량이 합쳐진 것이라서요.",
        },
        {
          path: "/App.js",
          action: "edit",
          code: APP_CART_PAGE,
          hint: "화면이 2개가 됐어요. page 값에 따라 하나만 보입니다.",
        },
      ],
    },
    {
      id: "s10",
      title: "11. 수량 바꾸기",
      goal: "이제 + - 버튼으로 수량을 바꾸고, 0이 되면 목록에서 빠지게 할 겁니다.",
      why: "쇼핑에서 수량 조절은 필수예요. 그리고 0개가 된 줄이 남아 있으면 이상하니, 0이면 자동으로 빠져야 합니다.",
      what: "App.js 에 changeQty 함수를 만들고, CartPage 에 + - 버튼을 답니다.",
      where: "App.js 먼저, 그 다음 CartPage.js 순서로 고치세요.",
      result:
        "map 으로 수량을 바꾸고 filter 로 0개짜리를 걸러냈어요. 두 가지를 이어서 쓰는(체이닝) 방식을 처음 써 봤습니다.",
      next: "다음에는 합계 금액을 계산해서 보여줄 거예요.",
      files: [
        {
          path: "/App.js",
          action: "edit",
          code: APP_QTY,
          hint: "map 뒤에 바로 filter 를 붙였어요. 「바꾸고 → 걸러내기」가 한 줄로 이어집니다.",
        },
        {
          path: "/pages/CartPage.js",
          action: "edit",
          code: CART_QTY,
          hint: "changeQty(line.id, -1) 처럼 -1 을 넘기면 빼기, 1 이면 더하기예요.",
        },
      ],
    },
    {
      id: "s11",
      title: "12. 합계 금액 보여주기",
      goal: "이제 담은 물건의 금액을 모두 더해 보여주고, 주문 버튼을 만들 겁니다.",
      why: "쇼핑 화면에서 사람이 가장 먼저 찾는 게 총액이에요. 그리고 장바구니가 비면 주문 버튼은 눌리지 않아야 합니다.",
      what: "reduce 로 (가격 × 수량)을 모두 더하고, toLocaleString 으로 천 단위 콤마를 찍습니다.",
      where: "CartPage.js 를 통째로 아래 코드로 바꾸세요.",
      result:
        "reduce 로 합계를 계산하고 toLocaleString 으로 12,300원처럼 콤마를 찍었어요. 장바구니가 비면 주문 버튼이 회색으로 죽어서 헛클릭을 막습니다.",
      next: "다음에는 주문 화면을 만들 거예요.",
      files: [
        {
          path: "/pages/CartPage.js",
          action: "edit",
          code: CART_TOTAL,
          hint: "toLocaleString() 은 숫자에 콤마를 찍어 줍니다. 12300 → 12,300",
        },
      ],
    },
    {
      id: "s12",
      title: "13. 주문 화면 만들기",
      goal: "이제 주문하기를 누르면 이름·주소를 적는 화면이 나오게 할 겁니다.",
      why: "폼(입력 화면)은 앱에서 가장 자주 나오는 화면이에요. 여러 칸을 받아 한 번에 처리하는 연습입니다.",
      what: "pages 에 OrderPage.js 를 만들고, App.js 에 주문 화면과 finishOrder 를 연결합니다.",
      where: "pages 폴더 옆 ＋파일 로 OrderPage.js 를 만들고, App.js 도 함께 고치세요.",
      result:
        "이름·주소 칸과 낼 금액이 있는 주문 화면을 만들었어요. 장바구니의 「주문하기」가 이 화면으로 데려다 줍니다.",
      next: "다음에는 주문을 마치면 완료 화면이 뜨게 만들 거예요.",
      files: [
        {
          path: "/pages/OrderPage.js",
          action: "create",
          code: ORDER_PAGE,
          hint: "done 이 true 면 완료 화면을, 아니면 입력 화면을 보여줍니다. 한 파일 안에서 화면이 갈리는 방식이에요.",
        },
        {
          path: "/App.js",
          action: "edit",
          code: APP_ORDER,
          hint: "goOrder 로 페이지를 넘기고, finishOrder 로 장바구니를 비웁니다.",
        },
      ],
    },
    {
      id: "s13",
      title: "14. 후기 화면 만들기",
      goal: "이제 별점과 한 줄 후기를 남길 수 있게 할 겁니다.",
      why: "후기는 다른 사람의 결정을 바꾸는 가장 센 장치예요. 그리고 별점은 「숫자를 그림으로 바꾸는」 좋은 연습입니다.",
      what: "pages 에 ReviewPage.js 를 만듭니다. 별 버튼 5개, 이름·후기 칸, 남긴 후기 목록이 들어갑니다.",
      where: "pages 폴더 옆 ＋파일 로 ReviewPage.js 를 만드세요. (App.js 연결은 다음 스텝에서)",
      result:
        '별점 버튼과 후기 입력 칸, 후기 목록을 만들었어요. "★".repeat(별점) 으로 숫자를 별 그림으로 바꾸는 방법도 써 봤습니다.',
      next: "다음이 마지막입니다. 소개 화면을 만들고 전부 연결할 거예요.",
      files: [
        {
          path: "/pages/ReviewPage.js",
          action: "create",
          code: REVIEW_PAGE,
          hint: '"★".repeat(3) 은 ★★★ 이 됩니다. 숫자를 그림으로 바꾸는 간단한 방법이에요.',
        },
      ],
    },
    {
      id: "s14",
      title: "15. 소개 화면 만들기",
      goal: "이제 이 가게가 뭔지 알려주는 소개 화면을 만들 겁니다.",
      why: "처음 온 사람은 「이게 뭐 하는 곳이지?」부터 궁금해해요. 소개는 짧아도 꼭 있어야 합니다.",
      what: "pages 에 AboutPage.js 를 만듭니다. 무엇을 파는지, 무엇을 할 수 있는지 세 줄로 적습니다.",
      where: "pages 폴더 옆 ＋파일 로 AboutPage.js 를 만드세요.",
      result:
        "가게 소개 화면을 만들었어요. 이제 화면 5개가 전부 만들어졌고, 마지막으로 하나로 연결하는 일만 남았습니다.",
      next: "마지막! App.js 에서 후기와 소개까지 전부 연결합니다.",
      files: [
        {
          path: "/pages/AboutPage.js",
          action: "create",
          code: ABOUT_PAGE,
          hint: "읽기만 하는 화면이라 상태(useState)가 필요 없어요. 이런 화면이 가장 만들기 쉽습니다.",
        },
      ],
    },
    {
      id: "s15",
      title: "16. 전부 연결하기 (마지막!)",
      goal: "이제 5개 화면을 모두 연결해 앱을 완성할 겁니다.",
      why: "부품을 다 만들어도 연결하지 않으면 화면에 안 나와요. 마지막은 언제나 「이어 붙이기」입니다.",
      what: "App.js 에 reviews 상태와 addReview 를 만들고, 후기·소개 화면을 page 값에 연결합니다.",
      where: "App.js 를 통째로 아래 코드로 바꾸세요.",
      result:
        "후기 데이터와 addReview 를 App 에 두고 5개 화면을 전부 연결했어요. 상품 고르기 → 담기 → 수량 → 합계 → 주문 → 후기까지 이어지는 진짜 쇼핑 앱이 완성됐습니다!",
      next: "완성! 7단계로 넘어가서 인터넷에 올려 봅시다.",
      files: [
        {
          path: "/App.js",
          action: "edit",
          code: APP_FINAL,
          hint: "🎉 화면 5개가 page 값 하나로 갈립니다. 이 구조가 실제 서비스에서도 그대로 쓰여요.",
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
        "압축을 풀어 두세요. 폴더 안에 App.js, data, pages 등이 보이면 성공이에요.",
      ],
    },
    {
      id: "d2",
      title: "2. 깃허브 계정 만들기",
      why: "깃허브(GitHub)는 전 세계 개발자들이 코드를 올려 두는 창고예요. Vercel 이 여기서 코드를 가져갑니다.",
      actions: [
        "github.com 에 들어가서 Sign up 을 누르세요.",
        "이메일·비밀번호로 계정을 만듭니다.",
        "오른쪽 위 + 버튼 → New repository 를 누르세요.",
        "이름은 my-shop-app, Public 으로 두고 Create repository.",
      ],
      link: { label: "깃허브 열기", href: "https://github.com" },
    },
    {
      id: "d3",
      title: "3. 코드 올리기",
      why: "만든 파일들을 깃허브 창고에 넣는 단계예요.",
      actions: [
        "쉬운 방법 — 저장소 화면에서 「uploading an existing file」 을 누르고 압축 푼 파일들을 끌어다 놓으세요.",
        "익숙해지면 아래 명령어가 빠릅니다. 폴더에서 터미널을 열고 한 줄씩 붙여넣기 하세요.",
        "맨 마지막 줄의 주소는 본인 저장소 주소로 바꿔야 합니다.",
      ],
      command: `git init
git add .
git commit -m "첫 커밋"
git branch -M main
git remote add origin https://github.com/내아이디/my-shop-app.git
git push -u origin main`,
    },
    {
      id: "d4",
      title: "4. Vercel 에 연결하기",
      why: "이제 Vercel 이 깃허브 창고를 지켜보다가, 코드가 올라오면 자동으로 인터넷 주소를 만들어 줍니다.",
      actions: [
        "vercel.com 에 들어가 「Continue with GitHub」 로 들어갑니다.",
        "Add New → Project 를 누르세요.",
        "방금 만든 my-shop-app 저장소를 고르고 Import.",
        "설정은 건드리지 말고 Deploy 를 누르세요. 1~2분 기다립니다.",
        "🎉 축하합니다! my-shop-app.vercel.app 같은 주소가 생겼어요.",
      ],
      link: { label: "Vercel 열기", href: "https://vercel.com" },
    },
    {
      id: "d5",
      title: "5. 포트폴리오에 넣기",
      why: "2단계에서 정한 홍보 방법을 실제로 실행하는 순간이에요.",
      actions: [
        "생긴 주소를 복사하세요.",
        "포트폴리오·이력서에 「직접 만든 쇼핑 앱」으로 링크를 넣으세요.",
        "만들면서 막혔던 부분을 짧은 글로 정리해 올려 보세요.",
        "친구에게 보내고 어디서 헤매는지 지켜보세요. 그게 다음에 고칠 목록입니다.",
      ],
    },
  ],

  starterFiles: {},
};
