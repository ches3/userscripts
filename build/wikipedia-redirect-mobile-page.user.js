"use strict";
// ==UserScript==
// @name         wikipedia-redirect-mobile-page
// @namespace    https://ches3.me/
// @version      2024-07-28
// @description  Wikipediaのモバイル版ページを通常版ページにリダイレクトする
// @author       ches3
// @match        https://*.m.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// ==/UserScript==
(() => {
    const isMobile = () => {
        const regex = /iPhone|Android.+Mobile/i;
        return regex.test(navigator.userAgent);
    };
    if (isMobile()) {
        return;
    }
    if (location.hostname.match(/\.m\.wikipedia\.org$/)) {
        const newHostname = location.hostname.replace(/\.m\.wikipedia\.org$/, ".wikipedia.org");
        location.hostname = newHostname;
    }
})();
