"use strict";
// ==UserScript==
// @name         imdb-ratings-csv
// @namespace    https://ches3.me/
// @version      2026-08-05
// @description  IMDb の ratings history を CSV としてクリップボードにコピーする
// @author       ches3
// @match        https://www.imdb.com/user/*/ratings*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @grant        none
// ==/UserScript==
(() => {
    const HEADERS = [
        "imdb_id",
        "title",
        "rated_on",
        "year",
        "runtime",
        "imdb_rating",
        "my_rating",
        "directors",
        "actors",
        "poster_url",
        "title_url",
    ];
    const escapeCsvField = (value) => {
        if (/[",\n\r]/.test(value)) {
            return `"${value.replaceAll('"', '""')}"`;
        }
        return value;
    };
    const toCsv = (rows) => {
        const lines = [
            HEADERS.join(","),
            ...rows.map((row) => HEADERS.map((key) => escapeCsvField(row[key])).join(",")),
        ];
        return `${lines.join("\n")}\n`;
    };
    const parseItem = (item) => {
        const titleLink = item.querySelector("a.ipc-title-link-wrapper");
        const href = titleLink?.getAttribute("href") ?? "";
        const imdbId = href.includes("/title/")
            ? (href.split("/title/")[1]?.split(/[/?]/)[0] ?? "")
            : "";
        if (!imdbId) {
            return null;
        }
        const titleRaw = item.querySelector(".ipc-title__text")?.textContent?.trim() ?? "";
        const title = titleRaw.replace(/^\d+\.\s*/, "");
        const ratedOn = item
            .querySelector(".dli-user-list-item-date-added")
            ?.textContent?.trim()
            .replace(/^Rated on\s*/i, "") ?? "";
        const meta = [
            ...item.querySelectorAll("ul.ipc-inline-list li.ipc-inline-list__item"),
        ].map((el) => el.textContent?.trim() ?? "");
        const imdbRatingEl = item.querySelector('[data-testid="ratingGroup--imdb-rating"]');
        const imdbRating = imdbRatingEl
            ?.getAttribute("aria-label")
            ?.match(/IMDb rating:\s*([\d.]+)/i)?.[1] ??
            imdbRatingEl
                ?.querySelector(".ipc-rating-star--rating")
                ?.textContent?.trim() ??
            "";
        const myRating = item
            .querySelector('[data-testid="rate-button"]')
            ?.getAttribute("aria-label")
            ?.replace(/^Your rating:\s*/i, "")
            .trim() ?? "";
        const nameLinks = [
            ...item.querySelectorAll('a[href*="/name/"]'),
        ];
        const directors = nameLinks
            .filter((a) => /ref_=rt_li_1_/.test(a.getAttribute("href") ?? ""))
            .map((a) => a.textContent?.trim() ?? "")
            .filter(Boolean)
            .join("; ");
        const actors = nameLinks
            .filter((a) => /ref_=rt_li_2_/.test(a.getAttribute("href") ?? ""))
            .map((a) => a.textContent?.trim() ?? "")
            .filter(Boolean)
            .join("; ");
        const posterUrl = item.querySelector("img.ipc-image")?.src ?? "";
        const titleUrl = `https://www.imdb.com/title/${imdbId}/`;
        return {
            imdb_id: imdbId,
            title,
            rated_on: ratedOn,
            year: meta[0] ?? "",
            runtime: meta[1] ?? "",
            imdb_rating: imdbRating,
            my_rating: myRating,
            directors,
            actors,
            poster_url: posterUrl,
            title_url: titleUrl,
        };
    };
    const collectRows = () => {
        const items = document.querySelectorAll("li.ipc-metadata-list-summary-item");
        const rows = [];
        for (const item of items) {
            const row = parseItem(item);
            if (row) {
                rows.push(row);
            }
        }
        return rows;
    };
    const sortContainer = document.querySelector('[data-testid="sort-container"]');
    if (!sortContainer?.parentElement) {
        return;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.id = "imdb-ratings-csv-btn";
    button.textContent = "Copy CSV";
    button.title = "Copy ratings as CSV";
    const style = document.createElement("style");
    style.textContent = `
		#imdb-ratings-csv-btn {
			box-sizing: border-box;
			width: 92px;
			height: 36px;
			padding: 0;
			margin-right: 8px;
			border: 1px solid var(--ipt-base-border-color, hsl(0 0% 0% / 0.12));
			border-radius: 4px;
			background: transparent;
			color: var(--ipt-on-base-textSecondary-color, hsl(0 0% 0% / 0.54));
			font-family: Roboto, Helvetica, Arial, sans-serif;
			font-size: 14px;
			font-weight: 400;
			letter-spacing: 0.28px;
			line-height: 24px;
			text-align: center;
			cursor: pointer;
			white-space: nowrap;
			flex-shrink: 0;
			outline: none;
		}
		#imdb-ratings-csv-btn:hover {
			background: var(--ipt-base-hover-color, hsl(0 0% 0% / 0.08));
		}
		#imdb-ratings-csv-btn:focus {
			outline: none;
		}
		#imdb-ratings-csv-btn:focus-visible {
			box-shadow: inset 0 0 0 1px var(--ipt-base-border-color, hsl(0 0% 0% / 0.12));
		}
		#imdb-ratings-csv-btn:active {
			background: var(--ipt-base-hover-color, hsl(0 0% 0% / 0.08));
		}
	`;
    document.head.appendChild(style);
    button.addEventListener("click", async () => {
        const rows = collectRows();
        const csv = toCsv(rows);
        try {
            await navigator.clipboard.writeText(csv);
            button.textContent = "Copied!";
            setTimeout(() => {
                button.textContent = "Copy CSV";
            }, 1500);
        }
        catch (error) {
            console.error("UserScript error: failed to copy CSV", error);
            button.textContent = "Failed";
            setTimeout(() => {
                button.textContent = "Copy CSV";
            }, 1500);
        }
    });
    sortContainer.parentElement.insertBefore(button, sortContainer);
})();
