/* OdinWire World News — rss-loader.js v0.9.8 */

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

/* ----------------------------------------------------
   WEATHER WIDGET (v0.9.8)
---------------------------------------------------- */
async function loadWeather() {
  const container = document.getElementById("weatherContent");
  if (!container) return;

  try {
    // Using Open-Meteo free API (no key required)
    // Default to London coordinates
    const lat = 51.5074;
    const lon = -0.1278;

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );

    if (!res.ok) throw new Error("Weather fetch failed");

    const data = await res.json();
    const current = data.current_weather;

    // Map WMO weather codes to descriptions
    const weatherCodes = {
      0: "Clear sky",
      1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
      45: "Fog", 48: "Depositing rime fog",
      51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
      61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
      71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
      95: "Thunderstorm"
    };

    const desc = weatherCodes[current.weathercode] || "Unknown";

    container.innerHTML = `
      <div class="weather-content">
        <div class="weather-temp">${Math.round(current.temperature)}°C</div>
        <div class="weather-desc">${desc}</div>
        <div class="weather-location">London, UK</div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="weather-error">Weather unavailable</div>`;
    console.error("Weather error:", err);
  }
}

/* ----------------------------------------------------
   TIMEZONES (v0.9.8)
---------------------------------------------------- */
function updateTimezones() {
  const cities = [
    { id: "tzLondon", zone: "Europe/London" },
    { id: "tzNewYork", zone: "America/New_York" },
    { id: "tzTokyo", zone: "Asia/Tokyo" }
  ];

  cities.forEach(({ id, zone }) => {
    const el = document.getElementById(id);
    if (!el) return;

    const timeEl = el.querySelector(".tz-time");
    if (!timeEl) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString("en-GB", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    timeEl.textContent = timeString;
  });
}

function startTimezoneUpdates() {
  updateTimezones();
  setInterval(updateTimezones, 60000);
}

/* ----------------------------------------------------
   QUICK LINKS (v0.9.8)
---------------------------------------------------- */
const QUICK_LINKS_KEY = "ow-quick-links";

function loadQuickLinks() {
  const container = document.getElementById("quickLinksList");
  if (!container) return;

  const saved = localStorage.getItem(QUICK_LINKS_KEY);
  const links = saved ? JSON.parse(saved) : [];

  container.innerHTML = "";

  if (links.length === 0) {
    container.innerHTML = `<p style="color: var(--text-soft); font-size: 0.85rem;">No links added.</p>`;
    return;
  }

  links.forEach((link, index) => {
    const div = document.createElement("div");
    div.className = "quick-link-item";
    div.innerHTML = `
      <a href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.url}">
        ${link.title || link.url}
      </a>
      <button class="quick-link-delete" data-index="${index}" title="Remove">×</button>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll(".quick-link-delete").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.target.dataset.index);
      deleteQuickLink(idx);
    });
  });
}

function saveQuickLinks(links) {
  localStorage.setItem(QUICK_LINKS_KEY, JSON.stringify(links));
}

function addQuickLink() {
  const urlInput = document.getElementById("quickLinkInput");
  const titleInput = document.getElementById("quickLinkTitle");

  if (!urlInput) return;

  let url = urlInput.value.trim();
  const title = titleInput ? titleInput.value.trim() : "";

  if (!url) return;

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  try {
    new URL(url);

    const saved = localStorage.getItem(QUICK_LINKS_KEY);
    const links = saved ? JSON.parse(saved) : [];

    links.push({ url, title, added: Date.now() });
    saveQuickLinks(links);

    urlInput.value = "";
    if (titleInput) titleInput.value = "";

    loadQuickLinks();
  } catch (err) {
    alert("Please enter a valid URL");
  }
}

function deleteQuickLink(index) {
  const saved = localStorage.getItem(QUICK_LINKS_KEY);
  if (!saved) return;

  const links = JSON.parse(saved);
  links.splice(index, 1);
  saveQuickLinks(links);
  loadQuickLinks();
}

function initQuickLinks() {
  loadQuickLinks();

  const btn = document.getElementById("addQuickLinkBtn");
  if (btn) {
    btn.addEventListener("click", addQuickLink);
  }

  const urlInput = document.getElementById("quickLinkInput");
  if (urlInput) {
    urlInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") addQuickLink();
    });
  }
}

/* ----------------------------------------------------
   TRENDING IN FEED (v0.9.8)
---------------------------------------------------- */
function renderTrendingFeed() {
  const container = document.getElementById("trending-feed");
  if (!container) return;

  const words = {};
  const stopWords = ["about", "after", "before", "being", "could", "should", "their", "there", "where", "would", "while", "those", "these", "them", "than", "then", "that", "this", "with", "from", "have", "been", "were", "said", "each", "which", "will", "also", "into", "just", "more", "over", "such", "take", "than", "only", "some", "time", "very", "what", "know", "take", "year", "good", "come", "make", "well", "work", "life", "even", "back", "after", "first", "never", "other", "right", "think", "where", "being", "every", "great", "might", "shall", "still", "those", "while", "your"];

  allArticles.slice(0, 50).forEach(a => {
    const tokens = a.title.toLowerCase().split(/\W+/);
    tokens.forEach(t => {
      if (t.length > 4 && !stopWords.includes(t)) {
        words[t] = (words[t] || 0) + 1;
      }
    });
  });

  const topWords = Object.entries(words)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (topWords.length === 0) {
    container.innerHTML = `<p style="color: var(--text-soft); font-size: 0.85rem;">No trending topics.</p>`;
    return;
  }

  container.innerHTML = topWords.map(([word, count], i) => {
    const article = allArticles.find(a => 
      a.title.toLowerCase().includes(word)
    );

    return `
      <div class="trending-feed-item">
        <span class="trending-feed-rank">${i + 1}</span>
        ${article ? 
          `<a href="${article.link}" target="_blank" class="trending-feed-title">${article.title}</a>` :
          `<span class="trending-feed-title" style="text-transform: capitalize;">${word}</span>`
        }
      </div>
    `;
  }).join("");
}

/* ----------------------------------------------------
   HYBRID MAP LOADER (v0.9.6)
---------------------------------------------------- */
function loadHybridMap() {
  const container = document.getElementById("mapContainer");
  if (!container) return;

  container.innerHTML = `
    <iframe
      src="https://www.rainviewer.com/map.html?loc=51.5,-0.1,5&oFa=0&oC=0&oU=0&oCS=1&oF=0&oAP=0&c=3&sm=1&sn=1"
      style="width:100%;height:200px;border:0;border-radius:12px;"
      loading="lazy"
    ></iframe>
  `;
}

/* ----------------------------------------------------
   VIDEO RAIL LOADER (v0.9.6)
---------------------------------------------------- */
async function loadVideoRail() {
  const list = document.getElementById("videoList");
  if (!list) return;

  list.innerHTML = `<div class="map-loading">Loading videos…</div>`;

  const feeds = [
    "https://feeds.bbci.co.uk/news/video_and_audio/world/rss.xml",
    "https://www.reutersagency.com/feed/?best-topics=world&post_type=best"
  ];

  try {
    const results = await Promise.all(
      feeds.map(url => fetch(`/proxy?url=${encodeURIComponent(url)}`).then(r => r.text()).catch(() => ""))
    );

    const videos = [];

    results.forEach((xmlText, i) => {
      if (!xmlText) return;
      const xml = new DOMParser().parseFromString(xmlText, "text/xml");
      const items = [...xml.querySelectorAll("item")].slice(0, 6);

      items.forEach(item => {
        videos.push({
          title: item.querySelector("title")?.textContent || "",
          link: item.querySelector("link")?.textContent || "",
          thumb: item.querySelector("media\\:content")?.getAttribute("url") || null,
          source: i === 0 ? "BBC" : "Reuters"
        });
      });
    });

    if (videos.length === 0) {
      list.innerHTML = `<div class="map-loading">No videos available</div>`;
      return;
    }

    list.innerHTML = videos
      .map(v => `
        <div class="video-item">
          <img class="video-thumb" src="${v.thumb || "/img/placeholder-video.png"}" onerror="this.src='/img/placeholder-video.png'">
          <div class="video-info">
            <a href="${v.link}" target="_blank">${v.title}</a>
            <div class="video-source">${v.source}</div>
          </div>
        </div>
      `)
      .join("");
  } catch (err) {
    list.innerHTML = `<div class="map-loading">Error loading videos</div>`;
  }
}

/* ----------------------------------------------------
   AI SUMMARY GENERATOR (v0.9.6)
---------------------------------------------------- */
function generateAISummary() {
  const panel = document.getElementById("rr-ai-summary");
  if (!panel) return;

  const enabled = localStorage.getItem("ow-ai-summary") || "on";
  if (enabled === "off") {
    panel.classList.add("hidden");
    return;
  }

  panel.classList.remove("hidden");

  const body = document.getElementById("aiSummaryBody");
  const ts = document.getElementById("aiSummaryTimestamp");

  const top = allArticles.slice(0, 12);
  const bullets = top.map(a => `<li>${a.title}</li>`).join("");

  body.innerHTML = `
    <p>Here's what's shaping the world right now:</p>
    <ul>${bullets}</ul>
  `;

  ts.textContent = new Date().toLocaleTimeString();
}

/* ----------------------------------------------------
   AI SUMMARY TOGGLE
---------------------------------------------------- */
function initAISummaryToggle() {
  const btn = document.getElementById("settings-ai-summary-toggle");
  if (!btn) return;

  const current = localStorage.getItem("ow-ai-summary") || "on";
  if (current === "off") btn.classList.add("active");

  btn.onclick = () => {
    const state = localStorage.getItem("ow-ai-summary") || "on";
    const next = state === "on" ? "off" : "on";
    localStorage.setItem("ow-ai-summary", next);

    if (next === "off") {
      document.getElementById("rr-ai-summary").classList.add("hidden");
    } else {
      document.getElementById("rr-ai-summary").classList.remove("hidden");
      generateAISummary();
    }

    btn.classList.toggle("active");
  };
}

/* INLINE AD COUNTER */
let articleRenderCount = 0;

/* REFRESH TIMER */
let refreshInterval = 60;
let refreshCountdown = refreshInterval;
let refreshTimerId = null;

/* ANALYTICS STORAGE (DEPRECATED v0.9.8 but kept for compatibility) */
const ANALYTICS_KEY = "ow-world-analytics";
const TODAY = new Date().toISOString().slice(0, 10);

function loadAnalytics() {
  const saved = localStorage.getItem(ANALYTICS_KEY);
  if (!saved) {
    return { date: TODAY, clicks: {}, sources: {} };
  }
  const parsed = JSON.parse(saved);
  if (parsed.date !== TODAY) {
    return { date: TODAY, clicks: {}, sources: {} };
  }
  return parsed;
}

let analytics = loadAnalytics();

function saveAnalytics() {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
}

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
  if (!container) return;

  container.innerHTML = "";
  if (bookmarks.length === 0) {
    container.innerHTML = `<p style="color: var(--text-soft); font-size: 0.85rem;">No saved articles.</p>`;
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
    minute: "2-digit"
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

/* TOP STORIES — Reduced to 3 (v0.9.8) */
function generateTopStories(articles) {
  const newest = [...articles]
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, 3);
  return newest;
}

function renderTopStories(stories) {
  const container = document.getElementById("top-stories");
  if (!container) return;

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

/* INLINE AD CARD CREATOR */
function createInlineAdCard() {
  const ad = document.createElement("div");
  ad.className = "ad-inline-card";
  ad.innerHTML = `
    <div class="ad-label">Advertisement</div>
    <div class="ad-slot-inline"></div>
  `;
  return ad;
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

  div.querySelector(".bookmark-icon").addEventListener("click", () => {
    toggleBookmark(article);
    div.querySelector(".bookmark-icon").classList.toggle("saved");
  });

  div.querySelector(".reader-btn").addEventListener("click", () => {
    openReaderMode(article);
  });

  div.querySelector("a").addEventListener("click", () => {
    trackArticleClick(article.link, article.source);
  });

  return div;
}

/* RENDER ARTICLES (APPEND MODE FOR INFINITE SCROLL) */
function renderArticlesAppend(list) {
  const container = document.getElementById("rss-container");
  list.forEach(article => {
    const card = renderArticleCard(article);
    container.appendChild(card);

    const img = card.querySelector(".news-image");
    if (img) {
      const src = img.getAttribute("data-src");
      loadImage(img, src);
    }

    articleRenderCount++;
    if (articleRenderCount % 8 === 0) {
      const adCard = createInlineAdCard();
      container.appendChild(adCard);
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
  visibleArticles = filtered;
  batchIndex = 0;
  articleRenderCount = 0;
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
  renderTrendingFeed(); // v0.9.8
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
  if (!container) return;

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

  document.getElementById("reader-close").addEventListener("click", closeReaderMode);
  document.getElementById("reader-modal").addEventListener("click", (e) => {
    if (e.target.id === "reader-modal") closeReaderMode();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeReaderMode();
  });

  // v0.9.8 Initializations
  loadWeather();
  startTimezoneUpdates();
  initQuickLinks();

  loadRSS();
  loadHybridMap();
  loadVideoRail();
  generateAISummary();
  initAISummaryToggle();
  startRefreshTimer();
});