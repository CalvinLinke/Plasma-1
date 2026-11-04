// Texte der Cashback-Strecke. Feldbeschriftungen und Standard-Fehler kommen
// aus Roberts Prototyp (lib/prototyp-texte.ts), hier stehen nur die neuen.
// Ukrainisch und Arabisch vor dem Livegang von Muttersprachlern gegenlesen.

import { TEXTE as BASIS, type Sprache, type Texte as BasisTexte } from "@/lib/prototyp-texte";
import type { CashbackFehler } from "@/lib/cashback/pruefung";

type NeueTexte = {
  titel: string;
  lead: string;
  ortLabel: string;
  abschlagHeute: string;
  abschlagHinweis: string;
  preisBerechnen: string;
  sucht: string;
  angebotTitel: string;
  angebotMeta: string;
  proMonat: string;
  jahreskosten: string;
  ersparnis: string;
  plusCashback: string;
  preisgarantie: string;
  oeko: string;
  weiterAbschluss: string;
  angabenAendern: string;
  keinTarifTitel: string;
  keinTarifText: string;
  fehlerTitel: string;
  fehlerText: string;
  fotoButton: string;
  anrufen: string;
  personTitel: string;
  weiterZaehler: string;
  zaehlerTitel: string;
  rechnungTipp: string;
  zaehlerHilfe: string;
  maloLabel: string;
  maloHilfe: string;
  kundennummerLabel: string;
  vorversorgerHilfe: string;
  ibanHilfe: string;
  zusammenfassung: string;
  lieferstelle: string;
  zustimmungBestellung: string;
  zustimmungDatenschutz: string;
  datenschutzLink: string;
  zustimmungCashback: string;
  bedingungenLink: string;
  bestellen: string;
  sendet: string;
  widerruf: string;
  fertigTitel: string;
  fertigText: string;
  fertigSchritte: string[];
  sendeFehler: string;
  abgelaufen: string;
  demoHinweis: string;
  neueFehler: Partial<Record<CashbackFehler, string>>;
};

const NEU: Record<Sprache, NeueTexte> = {
  de: {
    titel: "Ihr neuer Strompreis in einer Minute.",
    lead: "Postleitzahl und Haushaltsgröße eingeben. Den Preis sehen Sie sofort.",
    ortLabel: "Ort",
    abschlagHeute: "Ihr Abschlag heute in € pro Monat (freiwillig)",
    abschlagHinweis: "Steht auf Ihrer Stromrechnung. Dann zeigen wir Ihnen, was Sie sparen.",
    preisBerechnen: "Preis berechnen",
    sucht: "Wir suchen Ihren Tarif. Das dauert ein paar Sekunden.",
    angebotTitel: "Ihr Angebot.",
    angebotMeta: "Für {plz} {ort}, gerechnet mit {kwh} kWh im Jahr.",
    proMonat: "im Monat",
    jahreskosten: "{betrag} im ersten Jahr, Bonus schon abgezogen",
    ersparnis: "Sie sparen ungefähr {betrag} im Jahr.",
    plusCashback: "Plus {betrag} von uns, sobald Ihr neuer Vertrag läuft.",
    preisgarantie: "Preisgarantie",
    oeko: "Ökostrom",
    weiterAbschluss: "Weiter zum Abschluss",
    angabenAendern: "Angaben ändern",
    keinTarifTitel: "Hier finden wir gerade keinen passenden Tarif.",
    keinTarifText: "Kein Problem. Schicken Sie uns ein Foto Ihrer Stromrechnung. Wir prüfen alles persönlich und melden uns innerhalb von 48 Stunden.",
    fehlerTitel: "Der Preis lässt sich gerade nicht laden.",
    fehlerText: "Versuchen Sie es in ein paar Minuten noch einmal. Oder schicken Sie uns ein Foto Ihrer Stromrechnung, wir melden uns innerhalb von 48 Stunden.",
    fotoButton: "Rechnung als Foto schicken",
    anrufen: "Anrufen: 0172 8182583",
    personTitel: "Wer bekommt den Strom?",
    weiterZaehler: "Weiter",
    zaehlerTitel: "Zähler und Konto.",
    rechnungTipp: "Nehmen Sie Ihre letzte Stromrechnung zur Hand. Dort steht alles, was wir hier brauchen.",
    zaehlerHilfe: "Steht auf der Rechnung und auf dem Zähler selbst.",
    maloLabel: "Marktlokations-ID (freiwillig)",
    maloHilfe: "11 Ziffern auf der Rechnung, oft unter „Marktlokation“ oder „MaLo“. Beschleunigt den Wechsel.",
    kundennummerLabel: "Kundennummer beim bisherigen Versorger (freiwillig)",
    vorversorgerHilfe: "Der volle Name, wie auf der Rechnung, z. B. Vattenfall Europe Sales GmbH.",
    ibanHilfe: "Für die monatlichen Abschläge an den neuen Versorger. Auf dieses Konto überweisen wir auch Ihre 50 €.",
    zusammenfassung: "Ihre Bestellung",
    lieferstelle: "Lieferstelle",
    zustimmungBestellung: "Ich bestelle den Tarif {tarif} von {anbieter} zu den oben genannten Preisen. Plasma Energie Solution leitet den Auftrag weiter. Der neue Versorger kündigt meinen bisherigen Vertrag.",
    zustimmungDatenschutz: "Ich bin einverstanden, dass meine Angaben für diesen Wechsel gespeichert und an den Versorger übermittelt werden.",
    datenschutzLink: "Datenschutz",
    zustimmungCashback: "Ich habe die Bedingungen der 50-€-Aktion gelesen.",
    bedingungenLink: "Bedingungen",
    bestellen: "Zahlungspflichtig bestellen",
    sendet: "Wird gesendet",
    widerruf: "Sie können den Vertrag 14 Tage lang ohne Angabe von Gründen widerrufen.",
    fertigTitel: "Geschafft. Ihr Auftrag ist da.",
    fertigText: "Ihre Vorgangsnummer: {vorgang}. Wir haben Ihnen gerade eine E-Mail geschickt.",
    fertigSchritte: [
      "Wir leiten Ihren Auftrag an {anbieter} weiter.",
      "{anbieter} schickt Ihnen die Vertragsbestätigung per E-Mail.",
      "Ihren alten Vertrag kündigt der neue Versorger. Sie müssen nichts tun.",
      "Sobald Sie beliefert werden, überweisen wir Ihnen {betrag}.",
    ],
    sendeFehler: "Das hat leider nicht geklappt. Bitte versuchen Sie es noch einmal oder rufen Sie uns an.",
    abgelaufen: "Das Angebot ist abgelaufen. Bitte berechnen Sie den Preis neu.",
    demoHinweis: "Testdaten: Beispieltarife, es wird nichts bestellt.",
    neueFehler: {
      ort: "Bitte den Ort angeben.",
      marktlokation: "Die Marktlokations-ID hat 11 Ziffern. Wenn Sie sie nicht finden, lassen Sie das Feld leer.",
      ibanPruefziffer: "Diese IBAN stimmt nicht. Bitte noch einmal prüfen.",
      bestellung: "Bitte bestätigen Sie die Bestellung.",
      cashback: "Bitte bestätigen Sie die Bedingungen der Aktion.",
    },
  },
  uk: {
    titel: "Ваша нова ціна на електроенергію за одну хвилину.",
    lead: "Введіть поштовий індекс і розмір домогосподарства. Ціну ви побачите одразу.",
    ortLabel: "Місто",
    abschlagHeute: "Ваш щомісячний платіж зараз, € (необов’язково)",
    abschlagHinweis: "Вказано у вашому рахунку. Тоді ми покажемо, скільки ви заощадите.",
    preisBerechnen: "Розрахувати ціну",
    sucht: "Шукаємо ваш тариф. Це займе кілька секунд.",
    angebotTitel: "Ваша пропозиція.",
    angebotMeta: "Для {plz} {ort}, розраховано на {kwh} кВт·год на рік.",
    proMonat: "на місяць",
    jahreskosten: "{betrag} за перший рік, бонус уже враховано",
    ersparnis: "Ви заощаджуєте приблизно {betrag} на рік.",
    plusCashback: "Плюс {betrag} від нас, щойно запрацює ваш новий договір.",
    preisgarantie: "Гарантія ціни",
    oeko: "Зелена енергія",
    weiterAbschluss: "Далі до оформлення",
    angabenAendern: "Змінити дані",
    keinTarifTitel: "Зараз ми не знайшли відповідного тарифу.",
    keinTarifText: "Не проблема. Надішліть нам фото вашого рахунку за електроенергію. Ми все перевіримо особисто і відповімо протягом 48 годин.",
    fehlerTitel: "Ціну зараз не вдається завантажити.",
    fehlerText: "Спробуйте ще раз за кілька хвилин. Або надішліть фото рахунку, ми відповімо протягом 48 годин.",
    fotoButton: "Надіслати фото рахунку",
    anrufen: "Зателефонувати: 0172 8182583",
    personTitel: "Хто отримує електроенергію?",
    weiterZaehler: "Далі",
    zaehlerTitel: "Лічильник і рахунок.",
    rechnungTipp: "Візьміть останній рахунок за електроенергію. Там є все, що потрібно.",
    zaehlerHilfe: "Вказано в рахунку і на самому лічильнику.",
    maloLabel: "Ідентифікатор точки поставки, MaLo (необов’язково)",
    maloHilfe: "11 цифр у рахунку, часто під «Marktlokation» або «MaLo». Пришвидшує зміну.",
    kundennummerLabel: "Номер клієнта у попереднього постачальника (необов’язково)",
    vorversorgerHilfe: "Повна назва, як у рахунку, напр. Vattenfall Europe Sales GmbH.",
    ibanHilfe: "Для щомісячних платежів новому постачальнику. На цей рахунок ми також переказуємо ваші 50 €.",
    zusammenfassung: "Ваше замовлення",
    lieferstelle: "Адреса поставки",
    zustimmungBestellung: "Я замовляю тариф {tarif} від {anbieter} за зазначеними цінами. Plasma Energie Solution передає замовлення. Новий постачальник розриває мій попередній договір.",
    zustimmungDatenschutz: "Я погоджуюся, що мої дані зберігаються для цієї зміни і передаються постачальнику.",
    datenschutzLink: "Захист даних",
    zustimmungCashback: "Я прочитав(ла) умови акції 50 €.",
    bedingungenLink: "Умови",
    bestellen: "Замовити з оплатою",
    sendet: "Надсилається",
    widerruf: "Ви можете відкликати договір протягом 14 днів без пояснення причин.",
    fertigTitel: "Готово. Ваше замовлення отримано.",
    fertigText: "Номер вашої заявки: {vorgang}. Ми щойно надіслали вам e-mail.",
    fertigSchritte: [
      "Ми передаємо ваше замовлення до {anbieter}.",
      "{anbieter} надішле вам підтвердження договору електронною поштою.",
      "Ваш старий договір розриває новий постачальник. Вам нічого не потрібно робити.",
      "Щойно почнеться постачання, ми переказуємо вам {betrag}.",
    ],
    sendeFehler: "На жаль, не вдалося. Спробуйте ще раз або зателефонуйте нам.",
    abgelaufen: "Пропозиція застаріла. Будь ласка, розрахуйте ціну знову.",
    demoHinweis: "Тестові дані: прикладні тарифи, нічого не замовляється.",
    neueFehler: {
      ort: "Вкажіть місто.",
      marktlokation: "MaLo має 11 цифр. Якщо не знаходите, залиште поле порожнім.",
      ibanPruefziffer: "Цей IBAN неправильний. Перевірте ще раз.",
      bestellung: "Підтвердьте замовлення.",
      datenschutz: "Підтвердьте згоду.",
      cashback: "Підтвердьте умови акції.",
    },
  },
  ar: {
    titel: "سعر الكهرباء الجديد خلال دقيقة واحدة.",
    lead: "أدخلوا الرمز البريدي وعدد أفراد الأسرة. سترون السعر فوراً.",
    ortLabel: "المدينة",
    abschlagHeute: "دفعتكم الشهرية الحالية باليورو (اختياري)",
    abschlagHinweis: "مذكورة في فاتورة الكهرباء. عندها نعرض لكم مقدار التوفير.",
    preisBerechnen: "احسبوا السعر",
    sucht: "نبحث عن تعرفتكم. يستغرق ذلك بضع ثوانٍ.",
    angebotTitel: "عرضكم.",
    angebotMeta: "لـ {plz} {ort}، محسوب على {kwh} كيلوواط ساعة سنوياً.",
    proMonat: "شهرياً",
    jahreskosten: "{betrag} في السنة الأولى، بعد خصم المكافأة",
    ersparnis: "توفرون حوالي {betrag} سنوياً.",
    plusCashback: "بالإضافة إلى {betrag} منا عند بدء عقدكم الجديد.",
    preisgarantie: "ضمان السعر",
    oeko: "كهرباء خضراء",
    weiterAbschluss: "متابعة إلى إتمام الطلب",
    angabenAendern: "تعديل البيانات",
    keinTarifTitel: "لم نجد الآن تعرفة مناسبة.",
    keinTarifText: "لا مشكلة. أرسلوا لنا صورة فاتورة الكهرباء. نراجع كل شيء شخصياً ونرد خلال 48 ساعة.",
    fehlerTitel: "لا يمكن تحميل السعر حالياً.",
    fehlerText: "حاولوا مرة أخرى بعد بضع دقائق. أو أرسلوا صورة الفاتورة، ونرد خلال 48 ساعة.",
    fotoButton: "إرسال صورة الفاتورة",
    anrufen: "اتصلوا: 0172 8182583",
    personTitel: "من يحصل على الكهرباء؟",
    weiterZaehler: "متابعة",
    zaehlerTitel: "العداد والحساب البنكي.",
    rechnungTipp: "أحضروا آخر فاتورة كهرباء. فيها كل ما نحتاجه هنا.",
    zaehlerHilfe: "مذكور في الفاتورة وعلى العداد نفسه.",
    maloLabel: "رقم موقع التوريد MaLo (اختياري)",
    maloHilfe: "11 رقماً في الفاتورة، غالباً تحت «Marktlokation» أو «MaLo». يسرّع التغيير.",
    kundennummerLabel: "رقم العميل لدى المورّد السابق (اختياري)",
    vorversorgerHilfe: "الاسم الكامل كما في الفاتورة، مثل Vattenfall Europe Sales GmbH.",
    ibanHilfe: "للدفعات الشهرية للمورّد الجديد. وإلى هذا الحساب نحوّل أيضاً الـ 50 يورو.",
    zusammenfassung: "طلبكم",
    lieferstelle: "عنوان التوريد",
    zustimmungBestellung: "أطلب التعرفة {tarif} من {anbieter} بالأسعار المذكورة أعلاه. تقوم Plasma Energie Solution بتمرير الطلب. يقوم المورّد الجديد بإنهاء عقدي السابق.",
    zustimmungDatenschutz: "أوافق على حفظ بياناتي لهذا التغيير ونقلها إلى المورّد.",
    datenschutzLink: "حماية البيانات",
    zustimmungCashback: "قرأت شروط عرض الـ 50 يورو.",
    bedingungenLink: "الشروط",
    bestellen: "طلب مُلزم بالدفع",
    sendet: "جارٍ الإرسال",
    widerruf: "يمكنكم إلغاء العقد خلال 14 يوماً دون ذكر الأسباب.",
    fertigTitel: "تم. وصلنا طلبكم.",
    fertigText: "رقم طلبكم: {vorgang}. أرسلنا لكم للتو رسالة بريد إلكتروني.",
    fertigSchritte: [
      "نمرّر طلبكم إلى {anbieter}.",
      "يرسل لكم {anbieter} تأكيد العقد بالبريد الإلكتروني.",
      "المورّد الجديد ينهي عقدكم القديم. لا تحتاجون لفعل شيء.",
      "عند بدء التوريد نحوّل لكم {betrag}.",
    ],
    sendeFehler: "للأسف لم ينجح ذلك. حاولوا مرة أخرى أو اتصلوا بنا.",
    abgelaufen: "انتهت صلاحية العرض. يرجى حساب السعر من جديد.",
    demoHinweis: "بيانات تجريبية: تعرفات مثال، لا يتم طلب أي شيء.",
    neueFehler: {
      ort: "يرجى إدخال المدينة.",
      marktlokation: "رقم MaLo من 11 رقماً. إذا لم تجدوه اتركوا الحقل فارغاً.",
      ibanPruefziffer: "رقم IBAN هذا غير صحيح. يرجى التحقق.",
      bestellung: "يرجى تأكيد الطلب.",
      datenschutz: "يرجى تأكيد الموافقة.",
      cashback: "يرجى تأكيد شروط العرض.",
    },
  },
  en: {
    titel: "Your new electricity price in one minute.",
    lead: "Enter your postcode and household size. You see the price right away.",
    ortLabel: "City",
    abschlagHeute: "Your current monthly payment in € (optional)",
    abschlagHinweis: "It is on your electricity bill. Then we show you what you save.",
    preisBerechnen: "Calculate price",
    sucht: "We are looking for your tariff. This takes a few seconds.",
    angebotTitel: "Your offer.",
    angebotMeta: "For {plz} {ort}, calculated with {kwh} kWh per year.",
    proMonat: "per month",
    jahreskosten: "{betrag} in the first year, bonus already deducted",
    ersparnis: "You save about {betrag} per year.",
    plusCashback: "Plus {betrag} from us once your new contract starts.",
    preisgarantie: "Price guarantee",
    oeko: "Green electricity",
    weiterAbschluss: "Continue to order",
    angabenAendern: "Change details",
    keinTarifTitel: "We cannot find a suitable tariff right now.",
    keinTarifText: "No problem. Send us a photo of your electricity bill. We check everything personally and reply within 48 hours.",
    fehlerTitel: "The price cannot be loaded right now.",
    fehlerText: "Please try again in a few minutes. Or send us a photo of your bill, we reply within 48 hours.",
    fotoButton: "Send a photo of the bill",
    anrufen: "Call: 0172 8182583",
    personTitel: "Who receives the electricity?",
    weiterZaehler: "Continue",
    zaehlerTitel: "Meter and bank account.",
    rechnungTipp: "Have your last electricity bill ready. It contains everything we need here.",
    zaehlerHilfe: "It is on the bill and on the meter itself.",
    maloLabel: "Market location ID, MaLo (optional)",
    maloHilfe: "11 digits on the bill, often under “Marktlokation” or “MaLo”. Speeds up the switch.",
    kundennummerLabel: "Customer number at your current supplier (optional)",
    vorversorgerHilfe: "The full name as on the bill, e.g. Vattenfall Europe Sales GmbH.",
    ibanHilfe: "For the monthly payments to the new supplier. We also transfer your €50 to this account.",
    zusammenfassung: "Your order",
    lieferstelle: "Supply address",
    zustimmungBestellung: "I order the tariff {tarif} from {anbieter} at the prices shown above. Plasma Energie Solution forwards the order. The new supplier cancels my current contract.",
    zustimmungDatenschutz: "I agree that my details are stored for this switch and passed on to the supplier.",
    datenschutzLink: "Privacy",
    zustimmungCashback: "I have read the terms of the €50 offer.",
    bedingungenLink: "Terms",
    bestellen: "Order with obligation to pay",
    sendet: "Sending",
    widerruf: "You can withdraw from the contract within 14 days without giving a reason.",
    fertigTitel: "Done. We have your order.",
    fertigText: "Your reference number: {vorgang}. We have just sent you an email.",
    fertigSchritte: [
      "We forward your order to {anbieter}.",
      "{anbieter} sends you the contract confirmation by email.",
      "The new supplier cancels your old contract. You do not need to do anything.",
      "Once your supply starts, we transfer {betrag} to you.",
    ],
    sendeFehler: "That did not work. Please try again or call us.",
    abgelaufen: "The offer has expired. Please calculate the price again.",
    demoHinweis: "Test data: sample tariffs, nothing is ordered.",
    neueFehler: {
      ort: "Please enter the city.",
      marktlokation: "The MaLo ID has 11 digits. If you cannot find it, leave the field empty.",
      ibanPruefziffer: "This IBAN is not correct. Please check it.",
      bestellung: "Please confirm the order.",
      datenschutz: "Please confirm your consent.",
      cashback: "Please confirm the terms of the offer.",
    },
  },
};

export type CashbackTexte = BasisTexte & NeueTexte & { meldung: (key: CashbackFehler) => string };

export function cashbackTexte(sprache: Sprache): CashbackTexte {
  const basis = BASIS[sprache];
  const neu = NEU[sprache];
  return {
    ...basis,
    ...neu,
    meldung: (key) =>
      neu.neueFehler[key] ??
      (basis.fehler as Record<string, string>)[key] ??
      NEU.de.neueFehler[key] ??
      (BASIS.de.fehler as Record<string, string>)[key] ??
      key,
  };
}
