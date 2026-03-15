const fs = require('fs');
const path = require('path');

const localesDir = 'e:\\Videos\\invoice-quickly\\locales';

const translations = {
  ar: { noWatermark: "بدون علامة مائية", instantPdf: "بي دي إف فوري", templates: "قوالب", viewAllHub: "عرض كل المركز" },
  da: { noWatermark: "Intet vandmærke", instantPdf: "Øjeblikkelig PDF", templates: "Skabeloner", viewAllHub: "Se hele hubben" },
  de: { noWatermark: "Ohne Wasserzeichen", instantPdf: "Sofortige PDF", templates: "Vorlagen", viewAllHub: "Gesamten Hub anzeigen" },
  en: { noWatermark: "No Watermark", instantPdf: "Instant PDF", templates: "Templates", viewAllHub: "View All Hub" },
  es: { noWatermark: "Sin marca de agua", instantPdf: "PDF instantáneo", templates: "Plantillas", viewAllHub: "Ver todo el centro" },
  fi: { noWatermark: "Ei vesileimaa", instantPdf: "Välitön PDF", templates: "Mallit", viewAllHub: "Näytä kaikki keskukset" },
  fr: { noWatermark: "Sans filigrane", instantPdf: "PDF instantané", templates: "Modèles", viewAllHub: "Voir tout le centre" },
  hi: { noWatermark: "कोई वाटरमार्क नहीं", instantPdf: "तत्काल पीडीएफ", templates: "टेम्प्लेट", viewAllHub: "सभी हब देखें" },
  id: { noWatermark: "Tanpa Tanda Air", instantPdf: "PDF Instan", templates: "Templat", viewAllHub: "Lihat Semua Hub" },
  it: { noWatermark: "Nessuna filigrana", instantPdf: "PDF istantaneo", templates: "Modelli", viewAllHub: "Mostra tutto l'hub" },
  ja: { noWatermark: "透かしなし", instantPdf: "即時PDF", templates: "テンプレート", viewAllHub: "すべてのハブを表示" },
  ko: { noWatermark: "워터마크 없음", instantPdf: "즉시 PDF", templates: "템플릿", viewAllHub: "모든 허브 보기" },
  nl: { noWatermark: "Geen watermerk", instantPdf: "Directe PDF", templates: "Sjablonen", viewAllHub: "Bekijk de hele Hub" },
  no: { noWatermark: "Ingen vannmerke", instantPdf: "Umiddelbar PDF", templates: "Maler", viewAllHub: "Se all hub" },
  pl: { noWatermark: "Brak znaku wodnego", instantPdf: "Błyskawiczny PDF", templates: "Szablony", viewAllHub: "Rozwiń cały hub" },
  pt: { noWatermark: "Sem marca d'água", instantPdf: "PDF instantâneo", templates: "Modelos", viewAllHub: "Ver todo o Hub" },
  ru: { noWatermark: "Без водяных знаков", instantPdf: "Мгновенный PDF", templates: "Шаблоны", viewAllHub: "Показать весь центр" },
  sv: { noWatermark: "Inget vattenstämpel", instantPdf: "Omedelbar PDF", templates: "Mallar", viewAllHub: "Visa hela hubben" },
  th: { noWatermark: "ไม่มีลายน้ำ", instantPdf: "รับ PDF ทันที", templates: "เทมเพลต", viewAllHub: "ดูศูนย์รวมทั้งหมด" },
  tr: { noWatermark: "Filigran yok", instantPdf: "Anında PDF", templates: "Şablonlar", viewAllHub: "Tüm Merkezi Görüntüle" },
  vn: { noWatermark: "Không có Watermark", instantPdf: "PDF Tức Thì", templates: "Mẫu Hóa Đơn", viewAllHub: "Xem Tất Cả Trợ Giúp" },
  zh: { noWatermark: "无水印", instantPdf: "即时 PDF", templates: "模板", viewAllHub: "查看所有帮助中心" }
};

const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const langMatch = file.match(/^([a-z]+)\.ts$/);
  if (!langMatch) return;
  const lang = langMatch[1];
  
  if (!translations[lang]) {
    console.warn(`No translations provided for ${lang}, using en...`);
  }
  
  const trans = translations[lang] || translations['en'];
  
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // check if already added
  if (content.includes('noWatermark:')) return;
  
  const appendString = `\n  // Footer additional\n  noWatermark: "${trans.noWatermark}",\n  instantPdf: "${trans.instantPdf}",\n  templates: "${trans.templates}",\n  viewAllHub: "${trans.viewAllHub}",\n};`;
  
  // Find the LAST '};\n' or '};' before export type (in en.ts) or at EOF
  // Since all files end with '};' or '};\n' (except en.ts which has export type below it)
  
  if (lang === 'en') {
    content = content.replace(/};\s*export type Translations = typeof en;/m, appendString + '\n\nexport type Translations = typeof en;');
  } else {
    // For others, we assume `};` is near the end
    // Replace the last occurrence of `};` with our string
    const lastBraceIndex = content.lastIndexOf('};');
    if (lastBraceIndex !== -1) {
      content = content.substring(0, lastBraceIndex) + appendString + content.substring(lastBraceIndex + 2);
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
