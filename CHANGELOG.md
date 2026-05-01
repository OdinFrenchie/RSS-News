# Changelog

All notable changes to this project will be documented in this file.

## [0.4.1] - 2026-05-01

### Added - 0.4.1

- Improved World News page layout with enhanced spacing, intro header, and modernised article styling.
- Added new CSS rules for cleaner visual hierarchy and improved readability.

### Changed - 0.4.1

- Updated World News HTML structure to support enhanced layout.

### Notes - 0.4.1

- This is a visual/UI improvement release with no functional changes to RSS loading.

## [0.4.0] - 2026-05-01

### Added - 0.4.0

- Updated World News RSS feed list with fully compatible rss2json sources:
  - BBC World
  - Reuters World (correct XML feed)
  - Al Jazeera Global RSS

### Fixed - 0.4.0

- Removed invalid Reuters and AP feeds causing 422/500 API errors.
- Confirmed Cloudflare deployment now serves updated rss-loader.js.
- Ensured rss-loader.js uses rss2json endpoint consistently across all pages.

### Notes - 0.4.0

- This update restores full live news functionality for the World category.

---

## [0.3.2] - 2026-04-30

### Fixed - 0.3.2

- Reconnected Cloudflare Pages after GitHub repo visibility change.
- Resolved issue where Cloudflare deployed stale build artifacts.
- Removed merge conflict markers in news templates that prevented deployment.
- Forced Cloudflare to rebuild and serve updated JS assets.

---

## [0.3.1] - 2026-04-30

### Added - 0.3.1

- Document headings for README.md and CHANGELOG.md.
- Improved internal documentation consistency.

### Fixed 0.3.1

- Corrected rss-loader.js to remove AllOrigins and migrate to rss2json.
- Updated script loading paths across all news pages.

---

## [0.3.0] - 2026-04-29

### Added - 0.3.0

- Added standalone pages:
  - privacy.html
  - terms.html
  - about.html
  - contact.html

### Changed - 0.3.0

- Moved site files out of `/public` to root for Cloudflare compatibility.

---

## [0.2.0] - 2026-04-29

### Added - 0.2.1

- Initial multi-category news structure:
  - World
  - UK
  - Tech
  - Sports
  - Entertainment

### Added - 0.2.0

- Base HTML template for all news pages.
- Global stylesheet and layout system.

---

## [0.1.1] - 2026-04-29

### Fixed - 0.1.1

- Removed `/functions` folder to resolve Cloudflare Pages build failure.

---

## [0.1.0] - 2026-04-28

### Added - 0.1.0

- Initial OdinWire project setup.
- Homepage layout.
- Basic RSS loader script (pre-rss2json version).
- Initial project documentation.
