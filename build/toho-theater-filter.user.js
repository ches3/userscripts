"use strict";
// ==UserScript==
// @name         toho-theater-filter
// @namespace    https://ches3.me/
// @version      2024-08-16
// @description  TOHO THEATER LISTの上映館リストを絞り込む
// @author       ches3
// @match        https://theater.toho.co.jp/toho_theaterlist/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=theater.toho.co.jp
// @grant        none
// ==/UserScript==
(() => {
    const excludeList = [
        "イオンシネマ浦和美園",
        "イオンシネマ大宮",
        "ユナイテッド・シネマ浦和",
        "１０９シネマズ菖蒲",
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
        "ＴＯＨＯシネマズららぽーと富士見",
        "ユナイテッド・シネマ入間",
        "ユナイテッド・シネマ ウニクス南古谷",
        "ユナイテッド・シネマ新座",
        "ユナイテッド・シネマわかば",
        "ＵＳシネマ木更津",
        "イオンシネマ千葉ニュータウン",
        "ＴＯＨＯシネマズ柏",
        "ＵＳシネマ千葉ニュータウン",
        "旭サンモールシネマ",
        "ＴＯＨＯシネマズ市原",
        "ＵＳシネマちはら台",
        "成田ＨＵＭＡXシネマズ",
        "１０９シネマズ二子玉川",
        "イオンシネマ板橋",
        "T・ジョイSEIBU大泉",
        "ユナイテッド・シネマとしまえん",
        "ＴＯＨＯシネマズ西新井",
        "イオンシネマ シアタス調布",
        "イオンシネマ多摩センター",
        "イオンシネマ日の出",
        "イオンシネマむさし村山",
        "１０９シネマズグランベリーパーク",
        "ＴＯＨＯシネマズ府中",
        "ＴＯＨＯシネマズ南大沢",
        "１０９シネマズ港北",
        "イオンシネマ港北ニュータウン",
        "イオンシネマみなとみらい",
        "ＴＯＨＯシネマズ上大岡",
        "ＴＯＨＯシネマズららぽーと横浜",
        "１０９シネマズ川崎",
        "イオンシネマ新百合ヶ丘",
        "ＴＯＨＯシネマズ川崎",
        "１０９シネマズ湘南",
        "イオンシネマ茅ヶ崎",
        "シネプレックス平塚",
        "横須賀ＨＵＭＡXシネマズ",
        "イオンシネマ海老名",
        "小田原コロナシネマワールド",
        "ＴＯＨＯシネマズ海老名",
        "ＴＯＨＯシネマズ小田原",
        "ＴＯＨＯシネマズ水戸内原",
        "ユナイテッド・シネマ水戸",
        "シネマサンシャイン土浦",
        "シネプレックスつくば",
        "ＭＯＶＩＸつくば",
        "ＵＳシネマつくば",
        "ＴＯＨＯシネマズひたちなか",
        "ＵＳシネマパルナ稲敷",
        "イオンシネマ守谷",
        "ＴＯＨＯシネマズ宇都宮",
        "ＭＯＶＩＸ宇都宮",
        "小山シネマハーヴェスト",
        "１０９シネマズ佐野",
        "フォーラム那須塩原",
        "ユナイテッド・シネマ アシコタウンあしかが",
        "ユナイテッド・シネマ前橋",
        "１０９シネマズ高崎",
        "イオンシネマ高崎",
        "小田原コロナワールド",
        "熊谷シネティアラ２１",
        "こうのすシネマ",
        "ユナイテッド・シネマウニクス南古谷",
        "ユナイテッド・シネマウニクス上里",
        "ＴＯＨＯシネマズ甲府",
    ];
    const favoriteList = [
        "ＭＯＶＩＸさいたま",
        "ＴＯＨＯシネマズららぽーと船橋",
        "ＭＯＶＩＸ柏の葉",
        "ＴＯＨＯシネマズ日本橋",
        "丸の内ピカデリー",
        "新宿バルト９",
        "新宿ピカデリー",
        "グランドシネマサンシャイン 池袋",
        "TOHOシネマズ池袋",
        "T・ジョイPRINCE品川",
        "ＭＯＶＩＸ亀有",
        "立川シネマシティ",
        "ＴＯＨＯシネマズ立川立飛",
        "横浜ブルク１３",
        "川崎チネチッタ",
        "ＴＯＨＯシネマズ日比谷",
        "T・ジョイエミテラス所沢",
    ];
    const crossToLine = (elem) => {
        elem.setAttribute("class", "line");
    };
    const open = (elem) => {
        elem.setAttribute("style", "overflow: hidden; display: block;");
    };
    const openKanto = () => {
        const kantoIcon = document.querySelector("#region3 > div");
        const kantoUl = document.querySelector("#region3 > ul");
        if (!kantoIcon || !kantoUl) {
            return;
        }
        crossToLine(kantoIcon);
        open(kantoUl);
    };
    const openPrefectures = () => {
        const prefectures = document.querySelectorAll("#region3 > ul > li");
        if (prefectures.length === 0) {
            return;
        }
        for (const prefecture of prefectures) {
            const prefectureIcon = prefecture.querySelector("p");
            const prefectureLi = prefecture.querySelector("table");
            if (!prefectureIcon || !prefectureLi) {
                continue;
            }
            crossToLine(prefectureIcon);
            open(prefectureLi);
        }
    };
    const filter = () => {
        var _a;
        const theaterElemList = document.querySelectorAll("#region3 table tbody tr");
        for (const theaterElem of theaterElemList) {
            const item_title = (_a = theaterElem.querySelector("a")) === null || _a === void 0 ? void 0 : _a.textContent;
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
            openKanto();
            openPrefectures();
            filter();
        }
    });
})();
