/* OdinWire World News — rss-loader.js v0.9.0 */

/* WORLD NEWS FEEDS */
const FEEDS = {
  bbc: "https://feeds.bbci.co.uk/news/world/rss.xml",
  reuters: "https://feeds.reuters.com/reuters/worldNews",
  aljazeera: "https://www.aljazeera.com/xml/rss/all.xml",
  dw: "https://rss.dw.com/rdf/rss-en-world",
  euronews: "https://www.euronews.com/rss?level=world",
  france24: "https://www.france24.com/en/rss",
  sky: "https://feeds.skynews.com/feeds/rss/world.xml",
  npr: "https://feeds.npr.org/1004/rss.xml",
  cbc: "https://www.cbc.ca/webfeed/rss/rss-world",
  abc: "https://www.abc.net.au/news/feed/51120/rss.xml",
  japantimes: "https://www.japantimes.co.jp/feed/topstories/",
  voa: "https://www.voanews.com/rss"
};

/* GLOBAL STATE */
let allArticles = [];
let visibleArticles = [];
let currentSourceFilter = "all";
let currentSearchTerm = "";
let batchSize = 20;
let batchIndex = 0;

/* REFRESH TIMER */
let refreshInterval = 60;
let refreshCountdown = refreshInterval;
let refreshTimerId = null;

/* ANALYTICS STORAGE */
const ANALYTICS_KEY = "ow-world-analytics";
const TODAY = new Date().toISOString().slice(0, 10);

/* Load or initialize analytics */
function loadAnalytics() {
  const saved = localStorage.getItem(ANALYTICS_KEY);
  if (!saved) {
    return { date: TODAY, clicks: {}, sources: {} };
  }
  const parsed = JSON.parse(saved);
  /* Reset if date changed */
  if (parsed.date !== TODAY) {
    return { date: TODAY, clicks: {}, sources: {} };
  }
  return parsed;
}

let analytics = loadAnalytics();

/* Save analytics */
function saveAnalytics() {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
}

/* Track article click */
function trackArticleClick(link, source) {
  analytics.clicks[link] = (analytics.clicks[link] || 0) + 1;
  analytics.sources[source] = (analytics.sources[source] || 0) + 1;
  saveAnalytics();
}

/* BOOKMARK SYSTEM */
const BOOKMARK_KEY = "ow-world-bookmarks";

function loadBookmarks() {
  const saved = localStorage.getItem(BOOKMARK_KEY);
  return saved ? JSON.parse(saved) : [];
}

let bookmarks = loadBookmarks();

function saveBookmarks() {
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
}

function toggleBookmark(article) {
  const exists = bookmarks.find(b => b.link === article.link);
  if (exists) {
    bookmarks = bookmarks.filter(b => b.link !== article.link);
  } else {
    bookmarks.push({
      title: article.title,
      link: article.link,
      source: article.source
    });
  }
  saveBookmarks();
  renderSavedArticles();
}

/* RENDER SAVED ARTICLES */
function renderSavedArticles() {
  const container = document.getElementById("saved-articles");
  container.innerHTML = "";
  if (bookmarks.length === 0) {
    container.innerHTML = `<p class="empty-analytics">No saved articles.</p>`;
    return;
  }
  bookmarks.forEach(item => {
    const div = document.createElement("div");
    div.className = "saved-article-item";
    div.innerHTML = `
      <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>
    `;
    container.appendChild(div);
  });
}

/* FETCH FEED */
async function fetchFeed(url) {
  try {
    const apiURL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
    const response = await fetch(apiURL);
    const data = await response.json();
    if (data.status !== "ok") return [];
    return data.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      description: item.description,
      thumbnail: item.thumbnail || (item.enclosure && item.enclosure.link) || null
    }));
  } catch {
    return [];
  }
}

/* FORMAT DATE */
function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

/* AUTO-SUMMARY GENERATOR */
function generateSummary(article) {
  if (!article || !article.title || !article.description) return "";
  const title = article.title;
  const desc = article.description.replace(/<[^>]+>/g, "");
  const keywords = title
    .split(" ")
    .filter(w => w.length > 4)
    .slice(0, 3)
    .join(", ");
  return `This story highlights ${keywords}. ${desc.slice(0, 120)}…`;
}

/* LAZY IMAGE LOADER */
function loadImage(img, src) {
  img.src = src;
  img.onload = () => img.classList.add("loaded");
  img.onerror = () => {
    img.src = "/img/fallback.jpg";
    img.classList.add("loaded");
  };
}

/* TOP STORIES — Enhanced Logic */
function generateTopStories(articles) {
  const newest = [...articles]
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, 3);
  const longest = [...articles]
    .sort((a, b) => b.title.length - a.title.length)
    .slice(0, 2);
  const mixed = [...new Set([...newest, ...longest])];
  return mixed.slice(0, 5);
}

function renderTopStories(stories) {
  const container = document.getElementById("top-stories");
  container.innerHTML = "";
  stories.forEach(story => {
    const div = document.createElement("div");
    div.className = "top-story-item";
    div.innerHTML = `
      <div class="top-story-bullet"></div>
      <div class="top-story-content">
        <a href="${story.link}" target="_blank" rel="noopener noreferrer">${story.title}</a>
      </div>
    `;
    container.appendChild(div);
  });
}

/* MOST READ TODAY */
function renderMostReadToday() {
  const container = document.getElementById("most-read-today");
  container.innerHTML = "";
  const entries = Object.entries(analytics.clicks)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  if (entries.length === 0) {
    container.innerHTML = `<p class="empty-analytics">No data yet.</p>`;
    return;
  }
  entries.forEach(([link, count]) => {
    const article = allArticles.find(a => a.link === link);
    if (!article) return;
    const div = document.createElement("div");
    div.className = "most-read-item";
    div.innerHTML = `
      <a href="${article.link}" target="_blank" rel="noopener noreferrer">${article.title}</a>
      <span class="analytics-count">(${count})</span>
    `;
    container.appendChild(div);
  });
}

/* TOP SOURCES */
function renderTopSources() {
  const container = document.getElementById("top-sources");
  container.innerHTML = "";
  const entries = Object.entries(analytics.sources)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  if (entries.length === 0) {
    container.innerHTML = `<p class="empty-analytics">No data yet.</p>`;
    return;
  }
  entries.forEach(([source, count]) => {
    const div = document.createElement("div");
    div.className = "top-source-item";
    div.innerHTML = `
      <span class="top-source-label">${source.toUpperCase()}</span>
      <span class="top-source-count">${count}</span>
    `;
    container.appendChild(div);
  });
}

/* RENDER ARTICLE CARD */
function renderArticleCard(article) {
  const div = document.createElement("div");
  div.className = "news-item";
  const isSaved = bookmarks.some(b => b.link === article.link);
  const bookmarkClass = isSaved ? "bookmark-icon saved" : "bookmark-icon";
  const summary = generateSummary(article);

  div.innerHTML = `
    <h2>
      <a href="${article.link}" target="_blank" rel="noopener noreferrer">${article.title}</a>
      <span class="${bookmarkClass}" data-link="${article.link}">⭐</span>
    </h2>
    <div class="news-date">${formatDate(article.pubDate)}</div>
    ${article.thumbnail ? `
      <img class="news-image" data-src="${article.thumbnail}" alt="">
    ` : ""}
    <div class="news-desc">${article.description}</div>
    <div class="auto-summary">${summary}</div>
    <button class="reader-btn" data-link="${article.link}">Reader Mode</button>
  `;

  /* Bookmark click */
  div.querySelector(".bookmark-icon").addEventListener("click", () => {
    toggleBookmark(article);
    div.querySelector(".bookmark-icon").classList.toggle("saved");
  });

  /* Reader Mode */
  div.querySelector(".reader-btn").addEventListener("click", () => {
    openReaderMode(article);
  });

  /* Track clicks */
  div.querySelector("a").addEventListener("click", () => {
    trackArticleClick(article.link, article.source);
    renderMostReadToday();
    renderTopSources();
  });

  return div;
}

/* RENDER ARTICLES (APPEND MODE FOR INFINITE SCROLL) */
function renderArticlesAppend(list) {
  const container = document.getElementById("rss-container");
  list.forEach(article => {
    const card = renderArticleCard(article);
    container.appendChild(card);
    /* Lazy-load image */
    const img = card.querySelector(".news-image");
    if (img) {
      const src = img.getAttribute("data-src");
      loadImage(img, src);
    }
  });
}

/* APPLY FILTERS + RESET VISIBLE ARTICLES */
function applyFilters() {
  let filtered = [...allArticles];
  if (currentSourceFilter !== "all") {
    filtered = filtered.filter(a => a.source === currentSourceFilter);
  }
  if (currentSearchTerm) {
    const term = currentSearchTerm;
    filtered = filtered.filter(a =>
      a.title && a.title.toLowerCase().includes(term)
    );
  }
  /* Reset infinite scroll */
  visibleArticles = filtered;
  batchIndex = 0;
  const container = document.getElementById("rss-container");
  container.innerHTML = "";
  renderNextBatch();
}

/* INFINITE SCROLL — LOAD NEXT BATCH */
function renderNextBatch() {
  const start = batchIndex * batchSize;
  const end = start + batchSize;
  const slice = visibleArticles.slice(start, end);
  if (slice.length === 0) return;
  renderArticlesAppend(slice);
  batchIndex++;
  /* Hide shimmer */
  document.getElementById("scroll-loading").classList.remove("visible");
}

/* INFINITE SCROLL CHECK */
window.owInfiniteScrollCheck = function () {
  const scrollPos = window.scrollY + window.innerHeight;
  const docHeight = document.body.offsetHeight;
  if (scrollPos >= docHeight * 0.85) {
    const loading = document.getElementById("scroll-loading");
    if (!loading.classList.contains("visible")) {
      loading.classList.add("visible");
      setTimeout(() => {
        renderNextBatch();
      }, 400);
    }
  }
};

/* READER MODE */
function openReaderMode(article) {
  const modal = document.getElementById("reader-modal");
  const titleEl = document.getElementById("reader-title");
  const bodyEl = document.getElementById("reader-body");
  const linkEl = document.getElementById("reader-original-link");

  titleEl.textContent = article.title;
  bodyEl.innerHTML = article.description;
  linkEl.href = article.link;

  modal.classList.add("open");
}

function closeReaderMode() {
  document.getElementById("reader-modal").classList.remove("open");
}

/* REFRESH TIMER */
function startRefreshTimer() {
  const nextEl = document.getElementById("next-refresh");
  const updatedEl = document.getElementById("refresh-time");
  if (refreshTimerId) clearInterval(refreshTimerId);
  refreshCountdown = refreshInterval;
  nextEl.textContent = refreshCountdown;
  refreshTimerId = setInterval(() => {
    refreshCountdown--;
    nextEl.textContent = refreshCountdown;
    if (refreshCountdown <= 0) {
      loadRSS();
      refreshCountdown = refreshInterval;
      updatedEl.textContent = "just now";
    }
  }, 1000);
}

/* LOAD RSS */
async function loadRSS() {
  const loadingEl = document.getElementById("main-loading");
  const mainUpdatedEl = document.getElementById("main-last-updated");
  if (loadingEl) loadingEl.classList.add("visible");

  allArticles = [];

  const selectedFeedKeys = Array.from(document.querySelectorAll(".feed-check"))
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  if (selectedFeedKeys.length === 0) {
    document.getElementById("rss-container").innerHTML = "<p>No sources selected.</p>";
    if (loadingEl) loadingEl.classList.remove("visible");
    if (mainUpdatedEl) mainUpdatedEl.textContent = "Last updated: —";
    return;
  }

  for (const key of selectedFeedKeys) {
    const url = FEEDS[key];
    if (!url) continue;
    const feedArticles = await fetchFeed(url);
    const withSource = feedArticles.map(a => ({ ...a, source: key }));
    allArticles = allArticles.concat(withSource);
  }

  allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  applyFilters();
  renderTopStories(generateTopStories(allArticles));
  renderTrendingKeywords(generateTrendingKeywords(allArticles));
  renderMostReadToday();
  renderTopSources();
  renderSavedArticles();

  if (loadingEl) loadingEl.classList.remove("visible");
  if (mainUpdatedEl) {
    const now = new Date();
    mainUpdatedEl.textContent = "Last updated: " + now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }
}

/* TRENDING KEYWORDS */
function generateTrendingKeywords(articles) {
  const words = {};
  articles.forEach(a => {
    const tokens = a.title.toLowerCase().split(/\W+/);
    tokens.forEach(t => {
      if (t.length > 4) {
        words[t] = (words[t] || 0) + 1;
      }
    });
  });
  return Object.entries(words)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
}

function renderTrendingKeywords(list) {
  const container = document.getElementById("trending-list");
  container.innerHTML = "";
  list.forEach(word => {
    const span = document.createElement("span");
    span.className = "trending-chip";
    span.textContent = word;
    span.addEventListener("click", () => {
      currentSearchTerm = word;
      document.getElementById("search-input").value = word;
      applyFilters();
    });
    container.appendChild(span);
  });
}

/* FEED SELECTION PERSISTENCE */
function restoreFeedSelection() {
  const saved = localStorage.getItem("selected-feeds");
  if (!saved) return;
  const selected = new Set(JSON.parse(saved));
  document.querySelectorAll(".feed-check").forEach(cb => {
    cb.checked = selected.has(cb.value);
  });
}

function saveFeedSelection() {
  const selected = Array.from(document.querySelectorAll(".feed-check"))
    .filter(cb => cb.checked)
    .map(cb => cb.value);
  localStorage.setItem("selected-feeds", JSON.stringify(selected));
}

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  restoreFeedSelection();

  document.querySelectorAll(".feed-check").forEach(cb => {
    cb.addEventListener("change", () => {
      saveFeedSelection();
      loadRSS();
    });
  });

  /* Select all / clear all */
  const selectAllBtn = document.getElementById("select-all-feeds");
  const clearAllBtn = document.getElementById("clear-all-feeds");

  if (selectAllBtn) {
    selectAllBtn.addEventListener("click", () => {
      document.querySelectorAll(".feed-check").forEach(cb => (cb.checked = true));
      saveFeedSelection();
      loadRSS();
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
      document.querySelectorAll(".feed-check").forEach(cb => (cb.checked = false));
      saveFeedSelection();
      loadRSS();
    });
  }

  /* Source filter chips */
  const sourceFilters = document.getElementById("source-filters");
  if (sourceFilters) {
    sourceFilters.addEventListener("click", (e) => {
      const btn = e.target.closest(".source-chip");
      if (!btn) return;
      const source = btn.getAttribute("data-source") || "all";
      currentSourceFilter = source;
      sourceFilters.querySelectorAll(".source-chip").forEach(chip => {
        chip.classList.toggle("active", chip === btn);
      });
      applyFilters();
    });
  }

  /* Search input */
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    let searchTimeout = null;
    searchInput.addEventListener("input", () => {
      const value = searchInput.value.trim().toLowerCase();
      if (searchTimeout) clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentSearchTerm = value;
        applyFilters();
      }, 150);
    });
  }

  /* Reader Mode close */
  document.getElementById("reader-close").addEventListener("click", closeReaderMode);
  document.getElementById("reader-modal").addEventListener("click", (e) => {
    if (e.target.id === "reader-modal") closeReaderMode();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeReaderMode();
  });

  loadRSS();
  startRefreshTimer();
});
