/* PAGE TYPE DETECTION */
const PAGE_TYPE = document.body.dataset.page || 'world';
const IS_UK = PAGE_TYPE === 'uk';
const IS_US = PAGE_TYPE === 'us';
const IS_ASIA = PAGE_TYPE === 'asia';
const IS_EUROPE = PAGE_TYPE === 'europe';
const IS_AUSTRALIA = PAGE_TYPE === 'australia';
const IS_CANADA = PAGE_TYPE === 'canada';
const IS_CHINA = PAGE_TYPE === 'china';
const IS_INDIA = PAGE_TYPE === 'india';

/* CACHE CONFIGURATION */
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const STORAGE_PREFIX = `ow-${PAGE_TYPE}-`;
const CACHE_KEY = `${STORAGE_PREFIX}article-cache`;

/* FEEDS CONFIGURATION */
const FEEDS_CONFIG = {
  world: {
    // Tier 1: Direct feeds (reliable) - DEFAULT ACTIVE
    bbc: "https://feeds.bbci.co.uk/news/world/rss.xml",
    aljazeera: "https://www.aljazeera.com/xml/rss/all.xml",
    dw: "https://rss.dw.com/rdf/rss-en-world",
    france24: "https://www.france24.com/en/rss",
    sky: "https://feeds.skynews.com/feeds/rss/world.xml",
    npr: "https://feeds.npr.org/1004/rss.xml",
    cnn: "http://rss.cnn.com/rss/edition_world.rss",
    washingtonpost: "https://feeds.washingtonpost.com/rss/world",
    latimes: "https://www.latimes.com/world-nation/rss2.0.xml",

    // Tier 2: RSSHub feeds (unchecked by default)
    reuters: "https://rsshub.app/reuters/world",
    guardian: "https://rsshub.app/guardian/world",
    japantimes: "https://rsshub.app/japantimes",
    axios: "https://rsshub.app/axios",
    politico: "https://rsshub.app/politico",
    independent: "https://rsshub.app/independent",
    voa: "https://rsshub.app/voanews",
    euronews: "https://rsshub.app/euronews/en/news"
  },

  uk: {
    // Tier 1: Direct UK feeds (reliable) - DEFAULT ACTIVE
    bbc: "https://feeds.bbci.co.uk/news/uk/rss.xml",
    bbcengland: "https://feeds.bbci.co.uk/news/england/rss.xml",
    sky: "https://feeds.skynews.com/feeds/rss/uk.xml",
    guardian: "https://www.theguardian.com/uk/rss",
    independent: "https://www.independent.co.uk/news/uk/rss",
    telegraph: "https://www.telegraph.co.uk/news/rss.xml",
    eveningstandard: "https://www.standard.co.uk/rss.xml",

    // Tier 2: RSSHub feeds (unchecked by default)
    politicshome: "https://rsshub.app/politics-home",
    labourlist: "https://rsshub.app/labourlist",
    conservativehome: "https://rsshub.app/conservativehome"
  },

  us: {
    // Tier 1: Direct US feeds (reliable) - DEFAULT ACTIVE
    cnn: "http://rss.cnn.com/rss/edition_us.rss",
    nyt: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    washingtonpost: "https://feeds.washingtonpost.com/rss/politics",
    npr: "https://feeds.npr.org/1003/rss.xml",
    reuters: "https://rsshub.app/reuters/us",
    ap: "https://rsshub.app/apnews/topics/apf-topnews",

    // Tier 2: RSSHub feeds (unchecked by default)
    wsj: "https://rsshub.app/wsj/us",
    usatoday: "https://rsshub.app/usatoday/news"
  },

  asia: {
    // Tier 1: Direct Asia feeds (reliable) - DEFAULT ACTIVE
    japantimes: "https://www.japantimes.co.jp/feed/",
    scmp: "https://rsshub.app/scmp/91",
    straitstimes: "https://www.straitstimes.com/news/asia/rss.xml",
    koreaherald: "http://www.koreaherald.com/rss.php",
    bangkokpost: "https://www.bangkokpost.com/rss/data/breakingnews.xml",
    channelnewsasia: "https://www.channelnewsasia.com/rss",

    // Tier 2: RSSHub feeds (unchecked by default)
    indianexpress: "https://rsshub.app/indianexpress"
  },

  europe: {
    // Tier 1: Direct Europe feeds (reliable) - DEFAULT ACTIVE
    euronews: "https://www.euronews.com/rss",
    france24: "https://www.france24.com/en/europe/rss",
    dw: "https://rss.dw.com/rdf/rss-en-eu",
    bbceurope: "https://feeds.bbci.co.uk/news/world/europe/rss.xml",

    // Tier 2: RSSHub feeds (unchecked by default)
    politicoeu: "https://rsshub.app/politico/eu",
    euobserver: "https://rsshub.app/euobserver",
    thelocal: "https://rsshub.app/thelocal"
  },

  australia_nz: {
    // Tier 1: Direct Australia/NZ feeds (reliable) - DEFAULT ACTIVE
    abcau: "https://www.abc.net.au/news/feed/51120/rss.xml",
    smh: "https://www.smh.com.au/rss/feed.xml",
    theaustralian: "https://www.theaustralian.com.au/feed",
    theage: "https://www.theage.com.au/rss/feed.xml",
    newscomau: "https://www.news.com.au/feed",

    // Tier 2: RSSHub feeds (unchecked by default)
    nzherald: "https://rsshub.app/nzherald"
  },

  canada: {
    // Tier 1: Direct Canada feeds (reliable) - DEFAULT ACTIVE
    cbc: "https://www.cbc.ca/cmlink/rss-world",
    globalnews: "https://globalnews.ca/feed/",
    ctv: "https://www.ctvnews.ca/rss/ctvnews-ca-top-stories-public-rss-1.822009",

    // Tier 2: RSSHub feeds (unchecked by default)
    torontostar: "https://rsshub.app/torontostar",
    nationalpost: "https://rsshub.app/nationalpost"
  },

  china: {
    // Tier 1: International China coverage (reliable) - DEFAULT ACTIVE
    scmp: "https://rsshub.app/scmp/91",
    caixin: "https://rsshub.app/caixin/latest",
    sixthtone: "https://rsshub.app/sixthtone/news",

    // Tier 2: State media (unchecked by default)
    chinadaily: "https://rsshub.app/chinadaily/english",
    globaltimes: "https://rsshub.app/globaltimes/hu-sijin"
  },

  india: {
    // Tier 1: Direct India feeds (reliable) - DEFAULT ACTIVE
    timesofindia: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
    thehindu: "https://www.thehindu.com/news/?service=rss",
    indianexpress: "https://indianexpress.com/feed/",
    ndtv: "https://feeds.feedburner.com/ndtvnews-latest",

    // Tier 2: RSSHub feeds (unchecked by default)
    hindustantimes: "https://rsshub.app/hindustantimes/news",
    businessstandard: "https://rsshub.app/businessstandard/latest"
  },

  tech: {
    // To be implemented
  },

  sports: {
    // To be implemented
  },

  entertainment: {
    // To be implemented
  }
};

/* ACTIVE FEEDS */
const FEEDS = FEEDS_CONFIG[PAGE_TYPE] || FEEDS_CONFIG.world;

/* GLOBAL STATE */
let allArticles = [];
let visibleArticles = [];
let currentSourceFilter = "all";
let currentSearchTerm = "";
let batchSize = 20;
let batchIndex = 0;

/* CACHE FUNCTIONS */
function getCachedArticles() {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  const { timestamp, articles } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) {
    sessionStorage.removeItem(CACHE_KEY);
    return null;
  }
  return articles;
}

function cacheArticles(articles) {
  sessionStorage.setItem(CACHE_KEY, JSON.stringify({
    timestamp: Date.now(),
    articles
  }));
}

/* PARALLEL FETCH WITH TIMEOUT */
async function fetchFeedWithTimeout(url, timeoutMs = 3000) {
  return Promise.race([
    fetchFeed(url),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), timeoutMs)
    )
  ]).catch(err => {
    console.log("Feed failed or timed out:", url);
    return [];
  });
}

async function fetchFeed(url) {
  const directUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(directUrl);
    const data = await response.json();
    if (data.status === "ok" && data.items && data.items.length > 0) {
      return data.items.map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: item.description,
        thumbnail: item.thumbnail || (item.enclosure && item.enclosure.link) || null
      }));
    }
  } catch (e) {
    // Try proxy fallback
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const proxyResponse = await fetch(proxyUrl);
      const xmlText = await proxyResponse.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const items = xmlDoc.querySelectorAll("item");

      return Array.from(items).slice(0, 20).map(item => ({
        title: item.querySelector("title")?.textContent || "No title",
        link: item.querySelector("link")?.textContent || "#",
        pubDate: item.querySelector("pubDate")?.textContent || new Date().toISOString(),
        description: item.querySelector("description")?.textContent || "",
        thumbnail: null
      }));
    } catch (proxyErr) {
      return [];
    }
  }
  return [];
}

/* SKELETON LOADER */
function showSkeletonLoader() {
  const container = document.getElementById("rss-container");
  container.innerHTML = Array(3).fill(`
    <div class="news-item" style="opacity: 0.6;">
      <div style="height: 20px; background: var(--shimmer-bg); border-radius: 4px; margin-bottom: 12px; width: 80%;"></div>
      <div style="height: 14px; background: var(--shimmer-bg); border-radius: 4px; margin-bottom: 8px; width: 40%;"></div>
      <div style="height: 60px; background: var(--shimmer-bg); border-radius: 4px;"></div>
    </div>
  `).join('');
}

/* OPTIMIZED LOAD RSS */
async function loadRSS() {
  const loadingEl = document.getElementById("main-loading");
  const navUpdatedEl = document.getElementById("nav-last-updated");

  // Try cache first
  const cached = getCachedArticles();
  if (cached && cached.length > 0) {
    console.log("Cache hit:", cached.length, "articles");
    allArticles = cached;
    renderAll();
    if (navUpdatedEl) navUpdatedEl.textContent = "Updated: " + new Date().toLocaleTimeString("en-GB");
    // Background refresh
    setTimeout(() => refreshFeedsSilently(), 500);
    return;
  }

  // Show skeleton immediately
  showSkeletonLoader();
  if (loadingEl) loadingEl.classList.add("visible");

  await fetchAndRender();
  cacheArticles(allArticles);

  if (loadingEl) loadingEl.classList.remove("visible");
}

async function fetchAndRender() {
  allArticles = [];

  const selectedFeedKeys = Array.from(document.querySelectorAll(".feed-check"))
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  if (selectedFeedKeys.length === 0) {
    document.getElementById("rss-container").innerHTML = "<p>No sources selected.</p>";
    return;
  }

  // PARALLEL fetch all feeds with 3s timeout
  const feedPromises = selectedFeedKeys.map(async key => {
    const url = FEEDS[key];
    if (!url) return [];
    const articles = await fetchFeedWithTimeout(url, 3000);
    return articles.map(a => ({ ...a, source: key }));
  });

  const results = await Promise.all(feedPromises);
  allArticles = results.flat();

  renderAll();
}

async function refreshFeedsSilently() {
  console.log("Background refresh...");
  await fetchAndRender();
  cacheArticles(allArticles);
}

function renderAll() {
  allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  applyFilters();
  renderTopStories(generateTopStories(allArticles));
  renderTrendingKeywords(generateTrendingKeywords(allArticles));
  renderTrendingFeed();
  renderSavedArticles();
  generateAISummary();

  const navUpdatedEl = document.getElementById("nav-last-updated");
  if (navUpdatedEl) {
    navUpdatedEl.textContent = "Updated: " + new Date().toLocaleTimeString("en-GB");
  }
}

/* WEATHER WIDGET */
const WEATHER_KEY = `${STORAGE_PREFIX}weather-location`;

async function loadWeather() {
  const container = document.getElementById("weatherContent");
  const selector = document.getElementById("weatherLocation");
  if (!container) return;

  // Default locations per region
  const defaultLocs = {
    world: "51.5074,-0.1278,London",
    uk: "51.5074,-0.1278,London",
    us: "40.7128,-74.0060,New York",
    asia: "35.6762,139.6503,Tokyo",
    europe: "50.8503,4.3517,Brussels",
    australia_nz: "-33.8688,151.2093,Sydney",
    canada: "43.6532,-79.3832,Toronto",
    china: "39.9042,116.4074,Beijing",
    india: "28.6139,77.2090,New Delhi"
  };

  const defaultLoc = defaultLocs[PAGE_TYPE] || defaultLocs.world;
  const savedLoc = localStorage.getItem(WEATHER_KEY) || defaultLoc;

  if (selector) selector.value = savedLoc;

  const [lat, lon, city] = savedLoc.split(",");
  await fetchWeather(lat, lon, city);

  if (selector) {
    selector.addEventListener("change", (e) => {
      localStorage.setItem(WEATHER_KEY, e.target.value);
      const [newLat, newLon, newCity] = e.target.value.split(",");
      fetchWeather(newLat, newLon, newCity);
    });
  }
}

async function fetchWeather(lat, lon, city) {
  const container = document.getElementById("weatherContent");
  container.innerHTML = `<div class="weather-loading">Loading…</div>`;

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );

    if (!res.ok) throw new Error("Weather fetch failed");

    const data = await res.json();
    const current = data.current_weather;

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
        <div class="weather-location-name">${city}</div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="weather-error">Weather unavailable</div>`;
    console.error("Weather error:", err);
  }
}

/* TIMEZONES */
function updateTimezones() {
  const timezoneConfigs = {
    world: [
      { id: "tzLondon", zone: "Europe/London" },
      { id: "tzNewYork", zone: "America/New_York" },
      { id: "tzTokyo", zone: "Asia/Tokyo" }
    ],
    uk: [
      { id: "tzLondon", zone: "Europe/London" },
      { id: "tzEdinburgh", zone: "Europe/London" }
    ],
    us: [
      { id: "tzNewYork", zone: "America/New_York" },
      { id: "tzChicago", zone: "America/Chicago" },
      { id: "tzDenver", zone: "America/Denver" },
      { id: "tzLosAngeles", zone: "America/Los_Angeles" }
    ],
    asia: [
      { id: "tzTokyo", zone: "Asia/Tokyo" },
      { id: "tzSingapore", zone: "Asia/Singapore" },
      { id: "tzHongKong", zone: "Asia/Hong_Kong" },
      { id: "tzSeoul", zone: "Asia/Seoul" }
    ],
    europe: [
      { id: "tzLondon", zone: "Europe/London" },
      { id: "tzParis", zone: "Europe/Paris" },
      { id: "tzBerlin", zone: "Europe/Berlin" },
      { id: "tzRome", zone: "Europe/Rome" }
    ],
    australia_nz: [
      { id: "tzSydney", zone: "Australia/Sydney" },
      { id: "tzMelbourne", zone: "Australia/Melbourne" },
      { id: "tzPerth", zone: "Australia/Perth" },
      { id: "tzAuckland", zone: "Pacific/Auckland" }
    ],
    canada: [
      { id: "tzToronto", zone: "America/Toronto" },
      { id: "tzVancouver", zone: "America/Vancouver" },
      { id: "tzMontreal", zone: "America/Montreal" },
      { id: "tzCalgary", zone: "America/Edmonton" }
    ],
    china: [
      { id: "tzBeijing", zone: "Asia/Shanghai" },
      { id: "tzShanghai", zone: "Asia/Shanghai" },
      { id: "tzHongKong", zone: "Asia/Hong_Kong" },
      { id: "tzShenzhen", zone: "Asia/Shanghai" }
    ],
    india: [
      { id: "tzDelhi", zone: "Asia/Kolkata" },
      { id: "tzMumbai", zone: "Asia/Kolkata" },
      { id: "tzBangalore", zone: "Asia/Kolkata" },
      { id: "tzKolkata", zone: "Asia/Kolkata" }
    ]
  };

  const cities = timezoneConfigs[PAGE_TYPE] || timezoneConfigs.world;

  cities.forEach(({ id, zone }) => {
    const el = document.getElementById(id);
    if (!el) return;

    const timeEl = el.querySelector(".tz-time");
    if (!timeEl) return;

    try {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-GB", {
        timeZone: zone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });

      timeEl.textContent = timeString;
    } catch (e) {
      timeEl.textContent = "--:--";
    }
  });
}

function startTimezoneUpdates() {
  updateTimezones();
  setInterval(updateTimezones, 60000);
}

/* QUICK LINKS */
const QUICK_LINKS_KEY = `${STORAGE_PREFIX}quick-links`;

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

/* TRENDING IN FEED */
function renderTrendingFeed() {
  const container = document.getElementById("trending-feed");
  if (!container) return;

  const words = {};
  const stopWords = ["about", "after", "before", "being", "could", "should", "their", "there", "where", "would", "while", "those", "these", "them", "than", "then", "that", "this", "with", "from", "have", "been", "were", "said", "each", "which", "will", "also", "into", "just", "more", "over", "such", "take", "only", "some", "time", "very", "what", "know", "year", "good", "come", "make", "well", "work", "life", "even", "back", "first", "never", "other", "right", "think", "every", "great", "might", "shall", "still", "your"];

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

/* WEATHER MAP - PLACEHOLDER */
function loadWeatherMap() {
  const container = document.getElementById("mapContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="map-placeholder">
      <div>🗺️ ${getRegionName()} Map</div>
      <small>Interactive maps coming soon</small>
    </div>
  `;
}

function getRegionName() {
  const names = {
    world: "Global",
    uk: "UK",
    us: "US",
    asia: "Asia",
    europe: "Europe",
    australia: "Australia & NZ",
    canada: "Canada",
    china: "China",
    india: "India"
  };
  return names[PAGE_TYPE] || "Global";
}

/* VIDEO RAIL */
async function loadVideoRail() {
  const list = document.getElementById("videoList");
  if (!list) return;

  list.innerHTML = `<div class="map-loading">Loading videos…</div>`;

  const videoFeeds = {
    world: [
      "https://feeds.bbci.co.uk/news/video_and_audio/world/rss.xml",
      "https://www.reutersagency.com/feed/?best-topics=world&post_type=best"
    ],
    uk: [
      "https://feeds.bbci.co.uk/news/video_and_audio/uk/rss.xml",
      "https://www.reutersagency.com/feed/?best-topics=world&post_type=best"
    ],
    us: [
      "https://feeds.bbci.co.uk/news/video_and_audio/world/rss.xml",
      "https://www.reutersagency.com/feed/?best-topics=us&post_type=best"
    ],
    asia: [
      "https://feeds.bbci.co.uk/news/video_and_audio/world/rss.xml",
      "https://www.reutersagency.com/feed/?best-topics=asia&post_type=best"
    ],
    europe: [
      "https://feeds.bbci.co.uk/news/video_and_audio/world/rss.xml",
      "https://www.reutersagency.com/feed/?best-topics=europe&post_type=best"
    ],
    australia_nz: [
      "https://feeds.bbci.co.uk/news/video_and_audio/world/rss.xml",
      "https://www.reutersagency.com/feed/?best-topics=asia&post_type=best"
    ],
    canada: [
      "https://feeds.bbci.co.uk/news/video_and_audio/world/rss.xml",
      "https://www.reutersagency.com/feed/?best-topics=americas&post_type=best"
    ],
    china: [
      "https://feeds.bbci.co.uk/news/video_and_audio/world/rss.xml",
      "https://www.reutersagency.com/feed/?best-topics=asia&post_type=best"
    ],
    india: [
      "https://feeds.bbci.co.uk/news/video_and_audio/world/rss.xml",
      "https://www.reutersagency.com/feed/?best-topics=asia&post_type=best"
    ]
  };

  const feeds = videoFeeds[PAGE_TYPE] || videoFeeds.world;

  try {
    const results = await Promise.all(
      feeds.map(url => fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`).then(r => r.text()).catch(() => ""))
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

/* AI SUMMARY GENERATOR */
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

  const summaryTexts = {
    world: "Here's what's shaping the world right now:",
    uk: "Here's what's happening in the UK right now:",
    us: "Here's what's happening across the United States right now:",
    asia: "Here's what's happening across Asia right now:",
    europe: "Here's what's happening across Europe right now:",
    australia_nz: "Here's what's happening in Australia and New Zealand right now:",
    canada: "Here's what's happening across Canada right now:",
    china: "Here's the latest from China and the region right now:",
    india: "Here's what's happening across India right now:"
  };

  const summaryText = summaryTexts[PAGE_TYPE] || summaryTexts.world;

  body.innerHTML = `
    <p>${summaryText}</p>
    <ul>${bullets}</ul>
  `;

  ts.textContent = new Date().toLocaleTimeString();
}

/* AI SUMMARY TOGGLE */
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

/* ANALYTICS STORAGE */
const ANALYTICS_KEY = `${STORAGE_PREFIX}analytics`;
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
const BOOKMARK_KEY = `${STORAGE_PREFIX}bookmarks`;

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

/* TOP STORIES */
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

/* RENDER ARTICLES */
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

/* APPLY FILTERS */
function applyFilters() {
  let filtered = [...allArticles];

  if (currentSourceFilter !== "all") {
    filtered = filtered.filter(a => a.source === currentSourceFilter);
  }

  if (currentSearchTerm) {
    const term = currentSearchTerm.toLowerCase();
    filtered = filtered.filter(a => {
      const titleMatch = a.title && a.title.toLowerCase().includes(term);
      const descMatch = a.description && a.description.toLowerCase().includes(term);
      return titleMatch || descMatch;
    });
  }

  visibleArticles = filtered;
  batchIndex = 0;
  articleRenderCount = 0;

  const container = document.getElementById("rss-container");
  container.innerHTML = "";

  if (filtered.length === 0 && currentSearchTerm) {
    container.innerHTML = `
      <div class="no-results">
        <p>No articles found for "<strong>${escapeHtml(currentSearchTerm)}</strong>"</p>
        <button onclick="clearSearch()" class="clear-search-btn">Clear Search</button>
      </div>
    `;
    return;
  }

  renderNextBatch();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function clearSearch() {
  currentSearchTerm = "";
  document.getElementById("search-input").value = "";
  applyFilters();
}

/* INFINITE SCROLL */
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
  const updatedEl = document.getElementById("nav-last-updated");

  if (refreshTimerId) clearInterval(refreshTimerId);
  refreshCountdown = refreshInterval;

  if (nextEl) nextEl.textContent = refreshCountdown;

  refreshTimerId = setInterval(() => {
    refreshCountdown--;
    if (nextEl) nextEl.textContent = refreshCountdown;

    if (refreshCountdown <= 0) {
      loadRSS();
      refreshCountdown = refreshInterval;
      if (updatedEl) updatedEl.textContent = "Updated: " + new Date().toLocaleTimeString("en-GB");
    }
  }, 1000);
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
  const saved = localStorage.getItem(`${STORAGE_PREFIX}selected-feeds`);
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
  localStorage.setItem(`${STORAGE_PREFIX}selected-feeds`, JSON.stringify(selected));
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

  // Initialize features
  loadWeather();
  startTimezoneUpdates();
  initQuickLinks();

  loadRSS();
  loadWeatherMap();
  loadVideoRail();
  generateAISummary();
  initAISummaryToggle();
  startRefreshTimer();
});