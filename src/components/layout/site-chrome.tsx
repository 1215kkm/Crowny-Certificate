"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";

/**
 * 사이트 공통 껍데기(헤더·푸터).
 *
 * /learn 은 4분할 전체화면 학습 도구라 사이트 헤더·푸터가 있으면
 * 세로 공간이 죽는다. 새 창으로 띄우는 별개 화면이므로 껍데기를 벗긴다.
 */
const BARE_PREFIXES = ["/learn"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const bare = BARE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (bare) return <>{children}</>;

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
