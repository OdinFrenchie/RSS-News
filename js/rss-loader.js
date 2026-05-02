(function () {
    const FEEDS = {
        bbc: {
            name: "BBC World",
            url: "https://feeds.bbci.co.uk/news/world/rss.xml",
            color: "#bb1919"
        },
        reuters: {
            name: "Reuters World",
            url: "https://feeds.reuters.com/Reuters/worldNews",
            color: "#ff7a00"
        },
        aljazeera: {
            name: "Al Jazeera Global",
            url: "https://www.aljazeera.com/xml/rss/all.xml",
            color: "#c89b3c"
        },
        dw: {
            name: "Deutsche Welle (World)",
            url: "https://rss.dw.com/rdf/rss-en-world",
            color: "#0a4ea3"
        },
        euronews: {
            name: "Euronews (World)",
            url: "https://www.euronews.com/rss?level=theme&name=news",
            color: "#003399"
        },
        france24: {
            name: "France24 (International)",
            url: "https://www.france24.com/en/rss",
            color: "#0099ff"
        },
        sky: {
            name: "Sky News (World)",
            url: "https://feeds.skynews.com/feeds/rss/world.xml",
            color: "#d60000"
        },
        npr: {
            name: "NPR World",
            url: "https://feeds.npr.org/1004/rss.xml",
            color: "#d62021"
        },
        cbc: {
            name: "CBC World",
            url: "https://www.cbc.ca/cmlink/rss-world",
            color: "#e63946"
        },
        abc: {
            name: "ABC Australia (World)",
            url: "https://www.abc.net.au/news/feed/51120/rss.xml",
            color: "#1976d2"
        },
        japantimes: {
            name: "Japan Times",
            url: "https://www.japantimes.co.jp/feed/",
            color: "#333333"
        },
        voa: {
            name: "VOA News",
            url: "https://www.voanews.com/rss",
            color: "#2563eb"
        }
    };

    const CACHE_KEY_ARTICLES = "odinwire_world_articles_v1";
    const CACHE_KEY_BOOKMARKS = "odinwire_world_bookmarks_v1";
    const CACHE_KEY_CLICKS = "odinwire_world_clicks_v1";
    const CACHE_KEY_DEFAULT_NEWS = "odinwire_default_news_region";

    const rssContainer = document.getElementById("rss-container");
    const topStoriesContainer = document.getElementById("top-stories");
    const mostReadContainer = document.getElementById("most-read");
    const topSourcesContainer = document.getElementById("top-sources");
    const trendingList = document.getElementById("trending-list");
    const mainLastUpdated = document.getElementById("main-last-updated");
    const mainLoading = document.getElementById("main-loading");
    const nextRefreshSpan = document.getElementById("next-refresh");
    const loadMoreButton = document.getElementById("load-more");
    const sourceFilterChips = document.getElementById("source-filter-chips");
    const articleSearchInput = document.getElementById("article-search");
    const bookmarksContainer = document.getElementById("bookmarks-container");
    const clearBookmarksButton = document.getElementById("clear-bookmarks");

    const settingsToggle = document.getElementById("settings-toggle");
    const settingsPanel = document.getElementById("settings-panel");
    const settingsBackdrop = document.getElementById("settings-backdrop");
    const settingsClose = document.getElementById("settings-close");
    const selectAllFeedsButton = document.getElementById("select-all-feeds");
    const clearAllFeedsButton = document.getElementById("clear-all-feeds");
    const feedCheckboxes = document.querySelectorAll(".feed-check");

    const compactToggle = document.getElementById("compact-toggle");
    const settingsCompactToggle = document.getElementById("settings-compact-toggle");
    const themeToggle = document.getElementById("theme-toggle");

    const navNewsToggle = document.getElementById("nav-news-toggle");
    const navNewsSubmenu = document.getElementById("nav-news-submenu");
    const setDefaultNewsButton = document.getElementById("set-default-news");

    const readerBackdrop = document.getElementById("reader-backdrop");
    const readerModal = document.getElementById("reader-modal");
    const readerTitle = document.getElementById("reader-title");
    const readerMeta = document.getElementById("reader-meta");
    const readerBody = document.getElementById("reader-body");
    const readerOpenOriginal = document.getElementById("reader-open-original");
    const readerClose = document.getElementById("reader-close");

    let allArticles = [];
    let visibleCount = 20;
    const PAGE_SIZE = 20;
    let refreshIntervalSeconds = 60;
    let refreshCountdown = refreshIntervalSeconds;
    let refreshTimerId = null;
    let currentSourceFilter = null;
    let currentSearchQuery = "";
    let bookmarks = [];
    let clickStats = {};

    function loadLocalState() {
        try {
            const cachedArticles = localStorage.getItem(CACHE_KEY_ARTICLES);
            if (cachedArticles) {
                const parsed = JSON.parse(cachedArticles);
                if (Array.isArray(parsed)) {
                    allArticles = parsed;
                }
            }
        } catch (e) {
        }

        try {
            const cachedBookmarks = localStorage.getItem(CACHE_KEY_BOOKMARKS);
            if (cachedBookmarks) {
                const parsed = JSON.parse(cachedBookmarks);
                if (Array.isArray(parsed)) {
                    bookmarks = parsed;
                }
            }
        } catch (e) {
        }

        try {
            const cachedClicks = localStorage.getItem(CACHE_KEY_CLICKS);
            if (cachedClicks) {
                const parsed = JSON.parse(cachedClicks);
                if (parsed && typeof parsed === "object") {
                    clickStats = parsed;
                }
            }
        } catch (e) {
        }
    }

    function saveArticlesToCache() {
        try {
            localStorage.setItem(CACHE_KEY_ARTICLES, JSON.stringify(allArticles));
        } catch (e) {
        }
    }

    function saveBookmarks() {
        try {
            localStorage.setItem(CACHE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
        } catch (e) {
        }
    }

    function saveClicks() {
        try {
            localStorage.setItem(CACHE_KEY_CLICKS, JSON.stringify(clickStats));
        } catch (e) {
        }
    }

    function isBookmarked(id) {
        return bookmarks.some(b => b.id === id);
    }

    function toggleBookmark(article) {
        const existingIndex = bookmarks.findIndex(b => b.id === article.id);
        if (existingIndex >= 0) {
            bookmarks.splice(existingIndex, 1);
        } else {
            bookmarks.unshift({
                id: article.id,
                title: article.title,
                link: article.link,
                sourceKey: article.sourceKey,
                sourceName: article.sourceName,
                published: article.published
            });
        }
        saveBookmarks();
        renderBookmarks();
        renderArticles();
    }

    function clearBookmarks() {
        bookmarks = [];
        saveBookmarks();
        renderBookmarks();
        renderArticles();
    }

    function recordClick(article) {
        const todayKey = new Date().toISOString().slice(0, 10);
        if (!clickStats[todayKey]) {
            clickStats[todayKey] = {
                articles: {},
                sources: {}
            };
        }
        const dayStats = clickStats[todayKey];
        const articleKey = article.id;
        if (!dayStats.articles[articleKey]) {
            dayStats.articles[articleKey] = {
                title: article.title,
                link: article.link,
                count: 0
            };
        }
        dayStats.articles[articleKey].count += 1;
        if (!dayStats.sources[article.sourceKey]) {
            dayStats.sources[article.sourceKey] = {
                name: article.sourceName,
                count: 0
            };
        }
        dayStats.sources[article.sourceKey].count += 1;
        saveClicks();
        renderMostRead();
        renderTopSources();
    }

    function getTodayStats() {
        const todayKey = new Date().toISOString().slice(0, 10);
        return clickStats[todayKey] || { articles: {}, sources: {} };
    }

    function renderMostRead() {
        const stats = getTodayStats();
        const entries = Object.entries(stats.articles || {});
        entries.sort((a, b) => b[1].count - a[1].count);
        const top = entries.slice(0, 5);
        mostReadContainer.innerHTML = "";
        if (!top.length) {
            mostReadContainer.textContent = "No reads yet today.";
            return;
        }
        top.forEach(([id, info]) => {
            const div = document.createElement("div");
            div.className = "most-read-item";
            const a = document.createElement("a");
            a.href = info.link;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = info.title;
            div.appendChild(a);
            mostReadContainer.appendChild(div);
        });
    }

    function renderTopSources() {
        const stats = getTodayStats();
        const entries = Object.entries(stats.sources || {});
        entries.sort((a, b) => b[1].count - a[1].count);
        const top = entries.slice(0, 5);
        topSourcesContainer.innerHTML = "";
        if (!top.length) {
            topSourcesContainer.textContent = "No source data yet.";
            return;
        }
        top.forEach(([key, info]) => {
            const div = document.createElement("div");
            div.className = "top-source-item";
            div.textContent = `${info.name} (${info.count})`;
            topSourcesContainer.appendChild(div);
        });
    }

    function renderBookmarks() {
        bookmarksContainer.innerHTML = "";
        if (!bookmarks.length) {
            bookmarksContainer.textContent = "No bookmarks yet.";
            return;
        }
        bookmarks.forEach(b => {
            const card = document.createElement("div");
            card.className = "bookmark-card";
            const title = document.createElement("div");
            title.className = "bookmark-card-title";
            const a = document.createElement("a");
            a.href = b.link;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = b.title;
            title.appendChild(a);
            const meta = document.createElement("div");
            meta.className = "bookmark-card-meta";
            const date = b.published ? new Date(b.published).toLocaleString() : "";
            meta.textContent = `${b.sourceName}${date ? " • " + date : ""}`;
            card.appendChild(title);
            card.appendChild(meta);
            bookmarksContainer.appendChild(card);
        });
    }

    function buildSourceChips() {
        sourceFilterChips.innerHTML = "";
        const allChip = document.createElement("button");
        allChip.type = "button";
        allChip.className = "source-filter-chip";
        allChip.textContent = "All sources";
        allChip.dataset.sourceKey = "";
        sourceFilterChips.appendChild(allChip);
        Object.keys(FEEDS).forEach(key => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "source-filter-chip";
            chip.textContent = FEEDS[key].name;
            chip.dataset.sourceKey = key;
            sourceFilterChips.appendChild(chip);
        });
        sourceFilterChips.addEventListener("click", function (e) {
            const target = e.target;
            if (!target.classList.contains("source-filter-chip")) {
                return;
            }
            const key = target.dataset.sourceKey || null;
            currentSourceFilter = key || null;
            Array.from(sourceFilterChips.children).forEach(ch => {
                ch.classList.toggle("active", ch === target);
            });
            renderArticles();
        });
        allChip.classList.add("active");
    }

    function applyFilters(articles) {
        let filtered = articles;
        if (currentSourceFilter) {
            filtered = filtered.filter(a => a.sourceKey === currentSourceFilter);
        }
        if (currentSearchQuery) {
            const q = currentSearchQuery.toLowerCase();
            filtered = filtered.filter(a => {
                return (a.title && a.title.toLowerCase().includes(q)) ||
                    (a.description && a.description.toLowerCase().includes(q));
            });
        }
        return filtered;
    }

    function renderTrending(articles) {
        trendingList.innerHTML = "";
        const words = {};
        articles.forEach(a => {
            const title = a.title || "";
            title.split(/\s+/).forEach(w => {
                const clean = w.replace(/[^a-z0-9]/gi, "").toLowerCase();
                if (clean.length < 4) {
                    return;
                }
                words[clean] = (words[clean] || 0) + 1;
            });
        });
        const entries = Object.entries(words);
        entries.sort((a, b) => b[1] - a[1]);
        const top = entries.slice(0, 6);
        top.forEach(([word]) => {
            const span = document.createElement("span");
            span.className = "trending-chip";
            span.textContent = word;
            trendingList.appendChild(span);
        });
    }

    function renderTopStories(articles) {
        topStoriesContainer.innerHTML = "";
        const top = articles.slice(0, 6);
        top.forEach(a => {
            const item = document.createElement("div");
            item.className = "top-story-item";
            const bullet = document.createElement("div");
            bullet.className = "top-story-bullet";
            const content = document.createElement("div");
            content.className = "top-story-content";
            const link = document.createElement("a");
            link.href = a.link;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = a.title;
            link.addEventListener("click", function () {
                recordClick(a);
            });
            content.appendChild(link);
            item.appendChild(bullet);
            item.appendChild(content);
            topStoriesContainer.appendChild(item);
        });
    }

    function openReader(article) {
        readerTitle.textContent = article.title || "";
        const date = article.published ? new Date(article.published).toLocaleString() : "";
        readerMeta.textContent = `${article.sourceName}${date ? " • " + date : ""}`;
        readerBody.textContent = article.description || "";
        readerOpenOriginal.href = article.link || "#";
        readerBackdrop.classList.add("visible");
        readerModal.classList.add("open");
    }

    function closeReader() {
        readerBackdrop.classList.remove("visible");
        readerModal.classList.remove("open");
    }

    function renderArticles() {
        const filtered = applyFilters(allArticles);
        const toShow = filtered.slice(0, visibleCount);
        rssContainer.innerHTML = "";
        toShow.forEach(article => {
            const card = document.createElement("article");
            card.className = "news-item";
            const colorBar = document.createElement("div");
            colorBar.className = "source-color-bar";
            colorBar.style.backgroundColor = article.sourceColor || "";
            card.appendChild(colorBar);
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
            link.addEventListener("click", function () {
                recordClick(article);
            });
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
            const actions = document.createElement("div");
            actions.className = "card-actions";
            const readerBtn = document.createElement("button");
            readerBtn.type = "button";
            readerBtn.className = "card-button";
            readerBtn.textContent = "Reader";
            readerBtn.addEventListener("click", function () {
                openReader(article);
            });
            const bookmarkBtn = document.createElement("button");
            bookmarkBtn.type = "button";
            bookmarkBtn.className = "card-button";
            bookmarkBtn.textContent = isBookmarked(article.id) ? "Bookmarked" : "Bookmark";
            if (isBookmarked(article.id)) {
                bookmarkBtn.classList.add("bookmarked");
            }
            bookmarkBtn.addEventListener("click", function () {
                toggleBookmark(article);
            });
            actions.appendChild(readerBtn);
            actions.appendChild(bookmarkBtn);
            card.appendChild(actions);
            rssContainer.appendChild(card);
        });
        if (filtered.length <= visibleCount) {
            loadMoreButton.classList.add("disabled");
            loadMoreButton.disabled = true;
        } else {
            loadMoreButton.classList.remove("disabled");
            loadMoreButton.disabled = false;
        }
        renderTrending(filtered);
        renderTopStories(filtered);
    }

    function parseRSS(xmlText, sourceKey) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "application/xml");
        const items = Array.from(xml.querySelectorAll("item"));
        const feed = FEEDS[sourceKey];
        const articles = items.map((item, index) => {
            const title = item.querySelector("title") ? item.querySelector("title").textContent.trim() : "";
            const link = item.querySelector("link") ? item.querySelector("link").textContent.trim() : "";
            const description = item.querySelector("description") ? item.querySelector("description").textContent.trim() : "";
            const pubDate = item.querySelector("pubDate") ? item.querySelector("pubDate").textContent.trim() : "";
            const guid = item.querySelector("guid") ? item.querySelector("guid").textContent.trim() : link || title || `${sourceKey}-${index}`;
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
                id: `${sourceKey}-${guid}`,
                sourceKey,
                sourceName: feed.name,
                sourceColor: feed.color,
                title,
                link,
                description,
                published: pubDate ? new Date(pubDate).toISOString() : null,
                image
            };
        });
        return articles;
    }

    async function fetchFeed(sourceKey) {
        const feed = FEEDS[sourceKey];
        if (!feed) {
            return [];
        }
        try {
            const response = await fetch(`/proxy?url=${encodeURIComponent(feed.url)}`);
            if (!response.ok) {
                return [];
            }
            const text = await response.text();
            return parseRSS(text, sourceKey);
        } catch (e) {
            return [];
        }
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
        visibleCount = PAGE_SIZE;
        saveArticlesToCache();
        mainLastUpdated.textContent = "Last updated: " + new Date().toLocaleTimeString();
        mainLoading.classList.remove("visible");
        renderArticles();
        renderMostRead();
        renderTopSources();
    }

    function startRefreshTimer() {
        if (refreshTimerId) {
            clearInterval(refreshTimerId);
        }
        refreshCountdown = refreshIntervalSeconds;
        nextRefreshSpan.textContent = String(refreshCountdown);
        refreshTimerId = setInterval(() => {
            refreshCountdown -= 1;
            if (refreshCountdown <= 0) {
                refreshCountdown = refreshIntervalSeconds;
                loadFeeds();
            }
            nextRefreshSpan.textContent = String(refreshCountdown);
        }, 1000);
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
            visibleCount = PAGE_SIZE;
            renderArticles();
        });
        feedCheckboxes.forEach(cb => {
            cb.addEventListener("change", function () {
                loadFeeds();
            });
        });
    }

    function initCompactAndTheme() {
        compactToggle.addEventListener("click", function () {
            document.body.classList.toggle("compact");
            compactToggle.classList.toggle("active");
            settingsCompactToggle.classList.toggle("active");
        });
        settingsCompactToggle.addEventListener("click", function () {
            document.body.classList.toggle("compact");
            compactToggle.classList.toggle("active");
            settingsCompactToggle.classList.toggle("active");
        });
        themeToggle.addEventListener("click", function () {
            const current = document.documentElement.getAttribute("data-theme");
            const next = current === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
        });
    }

    function initLoadMore() {
        loadMoreButton.addEventListener("click", function () {
            if (loadMoreButton.disabled) {
                return;
            }
            visibleCount += PAGE_SIZE;
            renderArticles();
        });
    }

    function initSearch() {
        articleSearchInput.addEventListener("input", function () {
            currentSearchQuery = articleSearchInput.value.trim();
            visibleCount = PAGE_SIZE;
            renderArticles();
        });
    }

    function initBookmarks() {
        clearBookmarksButton.addEventListener("click", function () {
            clearBookmarks();
        });
        renderBookmarks();
    }

    function initReader() {
        readerBackdrop.addEventListener("click", function () {
            closeReader();
        });
        readerClose.addEventListener("click", function () {
            closeReader();
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                closeReader();
            }
        });
    }

    function initNewsNav() {
        navNewsToggle.addEventListener("click", function () {
            navNewsSubmenu.classList.toggle("open");
        });
        document.addEventListener("click", function (e) {
            if (!navNewsToggle.contains(e.target) && !navNewsSubmenu.contains(e.target)) {
                navNewsSubmenu.classList.remove("open");
            }
        });
        navNewsSubmenu.addEventListener("click", function (e) {
            const btn = e.target.closest(".nav-subitem");
            if (!btn || btn === setDefaultNewsButton) {
                return;
            }
            const region = btn.dataset.newsRegion;
            if (!region) {
                return;
            }
            if (region === "world") {
                window.location.href = "/news/world.html";
            } else if (region === "uk") {
                window.location.href = "/news/uk.html";
            } else if (region === "europe") {
                window.location.href = "/news/europe.html";
            } else if (region === "us") {
                window.location.href = "/news/us.html";
            } else if (region === "canada") {
                window.location.href = "/news/canada.html";
            } else if (region === "aunz") {
                window.location.href = "/news/aunz.html";
            } else if (region === "asia") {
                window.location.href = "/news/asia.html";
            } else if (region === "middleeast") {
                window.location.href = "/news/middleeast.html";
            }
        });
        setDefaultNewsButton.addEventListener("click", function () {
            try {
                localStorage.setItem(CACHE_KEY_DEFAULT_NEWS, "world");
            } catch (e) {
            }
        });
    }

    function init() {
        loadLocalState();
        buildSourceChips();
        initSettingsPanel();
        initCompactAndTheme();
        initLoadMore();
        initSearch();
        initBookmarks();
        initReader();
        initNewsNav();
        if (allArticles.length) {
            visibleCount = PAGE_SIZE;
            renderArticles();
            renderMostRead();
            renderTopSources();
        } else {
            loadFeeds();
        }
        startRefreshTimer();
    }

    document.addEventListener("DOMContentLoaded", init);
})();
