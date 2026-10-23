export const SPRACHEN = ["de", "uk", "ar", "en"] as const;

export type Sprache = (typeof SPRACHEN)[number];

export const FLAGGEN: Record<Sprache, string> = {
  de: "🇩🇪",
  uk: "🇺🇦",
  ar: "🇸🇦",
  en: "🇬🇧",
};

export type FehlerKey =
  | "plz"
  | "verbrauch"
  | "anrede"
  | "vorname"
  | "nachname"
  | "geburtstag"
  | "volljaehrig"
  | "email"
  | "telefon"
  | "strasse"
  | "hausnummer"
  | "ort"
  | "zaehlernummer"
  | "vorversorger"
  | "iban"
  | "kontoinhaber"
  | "datenschutz";

export type Texte = {
  spracheName: string;
  spracheAuswahl: string;
  banner: string;
  fortschritt: string;
  sucheTitel: string;
  sucheDetail: string;
  stromtitel: string;
  stromlead: string;
  plz: string;
  personen: string;
  haushaltHinweis: string;
  verbrauchLabel: string;
  tarifAnzeigen: string;
  angabenAendern: string;
  vorschlag: string;
  vorschlagMeta: string;
  imJahr: string;
  abschlag: string;
  arbeitspreis: string;
  grundpreis: string;
  proJahr: string;
  bonus: string;
  laufzeit: string;
  monate: string;
  pitch: string;
  keinTarif: string;
  beauftragen: string;
  systemTitel: string;
  systemText: string;
  mindestprovision: string;
  provisionZeile: string;
  grundUnter: string;
  grundGewinner: string;
  grundTeurer: string;
  zurueckTarif: string;
  werSchliesst: string;
  anrede: string;
  frau: string;
  herr: string;
  vorname: string;
  nachname: string;
  geburtstag: string;
  email: string;
  telefon: string;
  strasse: string;
  hausnummer: string;
  ort: string;
  weiterKonto: string;
  zurueck: string;
  tarifZeile: string;
  zaehlerTitel: string;
  beispieldaten: string;
  beispielHinweis: string;
  zaehlernummer: string;
  vorversorger: string;
  iban: string;
  kontoinhaber: string;
  einwilligung: string;
  bestellen: string;
  bleibtGeraet: string;
  vertragDeutsch: string;
  erfasst: string;
  erfasstText: string;
  tarif: string;
  verbrauch: string;
  externeId: string;
  bodyTitel: string;
  neu: string;
  zugangBanner: string;
  zugangTitel: string;
  zugangLead: string;
  passwort: string;
  passwortFalsch: string;
  oeffnen: string;
  fehler: Record<FehlerKey, string>;
};

export const TEXTE: Record<Sprache, Texte> = {
  de: {
    spracheName: "Deutsch",
    spracheAuswahl: "Sprache",
    banner: "Prototyp · Kampagne {code} · Beispielpreise · kein Auftrag an Neue Energie",
    fortschritt: "Fortschritt",
    sucheTitel: "Wir stellen Ihren Tarif zusammen.",
    sucheDetail: "{kwh} kWh, Schwelle {schwelle} € Provision, Beispielkatalog.",
    stromtitel: "Ihr Stromtarif.",
    stromlead: "PLZ und Haushaltsgröße. Danach sehen Sie einen Tarif.",
    plz: "Postleitzahl",
    personen: "Personen im Haushalt",
    haushaltHinweis: "Die Zahl darunter ist der angenommene Jahresverbrauch.",
    verbrauchLabel: "Jahresverbrauch in kWh, falls bekannt",
    tarifAnzeigen: "Tarif anzeigen",
    angabenAendern: "Angaben ändern",
    vorschlag: "Ihr Vorschlag.",
    vorschlagMeta: "PLZ {plz}, gerechnet mit {kwh} kWh.",
    imJahr: "im Jahr",
    abschlag: "{betrag} geschätzter monatlicher Abschlag",
    arbeitspreis: "Arbeitspreis",
    grundpreis: "Grundpreis",
    proJahr: "/ Jahr",
    bonus: "Bonus",
    laufzeit: "Laufzeit",
    monate: "{anzahl} Monate",
    pitch: "Unter den Tarifen, die wir anbieten, ist das der günstigste. Der Preis gilt für die genannten kWh.",
    keinTarif: "Über der Schwelle von {schwelle} € liegt kein Tarif. Die Schwelle im Kasten unten senken, dann erscheint ein Vorschlag.",
    beauftragen: "Diesen Tarif beauftragen",
    systemTitel: "Was das System entschieden hat",
    systemText:
      "Nur im Prototyp sichtbar. Der Kunde sieht die Provision nicht. Ideal übernimmt Preis und Provision aus dem Laura-Lauf und rechnet sie auf {kwh} kWh. Die anderen Tarife sind erfunden.",
    mindestprovision: "Mindestprovision nach Bonus",
    provisionZeile: "Provision {betrag} €",
    grundUnter: "Provision {betrag} € unter {schwelle} €",
    grundGewinner: "Günstigster über der Schwelle",
    grundTeurer: "Über der Schwelle, teurer",
    zurueckTarif: "Zurück zum Tarif",
    werSchliesst: "Wer den Vertrag schließt.",
    anrede: "Anrede",
    frau: "Frau",
    herr: "Herr",
    vorname: "Vorname",
    nachname: "Nachname",
    geburtstag: "Geburtstag",
    email: "E-Mail",
    telefon: "Telefon",
    strasse: "Straße",
    hausnummer: "Hausnummer",
    ort: "Ort",
    weiterKonto: "Weiter zu Zähler und Konto",
    zurueck: "Zurück",
    tarifZeile: "{name} · {betrag} im Jahr",
    zaehlerTitel: "Zähler und Konto.",
    beispieldaten: "Beispieldaten aus einer Rechnung",
    beispielHinweis: "Beispielwerte eingesetzt. Im Prototyp wird kein Foto gelesen.",
    zaehlernummer: "Zählernummer",
    vorversorger: "Bisheriger Versorger",
    iban: "IBAN",
    kontoinhaber: "Kontoinhaber",
    einwilligung: "Ich willige in die Verarbeitung der Angaben zum Zweck dieser Anfrage ein.",
    bestellen: "Zahlungspflichtig bestellen",
    bleibtGeraet: "Im Prototyp bleibt der Auftrag auf diesem Gerät.",
    vertragDeutsch: "Der Vertrag selbst bleibt auf Deutsch.",
    erfasst: "Erfasst.",
    erfasstText: "Entwurf für {name}, Tarif {tarif}. Der Body bleibt auf diesem Gerät, testMode ist {testMode}.",
    tarif: "Tarif",
    verbrauch: "Verbrauch",
    externeId: "Externe ID",
    bodyTitel: "Body für POST /contracts",
    neu: "Neu beginnen",
    zugangBanner: "Prototyp · Zugang mit Passwort",
    zugangTitel: "Geschützter Entwurf.",
    zugangLead: "Dieser Prototyp ist mit einem Passwort geschützt.",
    passwort: "Passwort",
    passwortFalsch: "Das Passwort stimmt nicht.",
    oeffnen: "Öffnen",
    fehler: {
      plz: "Bitte eine PLZ mit 5 Ziffern.",
      verbrauch: "Bitte Haushalt wählen oder den Verbrauch zwischen 500 und 50.000 kWh angeben.",
      anrede: "Bitte eine Anrede wählen.",
      vorname: "Vorname fehlt.",
      nachname: "Nachname fehlt.",
      geburtstag: "Geburtstag fehlt.",
      volljaehrig: "Der Vertrag braucht ein Alter ab 18 Jahren.",
      email: "E-Mail fehlt oder ist unvollständig.",
      telefon: "Telefonnummer fehlt.",
      strasse: "Straße fehlt.",
      hausnummer: "Hausnummer fehlt.",
      ort: "Ort fehlt.",
      zaehlernummer: "Zählernummer fehlt.",
      vorversorger: "Vorversorger fehlt. Der volle Name, wie auf der Rechnung.",
      iban: "Bitte eine deutsche IBAN mit 22 Zeichen.",
      kontoinhaber: "Kontoinhaber fehlt.",
      datenschutz: "Bitte die Einwilligung bestätigen.",
    },
  },
  uk: {
    spracheName: "Українська",
    spracheAuswahl: "Мова",
    banner: "Прототип · Кампанія {code} · Прикладні ціни · замовлення до Neue Energie не йде",
    fortschritt: "Хід",
    sucheTitel: "Збираємо ваш тариф.",
    sucheDetail: "{kwh} кВт·год, поріг {schwelle} € винагороди, приклад каталогу.",
    stromtitel: "Ваш тариф на електроенергію.",
    stromlead: "Індекс і розмір домогосподарства. Далі ви побачите один тариф.",
    plz: "Поштовий індекс",
    personen: "Осіб у домогосподарстві",
    haushaltHinweis: "Число під особами — орієнтовне річне споживання.",
    verbrauchLabel: "Річне споживання в кВт·год, якщо знаєте",
    tarifAnzeigen: "Показати тариф",
    angabenAendern: "Змінити дані",
    vorschlag: "Ваша пропозиція.",
    vorschlagMeta: "Індекс {plz}, розрахунок на {kwh} кВт·год.",
    imJahr: "на рік",
    abschlag: "{betrag} орієнтовний місячний платіж",
    arbeitspreis: "Ціна за кВт·год",
    grundpreis: "Базова ціна",
    proJahr: "/ рік",
    bonus: "Бонус",
    laufzeit: "Строк",
    monate: "{anzahl} місяців",
    pitch: "Серед тарифів, які ми пропонуємо, це найдешевший. Ціна діє для вказаних кВт·год.",
    keinTarif: "Над порогом {schwelle} € немає тарифу. Знизьте поріг у блоці нижче, тоді з’явиться пропозиція.",
    beauftragen: "Замовити цей тариф",
    systemTitel: "Що вирішила система",
    systemText:
      "Видно лише в прототипі. Клієнт винагороду не бачить. Ideal бере ціну й винагороду з прогону Laura і рахує їх на {kwh} кВт·год. Інші тарифи вигадані.",
    mindestprovision: "Мінімальна винагорода після бонусу",
    provisionZeile: "Винагорода {betrag} €",
    grundUnter: "Винагорода {betrag} € нижче {schwelle} €",
    grundGewinner: "Найдешевший над порогом",
    grundTeurer: "Над порогом, дорожчий",
    zurueckTarif: "Назад до тарифу",
    werSchliesst: "Хто укладає договір.",
    anrede: "Звертання",
    frau: "Пані",
    herr: "Пан",
    vorname: "Ім’я",
    nachname: "Прізвище",
    geburtstag: "Дата народження",
    email: "Електронна пошта",
    telefon: "Телефон",
    strasse: "Вулиця",
    hausnummer: "Номер будинку",
    ort: "Місто",
    weiterKonto: "Далі до лічильника і рахунку",
    zurueck: "Назад",
    tarifZeile: "{name} · {betrag} на рік",
    zaehlerTitel: "Лічильник і рахунок.",
    beispieldaten: "Зразкові дані з рахунку",
    beispielHinweis: "Підставлено зразкові значення. Прототип фото не читає.",
    zaehlernummer: "Номер лічильника",
    vorversorger: "Попередній постачальник",
    iban: "IBAN",
    kontoinhaber: "Власник рахунку",
    einwilligung: "Я погоджуюсь на обробку цих даних для цього запиту.",
    bestellen: "Замовити з обов’язком оплати",
    bleibtGeraet: "У прототипі замовлення лишається на цьому пристрої.",
    vertragDeutsch: "Сам договір лишається німецькою.",
    erfasst: "Зафіксовано.",
    erfasstText: "Чернетка для {name}, тариф {tarif}. Тіло лишається на цьому пристрої, testMode {testMode}.",
    tarif: "Тариф",
    verbrauch: "Споживання",
    externeId: "Зовнішній ID",
    bodyTitel: "Тіло для POST /contracts",
    neu: "Почати спочатку",
    zugangBanner: "Прототип · Вхід з паролем",
    zugangTitel: "Захищена чернетка.",
    zugangLead: "Цей прототип захищено паролем.",
    passwort: "Пароль",
    passwortFalsch: "Пароль не збігається.",
    oeffnen: "Відкрити",
    fehler: {
      plz: "Введіть індекс із 5 цифр.",
      verbrauch: "Оберіть домогосподарство або вкажіть споживання від 500 до 50 000 кВт·год.",
      anrede: "Оберіть звертання.",
      vorname: "Бракує імені.",
      nachname: "Бракує прізвища.",
      geburtstag: "Бракує дати народження.",
      volljaehrig: "Договір потребує віку від 18 років.",
      email: "Електронна пошта відсутня або неповна.",
      telefon: "Бракує номера телефону.",
      strasse: "Бракує вулиці.",
      hausnummer: "Бракує номера будинку.",
      ort: "Бракує міста.",
      zaehlernummer: "Бракує номера лічильника.",
      vorversorger: "Бракує попереднього постачальника. Повна назва, як у рахунку.",
      iban: "Введіть німецький IBAN із 22 символів.",
      kontoinhaber: "Бракує власника рахунку.",
      datenschutz: "Підтвердіть згоду.",
    },
  },
  ar: {
    spracheName: "العربية",
    spracheAuswahl: "اللغة",
    banner: "نموذج · حملة {code} · أسعار تجريبية · لا يُرسل طلب إلى Neue Energie",
    fortschritt: "التقدم",
    sucheTitel: "نجهّز تعرفتكم.",
    sucheDetail: "{kwh} كيلوواط ساعة، حد {schwelle} € عمولة، كتالوج تجريبي.",
    stromtitel: "تعرفة الكهرباء الخاصة بكم.",
    stromlead: "الرمز البريدي وعدد أفراد السكن. بعدها ترون تعرفة واحدة.",
    plz: "الرمز البريدي",
    personen: "الأشخاص في السكن",
    haushaltHinweis: "الرقم تحت عدد الأشخاص هو الاستهلاك السنوي المفترض.",
    verbrauchLabel: "الاستهلاك السنوي بالكيلوواط ساعة، إن كان معروفاً",
    tarifAnzeigen: "عرض التعرفة",
    angabenAendern: "تغيير البيانات",
    vorschlag: "اقتراحكم.",
    vorschlagMeta: "الرمز {plz}، محسوب على {kwh} كيلوواط ساعة.",
    imJahr: "في السنة",
    abschlag: "{betrag} قسط شهري تقديري",
    arbeitspreis: "سعر الكيلوواط",
    grundpreis: "السعر الأساسي",
    proJahr: "/ سنة",
    bonus: "مكافأة",
    laufzeit: "المدة",
    monate: "{anzahl} شهراً",
    pitch: "بين التعرفات التي نعرضها، هذه الأرخص. السعر ينطبق على الكيلوواط المذكورة.",
    keinTarif: "لا توجد تعرفة فوق حد {schwelle} €. خفّضوا الحد في المربع أدناه، فيظهر اقتراح.",
    beauftragen: "طلب هذه التعرفة",
    systemTitel: "ما قرره النظام",
    systemText:
      "ظاهر في النموذج فقط. العميل لا يرى العمولة. Ideal يأخذ السعر والعمولة من تشغيل Laura ويحسبهما على {kwh} كيلوواط ساعة. التعرفات الأخرى مختلقة.",
    mindestprovision: "الحد الأدنى للعمولة بعد المكافأة",
    provisionZeile: "عمولة {betrag} €",
    grundUnter: "عمولة {betrag} € تحت {schwelle} €",
    grundGewinner: "الأرخص فوق الحد",
    grundTeurer: "فوق الحد، وأغلى",
    zurueckTarif: "العودة إلى التعرفة",
    werSchliesst: "من يوقّع العقد.",
    anrede: "المخاطبة",
    frau: "السيدة",
    herr: "السيد",
    vorname: "الاسم الأول",
    nachname: "اسم العائلة",
    geburtstag: "تاريخ الميلاد",
    email: "البريد الإلكتروني",
    telefon: "الهاتف",
    strasse: "الشارع",
    hausnummer: "رقم المبنى",
    ort: "المدينة",
    weiterKonto: "متابعة إلى العداد والحساب",
    zurueck: "رجوع",
    tarifZeile: "{name} · {betrag} في السنة",
    zaehlerTitel: "العداد والحساب.",
    beispieldaten: "بيانات تجريبية من فاتورة",
    beispielHinweis: "أُدخلت قيم تجريبية. النموذج لا يقرأ صورة.",
    zaehlernummer: "رقم العداد",
    vorversorger: "المزوّد السابق",
    iban: "IBAN",
    kontoinhaber: "صاحب الحساب",
    einwilligung: "أوافق على معالجة هذه البيانات لغرض هذا الطلب.",
    bestellen: "طلب ملزم بالدفع",
    bleibtGeraet: "في النموذج يبقى الطلب على هذا الجهاز.",
    vertragDeutsch: "نص العقد يبقى بالألمانية.",
    erfasst: "تم التسجيل.",
    erfasstText: "مسودة لـ {name}، التعرفة {tarif}. يبقى النص على هذا الجهاز، testMode هو {testMode}.",
    tarif: "التعرفة",
    verbrauch: "الاستهلاك",
    externeId: "معرّف خارجي",
    bodyTitel: "النص لـ POST /contracts",
    neu: "البدء من جديد",
    zugangBanner: "نموذج · الدخول بكلمة مرور",
    zugangTitel: "مسودة محمية.",
    zugangLead: "هذا النموذج محمي بكلمة مرور.",
    passwort: "كلمة المرور",
    passwortFalsch: "كلمة المرور غير صحيحة.",
    oeffnen: "فتح",
    fehler: {
      plz: "أدخلوا رمزاً بريدياً من 5 أرقام.",
      verbrauch: "اختاروا عدد الأفراد أو أدخلوا استهلاكاً بين 500 و50.000 كيلوواط ساعة.",
      anrede: "اختاروا المخاطبة.",
      vorname: "الاسم الأول ناقص.",
      nachname: "اسم العائلة ناقص.",
      geburtstag: "تاريخ الميلاد ناقص.",
      volljaehrig: "العقد يشترط عمراً من 18 سنة.",
      email: "البريد الإلكتروني ناقص أو غير مكتمل.",
      telefon: "رقم الهاتف ناقص.",
      strasse: "الشارع ناقص.",
      hausnummer: "رقم المبنى ناقص.",
      ort: "المدينة ناقصة.",
      zaehlernummer: "رقم العداد ناقص.",
      vorversorger: "المزوّد السابق ناقص. الاسم الكامل كما في الفاتورة.",
      iban: "أدخلوا IBAN ألمانياً من 22 خانة.",
      kontoinhaber: "صاحب الحساب ناقص.",
      datenschutz: "أكّدوا الموافقة.",
    },
  },
  en: {
    spracheName: "English",
    spracheAuswahl: "Language",
    banner: "Prototype · Campaign {code} · Sample prices · no order is sent to Neue Energie",
    fortschritt: "Progress",
    sucheTitel: "We are putting your tariff together.",
    sucheDetail: "{kwh} kWh, threshold {schwelle} € commission, sample catalogue.",
    stromtitel: "Your electricity tariff.",
    stromlead: "Postcode and household size. Then you see one tariff.",
    plz: "Postcode",
    personen: "People in the household",
    haushaltHinweis: "The figure below is the assumed annual consumption.",
    verbrauchLabel: "Annual consumption in kWh, if you know it",
    tarifAnzeigen: "Show tariff",
    angabenAendern: "Change details",
    vorschlag: "Your proposal.",
    vorschlagMeta: "Postcode {plz}, calculated at {kwh} kWh.",
    imJahr: "per year",
    abschlag: "{betrag} estimated monthly payment",
    arbeitspreis: "Unit price",
    grundpreis: "Base price",
    proJahr: "/ year",
    bonus: "Bonus",
    laufzeit: "Term",
    monate: "{anzahl} months",
    pitch: "Among the tariffs we offer, this is the cheapest. The price applies to the kWh shown.",
    keinTarif: "No tariff sits above the threshold of {schwelle} €. Lower the threshold in the box below, then a proposal appears.",
    beauftragen: "Order this tariff",
    systemTitel: "What the system decided",
    systemText:
      "Visible only in the prototype. The customer does not see the commission. Ideal uses price and commission from the Laura run and applies them to {kwh} kWh. The other tariffs are made up.",
    mindestprovision: "Minimum commission after bonus",
    provisionZeile: "Commission {betrag} €",
    grundUnter: "Commission {betrag} € below {schwelle} €",
    grundGewinner: "Cheapest above the threshold",
    grundTeurer: "Above the threshold, more expensive",
    zurueckTarif: "Back to the tariff",
    werSchliesst: "Who signs the contract.",
    anrede: "Salutation",
    frau: "Ms",
    herr: "Mr",
    vorname: "First name",
    nachname: "Last name",
    geburtstag: "Date of birth",
    email: "Email",
    telefon: "Phone",
    strasse: "Street",
    hausnummer: "House number",
    ort: "City",
    weiterKonto: "Continue to meter and account",
    zurueck: "Back",
    tarifZeile: "{name} · {betrag} per year",
    zaehlerTitel: "Meter and account.",
    beispieldaten: "Sample data from a bill",
    beispielHinweis: "Sample values inserted. The prototype does not read a photo.",
    zaehlernummer: "Meter number",
    vorversorger: "Previous supplier",
    iban: "IBAN",
    kontoinhaber: "Account holder",
    einwilligung: "I agree to the processing of these details for this enquiry.",
    bestellen: "Order with obligation to pay",
    bleibtGeraet: "In the prototype the order stays on this device.",
    vertragDeutsch: "The contract itself stays in German.",
    erfasst: "Recorded.",
    erfasstText: "Draft for {name}, tariff {tarif}. The body stays on this device, testMode is {testMode}.",
    tarif: "Tariff",
    verbrauch: "Consumption",
    externeId: "External ID",
    bodyTitel: "Body for POST /contracts",
    neu: "Start again",
    zugangBanner: "Prototype · Password access",
    zugangTitel: "Protected draft.",
    zugangLead: "This prototype is protected by a password.",
    passwort: "Password",
    passwortFalsch: "The password is wrong.",
    oeffnen: "Open",
    fehler: {
      plz: "Please enter a 5-digit postcode.",
      verbrauch: "Please choose a household or enter consumption between 500 and 50,000 kWh.",
      anrede: "Please choose a salutation.",
      vorname: "First name is missing.",
      nachname: "Last name is missing.",
      geburtstag: "Date of birth is missing.",
      volljaehrig: "The contract requires age 18 or older.",
      email: "Email is missing or incomplete.",
      telefon: "Phone number is missing.",
      strasse: "Street is missing.",
      hausnummer: "House number is missing.",
      ort: "City is missing.",
      zaehlernummer: "Meter number is missing.",
      vorversorger: "Previous supplier is missing. The full name, as on the bill.",
      iban: "Please enter a German IBAN with 22 characters.",
      kontoinhaber: "Account holder is missing.",
      datenschutz: "Please confirm the consent.",
    },
  },
};

const LOCALE: Record<Sprache, string> = {
  de: "de-DE",
  uk: "uk-UA",
  ar: "ar-EG-u-nu-latn",
  en: "en-GB",
};

export function spracheAus(wert: string | string[] | undefined): Sprache {
  const roh = Array.isArray(wert) ? wert[0] : wert;
  if (roh === "uk" || roh === "ar" || roh === "en" || roh === "de") return roh;
  return "de";
}

export function htmlLang(sprache: Sprache): string {
  if (sprache === "uk") return "uk";
  if (sprache === "ar") return "ar";
  if (sprache === "en") return "en";
  return "de";
}

export function satz(vorlage: string, werte: Record<string, string | number>): string {
  return vorlage.replace(/\{([a-zA-Z0-9]+)\}/g, (voll, name: string) => {
    const wert = werte[name];
    return wert === undefined ? voll : String(wert);
  });
}

export function mitSprache(pfad: string, sprache: Sprache): string {
  const [path, query = ""] = pfad.split("?");
  const params = new URLSearchParams(query);
  if (sprache === "de") params.delete("lang");
  else params.set("lang", sprache);
  const q = params.toString();
  return q ? `${path}?${q}` : path;
}

export function formate(sprache: Sprache) {
  const locale = LOCALE[sprache];
  return {
    euro: new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }),
    ct: new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    kwh: new Intl.NumberFormat(locale),
  };
}
