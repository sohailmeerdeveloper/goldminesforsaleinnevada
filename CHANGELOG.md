# Changelog

## 2026-05-12 - Initial build

### Project Scaffold

- Initialized the Eleventy static site structure.
- Added project scripts, source folders, data files, and asset folders.
- Established development and production build paths.

### Design System

- Built the custom CSS token system, reset, typography, layout, and component foundations.
- Locked the document-grade Nevada mining property aesthetic.
- Preserved the two copper token system for paper and dark-background usage.

### Layout, Header, Footer, and Schema

- Added the base layout with SEO meta tags, canonical URLs, Open Graph tags, and Twitter Card tags.
- Built the header, navigation, skip link, footer, and inline Goldstone LLC mark.
- Added site-wide Organization JSON-LD.

### Homepage

- Built the homepage hero, portfolio data strip, featured property cards, Nevada context, principal section, and contact band.
- Used real approved copy and placeholder photo regions where client images are still needed.

### Property Pages

- Built reusable property page templates for Lynn Creek Placers and Adelaide Mine.
- Added quick facts, geology, mineralogy, history, references, mineral grids, source links, sidebars, CTAs, and property JSON-LD.
- Preserved verified Mindat and USGS MRDS source data.

### 2D Maps

- Added Leaflet 2D maps to property pages.
- Included OpenStreetMap, Esri Satellite, OpenTopoMap, CartoDB black-and-white, and Esri Hybrid layers.
- Added custom survey-style markers, popups, coordinate copying, Google Earth links, directions links, scale bars, fullscreen controls, live coordinate readouts, and data-table fallbacks.

### 3D Terrain Toggle

- Added optional MapLibre 3D terrain mode.
- Added `MAPTILER_KEY` handling and a graceful no-key fallback.
- Added property marker and fly-to-property control for keyed 3D mode.

### Content Pages

- Built `/about/`, `/contact/`, `/due-diligence/`, and `/nevada-mining/`.
- Added Person JSON-LD for Dennis Blancey on the about page.
- Added long-form due diligence and Nevada mining context pages with public-source framing.

### Properties Index and Filtering

- Built `/properties/` as a scalable property listing page.
- Added filter sidebar, accessible result count, empty state, source note, and inquiry CTA.
- Rendered property cards from `src/_data/properties.json`.

### Contact Form

- Wired the Netlify Forms inquiry form.
- Added hidden form-name field, honeypot, required labels, browser-native validation, and `/contact/thank-you/` flow.
- Documented Netlify notification setup for `Grandnevadacorp@gmail.com`.

### Sitemap and Robots

- Added build-time `sitemap.xml`.
- Added `robots.txt` allowing normal search crawling and GPTBot, ClaudeBot, PerplexityBot, and Google-Extended.
- Confirmed dev-only pages are excluded from production sitemap output.

### Lighthouse, Print, and Mobile Polish

- Optimized CSS and font loading.
- Lazy-loaded Leaflet map assets near the map viewport.
- Added property page print styles for letter-size fact sheets.
- Improved mobile map layer control usability.
- Verified Lighthouse, headings, JSON-LD, local links, sitemap, robots, form markup, mobile overflow, map behavior, and print output.

### Documentation and Launch Handoff

- Added the project README covering local setup, scripts, environment variables, editing site and property data, replacing photos, Netlify Forms, MapTiler key, deployment, and the launch QA checklist.
- Added this changelog covering the initial build through launch handoff.
- Recorded known limitations and follow-up items for the client review.
