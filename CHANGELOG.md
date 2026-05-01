# Changelog

All notable changes to this project will be documented in this file.

## [0.6.0] - 2026-05-01

### Added – 0.6.0

- Introduced full OdinWire desktop layout system with two‑column feed.
- Added Top Stories rail with curated hybrid logic (3 newest + 2 significant).
- Added Dark Mode with system detection and persistent user preference.
- Added Live Refresh indicator with real‑time “Updated X seconds ago”.
- Added new CSS theme variables for light/dark palettes.
- Added new layout wrapper (`layout-desktop`) for desktop‑first design.
- Added new sidebar components (`top-stories-rail`, `live-refresh`).

### Changed – 0.6.0

- Rebuilt `rss-loader.js` with clean architecture and Top Stories integration.
- Updated article card styling to use theme variables.
- Updated navigation bar to include theme toggle button.
- Updated global layout spacing and visual hierarchy.
- Updated World News page HTML structure for new layout system.

### Notes – 0.6.0

- This release completes features A–E of the OdinWire UI upgrade plan.
- Mobile layout will be addressed in v0.6.1+.

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
