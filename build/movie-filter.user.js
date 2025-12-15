"use strict";
// ==UserScript==
// @name         movie-filter
// @namespace    https://ches3.me/
// @version      2024-07-24
// @description  映画館の予約サイトで作品を絞り込む
// @author       ches3
// @match        *://hlo.tohotheater.jp/*
// @match        *://www.smt-cinema.com/*
// @match        *://tjoy.jp/*
// @match        *://res.cinemacity.co.jp/*
// @match        *://cinecitta.co.jp/*
// @match        *://www.cinemasunshine.co.jp/*
// @match        *://109cinemas.net/*
// @match        *://www.unitedcinemas.jp/*
// @match        *://cinema.aeoncinema.com/*
// @match        *://cinema.korona.co.jp/*
// @match        *://www.cinequinto-ticket.jp/*
// @match				 *://rosa10.cineticket.jp/theater/keisei/schedule*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==
(async () => {
    const titleList = [
        "(イベント版)",
        "かがみの孤城",
        "THE FIRST SLAM DUNK",
        "ソードアート・オンライン",
        "すずめの戸締まり",
        "BLUE GIANT",
        "名探偵コナン",
        "青春ブタ野郎",
        "五等分の花嫁",
        "ハリー・ポッター",
        "ユーフォニアム",
        "アイドルマスター",
        "アリスとテレスのまぼろし工場",
        "ガールズ&パンツァー",
        "ガールズ＆パンツァー",
        "駒田蒸留所へようこそ",
        "さよならの朝に約束の花をかざろう",
        "うたの☆プリンスさまっ",
        "ONE PIECE FILM RED",
        "結束バンド",
        "ポールプリンセス",
        "ヴァイオレット・エヴァーガーデン",
        "聲の形",
        "リズと青い鳥",
        "傷物語",
        "大室家",
        "SPY×FAMILY",
        "ルパン三世",
        "ラブライブ",
        "パリピ孔明",
        "アイカツ",
        "ドラえもん",
        "秒速5センチメートル",
        "トラペジウム",
        "i☆Ris",
        "雲のむこう、約束の場所",
        "推しの子",
        "ぼっち・ざ・ろっく！",
        "ウマ娘",
        "この素晴らしい世界に祝福を",
        "IDOLM@STER",
        "ぼっち・ざ・ろっく",
        "Ryuichi Sakamoto",
        "数分間のエールを",
        "レヴュースタァライト",
        "HELLO WORLD",
        "アイの歌声を聴かせて",
        "サマーウォーズ",
        "きみの色",
        "ふれる。",
        "がんばっていきまっしょい",
        "BanG Dream",
        "あの日見た花の名前を僕達はまだ知らない。",
        "心が叫びたがってるんだ。",
        "空の青さを知る人よ",
        "君の名は。",
        "夏へのトンネル、さよならの出口",
        "KING OF PRISM",
        "ゆるキャン",
        "ガールズバンドクライ",
        "プロジェクトセカイ",
        "メイクアガール",
        "先輩はおとこのこ",
        "ヒプノシスマイク",
        "＝LOVE",
        "=LOVE",
        "鬼滅の刃",
        "サイダーのように言葉が湧き上がる",
        "小林さんちのメイドラゴン",
        "F1",
        "≠ME THE MOVIE",
        "不思議の国でアリスと",
        "チェンソーマン",
        "ゾンビランドサガ",
        "羅小黒戦記",
        "わたしが恋人になれるわけないじゃん",
        "果てしなきスカーレット",
    ];
    const isInclude = (title) => {
        const normalizedTitle = zenToHan(title);
        for (const t of titleList) {
            if (normalizedTitle.includes(zenToHan(t))) {
                return true;
            }
        }
        return false;
    };
    const addFilterAttribute = async (workSelector, titleSelector) => {
        const items = await asyncQuerySelectorAll(workSelector);
        for (const item of items) {
            const item_title = item.querySelector(titleSelector)?.textContent;
            if (!item_title) {
                continue;
            }
            if (isInclude(item_title)) {
                continue;
            }
            item.setAttribute("hide", "");
        }
    };
    const appendStyle = () => {
        const style = document.createElement("style");
        style.textContent = `[filter="true"] [hide] { display: none; }`;
        document.head.appendChild(style);
    };
    const toggleFilter = () => {
        const elem = document.querySelector("body");
        if (!elem) {
            return;
        }
        if (elem.getAttribute("filter") === "true") {
            elem.setAttribute("filter", "false");
        }
        else {
            elem.setAttribute("filter", "true");
        }
    };
    const setFilter = (value) => {
        const elem = document.querySelector("body");
        if (!elem) {
            return;
        }
        elem.setAttribute("filter", value ? "true" : "false");
    };
    const tjoyOpener = () => {
        const works = document.querySelectorAll("section");
        for (const work of works) {
            work
                .querySelector("section:not([hide]) .panel")
                ?.setAttribute("style", "display:block;");
        }
    };
    const asyncQuerySelector = (selector, timeout = 10000) => {
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
    };
    const asyncQuerySelectorAll = (selector, timeout = 10000) => {
        return new Promise((resolve, reject) => {
            const intervalID = setInterval(() => {
                const elements = document.querySelectorAll(selector);
                if (elements && elements.length > 0) {
                    clearInterval(intervalID);
                    resolve(elements);
                }
            }, 500);
            setTimeout(() => {
                clearInterval(intervalID);
                reject(new Error(`Timeout: ${selector}`));
            }, timeout);
        });
    };
    const zenToHan = (str) => {
        return str
            .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
            return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
        })
            .replace(/　/g, " ");
    };
    const theaterDict = [
        {
            host: "hlo.tohotheater.jp",
            mutationSelector: ".schedule.main",
            workSelector: ".schedule-body-section-item",
            titleSelector: "h5",
            functions: [],
        },
        {
            host: "www.smt-cinema.com",
            mutationSelector: ".dailyWrap",
            workSelector: ".daily section",
            titleSelector: "h2",
            functions: [],
        },
        {
            host: "tjoy.jp",
            mutationSelector: ".box-film-wapper",
            workSelector: "section",
            titleSelector: "h5",
            functions: [tjoyOpener],
        },
        {
            host: "res.cinemacity.co.jp",
            workSelector: ".time-table",
            titleSelector: "a",
            functions: [],
        },
        {
            host: "cinecitta.co.jp",
            workSelector: ".sche_cine_list_block",
            titleSelector: ".sche_cine_list_title",
            functions: [],
        },
        {
            host: "www.cinemasunshine.co.jp",
            mutationSelector: ".tab_content-wrap",
            workSelector: ".content-item",
            titleSelector: ".title",
            functions: [],
        },
        {
            host: "109cinemas.net",
            mutationSelector: ".schedule-timetable-area",
            workSelector: ".schedule-timetable-area article",
            titleSelector: "h2",
            functions: [],
        },
        {
            host: "www.unitedcinemas.jp",
            workSelector: "#dailyList > li",
            titleSelector: ".movieTitle a",
            functions: [],
        },
        {
            host: "cinema.aeoncinema.com",
            workSelector: ".movielist",
            titleSelector: "div.title > p > a",
            functions: [],
        },
        {
            host: "cinema.korona.co.jp",
            mutationSelector: ".tab_content-wrap",
            workSelector: ".content-item",
            titleSelector: ".title",
            functions: [],
        },
        {
            host: "www.cinequinto-ticket.jp",
            workSelector: ".movie-panel",
            titleSelector: ".title-jp",
            functions: [],
        },
        {
            host: "rosa10.cineticket.jp",
            workSelector: ".movie-panel",
            titleSelector: ".title-jp",
            functions: [],
        },
    ];
    const theater = theaterDict.find((t) => location.hostname === t.host);
    if (!theater) {
        return;
    }
    addFilterAttribute(theater.workSelector, theater.titleSelector);
    appendStyle();
    if (theater.mutationSelector) {
        const target = await asyncQuerySelector(theater.mutationSelector);
        const observer = new MutationObserver(() => {
            setFilter(false);
            addFilterAttribute(theater.workSelector, theater.titleSelector);
        });
        observer.observe(target, {
            childList: true,
            subtree: true,
        });
    }
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "q") {
            toggleFilter();
            for (const f of theater.functions) {
                f();
            }
        }
    });
})();
