// ==UserScript==
// @name         regex101
// @namespace    https://ches3.me/
// @version      2026-07-02
// @description  ページ離脱時の確認ダイアログを無効化する
// @author       ches3
// @match        https://regex101.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=regex101.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

(() => {
  Object.defineProperty(window, "onbeforeunload", {
    configurable: true,
    enumerable: true,
    get: () => null,
    set: () => {},
  });
})();
