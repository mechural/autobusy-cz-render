import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const indexPath = path.join(rootDir, "dist", "index.html");
const assetsPath = path.join(rootDir, "dist", "assets");

if (!existsSync(indexPath)) {
  console.error("✗ Chybí dist/index.html – build pravděpodobně selhal.");
  process.exit(1);
}
if (!existsSync(assetsPath) || !statSync(assetsPath).isDirectory()) {
  console.error("✗ Chybí dist/assets – build pravděpodobně selhal.");
  process.exit(1);
}
console.log("✓ Build dist/ vypadá v pořádku.");
