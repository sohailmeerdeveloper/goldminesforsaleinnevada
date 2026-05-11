# Goldstone LLC Website

Static marketing website for documented Nevada mining properties at `goldminesforsaleinnevada.com`.

## Project Overview

- Site: `goldminesforsaleinnevada.com`
- Client: Goldstone LLC
- Principal: Dennis Blancey
- Purpose: a static, search-friendly marketing site for documented Nevada mining properties with public geological source references.

The site presents Goldstone LLC, current property files, Nevada mining context, buyer due diligence notes, maps, and a direct inquiry form.

## Tech Stack

- Eleventy static site
- Custom CSS using local design tokens
- Vanilla JavaScript
- Leaflet 2D property maps
- MapLibre 3D terrain toggle
- Netlify Forms inquiry form
- No React
- No Tailwind
- No jQuery or UI kits

## Local Setup

Install dependencies:

```bash
npm install
```

Run a production build (sets `ELEVENTY_ENV=production` automatically and is cross-platform):

```bash
npm run build
```

Run a development build (includes dev-only pages such as `/type-specimen/`):

```bash
npm run build:dev
```

Run a local development server:

```bash
npm start
```

If you prefer to invoke Eleventy directly, the equivalent production command is:

```bash
ELEVENTY_ENV=production npx @11ty/eleventy
```

On Windows PowerShell:

```powershell
$env:ELEVENTY_ENV='production'; npx @11ty/eleventy
```

The built site outputs to `dist/`.

## Environment Variables

Copy `.env.example` to `.env` for local development.

```bash
MAPTILER_KEY=
```

`MAPTILER_KEY` is optional for the site and is not needed for the Leaflet 2D maps. It is required for the optional MapLibre 3D terrain view on property pages.

Get a MapTiler key from [MapTiler Cloud](https://www.maptiler.com/cloud/). Add it locally as `MAPTILER_KEY=your_public_key_here`. On Netlify or Cloudflare Pages, add the same variable in the site's environment variable settings before building.

If `MAPTILER_KEY` is missing, the 3D Terrain control shows a clear note and the 2D map remains available.

## Editing Site-Wide Contact Info

Edit `src/_data/site.json`.

Current client details are stored there:

- Phones: `+1 775 400 5337`, `+1 775 544 8494`
- Email: `Grandnevadacorp@gmail.com`
- Offices: Carlin NV 89822, Golconda NV 89414, Carson City NV 89702

After editing, run `npm run build` and check the footer, contact page, property CTA cards, and Organization JSON-LD.

## Editing Property Data

Edit `src/_data/properties.json`.

Important data rules:

- `_meta` is editor metadata and is ignored by templates.
- Templates render only `properties.items`.
- Do not invent mining facts, production figures, acreage, legal status, pricing, ownership claims, or reserves.
- Verify changes against public source records or client-supplied source documents before publishing.

Common editable fields:

- `name`
- `district`
- `county`
- `coordinates`
- `depositType`
- `commodities`
- `minerals`
- `references`
- `mindatUrl`
- `usgsMrdsUrl`

Property data currently references Mindat and USGS MRDS source records. Preserve source URLs whenever possible so future buyers and maintainers can trace the public record.

## Adding a New Property

1. Add a new object to `src/_data/properties.json` under `items`.
2. Use a unique `slug`.
3. Add verified coordinates in decimal form so maps can render.
4. Add Mindat, MRDS, and other source links where available.
5. Add minerals, commodities, host rocks, geology, history, and references only when verified.
6. Create a page file in `src/properties/` using the current property page pattern:

```njk
---
layout: layouts/property.njk
title: Property Name
meta_title: Property Name Mining Property
meta_description: "Handwritten description for this property."
og_type: article
propertySlug: property-slug
property: true
extra_css:
  - /assets/css/property.css
  - /assets/css/map.css
extra_js:
  - /assets/js/map-2d.js
  - /assets/js/map-3d.js
---
```

7. Run `npm run build`.
8. Check the new property page, `/properties/`, sitemap output, map behavior, and Lighthouse.

## Replacing Placeholder Photos

Current placeholder regions:

- Lynn Creek property photo
- Adelaide property photo
- Dennis Blancey portrait

Use real client-owned, licensed, or public-domain imagery. Do not use AI-generated mine imagery, unrelated stock photos, or generic businessperson placeholders.

Preferred image handling:

- Place images under `src/assets/img/`.
- Use descriptive filenames.
- Add meaningful `alt` text where images are rendered.
- Prefer optimized WebP plus JPEG fallback for final production images.
- Keep source/licensing notes with the project if the image did not come directly from the client.

## Forms

The contact page uses Netlify Forms.

- Form name: `inquiry`
- Submission method: plain HTML `POST`
- Action: `/contact/thank-you/`
- Includes hidden `form-name` field
- Includes honeypot field
- No JavaScript required for submission
- No reCAPTCHA

Configure Netlify form notifications to send submissions to `Grandnevadacorp@gmail.com`.

## Deployment

Netlify is recommended.

Netlify settings:

- Build command: `npx @11ty/eleventy`
- Publish directory: `dist`
- Environment variable: `ELEVENTY_ENV=production`
- Optional environment variable for 3D terrain: `MAPTILER_KEY=...`

The included `netlify.toml` sets the build command and publish directory.

Domain note:

- Point `goldminesforsaleinnevada.com` DNS to the deployed Netlify site after the Netlify project is created.
- Configure the primary domain and HTTPS certificate in Netlify.

Cloudflare Pages is also possible:

- Build command: `npx @11ty/eleventy`
- Output directory: `dist`
- Add `ELEVENTY_ENV=production`
- Add `MAPTILER_KEY` if 3D terrain should work.

## Launch QA Checklist

- `npm run build` passes.
- `ELEVENTY_ENV=development npx @11ty/eleventy` passes.
- `dist/sitemap.xml` exists and lists public pages.
- `dist/robots.txt` exists and allows search and AI crawlers.
- Netlify detects the `inquiry` form.
- Netlify form notifications send to `Grandnevadacorp@gmail.com`.
- `MAPTILER_KEY` is added if 3D terrain should work at launch.
- Real photos are added or placeholders are accepted by the client.
- Lighthouse scores are checked.
- Property data is verified against source records.
- Phone links, email links, and the contact form are tested.
- Property page print preview is checked.
- Maps are checked on both property pages.
- Sitemap and canonical URLs use `https://goldminesforsaleinnevada.com`.

## Known Limitations and Follow-Ups

- Real MapTiler-key 3D terrain mode still needs QA with a real key.
- Current photo regions are placeholders until the client supplies real images.
- More properties can be added using the same data-driven pattern.
- Optional future work: private data room for serious buyers.
- Optional future work: downloadable PDF property packets generated from the same property data.

## Useful File Map

- Site data: `src/_data/site.json`
- Property data: `src/_data/properties.json`
- Homepage: `src/index.njk`
- Property index: `src/properties/index.njk`
- Property page template: `src/_includes/layouts/property.njk`
- Contact form: `src/contact.njk`
- Thank-you page: `src/contact/thank-you.njk`
- 2D map script: `src/assets/js/map-2d.js`
- 3D map script: `src/assets/js/map-3d.js`
- Main design tokens: `src/assets/css/tokens.css`
- Sitemap template: `src/sitemap.xml.njk`
- Robots template: `src/robots.txt.njk`
