// ==UserScript==
// @name         annict-twitter-link
// @namespace    https://ches3.me/
// @version      2026.10.16.0
// @description  https://github.com/ches3/userscripts#annict-twitter-link
// @homepageURL  https://github.com/ches3/userscripts#annict-twitter-link
// @author       ches3
// @match        https://annict.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=annict.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

declare function GM_getValue(key: string, defaultValue: string): string;
declare function GM_setValue(key: string, value: string): void;
declare function GM_registerMenuCommand(name: string, callback: () => void): number | string;

(() => {
  const tokenStorageKey = "annict-access-token";

  GM_registerMenuCommand("Annictトークンを設定", () => {
    const token = window.prompt("Annictのアクセストークンを入力してください（空欄で削除）");
    if (token === null) {
      return;
    }
    GM_setValue(tokenStorageKey, token.trim());
    location.reload();
  });

  const getWorkId = (): string | null => {
    const match = location.pathname.match(/^\/works\/(\d+)(?:\/|$)/);
    return match ? match[1] : null;
  };

  const fetchTwitterUsername = async (
    workId: string,
    accessToken: string,
  ): Promise<string | null> => {
    const url = `https://api.annict.com/v1/works?filter_ids=${workId}&access_token=${encodeURIComponent(accessToken)}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch work data: ${res.status} ${res.statusText}`);
    }
    const data: unknown = await res.json();
    if (
      typeof data !== "object" ||
      data === null ||
      !("works" in data) ||
      !Array.isArray(data.works)
    ) {
      throw new Error("Invalid work data");
    }
    const works: unknown[] = data.works;
    const work = works[0];
    if (work === undefined) {
      return null;
    }
    if (
      typeof work !== "object" ||
      work === null ||
      !("twitter_username" in work) ||
      (work.twitter_username !== null && typeof work.twitter_username !== "string")
    ) {
      throw new Error("Invalid Twitter username");
    }
    return work.twitter_username === "" ? null : work.twitter_username;
  };

  const insertTwitterLink = (twitterUsername: string) => {
    const container = document.querySelector("ul.list-inline.mb-0");
    if (!container) {
      console.error("Link container not found");
      return;
    }

    const existingLinks = container.querySelectorAll("a");
    const hasTwitterLink = Array.from(existingLinks).some(
      (link) => link.textContent.includes("Twitter") || link.textContent.includes("X"),
    );
    if (hasTwitterLink) {
      return;
    }

    const li = document.createElement("li");
    li.className = "list-inline-item";

    const twitterLink = document.createElement("a");
    twitterLink.href = `https://twitter.com/${twitterUsername}`;
    twitterLink.target = "_blank";
    twitterLink.rel = "noopener";
    twitterLink.innerHTML =
      'Twitter <i class="fa-solid fa-external-link-alt ms-1 small" aria-hidden="true"></i>';

    li.appendChild(twitterLink);
    container.appendChild(li);
  };

  const twitterUsernameCache = new Map<string, Promise<string | null>>();

  const main = async () => {
    const workId = getWorkId();
    if (workId === null) {
      return;
    }
    const accessToken = GM_getValue(tokenStorageKey, "");
    if (!accessToken) {
      return;
    }

    try {
      let twitterUsernamePromise = twitterUsernameCache.get(workId);

      if (twitterUsernamePromise === undefined) {
        twitterUsernamePromise = fetchTwitterUsername(workId, accessToken).catch(
          (error: unknown) => {
            twitterUsernameCache.delete(workId);
            throw error;
          },
        );
        twitterUsernameCache.set(workId, twitterUsernamePromise);
      }

      const twitterUsername = await twitterUsernamePromise;
      if (getWorkId() === workId && twitterUsername !== null && twitterUsername !== "") {
        insertTwitterLink(twitterUsername);
      }
    } catch (error: unknown) {
      console.error("Failed to add Twitter link", error);
    }
  };

  document.addEventListener("turbo:load", () => {
    void main();
  });

  void main();
})();
