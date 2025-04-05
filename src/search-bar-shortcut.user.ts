// ==UserScript==
// @name         Search Bar Shortcut
// @namespace    https://ches3.me/
// @version      2024-07-24
// @description  "/"キーで検索バーにフォーカスする
// @author       ches3
// @match        https://*.wikipedia.org/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.amazon.com/*
// @match        https://mail.google.com/*
// @match        http://ruijianime.com//*
// @match        https://video.unext.jp/*
// @match        https://sm.rakuten.co.jp/*
// @match        https://www.rakuten.co.jp/*
// @match        https://annict.com/*
// @match        https://www.mau2.com//*
// @match        https://www.gsmarena.com//*
// @match        https://ahkwiki.net/*
// @match        https://beatsaver.com/*
// @match        https://tv.dmm.com/*
// @match        https://www.futbin.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(async () => {
	const dict = [
		{
			host: "wikipedia.org",
			selector: '[name="search"]',
		},
		{
			host: "www.amazon.co.jp",
			selector: "#twotabsearchtextbox",
		},
		{
			host: "www.amazon.com",
			selector: "#twotabsearchtextbox",
		},
		{
			host: "mail.google.com",
			selector: "input[name=q]",
		},
		{
			host: "ruijianime.com",
			selector: "#srchanime",
		},
		{
			host: "video.unext.jp",
			selector: '[data-ucn="search-control-input"]',
		},
		{
			host: "sm.rakuten.co.jp",
			selector: "#topSearchKeyword",
		},
		{
			host: "www.rakuten.co.jp",
			selector: "#common-header-search-input",
		},
		{
			host: "annict.com",
			selector: "#q",
		},
		{
			host: "www.mau2.com",
			selector: ".searchQ",
		},
		{
			host: "www.gsmarena.com",
			selector: "#topsearch-text",
		},
		{
			host: "ahkwiki.net",
			selector: "#searchInput",
		},
		{
			host: "beatsaver.com",
			selector: ".form-control",
		},
		{
			host: "tv.dmm.com",
			selector: '[name="keyword"]',
		},
		{
			host: "www.futbin.com",
			selector: ".og-search-input",
		},
	];

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

	const getInputElement = async () => {
		const item = dict.find((item) => location.hostname === item.host);
		if (!item) {
			return;
		}

		const elem = await asyncQuerySelector(item.selector);
		if (!(elem instanceof HTMLInputElement)) {
			return;
		}

		return elem;
	};

	const searchInput = await getInputElement();
	if (!searchInput) {
		console.error("Input element not found.");
		return;
	}

	document.addEventListener("keydown", (e) => {
		if (e.key !== "/") {
			return;
		}

		const activeElement = document.activeElement;
		if ("INPUT" === activeElement?.tagName) {
			return;
		}
		if ("TEXTAREA" === activeElement?.tagName) {
			return;
		}

		searchInput.focus();
		e.preventDefault();
	});
})();
