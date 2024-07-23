"use strict";
// ==UserScript==
// @name         d-anime
// @namespace    https://ches3.me/
// @version      2024-07-24
// @description  dアニメ関連
// @author       ches3
// @match        *://animestore.docomo.ne.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animestore.docomo.ne.jp
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
    var _a, _b;
    const asyncQuerySelector = (selector, timeout = 10000) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const intervalID = setInterval(() => {
                const elem = document.querySelector(selector);
                if (elem) {
                    clearInterval(intervalID);
                    resolve(elem);
                }
            }, 500);
            setTimeout(() => {
                clearInterval(intervalID);
                reject(new Error(`Timeout: ${selector}`));
            }, timeout);
        });
    });
    if (location.pathname === "/animestore/sc_d_pc") {
        // 再生ページ
        const backArea = document.querySelector(".backArea");
        const fullscreenButton = document.querySelector(".fullscreenButton");
        if (backArea && fullscreenButton instanceof HTMLButtonElement) {
            backArea.addEventListener("dblclick", () => {
                fullscreenButton.click();
            });
        }
        const titleElem = yield asyncQuerySelector(".pauseInfoTxt1").catch((err) => console.error(err));
        if (titleElem) {
            document.title = `${titleElem.innerHTML} - d-anime`;
        }
    }
    else if (location.pathname === "/animestore/mp_viw_pc") {
        // マイページ
        const linkElems = document.querySelectorAll("div.thumbnailContainer > a");
        for (const elem of linkElems) {
            const partId = (_a = elem.getAttribute("onclick")) === null || _a === void 0 ? void 0 : _a.match(/\d+/);
            elem.setAttribute("href", `https://anime.dmkt-sp.jp/animestore/sc_d_pc?partId=${partId}`);
            elem.removeAttribute("onclick");
        }
    }
    else if (location.pathname === "/animestore/ci_pc") {
        // 作品ページ
        const linkElems = document.querySelectorAll("section.clearfix > a.clearfix");
        for (const elem of linkElems) {
            const partId = (_b = elem.getAttribute("id")) === null || _b === void 0 ? void 0 : _b.match(/\d+/);
            elem.setAttribute("href", `https://anime.dmkt-sp.jp/animestore/sc_d_pc?partId=${partId}`);
        }
        // setInterval(() => {
        // 	console.log("setInterval");
        // 	const thumbElem = document.querySelector("#modalThumbImg");
        // 	if (!thumbElem) {
        // 		return;
        // 	}
        // 	const thumbUrl = thumbElem.getAttribute("src");
        // 	if (!thumbUrl) {
        // 		return;
        // 	}
        // 	const partIdMatch = thumbUrl.match(/anime_kv\/img\/(?:\d+\/){5}(\d{8})_/);
        // 	if (!partIdMatch) {
        // 		return;
        // 	}
        // 	const partId = partIdMatch[1];
        // 	const playButton = document.querySelector("#streamingQuality");
        // 	if (!playButton) {
        // 		return;
        // 	}
        // 	console.log(partId);
        // 	playButton
        // 		.querySelector("a")
        // 		?.setAttribute(
        // 			"href",
        // 			`https://anime.dmkt-sp.jp/animestore/sc_d_pc?partId=${partId}`,
        // 		);
        // }, 1000);
    }
}))();
