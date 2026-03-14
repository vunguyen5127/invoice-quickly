import { mkdirSync, writeFileSync, chmodSync } from "node:fs";
import { resolve } from "node:path";

const hookDir = resolve(process.cwd(), ".git", "hooks");
const hookPath = resolve(hookDir, "pre-push");

mkdirSync(hookDir, { recursive: true });

const script = `#!/usr/bin/env bash
set -e

echo "[pre-push] Running linting..."
npm run lint

echo "[pre-push] Running build checks..."
npm run build

echo "[pre-push] Running Playwright regression tests..."
npm run test:e2e
`;

writeFileSync(hookPath, script, "utf8");
chmodSync(hookPath, 0o755);

console.log("Installed pre-push hook at .git/hooks/pre-push");
console.log("This will run: npm run test:e2e before each push.");
