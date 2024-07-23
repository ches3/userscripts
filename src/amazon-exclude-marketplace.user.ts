// ==UserScript==
// @name         amazon-exclude-marketplace
// @namespace    https://ches3.me/
// @version      2024-07-24
// @description  マーケットプレイスの商品を除外する
// @author       ches3
// @match        *://www.amazon.co.jp/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.amazon.co.jp
// @grant        none
// ==/UserScript==

(() => {
	document.addEventListener("keydown", (e) => {
		if (e.ctrlKey && e.key === "q") {
			location.href = `${location.href}&emi=AN1VRQENFRJN5`;
		}
	});
})();
