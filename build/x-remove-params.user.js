"use strict";
// ==UserScript==
// @name         x-remove-params
// @namespace    https://ches3.me/
// @version      2024-07-24
// @description  ツイートページの余計なパラメータを削除する
// @author       ches3
// @match        https://x.com/*/status/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @run-at       document-start
// ==/UserScript==
(() => {
    const searchParams = new URLSearchParams(location.search);
    if (!searchParams.get("t") && !searchParams.get("s")) {
        return;
    }
    searchParams.delete("t");
    searchParams.delete("s");
    const newHref = location.pathname + searchParams.toString();
    window.history.replaceState({}, "", newHref);
})();
