// ==UserScript==
// @name         youtube-subscriptions-to-videos
// @namespace    https://ches3.me/
// @version      2026.10.16.0
// @description  https://github.com/ches3/userscripts#youtube-subscriptions-to-videos
// @homepageURL  https://github.com/ches3/userscripts#youtube-subscriptions-to-videos
// @author       ches3
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(() => {
  interface GuideEntryElement extends HTMLElement {
    data?: {
      navigationEndpoint?: {
        browseEndpoint?: { params?: string };
        commandMetadata?: { webCommandMetadata?: { url?: string } };
      };
    };
  }

  const linkSelector =
    'ytd-guide-section-renderer:has(a[href="/feed/subscriptions"]) ytd-guide-entry-renderer a#endpoint[href]';
  // YouTubeの「動画」タブが使うbrowseEndpoint.params。
  const videosTabParams = "EgZ2aWRlb3PyBgQKAjoA";

  const getVideosUrl = (link: HTMLAnchorElement): string | null => {
    const url = new URL(link.href);
    const match = url.pathname.match(/^(\/(?:@[^/]+|channel\/[^/]+))(?:\/videos)?\/?$/);
    if (url.origin !== location.origin || match === null) {
      return null;
    }
    url.pathname = `${match[1]}/videos`;
    return url.href;
  };

  const updateLink = (link: HTMLAnchorElement) => {
    const videosUrl = getVideosUrl(link);
    if (videosUrl === null) {
      return;
    }
    if (link.href !== videosUrl) {
      link.href = videosUrl;
    }

    const endpoint = link.closest<GuideEntryElement>("ytd-guide-entry-renderer")?.data
      ?.navigationEndpoint;
    const browseEndpoint = endpoint?.browseEndpoint;
    const webCommandMetadata = endpoint?.commandMetadata?.webCommandMetadata;
    if (browseEndpoint !== undefined && webCommandMetadata !== undefined) {
      browseEndpoint.params = videosTabParams;
      webCommandMetadata.url = new URL(videosUrl).pathname;
    }
  };

  const updateLinks = () => {
    for (const link of document.querySelectorAll<HTMLAnchorElement>(linkSelector)) {
      updateLink(link);
    }
  };

  const handleClick = (event: MouseEvent) => {
    if (event.button > 1 || !(event.target instanceof Element)) {
      return;
    }
    const link = event.target.closest(linkSelector);
    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }
    updateLink(link);
  };

  window.addEventListener("click", handleClick, true);

  const observer = new MutationObserver(updateLinks);
  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["href"],
  });
  updateLinks();
})();
