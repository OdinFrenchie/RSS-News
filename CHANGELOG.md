# Changelog

## [0.9.1] - 2026-05-04

### Added – 0.9.1

- Accent theme system with selectable swatches (Default, Sunrise, Forest, Midnight)
- Theme persistence using `data-theme-accent` and localStorage
- Reader Mode button styling improvements
- Dark-mode search input contrast enhancements
- Additional bottom padding to ensure advertisement visibility

### Changed – 0.9.1

- Dark-mode accent colours updated for improved readability
- Trending chip and highlight colours adjusted for dark mode
- Top Stories bullet styling softened for better contrast
- Auto-summary (AI highlight) visually removed via CSS

### Notes – 0.9.1

- All updates are strictly additive; no code was removed
- No structural or functional changes were made
- `rss-loader.js` remains unchanged from v0.9.0 baseline

## [0.9.0] - 2026-05-03

### Added – 0.9.0

- Infinite scroll with 20-article batches
- Lazy-loading images with shimmer placeholders
- Auto-summary generator (local, deterministic)
- Save for Later system with bookmarks panel
- Updated article card layout for summaries + lazy images

### Changed – 0.9.0

- Rendering pipeline updated for incremental loading
- Image handling improved with fallback + fade-in
- Reader Mode integrated with new card structure
- Search + filters now reset infinite scroll state

### Notes – 0.9.0

- Infinite scroll triggers at 85% scroll depth
- Bookmarks stored locally; persist across reloads
- Auto-summaries generated from title + description
- Built on stable v0.8.0 baseline

## [0.8.0] - 2026-05-03

### Added – 0.8.0

- Enhanced Top Stories rail with improved selection logic
- Most Read Today analytics (local click tracking)
- Top Sources analytics (local source click tracking)
- Reader Mode modal with clean typography and overlay
- Reader Mode icon added to all article cards

### Changed – 0.8.0

- Updated article rendering to include Reader Mode metadata
- Integrated analytics updates into click handlers
- Improved trending keyword generation

### Notes – 0.8.0

- All analytics stored locally; no backend required
- Reader Mode opens via icon next to title (title still opens original link)
- Built on stable v0.7.0 baseline

## [0.7.0] - 2026-05-02

### Added – 0.7.0

- Sticky chrome navigation bar with blur and shadow
- Source filter chips for per‑feed filtering
- Search bar with title‑only live filtering
- Clickable trending keyword chips integrated with search

### Changed – 0.7.0

- Updated article rendering to include data-source attributes for filtering
- Updated RSS loader to support combined filtering logic

### Notes – 0.7.0

- All enhancements built on stable v0.6.1 baseline
- No changes made to feed loading, ads, or top stories logic

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
