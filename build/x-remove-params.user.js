"use strict";
// ==UserScript==
// @name         x-remove-params
// @namespace    https://ches3.me/
// @version      2024.07.24.0
// @description  https://github.com/ches3/userscripts#x-remove-params
// @homepageURL  https://github.com/ches3/userscripts#x-remove-params
// @author       ches3
// @match        https://x.com/*/status/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @run-at       document-start
// ==/UserScript==
(() => {
    const removeParams = ["t", "s", "ref_src", "ref_url"];
    const searchParams = new URLSearchParams(location.search);
    if (!removeParams.some((param) => {
        const value = searchParams.get(param);
        return value !== null && value !== "";
    })) {
        return;
    }
    for (const param of removeParams) {
        searchParams.delete(param);
    }
    const newHref = location.pathname + searchParams.toString();
    window.history.replaceState({}, "", newHref);
})();
