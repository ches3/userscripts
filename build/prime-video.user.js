"use strict";
// ==UserScript==
// @name         prime-video
// @namespace    https://ches3.me/
// @version      2024-07-24
// @description  Prime Video関連
// @author       ches3
// @match        https://www.amazon.co.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.co.jp
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
(() => __awaiter(void 0, void 0, void 0, function* () {
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
    const playerElem = yield asyncQuerySelector("#dv-web-player");
    if (!playerElem) {
        return;
    }
    let intervalId;
    const observer = new MutationObserver(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!playerElem.classList.contains("dv-player-fullscreen")) {
            document.title = "Prime Video";
            clearInterval(intervalId);
            return;
        }
        // 作品タイトルをページタイトルに設定
        const title = (yield asyncQuerySelector("#dv-web-player h1")).textContent;
        const subTitle = (yield asyncQuerySelector("#dv-web-player h2"))
            .textContent;
        if (title && subTitle) {
            document.title = `${title} ${subTitle} | Prime Video`;
        }
        else if (title) {
            document.title = `${title} | Prime Video`;
        }
        // 次のエピソードへの自動遷移を無効化
        intervalId = setInterval(() => {
            const nextUpHideButton = document.querySelector(".atvwebplayersdk-nextupcardhide-button");
            if (!nextUpHideButton ||
                !(nextUpHideButton instanceof HTMLButtonElement)) {
                return;
            }
            nextUpHideButton.click();
        }, 1000);
    }));
    observer.observe(playerElem, {
        attributes: true,
    });
}))();
