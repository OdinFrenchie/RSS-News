(function () {
    const FEEDS = {
        bbc: {
            name: "BBC World",
            url: "https://feeds.bbci.co.uk/news/world/rss.xml"
        },
        reuters: {
            name: "Reuters World",
            url: "https://feeds.reuters.com/Reuters/worldNews"
        },
        aljazeera: {
            name: "Al Jazeera Global",
            url: "https://www.aljazeera.com/xml/rss/all.xml"
        },
        dw: {
            name: "Deutsche Welle (World)",
            url: "https://rss.dw.com/rdf/rss-en-world"
        },
        euronews: {
            name: "Euronews (World)",
            url: "https://www.euronews.com/rss?level=theme&name=news"
        },
        france24: {
            name: "France24 (International)",
            url: "https://www.france24.com/en/rss"
        },
        sky: {
            name: "Sky News (World)",
            url: "https://feeds.skynews.com/feeds/rss/world.xml"
        },
        npr: {
            name: "NPR World",
            url: "https://feeds.npr.org/1004/rss.xml"
        },
        cbc: {
            name: "CBC World",
            url: "https://www.cbc.ca/cmlink/rss-world"
        },
        abc: {
            name: "ABC Australia (World)",
            url: "https://www.abc.net.au/news/feed/51120/rss.xml"
        },
        japantimes: {
            name: "Japan Times",
            url: "https://www.japantimes.co.jp/feed/"
        },
        voa: {
            name: "VOA News",
            url: "https://www.voanews.com/rss"
        }
    };

    const rssContainer = document.getElementById("rss-container");
    const mainLastUpdated = document.getElementById("main-last-updated");
    const mainLoading = document.getElementById("main-loading");

    const settingsToggle = document.getElementById("settings-toggle");
    const settingsPanel = document.getElementById("settings-panel");
    const settingsBackdrop = document.getElementById("settings-backdrop");
    const settingsClose = document.getElementById("settings-close");
    const selectAllFeedsButton = document.getElementById("select-all-feeds");
    const clearAllFeedsButton = document.getElementById("clear-all-feeds");
    const feedCheckboxes = document.querySelectorAll(".feed-check");

    let allArticles = [];

    function parseRSS(xmlText, sourceKey) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "application/xml");
        const items = Array.from(xml.querySelectorAll("item"));
        const feed = FEEDS[sourceKey];

        return items.map((item, index) => {
            const titleNode = item.querySelector("title");
            const linkNode = item.querySelector("link");
            const descNode = item.querySelector("description");
            const dateNode = item.querySelector("pubDate");
            const guidNode = item.querySelector("guid");

            const title = titleNode ? titleNode.textContent.trim() : "";
            const link = linkNode ? linkNode.textContent.trim() : "";
            const description = descNode ? descNode.textContent.trim() : "";
            const pubDate = dateNode ? dateNode.textContent.trim() : "";
            const guid = guidNode ? guidNode.textContent.trim() : link || title || (sourceKey + "-" + index);

            let image = "";
            const mediaContent = item.querySelector("media\\:content, content");
            if (mediaContent && mediaContent.getAttribute("url")) {
                image = mediaContent.getAttribute("url");
            }
            const enclosure = item.querySelector("enclosure");
            if (!image && enclosure && enclosure.getAttribute("url")) {
                image = enclosure.getAttribute("url");
            }

            return {
                id: sourceKey + "-" + guid,
                sourceKey,
                sourceName: feed.name,
                title,
                link,
                description,
                published: pubDate ? new Date(pubDate).toISOString() : null,
                image
            };
        });
    }

    async function fetchFeed(sourceKey) {
        const feed = FEEDS[sourceKey];
        if (!feed) return [];
        try {
            const response = await fetch("/proxy?url=" + encodeURIComponent(feed.url));
            if (!response.ok) return [];
            const text = await response.text();
            return parseRSS(text, sourceKey);
        } catch (e) {
            return [];
        }
    }

    function renderArticles() {
        if (!rssContainer) return;
        rssContainer.innerHTML = "";

        allArticles.forEach(article => {
            const card = document.createElement("article");
            card.className = "news-item";

            const pill = document.createElement("span");
            pill.className = "source-pill";
            pill.textContent = article.sourceName;
            card.appendChild(pill);

            if (article.image) {
                const img = document.createElement("img");
                img.className = "news-image";
                img.src = article.image;
                img.alt = article.title || "";
                card.appendChild(img);
            }

            const h2 = document.createElement("h2");
            const link = document.createElement("a");
            link.href = article.link;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = article.title;
            h2.appendChild(link);
            card.appendChild(h2);

            const date = document.createElement("div");
            date.className = "news-date";
            date.textContent = article.published ? new Date(article.published).toLocaleString() : "";
            card.appendChild(date);

            const desc = document.createElement("div");
            desc.className = "news-desc";
            desc.textContent = article.description || "";
            card.appendChild(desc);

            rssContainer.appendChild(card);
        });
    }

    async function loadFeeds() {
        mainLoading.classList.add("visible");

        const enabledKeys = Array.from(feedCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value)
            .filter(key => FEEDS[key]);

        const promises = enabledKeys.map(key => fetchFeed(key));
        const results = await Promise.all(promises);

        let combined = [];
        results.forEach(list => {
            combined = combined.concat(list);
        });

        combined.sort((a, b) => {
            const da = a.published ? new Date(a.published).getTime() : 0;
            const db = b.published ? new Date(b.published).getTime() : 0;
            return db - da;
        });

        allArticles = combined;

        mainLastUpdated.textContent = "Last updated: " + new Date().toLocaleTimeString();
        mainLoading.classList.remove("visible");

        renderArticles();
    }

    function initSettingsPanel() {
        settingsToggle.addEventListener("click", function () {
            settingsPanel.classList.add("open");
            settingsBackdrop.classList.add("visible");
        });

        settingsClose.addEventListener("click", function () {
            settingsPanel.classList.remove("open");
            settingsBackdrop.classList.remove("visible");
        });

        settingsBackdrop.addEventListener("click", function () {
            settingsPanel.classList.remove("open");
            settingsBackdrop.classList.remove("visible");
        });

        selectAllFeedsButton.addEventListener("click", function () {
            feedCheckboxes.forEach(cb => {
                cb.checked = true;
            });
            loadFeeds();
        });

        clearAllFeedsButton.addEventListener("click", function () {
            feedCheckboxes.forEach(cb => {
                cb.checked = false;
            });
            allArticles = [];
            renderArticles();
        });

        feedCheckboxes.forEach(cb => {
            cb.addEventListener("change", function () {
                loadFeeds();
            });
        });
    }

    function init() {
        initSettingsPanel();
        loadFeeds();
    }

    init();
})();
