// ==UserScript==
// @name         mimorin-filter
// @namespace    https://ches3.me/
// @version      2025-12-28
// @description  興行収入を見守りたい！の記事一覧をフィルタリング
// @author       ches3
// @match        *://mimorin2014.com/archives.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mimorin2014.com
// @grant        none
// ==/UserScript==

(() => {
	// フィルタリング対象のタイトルパターン
	const patterns = [
		/^（独立系を含む）土日合算ランキング：/,
		/^（独立系を含む）デイリー合算ランキング：/,
		/^（独立系を含む）週間合算ランキング：/,
	];

	let isFiltered = false;

	const toggleFilter = () => {
		isFiltered = !isFiltered;

		// 記事リストの各アイテムを取得
		const items = document.querySelectorAll<HTMLElement>(".list_body > li");

		for (const item of items) {
			const link = item.querySelector("a");
			if (!link) continue;

			const title = link.textContent?.trim() || "";
			const matches = patterns.some((pattern) => pattern.test(title));

			if (isFiltered) {
				// フィルタON: マッチしないものを非表示
				item.style.display = matches ? "" : "none";
			} else {
				// フィルタOFF: すべて表示
				item.style.display = "";
			}
		}

		// ステータス表示
		showStatus(isFiltered ? "フィルタ ON" : "フィルタ OFF");
	};

	const showStatus = (message: string) => {
		let statusElem = document.getElementById("mimorin-filter-status");
		if (!statusElem) {
			statusElem = document.createElement("div");
			statusElem.id = "mimorin-filter-status";
			statusElem.style.cssText = `
				position: fixed;
				top: 20px;
				right: 20px;
				padding: 8px 16px;
				background: rgba(0, 0, 0, 0.8);
				color: white;
				border-radius: 4px;
				font-size: 14px;
				z-index: 10000;
				transition: opacity 0.3s;
			`;
			document.body.appendChild(statusElem);
		}

		statusElem.textContent = message;
		statusElem.style.opacity = "1";

		setTimeout(() => {
			statusElem.style.opacity = "0";
		}, 1000);
	};

	// キーボードショートカット
	document.addEventListener("keydown", (e) => {
		if (e.ctrlKey && e.key === "q") {
			e.preventDefault();
			toggleFilter();
		}
	});
})();
