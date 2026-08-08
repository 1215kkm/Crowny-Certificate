"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * 방문자 집계 (GoatCounter)
 *
 * 왜 이걸 쓰나
 * -----------
 * kaiat.co.kr 은 그동안 방문자를 하나도 세지 않았다. 강의·시험·인증서 발급까지 있는데
 * 몇 명이 오는지 알 방법이 없었다. 포미널(pominal.com)이 이미 같은 도구를 쓰고 있어서
 * 같은 계정에 붙였다. 그러면 한 화면에서 두 사이트를 같이 본다.
 *
 * 무료다. 가입·요금 없고, 쿠키를 심지 않아 개인정보 동의창도 필요 없다.
 *
 * 왜 경로 앞에 도메인을 붙이나
 * --------------------------
 * GoatCounter 는 어느 도메인에서 온 방문인지 저장하지 않는다. 그래서 한 계정에 두 사이트를
 * 붙이면 kaiat.co.kr 의 "/" 와 pominal.com 의 "/" 가 한 줄로 합쳐져 구분이 안 된다.
 * 경로 앞에 도메인을 붙이면 "kaiat.co.kr/exams" 처럼 나와서 갈라 볼 수 있다.
 * (GoatCounter 공식 문서가 권하는 방법 — help/domains)
 *
 * 왜 직접 세어주나
 * --------------
 * 이 사이트는 Next.js 라 페이지를 옮겨도 브라우저가 새로 열리지 않는다. 그래서 집계 도구가
 * 첫 화면 하나만 세고 끝난다. 주소가 바뀔 때마다 아래에서 직접 한 번씩 세어준다.
 */

const ENDPOINT = "https://1215kkm.goatcounter.com/count";

declare global {
  interface Window {
    goatcounter?: {
      count?: (opts?: { path?: string; title?: string; referrer?: string }) => void;
      path?: (p: string) => string;
      no_onload?: boolean;
    };
  }
}

export function GoatCounter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 집계 스크립트를 한 번만 넣는다
  useEffect(() => {
    if (document.querySelector("script[data-goatcounter]")) return;

    window.goatcounter = {
      ...window.goatcounter,
      // 첫 화면은 아래 주소 바뀔 때 세는 쪽에 맡긴다 (두 번 세지 않도록)
      no_onload: true,
      path: (p: string) => location.host + (p || location.pathname),
    };

    const s = document.createElement("script");
    s.async = true;
    s.src = "//gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", ENDPOINT);
    document.head.appendChild(s);
  }, []);

  // 주소가 바뀔 때마다 한 번씩 센다 (첫 화면 포함)
  useEffect(() => {
    if (!pathname) return;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const fn = window.goatcounter?.count;
      if (typeof fn !== "function") {
        // 스크립트가 아직 안 왔으면 잠깐 뒤에 다시
        window.setTimeout(tick, 400);
        return;
      }
      const qs = searchParams?.toString();
      fn({ path: location.host + pathname + (qs ? `?${qs}` : "") });
    };

    tick();
    return () => {
      cancelled = true;
    };
  }, [pathname, searchParams]);

  return null;
}
