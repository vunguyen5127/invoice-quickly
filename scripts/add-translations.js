const fs = require('fs');
const path = require('path');

const dict = {
  ar: {
    library: "المكتبة",
    libraryDesc: "إدارة الأصناف والعملاء المحفوظين لإنشاء فواتير سريعة.",
    clients: "العملاء",
    newClient: "عميل جديد",
    searchClients: "ابحث عن العملاء بالاسم أو البريد الإلكتروني أو الهاتف...",
    emptyClientsLibrary: "مكتبة العملاء الخاصة بك فارغة",
    saveClientsSpeed: "احفظ العملاء الذين يتم فواتيرهم بشكل متكرر لتسريع إنشاء الفاتورة.",
    contactInfo: "معلومات الاتصال",
    editClient: "تحرير العميل",
    deleteClient: "حذف العميل",
    deleteClientConfirm: "هل أنت متأكد أنك تريد حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء.",
    noClientsMatching: "لم يتم العثور على عملاء يطابقون",
    saveClient: "حفظ العميل"
  },
  da: {
    library: "Bibliotek",
    libraryDesc: "Administrer dine gemte varer og kunder for hurtig fakturering.",
    clients: "Kunder",
    newClient: "Ny Kunde",
    searchClients: "Søg efter kunder på navn, e-mail eller telefon...",
    emptyClientsLibrary: "Dit kundebibliotek er tomt",
    saveClientsSpeed: "Gem dine hyppigt fakturerede kunder for at fremskynde fakturaoprettelsen.",
    contactInfo: "Kontaktoplysninger",
    editClient: "Rediger Kunde",
    deleteClient: "Slet Kunde",
    deleteClientConfirm: "Er du sikker på, at du vil slette denne kunde? Denne handling kan ikke fortrydes.",
    noClientsMatching: "Ingen kunder fundet der matcher",
    saveClient: "Gem Kunde"
  },
  de: {
    library: "Bibliothek",
    libraryDesc: "Verwalten Sie Ihre gespeicherten Artikel und Kunden für eine schnelle Rechnungsstellung.",
    clients: "Kunden",
    newClient: "Neuer Kunde",
    searchClients: "Kunden nach Name, E-Mail oder Telefon suchen...",
    emptyClientsLibrary: "Ihre Kundenbibliothek ist leer",
    saveClientsSpeed: "Speichern Sie regelmäßig abgerechnete Kunden, um die Rechnungserstellung zu beschleunigen.",
    contactInfo: "Kontaktinformationen",
    editClient: "Kunde bearbeiten",
    deleteClient: "Kunde löschen",
    deleteClientConfirm: "Sind Sie sicher, dass Sie diesen Kunden löschen möchten? Dies kann nicht rückgängig gemacht werden.",
    noClientsMatching: "Keine übereinstimmenden Kunden gefunden",
    saveClient: "Kunde speichern"
  },
  es: {
    library: "Biblioteca",
    libraryDesc: "Gestiona tus artículos y clientes guardados para una facturación rápida.",
    clients: "Clientes",
    newClient: "Nuevo Cliente",
    searchClients: "Buscar clientes por nombre, correo electrónico o teléfono...",
    emptyClientsLibrary: "Tu biblioteca de clientes está vacía",
    saveClientsSpeed: "Guarda tus clientes facturados frecuentemente para acelerar la creación de facturas.",
    contactInfo: "Información de Contacto",
    editClient: "Editar Cliente",
    deleteClient: "Eliminar Cliente",
    deleteClientConfirm: "¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.",
    noClientsMatching: "No se encontraron clientes que coincidan con",
    saveClient: "Guardar Cliente"
  },
  fi: {
    library: "Kirjasto",
    libraryDesc: "Hallitse tallennettuja tuotteita ja asiakkaita nopeaa laskutusta varten.",
    clients: "Asiakkaat",
    newClient: "Uusi Asiakas",
    searchClients: "Etsi asiakkaita nimellä, sähköpostilla tai puhelimella...",
    emptyClientsLibrary: "Asiakaskirjastosi on tyhjä",
    saveClientsSpeed: "Tallenna usein laskutettavat asiakkaat nopeuttaaksesi laskun luomista.",
    contactInfo: "Yhteystiedot",
    editClient: "Muokkaa Asiakasta",
    deleteClient: "Poista Asiakas",
    deleteClientConfirm: "Oletko varma, että haluat poistaa tämän asiakkaan? Tätä toimintoa ei voi peruuttaa.",
    noClientsMatching: "Ei asiakkaita, jotka vastaavat",
    saveClient: "Tallenna Asiakas"
  },
  fr: {
    library: "Bibliothèque",
    libraryDesc: "Gérez vos articles et clients enregistrés pour une facturation rapide.",
    clients: "Clients",
    newClient: "Nouveau Client",
    searchClients: "Rechercher des clients par nom, e-mail ou téléphone...",
    emptyClientsLibrary: "Votre bibliothèque de clients est vide",
    saveClientsSpeed: "Enregistrez vos clients fréquemment facturés pour accélérer la création de factures.",
    contactInfo: "Coordonnées",
    editClient: "Modifier le Client",
    deleteClient: "Supprimer le Client",
    deleteClientConfirm: "Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.",
    noClientsMatching: "Aucun client correspondant à",
    saveClient: "Enregistrer le Client"
  },
  hi: {
    library: "लाइब्रेरी",
    libraryDesc: "त्वरित इन्वॉइसिंग के लिए अपने सहेजे गए आइटम और ग्राहकों को प्रबंधित करें।",
    clients: "ग्राहक",
    newClient: "नया ग्राहक",
    searchClients: "नाम, ईमेल या फोन से ग्राहकों को खोजें...",
    emptyClientsLibrary: "आपकी ग्राहक लाइब्रेरी खाली है",
    saveClientsSpeed: "इन्वॉइस बनाने की गति बढ़ाने के लिए अपने अक्सर बिल किए जाने वाले ग्राहकों को सहेजें।",
    contactInfo: "संपर्क जानकारी",
    editClient: "ग्राहक संपादित करें",
    deleteClient: "ग्राहक हटाएं",
    deleteClientConfirm: "क्या आप वाकई इस ग्राहक को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।",
    noClientsMatching: "कोई ग्राहक मेल नहीं खाता",
    saveClient: "ग्राहक सहेजें"
  },
  id: {
    library: "Pustaka",
    libraryDesc: "Kelola item dan klien yang disimpan untuk penagihan cepat.",
    clients: "Klien",
    newClient: "Klien Baru",
    searchClients: "Cari klien berdasarkan nama, email, atau telepon...",
    emptyClientsLibrary: "Pustaka klien Anda kosong",
    saveClientsSpeed: "Simpan klien yang sering ditagih untuk mempercepat pembuatan faktur.",
    contactInfo: "Info Kontak",
    editClient: "Edit Klien",
    deleteClient: "Hapus Klien",
    deleteClientConfirm: "Apakah Anda yakin ingin menghapus klien ini? Tindakan ini tidak dapat dibatalkan.",
    noClientsMatching: "Tidak ada klien yang cocok",
    saveClient: "Simpan Klien"
  },
  it: {
    library: "Libreria",
    libraryDesc: "Gestisci i tuoi articoli e clienti salvati per una fatturazione rapida.",
    clients: "Clienti",
    newClient: "Nuovo Cliente",
    searchClients: "Cerca clienti per nome, email o telefono...",
    emptyClientsLibrary: "La tua libreria clienti è vuota",
    saveClientsSpeed: "Salva i clienti fatturati frequentemente per velocizzare la creazione delle fatture.",
    contactInfo: "Info di Contatto",
    editClient: "Modifica Cliente",
    deleteClient: "Elimina Cliente",
    deleteClientConfirm: "Sei sicuro di voler eliminare questo cliente? Questa azione non può essere annullata.",
    noClientsMatching: "Nessun cliente corrispondente a",
    saveClient: "Salva Cliente"
  },
  ja: {
    library: "ライブラリ",
    libraryDesc: "保存済みのアイテムとクライアントを管理して、迅速な請求書作成を実現します。",
    clients: "クライアント",
    newClient: "新規クライアント",
    searchClients: "名前、メール、電話番号でクライアントを検索...",
    emptyClientsLibrary: "クライアントライブラリは空です",
    saveClientsSpeed: "頻繁に請求するクライアントを保存して、請求書作成をスピードアップします。",
    contactInfo: "連絡先情報",
    editClient: "クライアントを編集",
    deleteClient: "クライアントを削除",
    deleteClientConfirm: "本当にこのクライアントを削除しますか？この操作は元に戻せません。",
    noClientsMatching: "一致するクライアントが見つかりません",
    saveClient: "クライアントを保存"
  },
  ko: {
    library: "라이브러리",
    libraryDesc: "빠른 인보이스 작성을 위해 저장된 항목과 클라이언트를 관리하세요.",
    clients: "클라이언트",
    newClient: "새 클라이언트",
    searchClients: "이름, 이메일 또는 전화번호로 클라이언트 검색...",
    emptyClientsLibrary: "클라이언트 라이브러리가 비어 있습니다",
    saveClientsSpeed: "자주 청구하는 클라이언트를 저장하여 인보이스 생성을 가속화하세요.",
    contactInfo: "연락처 정보",
    editClient: "클라이언트 편집",
    deleteClient: "클라이언트 삭제",
    deleteClientConfirm: "이 클라이언트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
    noClientsMatching: "일치하는 클라이언트가 없습니다",
    saveClient: "클라이언트 저장"
  },
  nl: {
    library: "Biliotheek",
    libraryDesc: "Beheer uw opgeslagen artikelen en klanten voor snelle facturering.",
    clients: "Klanten",
    newClient: "Nieuwe Klant",
    searchClients: "Zoek klanten op naam, e-mail of telefoon...",
    emptyClientsLibrary: "Uw klantenbibliotheek is leeg",
    saveClientsSpeed: "Sla uw vaak gefactureerde klanten op om het maken van facturen te versnellen.",
    contactInfo: "Contactgegevens",
    editClient: "Klant Bewerken",
    deleteClient: "Klant Verwijderen",
    deleteClientConfirm: "Weet u zeker dat u deze klant wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.",
    noClientsMatching: "Geen overeenkomende klanten gevonden",
    saveClient: "Klant Opslaan"
  },
  no: {
    library: "Bibliotek",
    libraryDesc: "Administrer lagrede varer og kunder for rask fakturering.",
    clients: "Kunder",
    newClient: "Ny Kunde",
    searchClients: "Søk etter kunder med navn, e-post eller telefon...",
    emptyClientsLibrary: "Kundebiblioteket ditt er tomt",
    saveClientsSpeed: "Lagre kundene du ofte fakturerer for å få raskere fakturaoppretting.",
    contactInfo: "Kontaktinfo",
    editClient: "Rediger Kunde",
    deleteClient: "Slett Kunde",
    deleteClientConfirm: "Er du sikker på at du vil slette denne kunden? Denne handlingen kan ikke angres.",
    noClientsMatching: "Ingen kunder samsvarer",
    saveClient: "Lagre Kunde"
  },
  pl: {
    library: "Biblioteka",
    libraryDesc: "Zarządzaj zapisanymi elementami i klientami w celu szybkiego fakturowania.",
    clients: "Klienci",
    newClient: "Nowy Klient",
    searchClients: "Szukaj klientów według nazwy, e-maila lub telefonu...",
    emptyClientsLibrary: "Twoja biblioteka klientów jest pusta",
    saveClientsSpeed: "Zapisz często bilingowanych klientów, aby przyspieszyć tworzenie faktur.",
    contactInfo: "Informacje Kontaktowe",
    editClient: "Edytuj Klienta",
    deleteClient: "Usuń Klienta",
    deleteClientConfirm: "Czy na pewno chcesz usunąć tego klienta? Tej akcji nie można cofnąć.",
    noClientsMatching: "Nie znaleziono pasujących klientów",
    saveClient: "Zapisz Klienta"
  },
  pt: {
    library: "Biblioteca",
    libraryDesc: "Gerencie seus itens e clientes salvos para faturamento rápido.",
    clients: "Clientes",
    newClient: "Novo Cliente",
    searchClients: "Pesquisar clientes por nome, e-mail ou telefone...",
    emptyClientsLibrary: "Sua biblioteca de clientes está vazia",
    saveClientsSpeed: "Salve clientes faturados com frequência para acelerar a criação de faturas.",
    contactInfo: "Informações de Contato",
    editClient: "Editar Cliente",
    deleteClient: "Excluir Cliente",
    deleteClientConfirm: "Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.",
    noClientsMatching: "Nenhum cliente correspondente encontrado",
    saveClient: "Salvar Cliente"
  },
  ru: {
    library: "Библиотека",
    libraryDesc: "Управляйте сохраненными товарами и клиентами для быстрого выставления счетов.",
    clients: "Клиенты",
    newClient: "Новый Клиент",
    searchClients: "Поиск клиентов по имени, email или телефону...",
    emptyClientsLibrary: "Ваша библиотека клиентов пуста",
    saveClientsSpeed: "Сохраняйте часто выставляемых клиентов, чтобы ускорить создание счетов.",
    contactInfo: "Контактная Информация",
    editClient: "Редактировать Клиента",
    deleteClient: "Удалить Клиента",
    deleteClientConfirm: "Вы уверены, что хотите удалить этого клиента? Это действие нельзя отменить.",
    noClientsMatching: "Не найдено подходящих клиентов",
    saveClient: "Сохранить Клиента"
  },
  sv: {
    library: "Bibliotek",
    libraryDesc: "Hantera dina sparade artiklar och kunder för snabb fakturering.",
    clients: "Kunder",
    newClient: "Ny Kund",
    searchClients: "Sök kunder efter namn, e-post eller telefon...",
    emptyClientsLibrary: "Ditt kundbibliotek är tomt",
    saveClientsSpeed: "Spara kunder som ofta faktureras för att snabba upp skapandet av fakturor.",
    contactInfo: "Kontaktinformation",
    editClient: "Redigera Kund",
    deleteClient: "Radera Kund",
    deleteClientConfirm: "Är du säker på att du vill radera denna kund? Denna åtgärd kan inte ångras.",
    noClientsMatching: "Inga matchande kunder hittades",
    saveClient: "Spara Kund"
  },
  th: {
    library: "ห้องสมุด",
    libraryDesc: "จัดการรายการและลูกค้าที่บันทึกไว้เพื่อการออกใบแจ้งหนี้อย่างรวดเร็ว",
    clients: "ลูกค้า",
    newClient: "ลูกค้าใหม่",
    searchClients: "ค้นหาลูกค้าด้วยชื่อ อีเมล หรือโทรศัพท์...",
    emptyClientsLibrary: "ห้องสมุดลูกค้าของคุณว่างเปล่า",
    saveClientsSpeed: "บันทึกลูกค้าที่เรียกเก็บเงินบ่อยเพื่อช่วยให้สร้างใบแจ้งหนี้ได้เร็วขึ้น",
    contactInfo: "ข้อมูลติดต่อ",
    editClient: "แก้ไขลูกค้า",
    deleteClient: "ลบลูกค้า",
    deleteClientConfirm: "คุณแน่ใจหรือไม่ว่าต้องการลบลูกค้านี้ การดำเนินการนี้ไม่สามารถยกเลิกได้",
    noClientsMatching: "ไม่พบลูกค้าที่ตรงกัน",
    saveClient: "บันทึกลูกค้า"
  },
  tr: {
    library: "Kütüphane",
    libraryDesc: "Hızlı faturalandırma için kayıtlı öğelerinizi ve müşterilerinizi yönetin.",
    clients: "Müşteriler",
    newClient: "Yeni Müşteri",
    searchClients: "Müşterileri ad, e-posta veya telefon ile arayın...",
    emptyClientsLibrary: "Müşteri kütüphaneniz boş",
    saveClientsSpeed: "Fatura oluşturmayı hızlandırmak için sık faturalanan müşterilerinizi kaydedin.",
    contactInfo: "İletişim Bilgileri",
    editClient: "Müşteriyi Düzenle",
    deleteClient: "Müşteriyi Sil",
    deleteClientConfirm: "Bu müşteriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
    noClientsMatching: "Eşleşen müşteri bulunamadı",
    saveClient: "Müşteriyi Kaydet"
  },
  zh: {
    library: "库",
    libraryDesc: "管理您保存的项目和客户以快速开发票。",
    clients: "客户",
    newClient: "新客户",
    searchClients: "按名称、电子邮件或电话搜索客户...",
    emptyClientsLibrary: "您的客户库为空",
    saveClientsSpeed: "保存经常开票的客户以加快发票创建速度。",
    contactInfo: "联系信息",
    editClient: "编辑客户",
    deleteClient: "删除客户",
    deleteClientConfirm: "您确定要删除此客户吗？此操作无法撤消。",
    noClientsMatching: "找不到匹配的客户",
    saveClient: "保存客户"
  }
};

const localesDir = path.join(__dirname, '..', 'locales');

Object.keys(dict).forEach(lang => {
  const filepath = path.join(localesDir, `${lang}.ts`);
  if (!fs.existsSync(filepath)) return;
  
  let content = fs.readFileSync(filepath, 'utf8');
  
  Object.keys(dict[lang]).forEach(key => {
    const value = dict[lang][key];
    // Replace the english value strings that were inserted by fix-locales.js with localized strings
    const regex = new RegExp(`${key}:\\s*"[^"]*",?`, 'g');
    content = content.replace(regex, `${key}: "${value}",`);
  });
  
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`Updated translations for ${lang}`);
});
