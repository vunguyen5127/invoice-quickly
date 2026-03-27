const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'locales');
const enPath = path.join(localesDir, 'en.ts');

const enContent = fs.readFileSync(enPath, 'utf8');

// Extract all keys from en.ts
const keyRegex = /^\s*([a-zA-Z0-9_]+)\s*:/gm;
const enKeys = [];
let match;
while ((match = keyRegex.exec(enContent)) !== null) {
  const key = match[1];
  if (!['export', 'type', 'Translations', 'K'].includes(key)) {
    enKeys.push(key);
  }
}

// Extract key-value pairs from en.ts
const kvRegex = /^\s*([a-zA-Z0-9_]+)\s*:\s*("(?:[^"\\]|\\.)*"),?/gm;
const enDict = {};
while ((match = kvRegex.exec(enContent)) !== null) {
  enDict[match[1]] = match[2];
}

const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts') && f !== 'en.ts');

files.forEach(file => {
  const filepath = path.join(localesDir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  
  const targetKeys = [];
  while ((match = keyRegex.exec(content)) !== null) {
    targetKeys.push(match[1]);
  }
  
  const missingKeys = enKeys.filter(k => !targetKeys.includes(k) && enDict[k]);
  
  if (missingKeys.length > 0) {
    // Find the closing brace `};` and insert missing keys just before it
    const closingBraceIndex = content.lastIndexOf('};');
    if (closingBraceIndex !== -1) {
      let appendStr = '';
      missingKeys.forEach(k => {
        appendStr += `  ${k}: ${enDict[k]},\n`;
      });
      content = content.slice(0, closingBraceIndex) + appendStr + content.slice(closingBraceIndex);
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`Updated ${file} with ${missingKeys.length} new keys.`);
    }
  }
});
