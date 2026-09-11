"use client";

/* eslint-disable react-hooks/purity -- Date.now()는 포인터 제스처(스와이프/더블탭) 시간 계산에만 쓰이고
   전부 이벤트 핸들러 안에서만 호출된다(렌더링 중 호출 아님). 이 프로젝트는 React Compiler를 쓰지 않으므로
   순수성 검사가 필요 없다. */

import { useEffect, useMemo, useRef, useState } from "react";
import { BG, CATS, POSTS, SRC, SRC_ORDER } from "@/lib/data";

function buzz(ms: number) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    // 진동 API 미지원 브라우저는 조용히 무시
  }
}

function numFmt(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(".0", "") + "k" : String(n);
}

function isFullscreen() {
  return !!(document.fullscreenElement || (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement);
}

export default function Feed() {
  const [cur, setCur] = useState(CATS[0]);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [enabledSrc, setEnabledSrc] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SRC_ORDER.map((k) => [k, true]))
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [hintGone, setHintGone] = useState(false);
  // 서버에는 document가 없어 항상 false로 시작 → 클라이언트에서 처음 그리는 화면도 이와 똑같아야
  // 리액트의 "서버와 클라이언트 렌더링 결과가 같아야 한다"는 hydration 규칙을 어기지 않는다.
  // 실제 지원 여부는 마운트 후 아래 useEffect에서 한 번만 확인해 갱신한다.
  const [canFS, setCanFS] = useState(false);
  const [isFSOn, setIsFSOn] = useState(false);

  const feedRef = useRef<HTMLElement | null>(null);
  const progRef = useRef<HTMLDivElement | null>(null);
  const toastRef = useRef<HTMLDivElement | null>(null);
  const toastTimeoutRef = useRef<number | undefined>(undefined);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);

  const sxRef = useRef(0);
  const syRef = useRef(0);
  const stRef = useRef(0);
  const movedRef = useRef(false);
  const lastTapRef = useRef(0);
  const lpTimerRef = useRef<number | undefined>(undefined);
  const lastIdxRef = useRef(0);

  const list = useMemo(
    () => POSTS.filter((p) => p.cat.includes(cur) && enabledSrc[p.src]),
    [cur, enabledSrc]
  );

  const allOn = SRC_ORDER.every((k) => enabledSrc[k]);

  function showToast(msg: string) {
    const el = toastRef.current;
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => el.classList.remove("show"), 1400);
  }

  function updateProg() {
    const feedEl = feedRef.current;
    const progEl = progRef.current;
    if (!feedEl || !progEl) return;
    const i = Math.round(feedEl.scrollTop / window.innerHeight) + 1;
    progEl.style.width = (i / Math.max(list.length, 1)) * 100 + "%";
  }

  // 카테고리(cur)나 켜진 소스(enabledSrc)가 바뀌어 목록이 새로 계산될 때마다
  // 피드를 맨 위로 올리고 진행 막대를 다시 계산한다.
  useEffect(() => {
    feedRef.current?.scrollTo({ top: 0 });
    updateProg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  useEffect(() => {
    const doc = document.documentElement as unknown as {
      requestFullscreen?: () => Promise<void>;
      webkitRequestFullscreen?: () => Promise<void>;
    };
    // 브라우저 기능 감지는 클라이언트에서만 가능해 마운트 직후 한 번 갱신한다 (초기값은 하이드레이션 불일치를 피하려 항상 false).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanFS(!!(doc.requestFullscreen || doc.webkitRequestFullscreen));
    const onFsChange = () => setIsFSOn(isFullscreen());
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, []);

  function enterFS() {
    const el = document.documentElement as unknown as {
      requestFullscreen?: () => Promise<void>;
      webkitRequestFullscreen?: () => Promise<void>;
    };
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    req?.call(el)?.catch(() => {});
  }
  function exitFS() {
    const ex =
      document.exitFullscreen ||
      (document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen;
    ex?.call(document)?.catch(() => {});
  }
  function toggleFS() {
    if (isFullscreen()) exitFS();
    else enterFS();
  }

  function switchCat(c: string) {
    if (c === cur) return;
    buzz(12);
    const flashEl = flashRef.current;
    if (flashEl) {
      flashEl.textContent = c;
      flashEl.classList.remove("go");
      void flashEl.offsetWidth;
      flashEl.classList.add("go");
    }
    setCur(c);
    const btn = tabsRef.current?.querySelector<HTMLElement>(`[data-cat="${c}"]`);
    btn?.scrollIntoView({ inline: "center", block: "nearest" });
  }

  function toggleLike(key: string) {
    setLiked((prev) => {
      const on = !prev[key];
      buzz(on ? 18 : 8);
      return { ...prev, [key]: on };
    });
  }
  function toggleSave(key: string) {
    setSaved((prev) => {
      const on = !prev[key];
      buzz(12);
      showToast(on ? "저장함에 담았어요" : "저장을 취소했어요");
      return { ...prev, [key]: on };
    });
  }
  function toggleExpand(key: string) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }
  function toggleSource(k: string) {
    buzz(8);
    setEnabledSrc((prev) => ({ ...prev, [k]: !prev[k] }));
  }
  function toggleAllSources() {
    const turnOn = !allOn;
    setEnabledSrc(Object.fromEntries(SRC_ORDER.map((k) => [k, turnOn])));
  }

  function onScroll() {
    const feedEl = feedRef.current;
    if (!feedEl) return;
    if (feedEl.scrollTop > 60) setHintGone(true);
    updateProg();
    const i = Math.round(feedEl.scrollTop / window.innerHeight);
    if (i !== lastIdxRef.current) {
      lastIdxRef.current = i;
      buzz(6);
      if (canFS) {
        if (i > 0 && !isFullscreen()) enterFS();
        else if (i === 0 && isFullscreen()) exitFS();
      }
    }
    if (feedEl.scrollTop + feedEl.clientHeight >= feedEl.scrollHeight - 4) {
      showToast("마지막 글이에요 · 좌우로 밀어 다른 카테고리");
    }
  }

  function onPointerDown(e: React.PointerEvent) {
    if ((e.target as HTMLElement).closest("[data-act]")) return;
    sxRef.current = e.clientX;
    syRef.current = e.clientY;
    stRef.current = Date.now();
    movedRef.current = false;
    lpTimerRef.current = window.setTimeout(() => {
      if (!movedRef.current) {
        document.body.classList.add("zen");
        buzz(20);
      }
    }, 380);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (Math.abs(e.clientX - sxRef.current) > 8 || Math.abs(e.clientY - syRef.current) > 8) {
      movedRef.current = true;
      if (lpTimerRef.current) clearTimeout(lpTimerRef.current);
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    if (lpTimerRef.current) clearTimeout(lpTimerRef.current);
    if (document.body.classList.contains("zen")) {
      document.body.classList.remove("zen");
      return;
    }
    if ((e.target as HTMLElement).closest("[data-act]")) return;

    const dx = e.clientX - sxRef.current;
    const dy = e.clientY - syRef.current;
    const dt = Date.now() - stRef.current;

    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6 && dt < 600) {
      const i = CATS.indexOf(cur);
      const ni = dx < 0 ? i + 1 : i - 1;
      if (ni >= 0 && ni < CATS.length) switchCat(CATS[ni]);
      else {
        buzz(6);
        showToast(dx < 0 ? "마지막 카테고리예요" : "첫 카테고리예요");
      }
      return;
    }
    if (movedRef.current) return;

    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      const slideEl = (e.target as HTMLElement).closest(".slide") as HTMLElement | null;
      if (!slideEl) return;
      const key = slideEl.dataset.key!;
      const post = POSTS.find((p) => p.title === key);
      if (!post) return;
      const popEl = slideEl.querySelector(".pop") as HTMLElement | null;
      if (popEl) {
        const r = slideEl.getBoundingClientRect();
        popEl.style.left = e.clientX - r.left + "px";
        popEl.style.top = e.clientY - r.top + "px";
        popEl.classList.remove("go");
        void popEl.offsetWidth;
        popEl.classList.add("go");
      }
      buzz(18);
      if (!liked[key]) {
        setLiked((prev) => ({ ...prev, [key]: true }));
      }
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  }

  return (
    <>
      <div className="prog" ref={progRef} />
      <header className="top">
        <div className="tabs" role="tablist" ref={tabsRef}>
          {CATS.map((c) => (
            <button
              key={c}
              className="tab"
              role="tab"
              aria-selected={c === cur}
              data-cat={c}
              onClick={() => switchCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        {canFS && (
          <button className={`fsbtn${isFSOn ? " on" : ""}`} aria-label="전체화면" onClick={toggleFS}>
            <svg viewBox="0 0 24 24">
              <path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4" />
            </svg>
          </button>
        )}
      </header>

      <main
        className="feed"
        ref={feedRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {list.length ? (
          list.map((p, i) => {
            const key = p.title;
            const s = SRC[p.src];
            const bg = BG[i % BG.length];
            return (
              <section key={key} className="slide" data-i={i} data-key={key}>
                {p.t === "story" ? (
                  <div className="media" style={{ background: bg }} />
                ) : (
                  <div className="media" style={{ background: bg }}>
                    {p.emoji}
                    <span className="ph">샘플 이미지 자리</span>
                  </div>
                )}
                <div className="pop">❤️</div>
                <div className="body">
                  <div className="src">
                    <span className="dot" style={{ background: s.c }} />
                    <span className="srcname">{s.n}</span>
                    <span className="time">· {p.time}</span>
                    {p.also ? <span className="also">외 {p.also}곳</span> : null}
                  </div>
                  {p.t === "story" && <span className="tagline t-ai">AI 요약</span>}
                  {p.t === "link" && <span className="tagline t-deal">핫딜</span>}
                  <h2 className="title">{p.title}</h2>
                  {p.sum && <p className={`summary${expanded[key] ? " open" : ""}`}>{p.sum}</p>}
                  {p.t === "story" && (
                    <button className="more" data-act="expand" onClick={() => toggleExpand(key)}>
                      {expanded[key] ? "접기" : "본문 더 보기"}
                    </button>
                  )}
                  {p.t === "link" && (
                    <button
                      className="more"
                      data-act="open"
                      onClick={() => showToast("원문 사이트로 이동 (프로토타입)")}
                    >
                      보러 가기 ↗
                    </button>
                  )}
                </div>
                <div className="rail">
                  <button className={`act${liked[key] ? " on" : ""}`} data-act="like" onClick={() => toggleLike(key)}>
                    <svg viewBox="0 0 24 24">
                      <path d="M12 20.5S3.5 15 3.5 8.9A4.4 4.4 0 0 1 12 6.8a4.4 4.4 0 0 1 8.5 2.1c0 6.1-8.5 11.6-8.5 11.6z" />
                    </svg>
                    <span>{numFmt(p.likes + (liked[key] ? 1 : 0))}</span>
                  </button>
                  <button className="act" data-act="cmt" onClick={() => showToast("댓글은 다음 단계에서")}>
                    <svg viewBox="0 0 24 24">
                      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.5-5A8 8 0 1 1 21 12z" />
                    </svg>
                    <span>{numFmt(p.cmt)}</span>
                  </button>
                  <button className={`act${saved[key] ? " saved" : ""}`} data-act="save" onClick={() => toggleSave(key)}>
                    <svg viewBox="0 0 24 24">
                      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                    </svg>
                    <span>저장</span>
                  </button>
                  <button className="act" data-act="share" onClick={() => showToast("공유 시트 (프로토타입)")}>
                    <svg viewBox="0 0 24 24">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <path d="M8.6 10.6l6.8-4M8.6 13.4l6.8 4" />
                    </svg>
                    <span>공유</span>
                  </button>
                </div>
              </section>
            );
          })
        ) : (
          <section className="slide">
            <div className="body" style={{ paddingRight: 18 }}>
              <p className="title" style={{ textAlign: "center" }}>
                켜둔 소스에 해당 글이 없어요
              </p>
              <p className="summary" style={{ textAlign: "center", maxHeight: "none" }}>
                MY 탭에서 소스를 더 켜보세요.
              </p>
            </div>
          </section>
        )}
      </main>

      <div className={`hint${hintGone ? " gone" : ""}`}>
        위아래로 밀어 다음 글
        <br />
        좌우로 밀면 카테고리 전환
        <br />
        두 번 탭 좋아요 · 길게 누르면 화면만
      </div>
      <div className="toast" ref={toastRef} />
      <div className="flash" ref={flashRef} />

      <nav className="nav">
        <button className="nb cur">
          <svg viewBox="0 0 24 24">
            <path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          홈
        </button>
        <button className="nb">
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          검색
        </button>
        <button className="nb">
          <svg viewBox="0 0 24 24">
            <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
          </svg>
          랭킹
        </button>
        <button className="nb">
          <svg viewBox="0 0 24 24">
            <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
          </svg>
          저장
        </button>
        <button className="nb" onClick={() => setSheetOpen(true)}>
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
          </svg>
          MY
        </button>
      </nav>

      <div className={`backdrop${sheetOpen ? " open" : ""}`} onClick={() => setSheetOpen(false)} />
      <div className={`sheet${sheetOpen ? " open" : ""}`}>
        <div className="sheet-head">
          <h3>소스 선택</h3>
          <button className="sheet-all" onClick={toggleAllSources}>
            {allOn ? "전체 해제" : "전체 선택"}
          </button>
          <button className="sheet-close" aria-label="닫기" onClick={() => setSheetOpen(false)}>
            <svg viewBox="0 0 24 24">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <p className="sheet-note">켜둔 커뮤니티의 글만 피드에 보여요.</p>
        <div className="sheet-list">
          {SRC_ORDER.map((k) => {
            const s = SRC[k];
            const on = enabledSrc[k];
            return (
              <div className="src-row" key={k}>
                <span className="dot" style={{ background: s.c }} />
                <span className="name">{s.n}</span>
                <button
                  className={`switch${on ? " on" : ""}`}
                  aria-label={`${s.n} ${on ? "켜짐" : "꺼짐"}`}
                  onClick={() => toggleSource(k)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
