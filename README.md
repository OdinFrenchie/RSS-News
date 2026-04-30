# OdinWire

A fast, lightweight, RSS-powered multi-page news site built for Cloudflare Pages.  
Designed for speed, clarity, and zero-maintenance automatic updates.

## News System (v0.2.0)

A new RSS-powered news section has been added to OdinHub.  
This system automatically fetches and displays articles from multiple RSS feeds, sorted by date, with zero backend required.

### Current Pages

- `/news/world.html` — BBC, Reuters, AP World News

### New Files

- `/news/world.html` — First live news page
- `/js/rss-loader.js` — Multi-feed RSS parser and renderer
- `/css/style.css` — Global styling for news layout

### Features

- Supports multiple RSS feeds per page
- Auto-sorted by newest article
- Mobile-first responsive design
- Sticky bottom ad container for monetisation
- Clean, modern UI
- Fully static and Cloudflare Pages compatible

### Next Steps

- Review layout after deployment
- Adjust spacing, colours, typography as needed
- Clone template into additional categories:
  - UK
  - Tech
  - Sports
  - Entertainment
