const fs = require("node:fs");
const path = require("node:path");

function loadLocalEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;

  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match || process.env[match[1]]) return;
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    });
}

loadLocalEnv();

const env = process.env.ELEVENTY_ENV || "development";
const isProd = env === "production";

module.exports = function (eleventyConfig) {
  /* ── Passthrough copy ─────────────────────────────────────────── */
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  /* ── Watch targets ────────────────────────────────────────────── */
  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("src/assets/js/");

  /* ── Global data ──────────────────────────────────────────────── */
  eleventyConfig.addGlobalData("env", env);
  eleventyConfig.addGlobalData("isProd", isProd);
  eleventyConfig.addGlobalData("maptilerKey", process.env.MAPTILER_KEY || "");

  /* ── Dev-only page gate ───────────────────────────────────────── *
   * Set `devOnly: true` in a page's front matter to exclude it from
   * production builds. Reusable for any internal page (type specimen,
   * style guide, component previews, etc.).                          */
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      if (data.devOnly && isProd) return false;
      return data.permalink;
    },
  });

  /* ── Filters ──────────────────────────────────────────────────── */
  eleventyConfig.addFilter("dateIso", (d) => {
    const date = d instanceof Date ? d : new Date(d);
    return date.toISOString().split("T")[0];
  });

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  eleventyConfig.addFilter("findBySlug", (items, slug) =>
    (items || []).find((item) => item.slug === slug)
  );

  eleventyConfig.addFilter("json", (value) =>
    JSON.stringify(value, null, 2).replace(/</g, "\\u003c")
  );

  eleventyConfig.addFilter("pluck", (items, key) =>
    (items || []).map((item) => item[key])
  );

  eleventyConfig.addFilter("propertyJsonLd", (property, site, pageUrl) => {
    const url = `${site.url}${pageUrl}`;
    const coordinates = property.coordinates.decimal;
    const place = {
      "@context": "https://schema.org",
      "@type": "Place",
      "@id": `${url}#place`,
      "name": property.name,
      "url": url,
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": coordinates.lat,
        "longitude": coordinates.lng,
      },
      "containedInPlace": {
        "@type": "Place",
        "name": property.district,
        "containedInPlace": {
          "@type": "AdministrativeArea",
          "name": property.county,
          "containedInPlace": {
            "@type": "State",
            "name": "Nevada",
            "containedInPlace": { "@type": "Country", "name": "USA" },
          },
        },
      },
    };

    const additionalProperty = [
      ...property.commodities.map((commodity) => ({
        "@type": "PropertyValue",
        "name": "Commodity",
        "value": commodity,
      })),
      ...property.minerals.map((mineral) => ({
        "@type": "PropertyValue",
        "name": mineral.name,
        "value": mineral.formula,
        "description": mineral.strunz,
      })),
    ];

    return JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${url}#product`,
        "name": property.name,
        "description": property.deposit,
        "category": "Mining property",
        "url": url,
        "brand": { "@type": "Organization", "name": site.name, "url": site.url },
        "offers": {
          "@type": "Offer",
          "url": url,
          "availability": "https://schema.org/InStock",
          "seller": { "@type": "Organization", "name": site.name },
        },
        "additionalProperty": additionalProperty,
        "geo": place,
      },
      place,
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": site.url },
          { "@type": "ListItem", "position": 2, "name": "Properties", "item": `${site.url}/properties/` },
          { "@type": "ListItem", "position": 3, "name": property.name, "item": url },
        ],
      },
    ], null, 2).replace(/</g, "\\u003c");
  });

  /* ── Collections ──────────────────────────────────────────────── */
  eleventyConfig.addCollection("properties", (api) =>
    api.getFilteredByGlob("src/properties/*.njk").filter((i) => i.data.property)
  );

  /* ── Build log ────────────────────────────────────────────────── */
  eleventyConfig.on("eleventy.after", ({ results }) => {
    const count = results.length;
    console.log(`\n  [goldstone] env=${env}  pages=${count}  prod=${isProd}\n`);
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html", "11ty.js"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
