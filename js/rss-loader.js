/* ============================================================
   FILE: /js/rss-loader.js
   PURPOSE: Fetch and display multiple RSS feeds on any news page
   AUTHOR: OdinWire
   ============================================================ */

async function loadRSS(feeds = []) {
    const container = document.getElementById("rss-container");
    container.innerHTML = "<p>Loading news...</p>";

    try {
        // Fetch all feeds in parallel
        const feedPromises = feeds.map(url => fetchFeed(url));
        const feedResults = await Promise.all(feedPromises);

        // Flatten all articles into one array
        let articles = feedResults.flat();

        // Sort by date (newest first)
        articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        // Render articles
        container.innerHTML = articles.map(article => `
            <article class="news-item">
                <h2><a href="${article.link}" target="_blank">${article.title}</a></h2>
                <p class="news-date">${formatDate(article.pubDate)}</p>
                <p class="news-desc">${article.description}</p>
            </article>
        `).join("");

    } catch (error) {
        container.innerHTML = "<p>Failed to load news. Please try again later.</p>";
        console.error("RSS Load Error:", error);
    }
}

/* ============================================================
   Fetch and parse a single RSS feed using rss2json
   ============================================================ */
async function fetchFeed(url) {
    try {
        const apiURL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
        const response = await fetch(apiURL);
        const data = await response.json();

        if (!data.items) return [];

        return data.items.map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            description: item.description
        }));

    } catch (error) {
        console.error("Feed fetch failed:", url, error);
        return [];
    }
}

/* ============================================================
   Format date for display
   ============================================================ */
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
