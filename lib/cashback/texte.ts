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
  whatsappButton: string;
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
  maloUnbekannt: string;
  verbrauchRechnungLabel: string;
  verbrauchRechnungHilfe: string;
  gekuendigtFrage: string;
  ja: string;
  nein: string;
  gekuendigtNeinHilfe: string;
  lieferbeginnLabel: string;
  lieferbeginnHilfe: string;
  nameHinweis: string;
  preisNeu: string;
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
    keinTarifText: "Kein Problem. Rufen Sie uns an oder schreiben Sie uns per WhatsApp. Wir schauen persönlich nach einem Tarif für Sie.",
    fehlerTitel: "Der Preis lässt sich gerade nicht laden.",
    fehlerText: "Versuchen Sie es in ein paar Minuten noch einmal. Oder rufen Sie uns an, wir helfen Ihnen weiter.",
    whatsappButton: "Per WhatsApp schreiben",
    anrufen: "Anrufen: 0172 8182583",
    personTitel: "Wer bekommt den Strom?",
    weiterZaehler: "Weiter",
    zaehlerTitel: "Zähler und Konto.",
    rechnungTipp: "Nehmen Sie Ihre letzte Stromrechnung zur Hand. Dort steht alles, was wir hier brauchen.",
    zaehlerHilfe: "Steht auf der Rechnung und auf dem Zähler selbst.",
    maloLabel: "Marktlokations-ID",
    maloHilfe: "11 Ziffern, steht auf der Rechnung, oft unter „Marktlokation“ oder „MaLo-ID“. Damit findet der Netzbetreiber Ihren Anschluss sofort.",
    kundennummerLabel: "Kundennummer beim bisherigen Versorger",
    vorversorgerHilfe: "Der volle Name, wie auf der Rechnung, z. B. Vattenfall Europe Sales GmbH.",
    ibanHilfe: "Für die monatlichen Abschläge an den neuen Versorger. Auf dieses Konto überweisen wir auch Ihre 50 €.",
    maloUnbekannt: "Ich finde die Marktlokations-ID nicht. (Der Wechsel dauert dann etwas länger.)",
    verbrauchRechnungLabel: "Jahresverbrauch laut letzter Rechnung (kWh)",
    verbrauchRechnungHilfe: "Ändern Sie die Zahl, rechnen wir den Preis neu aus, bevor Sie bestellen.",
    gekuendigtFrage: "Haben Sie Ihren alten Vertrag schon selbst gekündigt?",
    ja: "Ja",
    nein: "Nein",
    gekuendigtNeinHilfe: "Gut so. Der neue Versorger kündigt für Sie. Es gilt die Kündigungsfrist Ihres alten Vertrags.",
    lieferbeginnLabel: "Ab wann soll der neue Versorger liefern?",
    lieferbeginnHilfe: "Am besten der Tag nach dem Ende Ihres alten Vertrags.",
    nameHinweis: "Bitte genau so, wie es auf Ihrer Stromrechnung steht. Sonst kann der alte Versorger die Kündigung nicht zuordnen.",
    preisNeu: "Wir haben den Preis mit Ihrem Verbrauch laut Rechnung neu berechnet. Bitte prüfen Sie die Bestellung und bestätigen Sie erneut.",
    zusammenfassung: "Ihre Bestellung",
    lieferstelle: "Lieferstelle",
    zustimmungBestellung: "Ich bestelle den Tarif {tarif} von {anbieter} zu den oben genannten Preisen. Plasma Energie Solution leitet den Auftrag weiter. Ich beauftrage den neuen Versorger, meinen bisherigen Vertrag zu kündigen, sofern ich das nicht schon selbst getan habe.",
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
      "Um die Kündigung Ihres alten Vertrags kümmert sich der neue Versorger, wenn Sie nicht schon selbst gekündigt haben.",
      "Sobald Sie beliefert werden, überweisen wir Ihnen {betrag}.",
    ],
    sendeFehler: "Das hat leider nicht geklappt. Bitte versuchen Sie es noch einmal oder rufen Sie uns an.",
    abgelaufen: "Das Angebot ist abgelaufen. Bitte berechnen Sie den Preis neu.",
    demoHinweis: "Testdaten: Beispieltarife, es wird nichts bestellt.",
    neueFehler: {
      lieferbeginnWunsch: "Bitte ein Datum ab morgen wählen, höchstens ein Jahr im Voraus.",
      bereitsGekuendigt: "Bitte Ja oder Nein wählen.",
      verbrauchRechnung: "Bitte den Jahresverbrauch in kWh angeben, wie auf der Rechnung.",
      kundennummer: "Kundennummer fehlt. Sie steht oben auf Ihrer Rechnung.",
      ort: "Bitte den Ort angeben.",
      marktlokation: "Bitte die 11-stellige Marktlokations-ID eintragen oder ankreuzen, dass Sie sie nicht finden.",
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
    keinTarifText: "Не проблема. Зателефонуйте нам або напишіть у WhatsApp. Ми особисто підберемо для вас тариф.",
    fehlerTitel: "Ціну зараз не вдається завантажити.",
    fehlerText: "Спробуйте ще раз за кілька хвилин. Або зателефонуйте нам, ми допоможемо.",
    whatsappButton: "Написати у WhatsApp",
    anrufen: "Зателефонувати: 0172 8182583",
    personTitel: "Хто отримує електроенергію?",
    weiterZaehler: "Далі",
    zaehlerTitel: "Лічильник і рахунок.",
    rechnungTipp: "Візьміть останній рахунок за електроенергію. Там є все, що потрібно.",
    zaehlerHilfe: "Вказано в рахунку і на самому лічильнику.",
    maloLabel: "Ідентифікатор точки поставки (MaLo-ID)",
    maloHilfe: "11 цифр у рахунку, часто під «Marktlokation» або «MaLo-ID». Так оператор мережі одразу знайде ваше підключення.",
    kundennummerLabel: "Номер клієнта у попереднього постачальника",
    vorversorgerHilfe: "Повна назва, як у рахунку, напр. Vattenfall Europe Sales GmbH.",
    ibanHilfe: "Для щомісячних платежів новому постачальнику. На цей рахунок ми також переказуємо ваші 50 €.",
    maloUnbekannt: "Я не можу знайти MaLo-ID. (Тоді зміна триватиме трохи довше.)",
    verbrauchRechnungLabel: "Річне споживання за останнім рахунком (кВт·год)",
    verbrauchRechnungHilfe: "Якщо ви зміните число, ми перерахуємо ціну перед замовленням.",
    gekuendigtFrage: "Ви вже самі розірвали старий договір?",
    ja: "Так",
    nein: "Ні",
    gekuendigtNeinHilfe: "Добре. Новий постачальник розірве договір за вас. Діє строк розірвання вашого старого договору.",
    lieferbeginnLabel: "З якої дати має постачати новий постачальник?",
    lieferbeginnHilfe: "Найкраще наступний день після завершення старого договору.",
    nameHinweis: "Будь ласка, точно так, як у вашому рахунку. Інакше старий постачальник не зможе зіставити розірвання.",
    preisNeu: "Ми перерахували ціну за вашим споживанням із рахунку. Перевірте замовлення і підтвердіть ще раз.",
    zusammenfassung: "Ваше замовлення",
    lieferstelle: "Адреса поставки",
    zustimmungBestellung: "Я замовляю тариф {tarif} від {anbieter} за зазначеними цінами. Plasma Energie Solution передає замовлення. Я доручаю новому постачальнику розірвати мій попередній договір, якщо я ще не зробив(ла) цього сам(а).",
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
      "Розірванням старого договору займеться новий постачальник, якщо ви ще не зробили цього самі.",
      "Щойно почнеться постачання, ми переказуємо вам {betrag}.",
    ],
    sendeFehler: "На жаль, не вдалося. Спробуйте ще раз або зателефонуйте нам.",
    abgelaufen: "Пропозиція застаріла. Будь ласка, розрахуйте ціну знову.",
    demoHinweis: "Тестові дані: прикладні тарифи, нічого не замовляється.",
    neueFehler: {
      lieferbeginnWunsch: "Оберіть дату, починаючи із завтра, не більше ніж на рік уперед.",
      bereitsGekuendigt: "Оберіть «Так» або «Ні».",
      verbrauchRechnung: "Вкажіть річне споживання в кВт·год, як у рахунку.",
      kundennummer: "Бракує номера клієнта. Він угорі у вашому рахунку.",
      ort: "Вкажіть місто.",
      marktlokation: "Введіть 11-значний MaLo-ID або позначте, що не можете його знайти.",
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
    keinTarifText: "لا مشكلة. اتصلوا بنا أو راسلونا عبر واتساب. نبحث لكم شخصياً عن تعرفة مناسبة.",
    fehlerTitel: "لا يمكن تحميل السعر حالياً.",
    fehlerText: "حاولوا مرة أخرى بعد بضع دقائق. أو اتصلوا بنا، وسنساعدكم.",
    whatsappButton: "راسلونا عبر واتساب",
    anrufen: "اتصلوا: 0172 8182583",
    personTitel: "من يحصل على الكهرباء؟",
    weiterZaehler: "متابعة",
    zaehlerTitel: "العداد والحساب البنكي.",
    rechnungTipp: "أحضروا آخر فاتورة كهرباء. فيها كل ما نحتاجه هنا.",
    zaehlerHilfe: "مذكور في الفاتورة وعلى العداد نفسه.",
    maloLabel: "رقم موقع التوريد (MaLo-ID)",
    maloHilfe: "11 رقماً في الفاتورة، غالباً تحت «Marktlokation» أو «MaLo-ID». بها يجد مشغّل الشبكة توصيلكم فوراً.",
    kundennummerLabel: "رقم العميل لدى المورّد السابق",
    vorversorgerHilfe: "الاسم الكامل كما في الفاتورة، مثل Vattenfall Europe Sales GmbH.",
    ibanHilfe: "للدفعات الشهرية للمورّد الجديد. وإلى هذا الحساب نحوّل أيضاً الـ 50 يورو.",
    maloUnbekannt: "لا أجد رقم MaLo-ID. (عندها يستغرق التغيير وقتاً أطول قليلاً.)",
    verbrauchRechnungLabel: "الاستهلاك السنوي حسب آخر فاتورة (كيلوواط ساعة)",
    verbrauchRechnungHilfe: "إذا غيّرتم الرقم نعيد حساب السعر قبل الطلب.",
    gekuendigtFrage: "هل ألغيتم عقدكم القديم بأنفسكم؟",
    ja: "نعم",
    nein: "لا",
    gekuendigtNeinHilfe: "جيد. المورّد الجديد يلغي العقد عنكم. تسري مهلة الإلغاء لعقدكم القديم.",
    lieferbeginnLabel: "متى يبدأ المورّد الجديد التوريد؟",
    lieferbeginnHilfe: "الأفضل اليوم التالي لانتهاء عقدكم القديم.",
    nameHinweis: "يرجى الكتابة تماماً كما في فاتورة الكهرباء. وإلا لا يستطيع المورّد القديم ربط الإلغاء بعقدكم.",
    preisNeu: "أعدنا حساب السعر حسب استهلاككم في الفاتورة. يرجى مراجعة الطلب وتأكيده من جديد.",
    zusammenfassung: "طلبكم",
    lieferstelle: "عنوان التوريد",
    zustimmungBestellung: "أطلب التعرفة {tarif} من {anbieter} بالأسعار المذكورة أعلاه. تقوم Plasma Energie Solution بتمرير الطلب. أفوّض المورّد الجديد بإنهاء عقدي السابق، إذا لم أقم بذلك بنفسي.",
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
      "يتولى المورّد الجديد إلغاء عقدكم القديم، إذا لم تلغوه بأنفسكم.",
      "عند بدء التوريد نحوّل لكم {betrag}.",
    ],
    sendeFehler: "للأسف لم ينجح ذلك. حاولوا مرة أخرى أو اتصلوا بنا.",
    abgelaufen: "انتهت صلاحية العرض. يرجى حساب السعر من جديد.",
    demoHinweis: "بيانات تجريبية: تعرفات مثال، لا يتم طلب أي شيء.",
    neueFehler: {
      lieferbeginnWunsch: "يرجى اختيار تاريخ من الغد، وليس أبعد من سنة.",
      bereitsGekuendigt: "يرجى اختيار نعم أو لا.",
      verbrauchRechnung: "يرجى إدخال الاستهلاك السنوي بالكيلوواط ساعة كما في الفاتورة.",
      kundennummer: "رقم العميل ناقص. تجدونه أعلى الفاتورة.",
      ort: "يرجى إدخال المدينة.",
      marktlokation: "يرجى إدخال رقم MaLo-ID المكوّن من 11 رقماً أو تحديد أنكم لا تجدونه.",
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
    keinTarifText: "No problem. Call us or message us on WhatsApp. We will look for a tariff for you personally.",
    fehlerTitel: "The price cannot be loaded right now.",
    fehlerText: "Please try again in a few minutes. Or call us and we will help you.",
    whatsappButton: "Message us on WhatsApp",
    anrufen: "Call: 0172 8182583",
    personTitel: "Who receives the electricity?",
    weiterZaehler: "Continue",
    zaehlerTitel: "Meter and bank account.",
    rechnungTipp: "Have your last electricity bill ready. It contains everything we need here.",
    zaehlerHilfe: "It is on the bill and on the meter itself.",
    maloLabel: "Market location ID (MaLo-ID)",
    maloHilfe: "11 digits on the bill, often under “Marktlokation” or “MaLo-ID”. With it the grid operator finds your connection immediately.",
    kundennummerLabel: "Customer number at your current supplier",
    vorversorgerHilfe: "The full name as on the bill, e.g. Vattenfall Europe Sales GmbH.",
    ibanHilfe: "For the monthly payments to the new supplier. We also transfer your €50 to this account.",
    maloUnbekannt: "I cannot find the MaLo-ID. (The switch then takes a little longer.)",
    verbrauchRechnungLabel: "Annual consumption according to your last bill (kWh)",
    verbrauchRechnungHilfe: "If you change the number, we recalculate the price before you order.",
    gekuendigtFrage: "Have you already cancelled your old contract yourself?",
    ja: "Yes",
    nein: "No",
    gekuendigtNeinHilfe: "Good. The new supplier cancels it for you. The notice period of your old contract still applies.",
    lieferbeginnLabel: "From when should the new supplier deliver?",
    lieferbeginnHilfe: "Ideally the day after your old contract ends.",
    nameHinweis: "Please exactly as it appears on your electricity bill. Otherwise the old supplier cannot match the cancellation.",
    preisNeu: "We recalculated the price with the consumption from your bill. Please check the order and confirm again.",
    zusammenfassung: "Your order",
    lieferstelle: "Supply address",
    zustimmungBestellung: "I order the tariff {tarif} from {anbieter} at the prices shown above. Plasma Energie Solution forwards the order. I authorise the new supplier to cancel my current contract, unless I have already done so myself.",
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
      "The new supplier takes care of cancelling your old contract, unless you have already done so.",
      "Once your supply starts, we transfer {betrag} to you.",
    ],
    sendeFehler: "That did not work. Please try again or call us.",
    abgelaufen: "The offer has expired. Please calculate the price again.",
    demoHinweis: "Test data: sample tariffs, nothing is ordered.",
    neueFehler: {
      lieferbeginnWunsch: "Please choose a date from tomorrow, at most one year ahead.",
      bereitsGekuendigt: "Please choose Yes or No.",
      verbrauchRechnung: "Please enter the annual consumption in kWh as on the bill.",
      kundennummer: "Customer number is missing. It is at the top of your bill.",
      ort: "Please enter the city.",
      marktlokation: "Please enter the 11-digit MaLo-ID or tick that you cannot find it.",
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
