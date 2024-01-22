"use strict";
const article = document.querySelector("article");
if (article) {
    const text = article.textContent;
    const wordMatchRegExp = /[^\s]+/g;
    if (text === null) {
        throw new Error("No text content found in the article");
    }
    const words = text.matchAll(wordMatchRegExp);
    const wordCount = Array.from(words).length;
    const readingTime = Math.ceil(wordCount / 200);
    const badge = document.createElement("p");
    badge.classList.add("color-secondary-text", "type--caption");
    badge.textContent = `⏱️ ${readingTime} min read`;
    const heading = document.querySelector("h1");
    const date = article.querySelector("time")?.parentNode;
    (date ?? heading)?.insertAdjacentElement("afterend", badge);
}
