import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

const enPath = path.join(localesDir, 'en.ts');
const enContent = fs.readFileSync(enPath, 'utf8');

const keyRegex = /^\s*([a-zA-Z0-9_]+)\s*:/gm;
const enKeys: string[] = [];
let match;
while ((match = keyRegex.exec(enContent)) !== null) {
  enKeys.push(match[1]);
}

let totalMissing = 0;
const missingReport: Record<string, string[]> = {};

for (const file of files) {
  if (file === 'en.ts') continue;
  const content = fs.readFileSync(path.join(localesDir, file), 'utf8');
  const fileKeys = new Set();
  let match2;
  while ((match2 = keyRegex.exec(content)) !== null) {
    fileKeys.add(match2[1]);
  }
  
  const missing = enKeys.filter(k => !fileKeys.has(k));
  if (missing.length > 0) {
    missingReport[file] = missing;
    totalMissing += missing.length;
  }
}

console.log(JSON.stringify(missingReport, null, 2));
console.log(`\nTotal missing keys across all files: ${totalMissing}`);
