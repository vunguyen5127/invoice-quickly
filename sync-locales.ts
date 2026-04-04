import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

const enPath = path.join(localesDir, 'en.ts');
const enContent = fs.readFileSync(enPath, 'utf8');

// Chỉ lấy các key chuẩn
const keyRegex = /^\s*([a-zA-Z0-9_]+)\s*:\s*(["'].*?["']),?/gm;
const enDict: Record<string, string> = {};
let match;
while ((match = keyRegex.exec(enContent)) !== null) {
  enDict[match[1]] = match[2];
}

async function translateText(textWithQuotes: string, toLang: string) {
  const langMap: Record<string, string> = {
    'vn': 'vi', 'zh': 'zh-CN' // Các mã ngôn ngữ đặc biệt
  };
  const tl = langMap[toLang] || toLang;
  
  // Loại bỏ dấu nháy bọc ở đầu và cuối để dịch nội dung thực
  const text = textWithQuotes.substring(1, textWithQuotes.length - 1);
  
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    let translated = "";
    for (const segment of data[0]) {
      translated += segment[0];
    }
    return `"${translated.replace(/"/g, '\\"')}"`; // Bọc lại bằng ngoặc kép
  } catch (e) {
    console.error(`Lỗi khi dịch "${text}" sang ${tl}:`, e);
    return textWithQuotes; // Nếu lỗi thì giữ nguyên tiếng Anh
  }
}

async function run() {
  console.log('Đang quét các file locales...');
  let totalUpdated = 0;
  
  for (const file of files) {
    if (file === 'en.ts') continue;
    const lang = file.replace('.ts', '');
    const filePath = path.join(localesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Tìm các key hiện có trong file này
    const fileKeys = new Set<string>();
    let m;
    while ((m = keyRegex.exec(content)) !== null) {
      fileKeys.add(m[1]);
    }
    
    // Lọc ra các key tiếng Anh nằm ngoài file hiện tại
    const missingKeys = Object.keys(enDict).filter(k => !fileKeys.has(k));
    
    if (missingKeys.length > 0) {
      console.log(`\n⏳ Đang tự động dịch & thêm ${missingKeys.length} keys vào ${file}...`);
      let appendStr = "";
      for (const key of missingKeys) {
        const enValue = enDict[key];
        const translatedValue = await translateText(enValue, lang);
        appendStr += `  ${key}: ${translatedValue},\n`;
      }
      
      let updated = false;
      if (content.includes("};\n\nexport type")) {
          content = content.replace("};\n\nexport type", ",\n" + appendStr + "};\n\nexport type");
          updated = true;
      } else {
          // Bắt ngoặc nhọn đóng cuối cùng của file
          const matchTarget = content.match(/}[^}]*$/);
          if (matchTarget) {
              const before = content.slice(0, matchTarget.index);
              const after = content.slice(matchTarget.index);
              content = before.trimEnd() + ",\n" + appendStr + after;
              updated = true;
          }
      }
      
      if (updated) {
          // Dọn dẹp dấu phẩy bị thừa
          content = content.replace(/,\s*,/g, ',');
          fs.writeFileSync(filePath, content);
          console.log(`✅ Đã cập nhật xong ${file}`);
          totalUpdated++;
      }
    }
  }
  
  console.log(`\n🎉 Hoàn thành! Đã kiểm tra và đồng bộ thành công ${totalUpdated} file ngôn ngữ.`);
}

run();
