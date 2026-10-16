// ==UserScript==
// @name         novel-manga-page-turn
// @namespace    https://ches3.me/
// @version      2026.10.16.0
// @description  https://github.com/ches3/userscripts#novel-manga-page-turn
// @homepageURL  https://github.com/ches3/userscripts#novel-manga-page-turn
// @author       ches3
// @match        https://www.pixiv.net/*
// @match        https://kakuyomu.jp/works/*/episodes/*
// @grant        none
// ==/UserScript==

(() => {
  type NovelViewer = {
    scroller: Element;
    isVerticalWriting: boolean;
    lineHeight: number;
  };

  type MangaViewer = {
    scroller: Element;
    forwardDirection: 1 | -1;
  };

  const isPixiv = location.hostname === "www.pixiv.net";
  if (!isPixiv && location.hostname !== "kakuyomu.jp") return;

  const getNovelViewer = isPixiv ? getPixivNovelViewer : getKakuyomuNovelViewer;

  let pendingScroll: {
    scroller: Element;
    isVerticalWriting: boolean;
    targetOffset: number;
  } | null = null;

  function clearPendingScroll() {
    pendingScroll = null;
  }

  function cancelPendingScroll() {
    const pending = pendingScroll;
    clearPendingScroll();
    if (pending === null || !pending.scroller.isConnected) return;
    pending.scroller.scrollTo(
      pending.isVerticalWriting
        ? { left: pending.scroller.scrollLeft, behavior: "auto" }
        : { top: pending.scroller.scrollTop, behavior: "auto" },
    );
  }

  function watchRouteChanges() {
    let currentRoute = location.pathname + location.search;

    function handleRouteChange() {
      const next = location.pathname + location.search;
      if (next === currentRoute) return;
      currentRoute = next;
      cancelPendingScroll();
    }

    navigation.addEventListener("currententrychange", handleRouteChange);
  }

  watchRouteChanges();

  document.addEventListener(
    "scrollend",
    (event) => {
      if (
        event.target === pendingScroll?.scroller ||
        (event.target === document && pendingScroll?.scroller === document.scrollingElement)
      ) {
        clearPendingScroll();
      }
    },
    true,
  );
  document.addEventListener("pointerdown", clearPendingScroll, { passive: true });
  document.addEventListener("wheel", clearPendingScroll, { passive: true });
  window.addEventListener("resize", clearPendingScroll);

  function getPixivNovelViewer(): NovelViewer | null {
    const container = document.querySelector<HTMLElement>("#novel-text-container");
    if (!container) return null;
    const style = getComputedStyle(container);
    const isVerticalWriting = style.writingMode === "vertical-rl";
    const scroller =
      isVerticalWriting ||
      (container.scrollHeight > container.clientHeight &&
        (style.overflowY === "auto" || style.overflowY === "scroll"))
        ? container
        : document.scrollingElement;
    if (!scroller) return null;
    return { scroller, isVerticalWriting, lineHeight: Number.parseFloat(style.lineHeight) };
  }

  function getKakuyomuNovelViewer(): NovelViewer | null {
    const scroller = document.scrollingElement;
    const episodeBody = document.querySelector<HTMLElement>(".js-episode-body");
    const bodyContainer = document.querySelector<HTMLElement>(".js-episode-body-container");
    if (!scroller || !episodeBody || !bodyContainer) return null;

    return {
      scroller,
      isVerticalWriting: getComputedStyle(episodeBody).writingMode === "vertical-rl",
      lineHeight: Number.parseFloat(getComputedStyle(bodyContainer).lineHeight),
    };
  }

  function getPixivMangaViewer(): MangaViewer | null {
    const mobileScroller = document.querySelector<HTMLElement>(".horizontal-viewer .content-frame");
    const scroller =
      mobileScroller ?? document.querySelector<HTMLElement>('div[dir="ltr"]:has([data-page])');
    if (!scroller) return null;

    const pager = document.querySelector<HTMLInputElement>(
      mobileScroller
        ? '.horizontal-viewer input[type="range"][dir]'
        : "input.gtm-manga-viewer-change-page",
    );
    const direction = pager?.dir;
    if (direction !== "rtl" && direction !== "ltr") return null;
    return { scroller, forwardDirection: direction === "rtl" ? -1 : 1 };
  }

  function turnMangaPage(mangaViewer: MangaViewer, forward: boolean) {
    const { scroller, forwardDirection } = mangaViewer;
    scroller.scrollBy({
      left: (forward ? 1 : -1) * forwardDirection * scroller.clientWidth,
      behavior: "auto",
    });
  }

  function turnNovelPage(novelViewer: NovelViewer, forward: boolean) {
    const { scroller, isVerticalWriting, lineHeight } = novelViewer;
    const viewportSize = isVerticalWriting ? scroller.clientWidth : scroller.clientHeight;
    const distance = Math.max(lineHeight, viewportSize - lineHeight * 2);
    const currentOffset = isVerticalWriting ? -scroller.scrollLeft : scroller.scrollTop;
    const maxOffset = isVerticalWriting
      ? scroller.scrollWidth - scroller.clientWidth
      : scroller.scrollHeight - scroller.clientHeight;
    const baseOffset =
      pendingScroll?.scroller === scroller && pendingScroll.isVerticalWriting === isVerticalWriting
        ? pendingScroll.targetOffset
        : currentOffset;
    const targetOffset = Math.max(
      0,
      Math.min(maxOffset, baseOffset + (forward ? 1 : -1) * distance),
    );

    pendingScroll = { scroller, isVerticalWriting, targetOffset };
    scroller.scrollTo(
      isVerticalWriting
        ? { left: -targetOffset, behavior: "smooth" }
        : { top: targetOffset, behavior: "smooth" },
    );
    if (Math.abs(currentOffset - targetOffset) < 1) clearPendingScroll();
  }

  window.addEventListener(
    "keydown",
    (event) => {
      if (
        (event.key !== "PageUp" && event.key !== "PageDown") ||
        event.defaultPrevented ||
        event.isComposing ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || target.closest('input, textarea, select, [role="textbox"]'))
      ) {
        return;
      }

      const shouldSkipPageTurn = isPixiv
        ? document.querySelector("#modal-mymenu, .bottom-popup-container, .popup") !== null
        : document.querySelector(
            ".js-viewer-setting-modal-container.isShown, .js-viewer-sidebar-container.contentAside-isShown",
          ) !== null;
      if (shouldSkipPageTurn) return;

      const mangaViewer = isPixiv ? getPixivMangaViewer() : null;
      const novelViewer = mangaViewer ? null : getNovelViewer();
      if (
        !mangaViewer &&
        (!novelViewer || !Number.isFinite(novelViewer.lineHeight) || novelViewer.lineHeight <= 0)
      ) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      if (event.repeat) return;

      const forward = event.key === "PageDown";
      if (mangaViewer) {
        turnMangaPage(mangaViewer, forward);
      } else if (novelViewer) {
        turnNovelPage(novelViewer, forward);
      }
    },
    true,
  );
})();
