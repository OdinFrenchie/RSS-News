# OdinWire — RSS‑Powered News Hub

OdinWire is a lightweight, zero‑maintenance news platform that aggregates live headlines from trusted global sources using RSS feeds. The site is fully static, Cloudflare‑hosted, and auto‑updates without any backend services.

## Features

- Live RSS aggregation using rss2json
- Five core news categories:
  - World
  - UK
  - Tech
  - Sports
  - Entertainment
- Clean, mobile‑first layout
- Auto‑updating content with no server required
- Minimal, fast, SEO‑friendly structure
- Cloudflare Pages deployment
- Ad‑ready layout with bottom fixed ad container

## Project Structure

/
├── index.html
├── news/
│   ├── world.html
│   ├── uk.html
│   ├── tech.html
│   ├── sports.html
│   └── entertainment.html
├── js/
│   └── rss-loader.js
├── css/
│   └── style.css
├── about.html
├── contact.html
├── privacy.html
├── terms.html
├── README.md
└── CHANGELOG.md

## How It Works

Each news page calls the `loadRSS()` function with a list of RSS feed URLs.  
The `/js/rss-loader.js` script:

1. Fetches each feed via rss2json  
2. Normalises article data  
3. Sorts by publication date  
4. Renders articles into the page  

No backend, no cron jobs, no databases — the browser handles everything.

## Example Feed Loader

<script>
    loadRSS([
  "https://feeds.bbci.co.uk/news/world/rss.xml",
  "https://feeds.reuters.com/reuters/worldNews",
  "https://www.aljazeera.com/xml/rss/all.xml"
  ]);
</script>

## Deployment

OdinWire is deployed via **Cloudflare Pages** with:

- No build step  
- No frameworks  
- Pure static hosting  

Changes pushed to the repository trigger automatic redeployment.

## Version

0.4.1

## Changelog

See `CHANGELOG.md` for full project history.

### Latest Release — v0.4.1 (2026‑05‑01)

- Improved World News page layout and styling
- Added enhanced intro header and article formatting
- Updated CSS for cleaner visual hierarchy
- Updated README and CHANGELOG

## License

This project is provided without restrictions. You may modify, publish, or commercialise it freely.
