import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");

writeFileSync(
  resolve(distDir, "_worker.js"),
  `import w from "./server/entry.mjs";
export default { fetch: (r, e, c) => w.fetch(r, e, c) };
`
);
