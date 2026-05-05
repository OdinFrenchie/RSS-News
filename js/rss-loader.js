/* ----------------------------------------------------
   OdinWire RSS Loader — v0.9.6
   ---------------------------------------------------- */

/* GLOBAL STATE */
let allArticles = [];
let filteredArticles = [];
let currentBatch = 0;
const BATCH_SIZE = 20;
let isLoading = false;
let activeSource = "all";
let trendingCounts = {};
let savedArticles = JSON.parse(localStorage.getItem("ow-saved") || "[]");
let sourceClickCounts = JSON.parse(localStorage.getItem("ow-source-clicks") || "{}");
let articleClickCounts = JSON.parse(localStorage.getItem("ow-article-clicks") || "{}");

/* FEED REGISTRY */
const FEEDS = {
  bbc: "https://feeds.bbci.co.uk/news/world/rss.xml",
  reuters: "https://www.reutersagency.com/feed/?best-topics=world&post_type=best",
  aljazeera: "https://www.aljazeera.com/xml/rss/all.xml",
  dw: "https://rss.dw.com/rdf/rss-en-world",
  euronews: "https://www.euronews.com/rss?level=theme&name=news",
  france24: "https://www.france24.com/en/rss",
  sky: "https://feeds.skynews.com/feeds/rss/world.xml",
  npr: "https://feeds.npr.org/1004/rss.xml",
  cbc: "https://www.cbc.ca/cmlink/rss-world",
  abc: "https://www.abc.net.au/news/feed/51120/rss.xml",
  japantimes: "https://www.japantimes.co.jp/feed/",
  voa: "https://www.voanews.com/rss"
};

/* ----------------------------------------------------
   FETCH + PARSE RSS
---------------------------------------------------- */
async function fetchFeed(url, source) {
  try {
    const res = await fetch(`/proxy?url=${encodeURIComponent(url)}`);
    const text = await res.text();
    const xml = new DOMParser().parseFromString(text, "text/xml");
    const items = [...xml.querySelectorAll("item")];

    return items.map(item => ({
      source,
      title: item.querySelector("title")?.textContent || "",
      link: item.querySelector("link")?.textContent || "",
      description: item.querySelector("description")?.textContent || "",
      pubDate: new Date(item.querySelector("pubDate")?.textContent || Date.now()),
      image: extractImage(item),
    }));
  } catch (err) {
    console.error("Feed error:", source, err);
    return [];
  }
}

/* Extract image from RSS */
function extractImage(item) {
  const media = item.querySelector("media\\:content, content");
  if (media?.getAttribute("url")) return media.getAttribute("url");

  const desc = item.querySelector("description")?.textContent || "";
  const match = desc.match(/<img[^>]+src="([^"]+)"/i);
  return match ? match[1] : null;
}

/* ----------------------------------------------------
   LOAD ALL FEEDS
---------------------------------------------------- */
async function loadAllFeeds() {
  document.getElementById("main-loading").classList.add("visible");

  const enabled = getEnabledSources();
  const feedPromises = enabled.map(src => fetchFeed(FEEDS[src], src));
  const results = await Promise.all(feedPromises);

  allArticles = results.flat();
  allArticles.sort((a, b) => b.pubDate - a.pubDate);

  trendingCounts = {};
  extractTrendingKeywords(allArticles);

  filteredArticles = allArticles;
  currentBatch = 0;

  document.getElementById("rss-container").innerHTML = "";
  loadNextBatch();

  updateTopStories();
  updateMostRead();
  updateTopSources();

  document.getElementById("main-loading").classList.remove("visible");
  updateRefreshTime();
}

/* ----------------------------------------------------
   INFINITE SCROLL
---------------------------------------------------- */
function loadNextBatch() {
  if (isLoading) return;
  isLoading = true;

  const start = currentBatch * BATCH_SIZE;
  const end = start + BATCH_SIZE;
  const batch = filteredArticles.slice(start, end);

  renderArticles(batch);

  currentBatch++;
  isLoading = false;
}

/* ----------------------------------------------------
   RENDER ARTICLES
---------------------------------------------------- */
function renderArticles(articles) {
  const container = document.getElementById("rss-container");

  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "news-item";

    const imgHTML = article.image
      ? `<img class="news-image" data-src="${article.image}" alt="">`
      : "";

    card.innerHTML = `
      ${imgHTML}
      <h2><a href="${article.link}" target="_blank">${article.title}</a>
        <span class="bookmark-icon ${savedArticles.includes(article.link) ? "saved" : ""}" data-link="${article.link}">★</span>
      </h2>
      <div class="news-date">${article.pubDate.toLocaleString()}</div>
      <div class="news-desc">${article.description}</div>
      <div class="auto-summary" id="summary-${hash(article.link)}"></div>
    `;

    container.appendChild(card);
  });

  lazyLoadImages();
  generateAutoSummaries(articles);
  bindBookmarkEvents();
  bindArticleClicks();
}

/* ----------------------------------------------------
   IMAGE LAZY LOADING
---------------------------------------------------- */
function lazyLoadImages() {
  const imgs = document.querySelectorAll("img[data-src]");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.src = img.dataset.src;
      img.onload = () => img.classList.add("loaded");
      observer.unobserve(img);
    });
  });

  imgs.forEach(img => observer.observe(img));
}

/* ----------------------------------------------------
   AUTO-SUMMARIES (local deterministic)
---------------------------------------------------- */
function generateAutoSummaries(articles) {
  articles.forEach(a => {
    const id = `summary-${hash(a.link)}`;
    const el = document.getElementById(id);
    if (!el) return;

    const text = a.description || a.title;
    const summary = localSummary(text);
    el.textContent = summary;
  });
}

function localSummary(text) {
  const words = text.split(/\s+/).slice(0, 28);
  return words.join(" ") + "...";
}

/* ----------------------------------------------------
   BOOKMARKS
---------------------------------------------------- */
function bindBookmarkEvents() {
  document.querySelectorAll(".bookmark-icon").forEach(icon => {
    icon.onclick = () => {
      const link = icon.dataset.link;
      if (savedArticles.includes(link)) {
        savedArticles = savedArticles.filter(l => l !== link);
        icon.classList.remove("saved");
      } else {
        savedArticles.push(link);
        icon.classList.add("saved");
      }
      localStorage.setItem("ow-saved", JSON.stringify(savedArticles));
      renderSavedArticles();
    };
  });
}

function renderSavedArticles() {
  const box = document.getElementById("saved-articles");
  box.innerHTML = savedArticles
    .map(l => `<div class="saved-article-item"><a href="${l}" target="_blank">${l}</a></div>`)
    .join("");
}

/* ----------------------------------------------------
   CLICK ANALYTICS
---------------------------------------------------- */
function bindArticleClicks() {
  document.querySelectorAll(".news-item h2 a").forEach(a => {
    a.onclick = () => {
      const link = a.href;
      articleClickCounts[link] = (articleClickCounts[link] || 0) + 1;
      localStorage.setItem("ow-article-clicks", JSON.stringify(articleClickCounts));

      const source = detectSourceFromLink(link);
      if (source) {
        sourceClickCounts[source] = (sourceClickCounts[source] || 0) + 1;
        localStorage.setItem("ow-source-clicks", JSON.stringify(sourceClickCounts));
      }

      updateMostRead();
      updateTopSources();
    };
  });
}

function detectSourceFromLink(link) {
  if (link.includes("bbc")) return "bbc";
  if (link.includes("reuters")) return "reuters";
  if (link.includes("aljazeera")) return "aljazeera";
  if (link.includes("dw")) return "dw";
  if (link.includes("euronews")) return "euronews";
  if (link.includes("france24")) return "france24";
  if (link.includes("sky")) return "sky";
  if (link.includes("npr")) return "npr";
  if (link.includes("cbc")) return "cbc";
  if (link.includes("abc")) return "abc";
  if (link.includes("japantimes")) return "japantimes";
  if (link.includes("voa")) return "voa";
  return null;
}

/* ----------------------------------------------------
   TRENDING KEYWORDS
---------------------------------------------------- */
function extractTrendingKeywords(articles) {
  articles.forEach(a => {
    const words = a.title.toLowerCase().split(/\W+/);
    words.forEach(w => {
      if (w.length < 5) return;
      trendingCounts[w] = (trendingCounts[w] || 0) + 1;
    });
  });

  renderTrendingKeywords();
}

function renderTrendingKeywords() {
  const box = document.getElementById("trending-list");
  const sorted = Object.entries(trendingCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  box.innerHTML = sorted
    .map(([w]) => `<span class="trending-chip">${w}</span>`)
    .join("");
}

/* ----------------------------------------------------
   TOP STORIES
---------------------------------------------------- */
function updateTopStories() {
  const box = document.getElementById("top-stories");
  const top = allArticles.slice(0, 10);

  box.innerHTML = top
    .map(a => `
      <div class="top-story-item">
        <div class="top-story-bullet"></div>
        <div class="top-story-content">
          <a href="${a.link}" target="_blank">${a.title}</a>
        </div>
      </div>
    `)
    .join("");
}

/* ----------------------------------------------------
   MOST READ TODAY
---------------------------------------------------- */
function updateMostRead() {
  const box = document.getElementById("most-read-today");

  const sorted = Object.entries(articleClickCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  box.innerHTML = sorted
    .map(([link, count]) => `
      <div class="top-story-item">
        <div class="top-story-content">
          <a href="${link}" target="_blank">${link}</a>
          <span class="analytics-count">${count}</span>
        </div>
      </div>
    `)
    .join("");
}

/* ----------------------------------------------------
   TOP SOURCES
---------------------------------------------------- */
function updateTopSources() {
  const box = document.getElementById("top-sources");

  const sorted = Object.entries(sourceClickCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  box.innerHTML = sorted
    .map(([src, count]) => `
      <div class="top-source-item">
        <span>${src.toUpperCase()}</span>
        <span class="top-source-count">${count}</span>
      </div>
    `)
    .join("");
}

/* ----------------------------------------------------
   READER MODE
---------------------------------------------------- */
function openReaderMode(article) {
  document.getElementById("reader-title").textContent = article.title;
  document.getElementById("reader-body").innerHTML = article.description;
  document.getElementById("reader-original-link").href = article.link;

  document.getElementById("reader-modal").classList.add("open");
}

document.getElementById("reader-close").onclick = () => {
  document.getElementById("reader-modal").classList.remove("open");
};

/* ----------------------------------------------------
   UTILS
---------------------------------------------------- */
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function getEnabledSources() {
  return [...document.querySelectorAll(".feed-check:checked")].map(i => i.value);
}

function updateRefreshTime() {
  document.getElementById("refresh-time").textContent = new Date().toLocaleTimeString();
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
   VIDEO RAIL LOADER (BBC + Reuters)
---------------------------------------------------- */

async function loadVideoRail() {
  const list = document.getElementById("videoList");
  if (!list) return;

  list.innerHTML = `<div class="map-loading">Loading videos…</div>`;

  const feeds = [
    "https://feeds.bbci.co.uk/news/video_and_audio/world/rss.xml",
    "https://www.reutersagency.com/feed/?best-topics=world&post_type=best"
  ];

  const results = await Promise.all(
    feeds.map(url => fetch(`/proxy?url=${encodeURIComponent(url)}`).then(r => r.text()))
  );

  const videos = [];

  results.forEach((xmlText, i) => {
    const xml = new DOMParser().parseFromString(xmlText, "text/xml");
    const items = [...xml.querySelectorAll("item")].slice(0, 6);

    items.forEach(item => {
      videos.push({
        title: item.querySelector("title")?.textContent || "",
        link: item.querySelector("link")?.textContent || "",
        thumb: extractImage(item),
        source: i === 0 ? "BBC" : "Reuters"
      });
    });
  });

  list.innerHTML = videos
    .map(v => `
      <div class="video-item">
        <img class="video-thumb" src="${v.thumb || "/img/placeholder-video.png"}">
        <div class="video-info">
          <a href="${v.link}" target="_blank">${v.title}</a>
          <div class="video-source">${v.source}</div>
        </div>
      </div>
    `)
    .join("");
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
    <p>Here’s what’s shaping the world right now:</p>
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

/* ----------------------------------------------------
   REFRESH TIMER
---------------------------------------------------- */

let refreshCountdown = 60;

function startRefreshTimer() {
  setInterval(() => {
    refreshCountdown--;
    if (refreshCountdown <= 0) {
      refreshCountdown = 60;
      loadAllFeeds();
      loadVideoRail();
      generateAISummary();
    }
    document.getElementById("next-refresh").textContent = refreshCountdown;
  }, 1000);
}

/* ----------------------------------------------------
   SETTINGS PANEL LOGIC
---------------------------------------------------- */

const settingsPanel = document.getElementById("settings-panel");
const settingsBackdrop = document.getElementById("settings-backdrop");

document.getElementById("settings-toggle").onclick = () => {
  settingsPanel.classList.add("open");
  settingsBackdrop.classList.add("visible");
};

document.getElementById("settings-close").onclick = closeSettings;
settingsBackdrop.onclick = closeSettings;

function closeSettings() {
  settingsPanel.classList.remove("open");
  settingsBackdrop.classList.remove("visible");
}

/* ----------------------------------------------------
   THEME + ACCENT LOGIC
---------------------------------------------------- */

document.getElementById("theme-toggle").onclick = () => {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("ow-theme", next);
};

const savedTheme = localStorage.getItem("ow-theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

document.querySelectorAll(".theme-swatch").forEach(btn => {
  btn.onclick = () => {
    const accent = btn.dataset.themeAccent;
    document.documentElement.setAttribute("data-theme-accent", accent);
    localStorage.setItem("ow-accent", accent);

    document.querySelectorAll(".theme-swatch").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  };
});

const savedAccent = localStorage.getItem("ow-accent");
if (savedAccent) {
  document.documentElement.setAttribute("data-theme-accent", savedAccent);
  document.querySelector(`.theme-swatch[data-theme-accent="${savedAccent}"]`)?.classList.add("active");
}

/* ----------------------------------------------------
   QUICK LINKS
---------------------------------------------------- */

function loadQuickLinks() {
  const list = document.getElementById("quickLinksList");
  const stored = JSON.parse(localStorage.getItem("ow-quicklinks") || "[]");

  list.innerHTML = stored
    .map(l => `<div><a href="${l}" target="_blank">${l}</a></div>`)
    .join("");
}

document.getElementById("addQuickLinkBtn").onclick = () => {
  const input = document.getElementById("quickLinkInput");
  const url = input.value.trim();
  if (!url) return;

  const stored = JSON.parse(localStorage.getItem("ow-quicklinks") || "[]");
  stored.push(url);
  localStorage.setItem("ow-quicklinks", JSON.stringify(stored));

  input.value = "";
  loadQuickLinks();
};

loadQuickLinks();

/* ----------------------------------------------------
   TIMEZONES
---------------------------------------------------- */

function updateTimezones() {
  document.getElementById("tzLondon").textContent = "London: " + new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });
  document.getElementById("tzNewYork").textContent = "New York: " + new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  document.getElementById("tzTokyo").textContent = "Tokyo: " + new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
}

setInterval(updateTimezones, 1000);
updateTimezones();

/* ----------------------------------------------------
   WEATHER (simple placeholder)
---------------------------------------------------- */

function loadWeather() {
  document.getElementById("weatherContent").textContent = "Weather data unavailable (API-free mode)";
}

loadWeather();

/* ----------------------------------------------------
   INITIALISE EVERYTHING
---------------------------------------------------- */

window.onload = () => {
  loadAllFeeds();
  loadHybridMap();
  loadVideoRail();
  generateAISummary();
  initAISummaryToggle();
  startRefreshTimer();
};
