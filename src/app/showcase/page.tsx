"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  SHOWCASE_EXAMPLES,
  SHOWCASE_GRADE_LABEL,
  type ShowcaseGrade,
} from "@/data/showcase-examples";
import { Trophy, ExternalLink, Lightbulb, Award } from "lucide-react";

interface ShowcaseItem {
  id: string;
  grade: ShowcaseGrade;
  userName: string;
  title: string;
  url: string;
  screenshotUrl: string | null;
  description: string;
  authorAge: string | null;
  authorBackground: string | null;
}

const FILTERS: { value: "ALL" | ShowcaseGrade; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "GRADE_2", label: "2급" },
  { value: "GRADE_1", label: "1급" },
  { value: "SPECIAL", label: "특급" },
];

export default function ShowcasePage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"ALL" | ShowcaseGrade>("ALL");
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = filter === "ALL" ? "/api/showcase/list" : `/api/showcase/list?grade=${filter}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const examples = SHOWCASE_EXAMPLES.filter((e) => filter === "ALL" || e.grade === filter);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Trophy className="w-7 h-7 text-primary" /> 합격작 쇼케이스</h1>
        {user && (
          <Link href="/showcase/manage" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
            내 합격작 등록/관리
          </Link>
        )}
      </div>
      <p className="text-muted-foreground mb-6">합격자들이 직접 제작한 결과물과 등급별 예시를 확인하세요.</p>

      <div className="flex gap-2 mb-8">
        {FILTERS.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f.value ? "bg-primary text-white" : "border border-border hover:bg-muted"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* 예시답안 */}
      {examples.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-orange-500" /> 예시답안 (기준 참고용)</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {examples.map((ex, i) => (
              <div key={i} className="border border-dashed border-orange-300 rounded-2xl p-5 bg-orange-50/30">
                <div className="text-xs text-orange-700 font-medium mb-1">{SHOWCASE_GRADE_LABEL[ex.grade]}</div>
                <h3 className="font-bold mb-2">{ex.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{ex.summary}</p>
                <ul className="text-sm space-y-1">
                  {ex.highlights.map((h, j) => <li key={j} className="flex gap-1.5"><span className="text-orange-500">✓</span><span>{h}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 합격작 */}
      <section>
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> 합격자 제출물</h2>
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="border border-border rounded-2xl p-12 text-center text-muted-foreground">
            아직 공개된 합격작이 없습니다. 합격 후 첫 번째 주인공이 되어보세요!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <div key={it.id} className="border border-border rounded-2xl overflow-hidden hover:shadow-md transition flex flex-col">
                {it.screenshotUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.screenshotUrl} alt={it.title} className="w-full h-44 object-cover bg-gray-100" />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-muted-foreground text-sm">미리보기 없음</div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-xs text-primary font-medium mb-1">{SHOWCASE_GRADE_LABEL[it.grade]}</div>
                  <h3 className="font-bold mb-1">{it.title}</h3>
                  {it.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{it.description}</p>}
                  <div className="text-xs text-muted-foreground mb-3">
                    {it.userName}
                    {it.authorAge ? ` · ${it.authorAge}` : ""}
                    {it.authorBackground ? ` · ${it.authorBackground}` : ""}
                  </div>
                  <a href={it.url} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium">
                    작품 보러가기 <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
