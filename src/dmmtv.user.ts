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

(() => {
	const asyncQuerySelector = (selector: string, timeout = 10000) => {
		return new Promise<Element>((resolve, reject) => {
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

	let currentURL: string;

	setInterval(async () => {
		if (currentURL === location.href) {
			return;
		}
		currentURL = location.href;

		if (!location.pathname.match(/^\/vod\/playback\//)) {
			return;
		}

		// ダブルクリックでフルスクリーン切り替え
		const videoParent = await asyncQuerySelector("#vodWrapper");
		videoParent.addEventListener("dblclick", () => {
			const fullscreenButton = document.querySelector(
				'[aria-label="フルスクリーン"]',
			);
			if (fullscreenButton instanceof HTMLButtonElement) {
				fullscreenButton.click();
			}
		});
	}, 1000);
})();
