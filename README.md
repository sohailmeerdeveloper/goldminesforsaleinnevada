# Goldstone LLC Website

Static Eleventy site for Goldstone LLC's Nevada mining property pages.

## 3D Terrain Maps

The Leaflet 2D property maps work without any API key. The optional MapLibre 3D Terrain view requires a public MapTiler key.

1. Register for a free key at https://www.maptiler.com/cloud/.
2. Copy `.env.example` to `.env`.
3. Set `MAPTILER_KEY=your_public_key_here`.
4. On Netlify, Cloudflare Pages, or another host, add `MAPTILER_KEY` as an environment variable before building.

If `MAPTILER_KEY` is missing, the 3D Terrain control shows a technical note and keeps the 2D map available.

## Inquiry Form

The contact page uses Netlify Forms for the `inquiry` form. The form posts to `/contact/thank-you/`, includes a `form-name` hidden field and honeypot field, and does not require JavaScript for submission.

Configure Netlify form notifications to send inquiry submissions to `Grandnevadacorp@gmail.com`.
