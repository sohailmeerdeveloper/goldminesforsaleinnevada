// Cross-platform production build launcher for Eleventy.
// Sets ELEVENTY_ENV=production so the project's environment-aware config
// produces a production build on Windows, macOS, and Linux without adding
// a cross-env dependency.

"use strict";

process.env.ELEVENTY_ENV = "production";

const { spawnSync } = require("node:child_process");
const result = spawnSync("npx", ["@11ty/eleventy"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

process.exit(result.status || 0);
