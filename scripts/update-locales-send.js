const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'locales');

// New translations for each locale
const translations = {
  ar: { markAsSent: "إرسال الفاتورة", sendInvoice: "إرسال الفاتورة", sendingInvoice: "جاري الإرسال...", sendInvoiceSuccess: "تم إرسال الفاتورة بنجاح!", sendInvoiceFailed: "فشل إرسال الفاتورة. يرجى المحاولة مرة أخرى.", clientEmailRequired: "البريد الإلكتروني للعميل مطلوب لإرسال الفاتورة. يرجى تعديل الفاتورة وإضافة البريد الإلكتروني للعميل.", emailTo: "إلى", emailSubject: "الموضوع", emailMessage: "الرسالة" },
  da: { markAsSent: "Send faktura", sendInvoice: "Send faktura", sendingInvoice: "Sender...", sendInvoiceSuccess: "Faktura sendt!", sendInvoiceFailed: "Kunne ikke sende faktura. Prøv igen.", clientEmailRequired: "Kundens e-mail er påkrævet for at sende faktura. Rediger fakturaen og tilføj kundens e-mail.", emailTo: "Til", emailSubject: "Emne", emailMessage: "Besked" },
  de: { markAsSent: "Rechnung senden", sendInvoice: "Rechnung senden", sendingInvoice: "Wird gesendet...", sendInvoiceSuccess: "Rechnung erfolgreich gesendet!", sendInvoiceFailed: "Rechnung konnte nicht gesendet werden. Bitte versuchen Sie es erneut.", clientEmailRequired: "Die E-Mail-Adresse des Kunden ist erforderlich. Bitte bearbeiten Sie die Rechnung und fügen Sie die E-Mail des Kunden hinzu.", emailTo: "An", emailSubject: "Betreff", emailMessage: "Nachricht" },
  es: { markAsSent: "Enviar factura", sendInvoice: "Enviar factura", sendingInvoice: "Enviando...", sendInvoiceSuccess: "¡Factura enviada con éxito!", sendInvoiceFailed: "Error al enviar la factura. Inténtelo de nuevo.", clientEmailRequired: "Se requiere el correo del cliente para enviar la factura. Edite la factura y agregue el correo del cliente.", emailTo: "Para", emailSubject: "Asunto", emailMessage: "Mensaje" },
  fi: { markAsSent: "Lähetä lasku", sendInvoice: "Lähetä lasku", sendingInvoice: "Lähetetään...", sendInvoiceSuccess: "Lasku lähetetty onnistuneesti!", sendInvoiceFailed: "Laskun lähetys epäonnistui. Yritä uudelleen.", clientEmailRequired: "Asiakkaan sähköposti vaaditaan laskun lähettämiseen. Muokkaa laskua ja lisää asiakkaan sähköposti.", emailTo: "Vastaanottaja", emailSubject: "Aihe", emailMessage: "Viesti" },
  fr: { markAsSent: "Envoyer la facture", sendInvoice: "Envoyer la facture", sendingInvoice: "Envoi en cours...", sendInvoiceSuccess: "Facture envoyée avec succès !", sendInvoiceFailed: "Échec de l'envoi de la facture. Veuillez réessayer.", clientEmailRequired: "L'e-mail du client est requis pour envoyer la facture. Veuillez modifier la facture et ajouter l'e-mail du client.", emailTo: "À", emailSubject: "Objet", emailMessage: "Message" },
  hi: { markAsSent: "चालान भेजें", sendInvoice: "चालान भेजें", sendingInvoice: "भेज रहे हैं...", sendInvoiceSuccess: "चालान सफलतापूर्वक भेजा गया!", sendInvoiceFailed: "चालान भेजने में विफल। कृपया पुनः प्रयास करें।", clientEmailRequired: "चालान भेजने के लिए ग्राहक का ईमेल आवश्यक है। कृपया चालान संपादित करें और ग्राहक का ईमेल जोड़ें।", emailTo: "प्रति", emailSubject: "विषय", emailMessage: "संदेश" },
  id: { markAsSent: "Kirim faktur", sendInvoice: "Kirim faktur", sendingInvoice: "Mengirim...", sendInvoiceSuccess: "Faktur berhasil dikirim!", sendInvoiceFailed: "Gagal mengirim faktur. Silakan coba lagi.", clientEmailRequired: "Email klien diperlukan untuk mengirim faktur. Silakan edit faktur dan tambahkan email klien.", emailTo: "Kepada", emailSubject: "Subjek", emailMessage: "Pesan" },
  it: { markAsSent: "Invia fattura", sendInvoice: "Invia fattura", sendingInvoice: "Invio in corso...", sendInvoiceSuccess: "Fattura inviata con successo!", sendInvoiceFailed: "Invio fattura non riuscito. Riprova.", clientEmailRequired: "L'e-mail del cliente è necessaria per inviare la fattura. Modifica la fattura e aggiungi l'e-mail del cliente.", emailTo: "A", emailSubject: "Oggetto", emailMessage: "Messaggio" },
  ja: { markAsSent: "請求書を送信", sendInvoice: "請求書を送信", sendingInvoice: "送信中...", sendInvoiceSuccess: "請求書が正常に送信されました！", sendInvoiceFailed: "請求書の送信に失敗しました。もう一度お試しください。", clientEmailRequired: "請求書を送信するにはクライアントのメールが必要です。請求書を編集してクライアントのメールを追加してください。", emailTo: "宛先", emailSubject: "件名", emailMessage: "メッセージ" },
  ko: { markAsSent: "송장 보내기", sendInvoice: "송장 보내기", sendingInvoice: "전송 중...", sendInvoiceSuccess: "송장이 성공적으로 전송되었습니다!", sendInvoiceFailed: "송장 전송에 실패했습니다. 다시 시도해 주세요.", clientEmailRequired: "송장을 보내려면 고객 이메일이 필요합니다. 송장을 편집하고 고객 이메일을 추가하세요.", emailTo: "받는 사람", emailSubject: "제목", emailMessage: "메시지" },
  nl: { markAsSent: "Factuur verzenden", sendInvoice: "Factuur verzenden", sendingInvoice: "Verzenden...", sendInvoiceSuccess: "Factuur succesvol verzonden!", sendInvoiceFailed: "Factuur verzenden mislukt. Probeer het opnieuw.", clientEmailRequired: "Het e-mailadres van de klant is vereist om de factuur te verzenden. Bewerk de factuur en voeg het e-mailadres van de klant toe.", emailTo: "Aan", emailSubject: "Onderwerp", emailMessage: "Bericht" },
  no: { markAsSent: "Send faktura", sendInvoice: "Send faktura", sendingInvoice: "Sender...", sendInvoiceSuccess: "Faktura sendt!", sendInvoiceFailed: "Kunne ikke sende faktura. Prøv igjen.", clientEmailRequired: "Kundens e-post er påkrevd for å sende faktura. Rediger fakturaen og legg til kundens e-post.", emailTo: "Til", emailSubject: "Emne", emailMessage: "Melding" },
  pl: { markAsSent: "Wyślij fakturę", sendInvoice: "Wyślij fakturę", sendingInvoice: "Wysyłanie...", sendInvoiceSuccess: "Faktura wysłana pomyślnie!", sendInvoiceFailed: "Nie udało się wysłać faktury. Spróbuj ponownie.", clientEmailRequired: "Adres e-mail klienta jest wymagany do wysłania faktury. Edytuj fakturę i dodaj e-mail klienta.", emailTo: "Do", emailSubject: "Temat", emailMessage: "Wiadomość" },
  pt: { markAsSent: "Enviar fatura", sendInvoice: "Enviar fatura", sendingInvoice: "Enviando...", sendInvoiceSuccess: "Fatura enviada com sucesso!", sendInvoiceFailed: "Falha ao enviar fatura. Tente novamente.", clientEmailRequired: "O e-mail do cliente é necessário para enviar a fatura. Edite a fatura e adicione o e-mail do cliente.", emailTo: "Para", emailSubject: "Assunto", emailMessage: "Mensagem" },
  ru: { markAsSent: "Отправить счёт", sendInvoice: "Отправить счёт", sendingInvoice: "Отправка...", sendInvoiceSuccess: "Счёт успешно отправлен!", sendInvoiceFailed: "Не удалось отправить счёт. Попробуйте ещё раз.", clientEmailRequired: "Для отправки счёта необходим email клиента. Отредактируйте счёт и добавьте email клиента.", emailTo: "Кому", emailSubject: "Тема", emailMessage: "Сообщение" },
  sv: { markAsSent: "Skicka faktura", sendInvoice: "Skicka faktura", sendingInvoice: "Skickar...", sendInvoiceSuccess: "Faktura skickad!", sendInvoiceFailed: "Kunde inte skicka faktura. Försök igen.", clientEmailRequired: "Kundens e-post krävs för att skicka faktura. Redigera fakturan och lägg till kundens e-post.", emailTo: "Till", emailSubject: "Ämne", emailMessage: "Meddelande" },
  th: { markAsSent: "ส่งใบแจ้งหนี้", sendInvoice: "ส่งใบแจ้งหนี้", sendingInvoice: "กำลังส่ง...", sendInvoiceSuccess: "ส่งใบแจ้งหนี้สำเร็จ!", sendInvoiceFailed: "ส่งใบแจ้งหนี้ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", clientEmailRequired: "ต้องมีอีเมลลูกค้าเพื่อส่งใบแจ้งหนี้ กรุณาแก้ไขใบแจ้งหนี้และเพิ่มอีเมลลูกค้า", emailTo: "ถึง", emailSubject: "หัวข้อ", emailMessage: "ข้อความ" },
  tr: { markAsSent: "Fatura gönder", sendInvoice: "Fatura gönder", sendingInvoice: "Gönderiliyor...", sendInvoiceSuccess: "Fatura başarıyla gönderildi!", sendInvoiceFailed: "Fatura gönderilemedi. Lütfen tekrar deneyin.", clientEmailRequired: "Fatura göndermek için müşteri e-postası gereklidir. Faturayı düzenleyin ve müşteri e-postasını ekleyin.", emailTo: "Kime", emailSubject: "Konu", emailMessage: "Mesaj" },
  zh: { markAsSent: "发送发票", sendInvoice: "发送发票", sendingInvoice: "发送中...", sendInvoiceSuccess: "发票发送成功！", sendInvoiceFailed: "发票发送失败，请重试。", clientEmailRequired: "发送发票需要客户邮箱。请编辑发票并添加客户邮箱。", emailTo: "收件人", emailSubject: "主题", emailMessage: "正文" },
};

for (const [locale, trans] of Object.entries(translations)) {
  const filePath = path.join(localesDir, `${locale}.ts`);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${locale} - file not found`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace markAsSent value
  content = content.replace(
    /markAsSent:\s*"[^"]*"/,
    `markAsSent: "${trans.markAsSent}"`
  );

  // Add new keys after "status" line
  const statusLine = /status:\s*"[^"]*",?\s*\n/;
  const match = content.match(statusLine);
  if (match) {
    const newKeys = `  sendInvoice: "${trans.sendInvoice}",
  sendingInvoice: "${trans.sendingInvoice}",
  sendInvoiceSuccess: "${trans.sendInvoiceSuccess}",
  sendInvoiceFailed: "${trans.sendInvoiceFailed}",
  clientEmailRequired: "${trans.clientEmailRequired}",
  emailTo: "${trans.emailTo}",
  emailSubject: "${trans.emailSubject}",
  emailMessage: "${trans.emailMessage}",
`;
    content = content.replace(statusLine, match[0] + newKeys);
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${locale}.ts`);
}

console.log('Done!');
