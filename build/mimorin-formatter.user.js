"use strict";
// ==UserScript==
// @name         mimorin-formatter
// @namespace    https://ches3.me/
// @version      2025-12-14
// @description  興行収入を見守りたい！のランキング表示を整形する
// @author       ches3
// @match        *://mimorin2014.com/blog-entry-*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mimorin2014.com
// @grant        none
// ==/UserScript==
(() => {
    const formatNumber = (numStr) => {
        // 先頭のアスタリスク(**)を除去して数値として整形
        const cleaned = numStr.replace(/^\*+/, "");
        const num = Number.parseInt(cleaned, 10);
        if (Number.isNaN(num)) {
            return numStr;
        }
        return num.toLocaleString();
    };
    const formatRankingLine = (line) => {
        // ランキング行のパターン:
        // *1　429608　848987　2931　278　100.5%　ズートピア２
        // 順位 販売数  座席数  回数 館数 先週比  映画名
        const pattern = /^([*\d]+)\s+([*\d]+)\s+([*\d]+)\s+([*\d]+)\s+([*\d]+)\s+([*\d.%]+)\s+(.+)$/;
        const match = line.match(pattern);
        if (!match) {
            return null;
        }
        const [, rank, sales, seats, shows, theaters, weekRatio, title] = match;
        // 着席率を計算（販売数÷座席数）
        const salesNum = Number.parseInt(sales.replace(/^\*+/, ""), 10);
        const seatsNum = Number.parseInt(seats.replace(/^\*+/, ""), 10);
        const occupancy = seatsNum > 0 ? `${((salesNum / seatsNum) * 100).toFixed(1)}%` : "-";
        // カラム幅を揃える
        const formattedRank = rank.replace(/^\*/, "").padStart(4, " ");
        const formattedSales = formatNumber(sales).padStart(9, " ");
        const formattedSeats = formatNumber(seats).padStart(9, " ");
        const formattedShows = formatNumber(shows).padStart(6, " ");
        const formattedTheaters = formatNumber(theaters).padStart(4, " ");
        const formattedOccupancy = occupancy.padStart(6, " ");
        const formattedRatio = (weekRatio.replace(/^\*+/, "") || "-").padStart(6, " ");
        return `${formattedRank} | ${formattedSales} | ${formattedSeats} | ${formattedShows} | ${formattedTheaters} | ${formattedOccupancy} | ${formattedRatio} | ${title}`;
    };
    const formatRanking = () => {
        const entryBody = document.querySelector(".entry_body:not(:has(iframe))");
        if (!entryBody) {
            return;
        }
        // データを含むテキストを取得（<br>タグを改行に変換）
        const html = entryBody.innerHTML;
        const text = html
            .trim()
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<[^>]+>/g, "")
            .replace(/&nbsp;/g, " ");
        const lines = text.split("\n");
        const title = lines[0];
        const header = lines[1];
        if (header !== "順位 販売数 座席数 回数 館数 先週比 映画（作品名）") {
            return;
        }
        const formattedLines = [
            title.trim(),
            "",
            "順位 |    販売数 |    座席数 |   回数 | 館数 | 着席率 | 先週比 | 作品名",
            "-----|-----------|-----------|--------|------|--------|--------|---------",
        ];
        for (const line of lines.slice(2)) {
            const trimmed = line.trim();
            // データ行を整形
            const formatted = formatRankingLine(trimmed);
            if (formatted) {
                formattedLines.push(formatted);
            }
        }
        // 整形されたコンテンツで置き換え
        const pre = document.createElement("pre");
        pre.style.cssText = `
			font-family: monospace;
			font-size: 13px;
			line-height: 1.5;
			padding: 4px 0;
			overflow-x: auto;
			white-space: pre;
		`;
        pre.textContent = formattedLines.join("\n");
        entryBody.innerHTML = "";
        entryBody.appendChild(pre);
    };
    // ページ読み込み後に実行
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", formatRanking);
    }
    else {
        formatRanking();
    }
})();
