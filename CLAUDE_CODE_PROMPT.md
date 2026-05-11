# Claude Code Build Prompt — goldminesforsaleinnevada.com

You are building a complete, production-ready marketing website for **Goldstone LLC**, a Nevada-based mining property brokerage. The site sells (or markets for sale) two real, documented gold/copper/silver mining properties in Nevada to serious investors, mining companies, and private buyers.

**Domain:** goldminesforsaleinnevada.com
**Client:** Dennis Blancey, President/Owner, Goldstone LLC (operating since 1989)
**Audience:** Mining investors, junior mining companies, private capital, geologists doing due diligence. NOT casual web visitors. Treat them like adults reading a prospectus.

---

## 0. NON-NEGOTIABLE QUALITY BAR — READ THIS FIRST

This site must **not look AI-generated**. Most AI-built sites die from the same handful of tells. Avoid every single one:

**Forbidden:**
- Purple-to-blue or pink-to-orange gradient hero backgrounds. No gradient blobs. No mesh gradients.
- Glassmorphism (backdrop-blur frosted cards stacked on gradients).
- Emojis anywhere — not in headings, nav, buttons, or body text. This is a serious investment site.
- Generic "Welcome to our website" or "We are passionate about…" copy.
- Three-column "Our Values" grids with icon-heading-paragraph (Trust / Excellence / Innovation).
- Centered-everything single-column layouts that scream Tailwind landing-page template.
- Lucide-style stroke icons everywhere as decoration.
- The phrases: "world-class," "cutting-edge," "seamlessly," "leverage," "unlock," "empower," "journey," "elevate," "robust solutions," "trusted by thousands" (with no data).
- Fake testimonials, fake investor logos, fake stats. If we don't have the data, we don't show it.
- Stock-photo hero of generic businesspeople shaking hands.
- Lorem ipsum. Anywhere. Ever. Use the real content provided below.
- Soft pastel color palettes. Mint green CTAs. Baby blue.
- Rounded-2xl on everything. Vary the radius — some sharp, some soft.

**Required aesthetic direction:**
- Think **mining prospectus meets US Geological Survey report meets high-end real estate listing**. Authoritative, document-grade, technical.
- The site should feel like the geological survey itself made it — dense with data, confident, no fluff.
- Reference points: the print design of `The Economist`, USGS publication PDFs, Christie's real estate listings, Patek Philippe's site, Sotheby's auction listings. NOT modern SaaS landing pages.
- Typography-first. Let the data and serif headings do the heavy lifting. Reduce decoration.

---

## 1. TECH STACK

**Use:**
- **Eleventy (11ty)** as the static site generator. Outputs pure HTML — crawlers and AI bots (ChatGPT, Claude, Perplexity, Google AI Overviews) see complete pre-rendered content. This is non-negotiable for SEO and for AI search visibility.
- Plain **HTML5** + **CSS3** (write custom CSS — do not use Tailwind. Tailwind class-soup is itself an AI tell. Write proper CSS with variables and BEM-ish naming.)
- **Vanilla JavaScript** for interactivity. If state management gets complex on one component, use **Alpine.js** (via CDN, ~15kb) — it's HTML-attribute-driven and SEO-safe.
- **Leaflet.js** (v1.9+) for 2D maps with layer switching.
- **MapLibre GL JS** (v4+) for the 3D terrain view with hillshading.
- **Lite-YouTube-Embed** if any video is added later.
- No npm bloat. No webpack. Eleventy + a couple of CDN scripts.

**Do not use:** React, Next.js, Vue, Svelte, Astro (overkill), Tailwind, Bootstrap, jQuery, any UI kit.

**Build output:** static `/dist` folder deployable to Netlify, Cloudflare Pages, or Vercel as static.

---

## 2. FILE & FOLDER STRUCTURE

```
goldminesforsaleinnevada/
├── .eleventy.js
├── package.json
├── README.md
├── netlify.toml
├── src/
│   ├── _data/
│   │   ├── site.json                  # site-wide settings, contact info
│   │   └── properties.json            # all mine data (structured)
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk               # HTML shell, SEO meta, schema.org JSON-LD
│   │   │   ├── page.njk
│   │   │   └── property.njk
│   │   └── partials/
│   │       ├── header.njk
│   │       ├── footer.njk
│   │       ├── property-card.njk
│   │       ├── map-block.njk
│   │       ├── mineral-list.njk
│   │       ├── data-table.njk
│   │       └── cta-band.njk
│   ├── assets/
│   │   ├── css/
│   │   │   ├── reset.css
│   │   │   ├── tokens.css             # CSS custom properties (colors, type, spacing)
│   │   │   ├── typography.css
│   │   │   ├── layout.css
│   │   │   ├── components.css
│   │   │   ├── map.css
│   │   │   └── main.css               # imports the above
│   │   ├── js/
│   │   │   ├── map-2d.js              # Leaflet init with layer control
│   │   │   ├── map-3d.js              # MapLibre with terrain
│   │   │   ├── gallery.js
│   │   │   └── main.js
│   │   ├── img/
│   │   │   └── (real mine photos + a generated topo SVG pattern)
│   │   └── docs/
│   │       └── (downloadable PDFs: mine fact sheets, references)
│   ├── index.njk                      # homepage
│   ├── properties/
│   │   ├── index.njk                  # properties listing
│   │   ├── lynn-creek-placers.njk
│   │   └── adelaide-mine.njk
│   ├── about.njk
│   ├── due-diligence.njk
│   ├── nevada-mining.njk              # SEO content page on why Nevada
│   ├── contact.njk
│   ├── sitemap.xml.njk
│   └── robots.txt.njk
└── dist/                              # build output
```

---

## 3. BRAND IDENTITY

**Company:** Goldstone LLC — "Since 1989"
**Tagline (use exactly):** Copper. Silver. Gold. Nevada Mining Properties.
**Principal:** Dennis Blancey, President/Owner

**Contact (from business card — use exactly):**
- Phone: +1 775 400 5337
- Phone: +1 775 544 8494
- Email: Grandnevadacorp@gmail.com
- Offices: Carlin NV 89822 · Golconda NV 89414 · Carson City NV 89702

**Logo:** Recreate the business-card logo as inline SVG: two stylized overlapping mountain peaks in a warm red/terracotta. Keep the SVG editable inline so it inherits color from CSS. Place "GOLDSTONE LLC" wordmark in a bold geometric sans next to it, with "Since 1989" as a small caps strapline.

---

## 4. DESIGN SYSTEM

### Color palette (define as CSS custom properties in `tokens.css`)

```css
:root {
  /* Earth + document tones — NO blue-purple gradients */
  --ink:           #1a1612;   /* near-black warm — body text */
  --ink-soft:      #3d342c;   /* secondary text */
  --paper:         #f4efe6;   /* cream/parchment — page bg for content sections */
  --paper-pure:    #faf7f1;
  --bone:          #e8e1d3;   /* card bg, dividers */
  --rule:          #2a221b;   /* hairline rules */

  /* Brand accents */
  --gold:          #b8862a;   /* refined gold, not yellow */
  --gold-deep:     #8a611a;
  --copper:        #a8472b;   /* matches the business-card mountain logo */
  --copper-deep:   #7a2f1a;
  --silver:        #8a8680;

  /* Functional */
  --bg:            #14110d;   /* near-black hero bg */
  --bg-elev:       #1f1a14;
  --accent:        var(--copper);

  /* Type scale */
  --font-serif:    "Source Serif 4", "Source Serif Pro", Georgia, serif;
  --font-sans:     "Inter", "Söhne", system-ui, sans-serif;
  --font-mono:     "JetBrains Mono", ui-monospace, monospace;

  /* Spacing scale (8pt) */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 24px;
  --s-6: 32px; --s-7: 48px; --s-8: 64px; --s-9: 96px; --s-10: 128px;

  /* Layout */
  --measure: 68ch;
  --gutter: clamp(16px, 4vw, 48px);
  --maxw: 1280px;
}
```

### Typography rules
- Headings: **Source Serif 4** (Google Fonts) at weights 600/700 — serif for editorial gravitas.
- Body: **Inter** at 400/500.
- Numbers and coordinates: **JetBrains Mono** — gives the geological-report feel.
- Heading scale uses a modular ratio of 1.25 (major third). Set `h1` around `clamp(2.5rem, 5vw, 4.5rem)`.
- Generous line-height on body (1.65). Headings tight (1.1).
- Use real small-caps (`font-variant-caps: all-small-caps`) for labels like "DEPOSIT TYPE" and "WGS-84".
- Never use uppercase styling on long phrases — only on short labels.

### Layout principles
- Asymmetric grids. Not centered card stacks.
- Use a 12-column CSS grid with named lines. Big sections can break out into 2/3 + 1/3 (content + sidebar data) layouts like a journal article.
- Generous vertical rhythm. Use whitespace as a primary design tool.
- Hairline rules (1px `--rule` color) to separate data blocks — like a published geological survey.
- Numbers, coordinates, formulas: always in mono font, often in a sidebar "data card."
- Don't round every corner. Cards can be sharp (0 radius) with a hairline border instead. Reserve radius for buttons (4px max).

### Imagery direction
- The client should send real photos of each mine site. Until then, use **placeholder boxes with a clear note in the build** — do NOT use AI-generated mine images or generic stock photos.
- The Adelaide Mine Mindat page shows a real outcrop photo: note in the build that this should be replaced with the client's licensed photo or one purchased from Mindat/USGS public domain sources.
- Add a generated **topographic-line SVG pattern** as a subtle background motif on dark sections — like USGS contour lines. Keep it at ~5% opacity.
- USGS imagery is public domain — link out to USGS MRDS records for each property as primary sources.

---

## 5. SITEMAP & PAGE-BY-PAGE BRIEF

### 5.1 Homepage `/`

**Hero (full viewport, dark `--bg` background, topo-line SVG pattern overlay):**
- Eyebrow label in small caps copper: "GOLDSTONE LLC · NEVADA · EST. 1989"
- H1 (serif): "Two patented mining properties. Verified geology. Direct from the principal."
- Sub (sans, max 60ch): "Goldstone LLC offers active and historic gold, copper, and silver mining properties across Eureka and Humboldt Counties, Nevada — documented in the USGS Mineral Resources Data System and Mindat geological databases."
- Two CTAs: primary "View Properties" → `/properties/`, ghost "Contact Dennis Blancey" → `/contact/`.
- Below the fold of the hero: a thin data bar showing key facts as a horizontal stat row:
  - `02` PROPERTIES LISTED
  - `Au · Ag · Cu · Pb · Zn · W` COMMODITIES
  - `1860s` EARLIEST RECORDED PRODUCTION
  - `BSk` CLIMATE ZONE (cold semi-arid)

**Section 2 — Featured properties (two large cards, side by side on desktop, stacked on mobile):**
Each card is image-left, content-right (or alternating). Card content:
- Property name (serif, large)
- Locality summary line
- Three key data points in a mini-table (deposit type, commodities, status)
- "Property file →" link to the property page

**Section 3 — Why Nevada (editorial spread):**
Two-column article-style layout. Left column: heading + 2 short paragraphs about Nevada being the #1 gold-producing US state, the Carlin Trend, Battle Mountain–Eureka mineral belt. Right column: a list of authoritative external links (USGS, Nevada Bureau of Mines and Geology, Mindat). Real data, no fluff.

**Section 4 — About the principal:**
Small portrait area for Dennis Blancey (client to provide photo — use placeholder), short bio paragraph mentioning Goldstone LLC since 1989, the three Nevada office cities, and the firm's specialization. Link to `/about/`.

**Section 5 — Contact band (full width, `--bg` background):**
Phone numbers, email, offices, with a "Request a property packet" form.

### 5.2 Properties index `/properties/`
- Editorial header explaining the portfolio.
- Two large property cards. Each card includes:
  - High-resolution photo placeholder
  - Property name (serif h2)
  - District / county / state
  - Coordinates in mono font
  - Deposit type
  - Commodity badges (small pill-less labels — just text with a hairline border)
  - "View full property file →"
- Filter sidebar (commodity, deposit type, county). Even with 2 properties, build it for scalability — easy to add more later.

### 5.3 Property page template `/properties/{slug}/`

This is the most important page type. Structure it like a one-pager mining prospectus. Layout:

**Top band (dark bg):**
- Breadcrumb (Home / Properties / [Name])
- Property name h1
- Subtitle: "[District] · [County] · Nevada · USA"
- Mindat locality ID and a link to the Mindat source page
- USGS MRDS record link

**Quick-facts strip (full-width, light bg, hairline-divided columns):**
6 mini-stats: Coordinates (decimal), Deposit Type, Commodities, Climate, Nearest Town, Mindat ID. All in mono font for the values.

**Two-column body (article + sticky sidebar):**
- LEFT (the article, max-width 68ch):
  - "Overview" — narrative paragraph
  - "Geology" — deposit description, host rocks, alteration
  - "Mineralogy" — list of minerals with formulas in mono
  - "History & Development" — production timeline
  - "References" — academic and government citations
- RIGHT (sticky sidebar at >1024px):
  - Map block (with the 5-layer switcher described below)
  - "Request property packet" CTA card
  - Quick downloads (PDF fact sheet link)
  - Contact card (phone numbers)

**Below body — full-width map section:**
Larger embedded map with the layer switcher (see Section 6).

**Mineral specimens grid:**
A grid showing each mineral as a card: name, chemical formula in mono, Strunz-10 group label. Card has a hairline border, no shadow. Hover reveals a short description.

**Commodity emphasis band:**
Large typographic band repeating the commodities with their symbols in huge serif: "Au · Ag · Cu · Pb · Zn · W" — this is a typographic feature, not decoration.

**Bottom CTA band:**
"Inquire about [Property Name]" with phone + form.

### 5.4 `/about/`
- Editorial bio of Dennis Blancey & Goldstone LLC.
- Three Nevada office locations with a small map showing all three pins.
- "Since 1989" — emphasize the 35+ years in the Nevada mining property market.

### 5.5 `/due-diligence/`
- Editorial page covering: title verification, USGS MRDS lookups, permitting in Nevada, BLM claims, reclamation bonds.
- Positions Goldstone LLC as transparent and document-grade.
- This page is heavy SEO content — target "Nevada mining claim due diligence," "buying patented mining claims Nevada."

### 5.6 `/nevada-mining/`
- SEO content pillar: Nevada gold production, Carlin Trend geology, Battle Mountain–Eureka belt, Humboldt and Eureka County mining history.
- Long-form (1500+ words). Real data with sources cited inline.

### 5.7 `/contact/`
- Full contact card with all three offices.
- Form (HTML-only, posts to a Netlify/Cloudflare form endpoint — implement as `data-netlify="true"` on the form so it works on Netlify without JS).
- A statement: "Inquiries are reviewed by Dennis Blancey directly."

---

## 6. MAP COMPONENT — REQUIRED FEATURES

Build ONE reusable map component (`partials/map-block.njk` + `js/map-2d.js` + `js/map-3d.js`) used on every property page.

### Layer switcher
A control in the top-right of the map with these views. Build all of them:

1. **Standard 2D** — OpenStreetMap Standard tiles. `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
2. **Satellite** — Esri World Imagery. `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
3. **Topographic** — OpenTopoMap. `https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png` (attribution: OpenTopoMap, SRTM, OSM)
4. **Black & White** — CartoDB Positron (no labels variant available). `https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png`
5. **Hybrid / Imagery + labels** — Esri imagery base + a transparent labels overlay (Esri World Boundaries and Places).
6. **3D Terrain** — toggle button that swaps the Leaflet instance for a **MapLibre GL JS** instance using free terrain tiles. Use **MapTiler's free terrain RGB** (requires a free API key from MapTiler — note in README that the client needs to register a free key) OR the AWS-hosted Mapzen Terrain Tiles as fallback. Include hillshade and 3D pitch (~60°). Add fly-to-property button.

### Map UI requirements
- Custom marker (not the default blue Leaflet pin). Use an inline SVG marker styled in `--copper`, with the property's Mindat ID engraved as small text. Make it sharp and document-like.
- Scale bar in metric AND imperial — geologists work in both. Show miles for US mining audience.
- Coordinate readout in the corner showing live cursor lat/lng in decimal degrees, mono font.
- "Copy coordinates" button on the marker popup.
- "Open in Google Earth" button on the marker popup that generates a KML on the fly OR links to `https://earth.google.com/web/@{lat},{lng},2000a,5000d,35y,0h,0t,0r/`.
- "Get directions" button linking to Google Maps directions.
- Fullscreen toggle.
- Mobile: layer switcher collapses into a single button with a bottom-sheet drawer.

### Map accessibility
- Don't break keyboard navigation. Leaflet has built-in keyboard support — preserve it.
- All controls have aria-labels.
- Provide a "View as data table" fallback below each map showing the coordinates in plain HTML — also helps SEO and crawler indexing.

---

## 7. STRUCTURED DATA (CRITICAL FOR AI SEARCH + GOOGLE)

This is what gets the site shown by ChatGPT, Claude, Perplexity, and Google AI Overviews. Put JSON-LD in `base.njk`.

### Site-wide on every page
- `Organization` schema for Goldstone LLC (name, founder Dennis Blancey, foundingDate 1989, addresses for all three offices, telephone, email, logo URL, areaServed Nevada).

### On every property page
- `Product` schema with the mine as product, including offers (`Offer` with availability/InStock or "for sale"), and `additionalProperty` for each mineral and commodity. Include the WGS-84 coordinates in `geo` (use `Place` nested in the product).
- `Place` schema with `geo: GeoCoordinates` (latitude/longitude), `containedInPlace` chain (district → county → state → country).
- `BreadcrumbList` schema.

### On `/about/`
- `Person` schema for Dennis Blancey, jobTitle: President & Owner, worksFor: Goldstone LLC.

### Open Graph + Twitter Cards
- Full og: tags on every page. `og:type=website` for index pages, `og:type=article` for property pages.
- Generate a per-property OG image at build time (or design one template — even just a typographic card with the property name on the `--bg` color).

---

## 8. SEO PLAYBOOK (NON-NEGOTIABLE)

Because they explicitly avoided React for crawler reasons, push the SEO advantage hard.

**On-page:**
- One `<h1>` per page, semantically correct heading hierarchy.
- Descriptive `<title>` (60 chars max) and `<meta description>` (155 chars max) per page. Write these by hand for each page — no templating.
- Self-referential canonical link tags on every page.
- `lang="en-US"` on `<html>`.
- All images have meaningful `alt` text describing geological content where possible.
- Internal linking: every property page links to `/nevada-mining/` and `/due-diligence/`. Both content pages link back to relevant properties.

**Technical:**
- Generate `sitemap.xml` at build time from Eleventy collections.
- `robots.txt` allowing all crawlers explicitly including `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`. We WANT AI crawlers indexing this — that's how investors will discover it.
- Preload critical CSS, lazy-load below-the-fold images with `loading="lazy"`.
- Use `<picture>` with WebP + JPEG fallback.
- Inline critical CSS for above-the-fold in `<style>` in head; defer the rest.
- Target Largest Contentful Paint < 2.5s, Cumulative Layout Shift < 0.05.
- 100% mobile responsive. Test on 360px width.

**Target keywords (organic, not stuffed):**
- "gold mines for sale in Nevada"
- "Nevada mining property for sale"
- "patented mining claims Nevada"
- "Eureka County gold mine for sale"
- "Humboldt County mining property"
- "Carlin Trend mining claims"
- "copper silver gold mine Nevada"

---

## 9. THE TWO PROPERTIES — CANONICAL DATA

This is the source of truth. Put it in `src/_data/properties.json`. Do NOT embellish or invent additional facts.

### Property 1 — Lynn Creek Placers

```json
{
  "slug": "lynn-creek-placers",
  "name": "Lynn Creek Placers",
  "district": "Lynn Mining District",
  "county": "Eureka County",
  "state": "Nevada",
  "country": "USA",
  "type": "Group of placers",
  "depositType": "Placer Au-PGE",
  "coordinates": {
    "dms": "40° 55′ 32″ N, 116° 17′ 20″ W",
    "decimal": { "lat": 40.92575, "lng": -116.28897 }
  },
  "climate": { "koppen": "BSk", "description": "Cold semi-arid (steppe)" },
  "nearestSettlement": { "name": "Carlin, NV", "population": 2302, "year": 2017, "distanceKm": 28.2 },
  "mindatId": 60622,
  "mindatUrl": "https://www.mindat.org/loc-60622.html",
  "usgsMrds": null,
  "guid": "mindat:1:2:60622:3",
  "deposit": "The channel extends eastward from the lode mining area for approximately 4 miles. In the upper 2.5 miles the gravels average 25 ft wide and 10 to 28 ft deep, and the pay streak is the first 1.5 ft of alluvium lying on bedrock.",
  "workings": "Numerous cuts, pits, trenches, and shafts.",
  "reserves": "Indicated reserves exceed 1 million cubic yards.",
  "geology": "Gold is probably derived from mineralized shear zones in chert and shale of the Vinini Formation. The recovered gold is very fine, averaging 920 to 960 fineness.",
  "hostRocks": ["Stream gravels"],
  "history": [
    { "year": 1952, "event": "Channel being worked by the Ura Gold Mines Co." }
  ],
  "commodities": ["Au"],
  "minerals": [
    { "name": "Native Gold", "formula": "Au", "strunz": "1 — Elements" },
    { "name": "Bismuthinite", "formula": "Bi₂S₃", "strunz": "2 — Sulphides and sulfosalts" },
    { "name": "Bismite", "formula": "Bi₂O₃", "strunz": "4 — Oxides and hydroxides" },
    { "name": "Bismutite", "formula": "(BiO)₂CO₃", "strunz": "5 — Carbonates" }
  ]
}
```

### Property 2 — Adelaide Mine

```json
{
  "slug": "adelaide-mine",
  "name": "Adelaide Mine",
  "district": "Gold Run Mining District",
  "county": "Humboldt County",
  "state": "Nevada",
  "country": "USA",
  "type": "Mine",
  "depositType": "Skarn Cu",
  "coordinates": {
    "dms": "40° 48′ 18″ N, 117° 29′ 40″ W",
    "decimal": { "lat": 40.80509, "lng": -117.49462 }
  },
  "climate": { "koppen": "BSk", "description": "Cold semi-arid (steppe)" },
  "nearestSettlements": [
    { "name": "Golconda, NV", "population": 214, "year": 2011, "distanceKm": 16.5 },
    { "name": "Winnemucca, NV", "population": 7887, "year": 2017, "distanceKm": 27.5 }
  ],
  "mindatId": 59702,
  "mindatUrl": "https://www.mindat.org/loc-59702.html",
  "usgsMrds": "10014368",
  "guid": "mindat:1:2:59702:2",
  "historicalNames": ["NBMG Sample Site 2301", "Sec 20 T34N R40E"],
  "structuralSetting": "NE-trending folds and faults.",
  "alteration": "Oxidation.",
  "deposit": "Sulfide replacement of marble and calcareous siltstone. Replacement bodies appear to follow transposed bedding (isoclinally folded rock), with north-trending high-angle faults and low-angle thrust faults influencing localization. Rocks east of the replaced units are hard, laminated sandstone and siltstone. Carbonate-bearing rocks are converted to calcsilicate rocks with light brown garnet; vesuvianite and scheelite are reported in mine waste dumps.",
  "ore": "Chalcopyrite, pyrrhotite, and minor sphalerite and galena in a gangue of calcite, garnet, and vesuvianite.",
  "structuralControl": "Fault zone.",
  "hostRocks": ["Preble Formation (limestone interbedded with dark calcareous phyllite)"],
  "history": [
    { "year": "1860s", "event": "Discovery and start of operations." },
    { "year": "1860s–1940", "event": "Operated continuously; produced the major portion of the gold, silver, copper, and lead for the district." },
    { "year": 1980, "event": "Production resumed; Bullion Monarch Co. held a 50% interest in M.& B. Mining Co. By October 1980 about 1,000 tons of ore had been mined and stockpiled for delivery to Monarch's 200-tons-per-day flotation mill at Austin." },
    { "year": 1984, "event": "Reported inactive by Garside." }
  ],
  "commodities": ["Cu", "Au", "Pb", "Ag", "W", "Zn"],
  "minerals": [
    { "name": "Calcite", "formula": "CaCO₃", "strunz": "5 — Carbonates" },
    { "name": "Chalcopyrite", "formula": "CuFeS₂", "strunz": "2 — Sulphides and sulfosalts" },
    { "name": "Diopside", "formula": "CaMgSi₂O₆", "strunz": "9 — Silicates" },
    { "name": "Galena", "formula": "PbS", "strunz": "2 — Sulphides and sulfosalts" },
    { "name": "Garnet Group", "formula": "X₃Z₂(SiO₄)₃", "strunz": "Unclassified" },
    { "name": "Orthoclase", "formula": "K(AlSi₃O₈)", "strunz": "9 — Silicates" },
    { "name": "Pyrrhotite", "formula": "Fe₁₋ₓS", "strunz": "2 — Sulphides and sulfosalts" },
    { "name": "Quartz", "formula": "SiO₂", "strunz": "4 — Oxides and hydroxides" },
    { "name": "Scheelite", "formula": "Ca(WO₄)", "strunz": "7 — Sulphates, chromates, molybdates and tungstates" },
    { "name": "Sphalerite", "formula": "ZnS", "strunz": "2 — Sulphides and sulfosalts" },
    { "name": "Vesuvianite", "formula": "Ca₁₉Fe³⁺Al₄(Al₆Mg₂)□₄□[Si₂O₇]₄[(SiO₄)₁₀]O(OH)₉", "strunz": "9 — Silicates" }
  ],
  "references": [
    "Ransome (1909). Notes on Some Mining Districts in Humboldt County, Nevada.",
    "Couch & Carpenter (1943). Nevada's Metal and Mineral Production (1859–1940).",
    "Willden (1964). Geology and Mineral Deposits of Humboldt County, Nevada.",
    "Berger (1975). Report of Property Examination, Adelaide Mine.",
    "Marsh & Erickson (1978). Geologic Map of the Gold Run Creek Quadrangle.",
    "Garside (1984). Field Investigation and Sample Analysis.",
    "Stager & Tingley (1988). Tungsten Deposits in Nevada."
  ]
}
```

---

## 10. CONTENT — REAL COPY TO USE

### Homepage hero
- Eyebrow: `GOLDSTONE LLC · NEVADA · EST. 1989`
- H1: `Two patented mining properties. Verified geology. Direct from the principal.`
- Sub: `Goldstone LLC offers gold, copper, and silver mining properties in Eureka and Humboldt Counties, Nevada — each documented in the USGS Mineral Resources Data System and the Mindat geological database. Inquiries are handled by Dennis Blancey directly.`

### About — Dennis Blancey
*(Use this exact paragraph or close to it. Do not embellish.)*

> Dennis Blancey has worked Nevada mining property since 1989. Goldstone LLC operates from three offices across the state — Carlin, Golconda, and Carson City — covering the Carlin Trend, the Battle Mountain–Eureka belt, and the Humboldt mining districts. The firm focuses on properties with documented USGS or Nevada Bureau of Mines and Geology records, and works directly with serious buyers rather than through intermediaries.

### Why Nevada (homepage section + `/nevada-mining/` long-form)
Use real, citable facts. The state's status as #1 US gold producer, the Carlin Trend's significance, the historical production records of Humboldt and Eureka counties. Cite sources inline (Nevada Division of Minerals annual reports, USGS Minerals Yearbook).

### Property page boilerplate intros (one per property)

**Lynn Creek Placers — opening paragraph:**
> Lynn Creek Placers is a four-mile placer channel in the Lynn Mining District, Eureka County, situated 28 km from Carlin in the heart of the Carlin Trend. The placer hosts very fine gold averaging 920–960 fineness, derived from mineralized shear zones in the chert and shale of the Vinini Formation. Indicated reserves exceed one million cubic yards, with workings comprising numerous cuts, pits, trenches, and shafts. Recorded operations date to 1952 under the Ura Gold Mines Co.

**Adelaide Mine — opening paragraph:**
> The Adelaide Mine is a historic copper-gold-silver-lead skarn deposit in the Gold Run Mining District, Humboldt County, 16.5 km from Golconda. Discovered in the 1860s, the mine operated continuously through 1940 and produced the major portion of gold, silver, copper, and lead for the district. Mineralization occurs as sulfide replacement of marble and calcareous siltstone within the Preble Formation, with ore composed of chalcopyrite and pyrrhotite plus minor sphalerite and galena. Scheelite traces in the mine waste dumps indicate tungsten potential. Most recently active in 1980 under Bullion Monarch's interest in M.& B. Mining Co.

---

## 11. INTERACTIVE & POLISH DETAILS

- **Sticky breadcrumb on property pages** — collapses into a thin top bar with property name + "Inquire" button when the user scrolls past the hero.
- **Reading progress indicator** on long content pages (`/nevada-mining/`, `/due-diligence/`) — a thin copper bar at the very top.
- **Smooth scroll** between sections via anchor links in the sidebar.
- **Print stylesheet** (`@media print`) — a property page should print to a clean, USGS-style fact sheet on letter-size paper. This matters because mining investors print and circulate property files.
- **Hover states** — desaturated/subtle. Underline-on-hover for links. No transform: scale(1.05) bouncing.
- **Focus states** — visible 2px copper outline for keyboard navigation.
- **Reduced motion** — respect `prefers-reduced-motion: reduce`. Disable scroll-triggered animations.
- **Dark mode is optional** — if implemented, use the same earth palette but swap paper-for-ink. Do not invert blindly. Honor `prefers-color-scheme: dark`.

---

## 12. FORMS

- The inquiry form is the primary conversion. Fields: Name, Company (optional), Email, Phone (optional), Property of interest (dropdown: Lynn Creek / Adelaide / Both / Other), Message.
- Implement as Netlify Forms (`<form name="inquiry" data-netlify="true" netlify-honeypot="bot-field">`). Add a hidden honeypot field. No reCAPTCHA — too intrusive for this audience.
- Success page at `/contact/thank-you/` — confirms Dennis Blancey will reply directly.
- Server-side form notifications go to `Grandnevadacorp@gmail.com`.

---

## 13. LEGAL / TRUST FOOTER

- "© 2026 Goldstone LLC. All rights reserved."
- A small disclaimer block: "Property descriptions reflect publicly available data from the USGS Mineral Resources Data System (MRDS) and the Mindat.org geological database. Prospective buyers should conduct independent due diligence including title verification, mineral rights review, and on-site inspection. Goldstone LLC does not provide investment advice."
- Link to a `/privacy/` page (basic — what's collected by the inquiry form, no tracking cookies, no third-party analytics beyond optional Plausible/Fathom).
- Do NOT add Google Analytics. Use **Plausible** or **Fathom** (privacy-friendly, cookieless) — note that the client needs to set up an account; leave the snippet commented in the head with a TODO.

---

## 14. ACCESSIBILITY

- WCAG 2.2 AA minimum. Color contrast checked on every text/background pair.
- Semantic landmarks: `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`, `<aside>`.
- Skip-to-content link at the top of every page.
- Form labels properly associated. Errors announced via `aria-live`.
- All maps have a textual data fallback below.

---

## 15. DEPLOYMENT

- `netlify.toml` configured: build command `npx @11ty/eleventy`, publish `dist`.
- Or `wrangler.toml` for Cloudflare Pages.
- Add a `README.md` for the client with: how to edit content (point them at `src/_data/properties.json`), how to add a new property page, how to swap photos, how to get a MapTiler key, how to enable form notifications.
- Include a `CHANGELOG.md`.

---

## 16. BUILD ORDER

Do it in this order. Don't skip ahead — the client should be able to see real progress after each stage:

1. Initialize Eleventy project, create folder structure, install dependencies.
2. Build `tokens.css`, `reset.css`, `typography.css` — get the design system right first.
3. Build `base.njk` layout with SEO meta, structured data, header/footer.
4. Build the homepage with real copy and placeholder image regions.
5. Build the property page template + both property pages with all real data from §9.
6. Build the Leaflet 2D map component with the 5 tile layers + custom marker.
7. Build the MapLibre 3D terrain toggle.
8. Build `/about/`, `/contact/`, `/due-diligence/`, `/nevada-mining/`.
9. Build `/properties/` index with filter sidebar.
10. Wire up the contact form (Netlify Forms).
11. Generate sitemap.xml and robots.txt.
12. Run Lighthouse — target 95+ on every category. Fix until you hit it.
13. Write the README for the client.

---

## 17. FINAL CHECKS — DO NOT SHIP UNTIL

- [ ] No emojis anywhere on the site.
- [ ] No purple/blue gradients. No glassmorphism.
- [ ] No fake testimonials, fake stats, or stock-photo placeholder businesspeople.
- [ ] Every page has unique handwritten `<title>` and `<meta description>`.
- [ ] Every property page validates as Product + Place schema in Google's Rich Results Test.
- [ ] Sitemap.xml lists every page.
- [ ] robots.txt allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended.
- [ ] All 5+ map layers function, custom marker renders, 3D terrain toggle works.
- [ ] Coordinates display in mono font matching the document-grade aesthetic.
- [ ] Mobile layout tested at 360px width.
- [ ] Lighthouse: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100.
- [ ] Print stylesheet produces a clean property fact sheet on letter-size paper.
- [ ] Contact form posts to Netlify and notifies `Grandnevadacorp@gmail.com`.
- [ ] README written for non-technical client maintenance.

---

## 18. WHEN YOU FINISH

Provide the client with:
1. A summary of what was built and where to find things.
2. A list of placeholder photo regions that need real images from the client (Dennis Blancey portrait, site photos of both mines).
3. The MapTiler signup link if 3D terrain needs a key.
4. The Netlify deployment URL and instructions to point goldminesforsaleinnevada.com at it.
5. A small "Phase 2 ideas" note: adding more properties as the client lists them, a password-protected data room for serious buyers, a downloadable PDF property packet per mine generated from the same data.

Now build it.
