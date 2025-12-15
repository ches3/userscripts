"use strict";
// ==UserScript==
// @name         u-next
// @namespace    https://ches3.me/
// @version      2024-07-24
// @description  U-NEXT関連
// @author       ches3
// @match        https://video.unext.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=video.unext.jp
// @grant        none
// ==/UserScript==
(() => {
    const asyncQuerySelector = (selector, timeout = 10000) => {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                }
            }, 500);
            setTimeout(() => {
                clearInterval(interval);
                reject(new Error(`Timeout: ${selector}`));
            }, timeout);
        });
    };
    let currentURL;
    let title;
    let episode;
    // タイムラインでロードされていない範囲にジャンプした際、タイトルがデフォルトに戻ってしまうのを防ぐ
    setInterval(() => {
        if (title && episode) {
            document.title = `${title} ${episode} | U-NEXT`;
        }
    }, 1000);
    setInterval(async () => {
        if (currentURL === location.href) {
            return;
        }
        currentURL = location.href;
        if (!location.pathname.match(/^\/play\//)) {
            title = "";
            episode = "";
            return;
        }
        // ダブルクリックでフルスクリーン切り替え
        const videoParent = await asyncQuerySelector("#videoFullScreenWrapper");
        const fullscreenButton = await asyncQuerySelector('[data-ucn="player-windowControl-fullScreen"]');
        if (!(fullscreenButton instanceof HTMLButtonElement)) {
            console.error("UserScript error: fullscreenButton is not HTMLButtonElement.");
            return;
        }
        videoParent.addEventListener("dblclick", () => {
            fullscreenButton.click();
        });
        // 作品タイトルをページタイトルに設定
        title = (await asyncQuerySelector("h2")).innerHTML;
        episode = (await asyncQuerySelector("h3")).innerHTML;
        document.title = `${title} ${episode} | U-NEXT`;
        // 次のエピソードへ即時遷移する
        const videoElem = await asyncQuerySelector("video");
        videoElem.addEventListener("ended", () => {
            const skipElem = document.querySelector(`[src^="//imgc.nxtv.jp/img/info/eps/"]:has(svg)`);
            if (!(skipElem instanceof HTMLElement)) {
                console.error("UserScript error: skipElem not found.");
                return;
            }
            skipElem.click();
        });
    }, 1000);
})();
