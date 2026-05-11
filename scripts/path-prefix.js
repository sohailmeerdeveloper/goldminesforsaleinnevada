// Rewrite root-relative href/src/action/srcset/content paths in built HTML
// and XML so the site works when GitHub Pages serves it under a sub-path
// (https://user.github.io/repo-name/). Skips protocol-relative ("//...")
// and absolute ("https://...") URLs so canonical/og URLs are preserved.

"use strict";

const fs = require("node:fs");
const path = require("node:path");

const prefix = (process.env.PATH_PREFIX || "").replace(/\/$/, "");
if (!prefix) {
  console.log("[path-prefix] PATH_PREFIX empty; nothing to rewrite");
  process.exit(0);
}

function walk(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const root = process.argv[2] || "dist";
if (!fs.existsSync(root)) {
  console.error(`[path-prefix] ${root}/ not found`);
  process.exit(1);
}

const files = walk(root).filter((p) => /\.(html|xml)$/i.test(p));
let rewritten = 0;
for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  const before = content;
  content = content.replace(
    /(\b(?:href|src|action|srcset|content|formaction)=")\/(?!\/)/g,
    `$1${prefix}/`,
  );
  content = content.replace(/url\(\/(?!\/)/g, `url(${prefix}/`);
  if (content !== before) {
    fs.writeFileSync(file, content, "utf8");
    rewritten++;
  }
}
console.log(`[path-prefix] applied ${prefix} to ${rewritten} files`);
