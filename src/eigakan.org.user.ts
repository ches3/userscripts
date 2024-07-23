// ==UserScript==
// @name         eigakan.org
// @namespace    https://ches3.me/
// @version      2024-07-24
// @description  eigakan.orgの上映館リストを絞り込む
// @author       ches3
// @match        *://eigakan.org/theaterpage/schedule.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eigakan.org
// @grant        none
// ==/UserScript==

(() => {
	const excludeList = [
		"イオンシネマ浦和美園",
		"イオンシネマ大宮",
		"ユナイテッド・シネマ浦和",
		"109シネマズ菖蒲",
		"イオンシネマ春日部",
		"イオンシネマ熊谷",
		"イオンシネマ羽生",
		"シネティアラ21",
		"シネプレックス幸手",
		"ユナイテッド・シネマ ウニクス上里",
		"ユナイテッド・シネマ春日部",
		"イオンシネマ大井",
		"イオンシネマ川口",
		"イオンシネマ越谷レイクタウン",
		"TOHOシネマズららぽーと富士見",
		"ユナイテッド・シネマ入間",
		"ユナイテッド・シネマ ウニクス南古谷",
		"ユナイテッド・シネマ新座",
		"ユナイテッド・シネマわかば",
		"USシネマ木更津",
		"イオンシネマ千葉ニュータウン",
		"TOHOシネマズ柏",
		"USシネマ千葉ニュータウン",
		"旭サンモールシネマ",
		"TOHOシネマズ市原",
		"USシネマちはら台",
		"成田HUMAXシネマズ",
		"109シネマズ二子玉川",
		"イオンシネマ板橋",
		"T・ジョイSEIBU大泉",
		"ユナイテッド・シネマとしまえん",
		"TOHOシネマズ西新井",
		"イオンシネマ シアタス調布",
		"イオンシネマ多摩センター",
		"イオンシネマ日の出",
		"イオンシネマむさし村山",
		"109シネマズグランベリーパーク",
		"TOHOシネマズ府中",
		"TOHOシネマズ南大沢",
		"109シネマズ港北",
		"イオンシネマ港北ニュータウン",
		"イオンシネマみなとみらい",
		"TOHOシネマズ上大岡",
		"TOHOシネマズららぽーと横浜",
		"109シネマズ川崎",
		"イオンシネマ新百合ヶ丘",
		"TOHOシネマズ川崎",
		"109シネマズ湘南",
		"イオンシネマ茅ヶ崎",
		"シネプレックス平塚",
		"横須賀HUMAXシネマズ",
		"イオンシネマ海老名",
		"小田原コロナシネマワールド",
		"TOHOシネマズ海老名",
		"TOHOシネマズ小田原",
		"TOHOシネマズ水戸内原",
		"ユナイテッド・シネマ水戸",
		"シネマサンシャイン土浦",
		"シネプレックスつくば",
		"MOVIXつくば",
		"USシネマつくば",
		"TOHOシネマズひたちなか",
		"USシネマパルナ稲敷",
		"イオンシネマ守谷",
		"TOHOシネマズ宇都宮",
		"MOVIX宇都宮",
		"小山シネマハーヴェスト",
		"109シネマズ佐野",
		"フォーラム那須塩原",
		"ユナイテッド・シネマ アシコタウンあしかが",
		"ユナイテッド・シネマ前橋",
		"109シネマズ高崎",
		"イオンシネマ高崎",
	];

	const favoriteList = [
		"MOVIXさいたま",
		"TOHOシネマズららぽーと船橋",
		"MOVIX柏の葉",
		"TOHOシネマズ日本橋",
		"丸の内ピカデリー",
		"新宿バルト9",
		"新宿ピカデリー",
		"グランドシネマサンシャイン 池袋",
		"TOHOシネマズ池袋",
		"T・ジョイPRINCE品川",
		"MOVIX亀有",
		"立川シネマシティ",
		"TOHOシネマズ立川立飛",
		"横浜ブルク13",
		"川崎チネチッタ",
	];

	const areaFilter = () => {
		const areaElemList = document.querySelectorAll(
			".theater_list:not(#area03)",
		);
		for (const areaElem of areaElemList) {
			areaElem.setAttribute("style", "display:none;");
		}
	};

	const theaterFilter = () => {
		const theaterElemList = document.querySelectorAll(
			".theater_list table tbody tr",
		);

		for (const theaterElem of theaterElemList) {
			const item_title =
				theaterElem.querySelector(".theater_name")?.textContent;
			if (!item_title) {
				continue;
			}

			for (const title of excludeList) {
				if (item_title.includes(title)) {
					theaterElem.setAttribute("style", "display:none;");
				}
			}
			for (const theater of favoriteList) {
				if (item_title.includes(theater)) {
					theaterElem.setAttribute("style", "background-color:#ffffaa;");
				}
			}
		}
	};

	document.addEventListener("keydown", (e) => {
		if (e.ctrlKey && e.key === "q") {
			areaFilter();
			theaterFilter();
		}
	});
})();
