const fs = require('fs');
const path = require('path');

const localesDir = 'e:\\Videos\\invoice-quickly\\locales';

// Full map of 22 languages and their 4 new keys
const mapping = {
  ar: { i: "قوالب الفاتورة", p: "مولد فاتورة PDF", e: "الترقية من إكسل", f: "مجاني 100٪" },
  da: { i: "Fakturaskabeloner", p: "PDF-fakturagenerator", e: "Opgradering fra Excel", f: "100 % Gratis" },
  de: { i: "Rechnungsvorlagen", p: "PDF-Rechnungsgenerator", e: "Upgrade von Excel", f: "100 % Kostenlos" },
  en: { i: "Invoice Templates", p: "PDF Invoice Generator", e: "Upgrade from Excel", f: "100% Forever" },
  es: { i: "Plantillas de Facturas", p: "Generador de Facturas PDF", e: "Actualizar desde Excel", f: "100% Gratis" },
  fi: { i: "Laskupohjat", p: "PDF-laskutusgeneraattori", e: "Päivitä Excelistä", f: "100 % Ilmainen" },
  fr: { i: "Modèles de Facture", p: "Générateur de Factures PDF", e: "Mise à niveau depuis Excel", f: "100 % Gratuit" },
  hi: { i: "चालान टेम्प्लेट", p: "चेक पीडीएफ जनरेटर", e: "एक्सेल से अपग्रेड करें", f: "100% नि: शुल्क" },
  id: { i: "Templat Faktur", p: "Pembuat Faktur PDF", e: "Tingkatkan dari Excel", f: "100% Gratis" },
  it: { i: "Modelli di Fattura", p: "Generatore di Fatture PDF", e: "Aggiorna da Excel", f: "100% Gratuito" },
  ja: { i: "請求書テンプレート", p: "PDF請求書ジェネレーター", e: "Excelからのアップグレード", f: "100％無料" },
  ko: { i: "인보이스 템플릿", p: "PDF 인보이스 생성기", e: "엑셀에서 업그레이드", f: "100% 무료" },
  nl: { i: "Factuursjablonen", p: "PDF Factuurgenerator", e: "Upgraden vanuit Excel", f: "100% Gratis" },
  no: { i: "Fakturamaler", p: "PDF Fakturagenerator", e: "Oppgrader fra Excel", f: "100 % Gratis" },
  pl: { i: "Szablony Faktur", p: "Generator Faktur PDF", e: "Aktualizacja z programu Excel", f: "100% Za Darmo" },
  pt: { i: "Modelos de Fatura", p: "Gerador de Faturas PDF", e: "Atualizar do Excel", f: "100% Grátis" },
  ru: { i: "Шаблоны счетов", p: "Генератор счетов PDF", e: "Обновление из Excel", f: "100% Бесплатно" },
  sv: { i: "Fakturamallar", p: "PDF-fakturagenerator", e: "Uppgradera från Excel", f: "100 % Gratis" },
  th: { i: "เทมเพลตใบแจ้งหนี้", p: "เครื่องมือสร้างใบแจ้งหนี้ PDF", e: "อัปเกรดจาก Excel", f: "ฟรี 100%" },
  tr: { i: "Fatura Şablonları", p: "PDF Fatura Oluşturucu", e: "Excel'den Yükselt", f: "%100 Ücretsiz" },
  vn: { i: "Mẫu Hóa Đơn", p: "Trình Tạo Hóa Đơn PDF", e: "Nâng Cấp Từ Excel", f: "Miễn Phí 100%" },
  zh: { i: "发票模板", p: "PDF 发票生成器", e: "从 Excel 升级", f: "100% 免费" }
};

const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const langMatch = file.match(/^([a-z]+)\.ts$/);
  if (!langMatch) return;
  const lang = langMatch[1];
  
  if (lang === 'en' || lang === 'vn') {
    // English and VN are already updated and typed properly!
    return;
  }
  
  const m = mapping[lang] || mapping['en'];
  
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('template_invoice:')) return; // Already done
  
  const appendString = `  template_invoice: "${m.i}",\n  template_pdf: "${m.p}",\n  template_excel: "${m.e}",\n  template_free: "${m.f}",\n};`;
  
  // Replace the last occurrence of `};`
  const lastBraceIndex = content.lastIndexOf('};');
  if (lastBraceIndex !== -1) {
    content = content.substring(0, lastBraceIndex) + appendString + content.substring(lastBraceIndex + 2);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file} with templates`);
  }
});
