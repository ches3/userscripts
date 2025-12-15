"use strict";
// ==UserScript==
// @name         showroom-shortcut
// @namespace    https://ches3.me/
// @version      2025-12-15
// @description  SHOWROOMにショートカットキーを追加する
// @author       ches3
// @match        https://www.showroom-live.com/r/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=showroom-live.com
// @grant        none
// ==/UserScript==
(() => {
    function toggleFullscreen() {
        const video = document.querySelector("video");
        if (!video) {
            return;
        }
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        else {
            video.requestFullscreen();
        }
    }
    function toggleMute() {
        const video = document.querySelector("video");
        if (!video) {
            return;
        }
        video.muted = !video.muted;
    }
    function togglePlay() {
        const video = document.querySelector("video");
        if (!video) {
            return;
        }
        if (video.paused) {
            video.play();
        }
        else {
            video.pause();
        }
    }
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey || e.shiftKey || e.altKey) {
            return;
        }
        const focusedElement = document.activeElement;
        if (!focusedElement) {
            return;
        }
        if (focusedElement.tagName === "INPUT" ||
            focusedElement.tagName === "TEXTAREA") {
            return;
        }
        if (e.key === " ") {
            e.preventDefault();
            togglePlay();
        }
        else if (e.key === "f") {
            e.preventDefault();
            toggleFullscreen();
        }
        else if (e.key === "m") {
            e.preventDefault();
            toggleMute();
        }
    });
})();
