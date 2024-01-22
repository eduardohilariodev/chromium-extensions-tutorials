"use strict";
(async () => {
    const tabs = await chrome.tabs.query({
        url: ["https://developer.chrome.com/docs/webstore/*", "https://developer.chrome.com/docs/extensions/*"],
    });
    const collator = new Intl.Collator();
    tabs.sort((a, b) => collator.compare(a.title ?? "", b.title ?? ""));
    const template = document.getElementById("li_template");
    const elements = new Set();
    for (const tab of tabs) {
        const firstElementChild = template.content.firstElementChild?.cloneNode(true);
        if (firstElementChild) {
            const element = firstElementChild;
            const title = tab?.title?.split("-")[0]?.trim();
            const pathname = new URL(tab.url ?? "").pathname.slice("/docs".length);
            const titleElement = element.querySelector(".title");
            const pathnameElement = element.querySelector(".pathname");
            const aElement = element.querySelector("a");
            if (titleElement && pathnameElement && aElement) {
                titleElement.textContent = title ?? "";
                pathnameElement.textContent = pathname;
                aElement.addEventListener("click", async () => {
                    if (typeof tab.id === "number") {
                        chrome.tabs.update(tab.id, { active: true });
                    }
                    await chrome.windows.update(tab.windowId, { focused: true });
                });
            }
            element.style.cursor = "pointer";
            elements.add(element);
        }
    }
    document.querySelector("ul")?.append(...Array.from(elements));
    const button = document.querySelector("button");
    if (button) {
        button.addEventListener("click", async () => {
            const tabIds = tabs.map(({ id }) => id);
            if (tabIds.length) {
                const group = chrome.tabs.group({ tabIds });
                chrome.tabs.update(group, { title: "DOCS" });
            }
        });
    }
})();
