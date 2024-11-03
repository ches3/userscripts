"use strict";
// ==UserScript==
// @name         DMM TV
// @namespace    https://ches3.me/
// @version      2024-11-04
// @description  DMM TV関連
// @author       ches3
// @match        https://tv.dmm.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tv.dmm.com
// @grant        none
// ==/UserScript==
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        if (currentURL === location.href) {
            return;
        }
        currentURL = location.href;
        if (!location.pathname.match(/^\/vod\/playback\//)) {
            return;
        }
        // ダブルクリックでフルスクリーン切り替え
        const videoParent = yield asyncQuerySelector("#vodWrapper");
        videoParent.addEventListener("dblclick", () => {
            const fullscreenButton = document.querySelector('[aria-label="フルスクリーン"]');
            if (fullscreenButton instanceof HTMLButtonElement) {
                fullscreenButton.click();
            }
        });
    }), 1000);
})();
