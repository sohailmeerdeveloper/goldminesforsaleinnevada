module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/assets/docs": "assets/docs" });

  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("src/assets/js/");

  eleventyConfig.addFilter("dateIso", (d) => {
    const date = d instanceof Date ? d : new Date(d);
    return date.toISOString().split("T")[0];
  });

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  eleventyConfig.addCollection("properties", (api) =>
    api.getFilteredByGlob("src/properties/*.njk").filter((i) => i.data.property)
  );

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
