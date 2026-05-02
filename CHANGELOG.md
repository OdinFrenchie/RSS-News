# Changelog

## [0.7.1] - 2026-05-02

### Fixed – 0.7.1

- Fixed World News initialisation so feeds load correctly when script is placed at end of body
- Ensured Load more button operates on the loaded article set

## [0.7.0] - 2026-05-02

### Added – 0.7.0

- Added source filter chips above the World News feed
- Added article search bar for live filtering
- Added local caching of articles for faster reloads
- Added smooth fade-in animations for news cards
- Added Top Sources analytics sidebar section
- Added Most read today sidebar section based on local click tracking
- Added auto refresh countdown indicator with animated status dot
- Added News parent navigation with foldable region dropdown
- Added bookmarking system with local storage and bookmarks section
- Added reader mode overlay for focused article reading

### Changed – 0.7.0

- Updated world.html layout to include toolbar, filters, bookmarks, and reader modal
- Updated style.css with new toolbar, chips, bookmarks, reader, and analytics styling
- Updated rss-loader.js to support filters, search, caching, analytics, bookmarks, and reader mode

### Notes – 0.7.0

- All enhancements are local-only and do not track users across sessions beyond this browser
- World News remains the default region; default region selection is stored locally for future expansion

## [0.6.1] - 2026-05-01

### Added – 0.6.1

- Added 12 global RSS feeds to World News
- Added curated feed grouping in settings panel
- Added hybrid default activation (major feeds ON, additional feeds OFF)

### Changed – 0.6.1

- Updated world.html with full feed list and grouping
- Updated rss-loader.js to support expanded feed set
- Updated style.css with feed-group-label styling

### Notes – 0.6.1

- World News page now provides full global coverage with structured source management

## [0.6.0] - 2026-05-01

### Added – 0.6.0

- Two‑column desktop layout with modern grid system.
- Top Stories rail with hybrid logic (3 newest + 2 significant).
- Dark Mode with system detection and persistent user preference.
- Live Refresh system with countdown and “Updated X seconds ago”.
- Slide‑out Settings panel (right side) for per‑page controls.
- Feed Selector with checkboxes and persistent user choices.
- Select all / clear actions for feed selector.
- Trending Keywords engine with stopword filtering and chips UI.
- Article images (when available) with responsive layout.
- Compact Mode toggle with persistent preference.
- Loading indicator for feed refresh.
- Last updated timestamp for main feed.
- Smooth fade‑in animations for article cards.
- Inline ad cards every 8 articles.
- Sidebar skyscraper ad slot and bottom fixed banner ad slot.
- Improved mobile fallback layout.
- Enhanced Top Stories styling with bullets and hierarchy.
- New theme variables and visual refinements across the page.

### Changed – 0.6.0

- Rebuilt `rss-loader.js` with modular architecture and new features.
- Updated `world.html` structure for new layout, settings panel, and ad slots.
- Updated `style.css` with new theme variables, layout rules, settings panel, and ad styling.
- Improved spacing, typography, and visual hierarchy across the page.

### Notes – 0.6.0

- This release completes features A–E of the OdinWire UI upgrade plan plus additional polish.
- v0.7.x will focus on search, filters, and interaction upgrades.

## [0.5.0-design] - 2026-05-01

### Added – 0.5.0-design

- Introduced full modern OdinWire design system.
- Implemented glass‑card article layout with soft shadows.
- Added OdinWire signature accent bar for unique identity.
- Added fluid typography using clamp() for responsive scaling.
- Added Scandinavian‑inspired spacing and layout rhythm.
- Added improved navigation styling with active state indicator.
- Added updated footer and global spacing improvements.

### Changed – 0.5.0-design

- Replaced entire `style.css` with modern minimal design.
- Updated article card hover interactions and depth.
- Updated colour palette to OdinWire Blue (#2A6CF0) accent.
- Updated global typography to system‑UI stack.
- Updated page intro layout and spacing.

### Notes – 0.5.0-design

- This release introduces OdinWire’s new visual identity.
- No functional changes to RSS loading logic.
- All pages now support the new design system.

## [0.4.1] - 2026-05-01

### Added – 0.4.1

- Improved World News page layout with enhanced spacing.
- Added modernised article styling and intro header.

### Changed – 0.4.1

- Updated CSS for cleaner visual hierarchy.
- Updated README and CHANGELOG.

## [0.4.0] - 2026-05-01

### Added – 0.4.0

- Updated World News RSS feed list with working sources:
  - BBC World
  - Reuters World (correct XML feed)
  - Al Jazeera Global RSS

### Fixed – 0.4.0

- Removed invalid Reuters/AP feeds causing 422/500 errors.
- Confirmed Cloudflare now serves updated rss-loader.js.
- Ensured rss2json usage across all pages.

### Notes – 0.4.0

- Restores full live news functionality for World category.

## [0.3.2] - 2026-04-30

### Fixed – 0.3.2

- Reconnected Cloudflare Pages after GitHub visibility change.
- Resolved stale build artifact deployment.
- Removed merge conflict markers in templates.
- Forced Cloudflare to rebuild updated JS assets.

## [0.3.1] - 2026-04-30

### Added – 0.3.1

- Document headings for README.md and CHANGELOG.md.

### Fixed – 0.3.1

- Removed AllOrigins and migrated to rss2json.
- Updated script loading paths across all pages.

## [0.3.0] - 2026-04-29

### Added – 0.3.0

- Added standalone pages:
  - privacy.html
  - terms.html
  - about.html
  - contact.html

### Changed – 0.3.0

- Moved site files out of `/public` for Cloudflare compatibility.

## [0.2.0] - 2026-04-29

### Added – 0.2.0

- Initial multi-category news structure:
  - World, UK, Tech, Sports, Entertainment
- Base HTML template and global stylesheet.

## [0.1.1] - 2026-04-29

### Fixed – 0.1.1

- Removed `/functions` folder to fix Cloudflare build failure.

## [0.1.0] - 2026-04-28

### Added – 0.1.0

- Initial OdinWire project setup.
- Homepage layout.
- Basic RSS loader script.
- Initial documentation.
