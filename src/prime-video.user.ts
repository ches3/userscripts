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

(async () => {
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

	const playerElem = await asyncQuerySelector("#dv-web-player");
	if (!playerElem) {
		return;
	}

	let intervalId: number;
	const observer = new MutationObserver(async () => {
		if (!playerElem.classList.contains("dv-player-fullscreen")) {
			document.title = "Prime Video";
			clearInterval(intervalId);
			return;
		}

		// 作品タイトルをページタイトルに設定
		const title = (await asyncQuerySelector("#dv-web-player h1")).textContent;
		const subTitle = (await asyncQuerySelector("#dv-web-player h2"))
			.textContent;
		if (title && subTitle) {
			document.title = `${title} ${subTitle} | Prime Video`;
		} else if (title) {
			document.title = `${title} | Prime Video`;
		}

		// 次のエピソードへの自動遷移を無効化
		intervalId = setInterval(() => {
			const nextUpHideButton = document.querySelector(
				".atvwebplayersdk-nextupcardhide-button",
			);
			if (
				!nextUpHideButton ||
				!(nextUpHideButton instanceof HTMLButtonElement)
			) {
				return;
			}
			nextUpHideButton.click();
		}, 1000);
	});
	observer.observe(playerElem, {
		attributes: true,
	});
})();
