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
            description: item.description
        }));

    } catch {
        return [];
    }
}

function generateTopStories(allArticles) {
    const newest = [...allArticles]
        .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
        .slice(0, 3);

    const significant = [...allArticles]
        .sort((a, b) => b.title.length - a.title.length)
        .slice(0, 2);

    return [...new Set([...newest, ...significant])];
}

function renderTopStories(stories) {
    const container = document.getElementById("top-stories");
    if (!container) return;

    container.innerHTML = "";

    stories.forEach(story => {
        const div = document.createElement("div");
        div.className = "top-story-item";
        div.innerHTML = `<a href="${story.link}" target="_blank">${story.title}</a>`;
        container.appendChild(div);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function renderArticles(articles) {
    const container = document.getElementById("rss-container");
    container.innerHTML = "";

    articles.forEach(article => {
        const div = document.createElement("div");
        div.className = "news-item";

        div.innerHTML = `
            <h2><a href="${article.link}" target="_blank">${article.title}</a></h2>
            <div class="news-date">${formatDate(article.pubDate)}</div>
            <div class="news-desc">${article.description}</div>
        `;

        container.appendChild(div);
    });
}

function updateRefreshTime() {
    const el = document.getElementById("refresh-time");
    if (!el) return;

    el.textContent = "just now";

    let seconds = 0;
    setInterval(() => {
        seconds++;
        el.textContent = seconds < 60
            ? `${seconds} seconds ago`
            : `${Math.floor(seconds / 60)} min ago`;
    }, 1000);
}

async function loadRSS(feedUrls) {
    let allArticles = [];

    for (const url of feedUrls) {
        const feedArticles = await fetchFeed(url);
        allArticles = allArticles.concat(feedArticles);
    }

    allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    renderArticles(allArticles);

    const topStories = generateTopStories(allArticles);
    renderTopStories(topStories);

    updateRefreshTime();
}
