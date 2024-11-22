// ==UserScript==
// @name         mau2-wikipedia
// @namespace    https://ches3.me/
// @version      2024-11-22
// @description  mau2.comの声優ページにWikipediaのリンクを追加する
// @author       ches3
// @match        https://www.mau2.com/voice/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.mau2.com
// @run-at       document-body
// @grant        none
// ==/UserScript==

const getUrl = async (title: string) => {
	const endpoint = "https://ja.wikipedia.org/w/api.php";
	const params = new URLSearchParams({
		action: "query",
		titles: title,
		format: "json",
		origin: "*",
	});

	const res = await fetch(`${endpoint}?${params.toString()}`);
	if (!res.ok) {
		return;
	}
	const json = await res.json();

	if ("-1" in json.query.pages) {
		return;
	}

	return `https://ja.wikipedia.org/wiki/${title.replace(/ /g, "_")}`;
};

const createElement = (href: string) => {
	const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" style="height: 1em; width: 1em; padding: 0.2em;" fill="currentColor">
      <!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
      <path d="M640 51.2l-.3 12.2c-28.1 .8-45 15.8-55.8 40.3-25 57.8-103.3 240-155.3 358.6H415l-81.9-193.1c-32.5 63.6-68.3 130-99.2 193.1-.3 .3-15 0-15-.3C172 352.3 122.8 243.4 75.8 133.4 64.4 106.7 26.4 63.4 .2 63.7c0-3.1-.3-10-.3-14.2h161.9v13.9c-19.2 1.1-52.8 13.3-43.3 34.2 21.9 49.7 103.6 240.3 125.6 288.6 15-29.7 57.8-109.2 75.3-142.8-13.9-28.3-58.6-133.9-72.8-160-9.7-17.8-36.1-19.4-55.8-19.7V49.8l142.5 .3v13.1c-19.4 .6-38.1 7.8-29.4 26.1 18.9 40 30.6 68.1 48.1 104.7 5.6-10.8 34.7-69.4 48.1-100.8 8.9-20.6-3.9-28.6-38.6-29.4 .3-3.6 0-10.3 .3-13.6 44.4-.3 111.1-.3 123.1-.6v13.6c-22.5 .8-45.8 12.8-58.1 31.7l-59.2 122.8c6.4 16.1 63.3 142.8 69.2 156.7L559.2 91.8c-8.6-23.1-36.4-28.1-47.2-28.3V49.6l127.8 1.1 .2 .5z"/>
    </svg>
  `;

	const elem = document.createElement("div");
	elem.className = "vpInfoProp";
	elem.innerHTML = `
    <a href="${href}" style="display: flex; align-items: center;">
      ${svg}
      Wikipedia
    </a>
  `;
	return elem;
};

(async () => {
	// URLを取得
	const name = document.querySelector("h1")?.textContent;
	if (!name) {
		return;
	}
	const href = (await getUrl(`${name} (声優)`)) || (await getUrl(name));
	if (!href) {
		return;
	}

	// 要素を挿入
	const elem = createElement(href);

	const parentElem = document.querySelector(".vpInfoPerson");
	if (!parentElem) {
		return;
	}
	const birthdayElem = document.querySelector(
		".vpInfoProp:has(> .ig-birthday)",
	);
	if (!birthdayElem) {
		return;
	}
	parentElem.insertBefore(elem, birthdayElem);
})();
