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
