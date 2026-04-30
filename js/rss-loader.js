/* ============================================================
   FILE: /js/rss-loader.js
   PURPOSE: Fetch and display multiple RSS feeds on any news page
   AUTHOR: OdinHub
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
   Fetch and parse a single RSS feed
   ============================================================ */
async function fetchFeed(url) {
    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "text/xml");

        const items = [...xml.querySelectorAll("item")];

        return items.map(item => ({
            title: item.querySelector("title")?.textContent || "No title",
            link: item.querySelector("link")?.textContent || "#",
            pubDate: item.querySelector("pubDate")?.textContent || new Date().toISOString(),
            description: item.querySelector("description")?.textContent || ""
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
