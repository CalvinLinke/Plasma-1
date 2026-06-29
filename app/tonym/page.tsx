import type { Metadata } from "next";
import Image from "next/image";
import TonyMForm from "@/components/TonyMForm";

export const metadata: Metadata = {
  title: "Bessere Konditionen über Ihren Makler — Plasma Energie × tonyM",
  description:
    "Exklusiver Zugang zum Strom- und Gastarif-Vergleich von Plasma Energie, vermittelt durch tonyM Versicherungsmakler. Rechnung hochladen, Angebot in 48 Stunden.",
  // Co-Branding-Landingpage gehört nicht in den Google-Index.
  robots: { index: false, follow: false },
};

export default function VarianteC() {
  return (
    <div className="min-h-screen bg-[#eef0f4] px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-[1080px] overflow-hidden rounded-md bg-white shadow-[0_4px_24px_rgba(0,0,0,.08)]">
        {/* ── Co-Brand-Leiste ── */}
        <div className="flex items-center justify-between gap-4 border-b border-[#f1f1f5] px-5 py-[18px] sm:px-10">
          <Image
            src="/tonym/plasma-logo.png"
            alt="Plasma Energie"
            width={67}
            height={34}
            className="h-[34px] w-auto object-contain"
          />
          <div className="flex items-center gap-[14px]">
            <span className="text-[12px] font-medium tracking-[.04em] text-[#9ca3af]">
              EXKLUSIVER ZUGANG VON
            </span>
            <Image
              src="/tonym/tonyM-logo.png"
              alt="tonyM Versicherungsmakler"
              width={59}
              height={42}
              className="h-[42px] w-auto object-contain"
            />
          </div>
        </div>

        {/* ── Bento-Hero ── */}
        <div className="bg-surface p-5 sm:p-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.15fr_1.15fr_1fr]">
            {/* Kachel A — Headline */}
            <div className="relative overflow-hidden rounded-[22px] border border-[#efeafd] p-6 sm:p-[34px] sm:col-span-2 lg:col-span-2 lg:col-start-1 lg:row-start-1"
              style={{ background: "linear-gradient(150deg,#ede9ff,#fff 70%)" }}
            >
              <div
                className="pointer-events-none absolute -top-10 -right-[30px] h-[240px] w-[240px] rounded-full"
                style={{ background: "radial-gradient(circle,rgba(123,97,255,.16),transparent 70%)" }}
              />
              <div className="relative">
                <div className="mb-[18px] inline-flex items-center gap-2 rounded-full border border-[#e7e3ff] bg-white px-[13px] py-[7px]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M6 11V8a6 6 0 1112 0v3" stroke="#4B0082" strokeWidth="2.4" strokeLinecap="round" />
                    <rect x="4.5" y="11" width="15" height="9" rx="2.2" fill="#4B0082" />
                  </svg>
                  <span className="text-[11px] font-semibold tracking-[.04em] text-[#4B0082]">
                    EXKLUSIVE KONDITIONEN · NUR ÜBER DIESEN LINK
                  </span>
                </div>
                <h1 className="mb-[14px] text-[28px] font-extrabold leading-[1.08] tracking-[-0.03em] text-marine sm:text-[38px]">
                  Bessere Konditionen —<br />
                  <span className="text-gradient">über Ihren Makler.</span>
                </h1>
                <p className="mb-[22px] max-w-[420px] text-[15.5px] leading-[1.55] text-[#4b5563]">
                  Tony Meuer hat Ihnen Plasma empfohlen. Rechnung hoch, zwei Angaben — wir holen das
                  Beste aus Ihrem Stromtarif heraus und wickeln den Wechsel komplett ab.
                </p>
                <a
                  href="#formC"
                  className="inline-flex items-center gap-2 rounded-[12px] bg-[#7B61FF] px-6 py-[13px] text-[15px] font-semibold text-white no-underline shadow-[0_8px_20px_rgba(123,97,255,.3)] transition-colors hover:bg-[#6a4fef]"
                >
                  Rechnung hochladen
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m-6-6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Kachel B — Tony (hoch) */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-[22px] bg-[#104070] p-[26px] sm:col-span-2 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:row-span-2">
              <div
                className="pointer-events-none absolute -top-[30px] -right-[30px] h-[160px] w-[160px] rounded-full"
                style={{ background: "radial-gradient(circle,rgba(255,255,255,.08),transparent 70%)" }}
              />
              <div className="relative">
                <Image
                  src="/tonym/tonyM-logo.png"
                  alt="tonyM"
                  width={37}
                  height={26}
                  className="mb-[18px] h-[26px] w-auto object-contain opacity-[.92] brightness-0 invert"
                />
                <Image
                  src="/tonym/tony-portrait.jpg"
                  alt="Tony Meuer"
                  width={400}
                  height={602}
                  className="mb-4 h-[240px] w-full rounded-[16px] object-cover"
                  style={{ objectPosition: "center 18%" }}
                />
              </div>
              <p className="relative m-0 text-[14.5px] font-medium leading-[1.5] text-white">
                „Strom- und Gasvergleich: kurz und knackig, ohne Geschwafel. Die Abwicklung ist
                schnell, einfach und ohne Aufwand. So mag ich das – und so empfehle ich es auch gern
                weiter!"
              </p>
              <div className="relative">
                <div className="text-[13.5px] font-bold text-white">Tony Meuer</div>
                <div className="text-[11.5px] font-normal text-white/60">
                  Versicherungsmakler · Dresden
                </div>
              </div>
            </div>

            {/* Kachel C — Beispiel-Ersparnis */}
            <div className="rounded-[22px] border border-[#eef] bg-white p-6 lg:col-start-1 lg:row-start-2">
              <div className="mb-[14px] text-[11px] font-semibold tracking-[.05em] text-[#9ca3af]">
                BEISPIEL-ANALYSE · STROMTARIF
              </div>
              <div className="mb-[11px]">
                <div className="mb-[5px] flex justify-between">
                  <span className="text-[12px] text-[#9ca3af]">Aktueller Vertrag</span>
                  <span className="text-[12px] font-semibold text-[#6b7280]">1.580 €</span>
                </div>
                <div className="h-2 overflow-hidden rounded-[99px] bg-[#f1f1f5]">
                  <div className="h-full w-full rounded-[99px] bg-[#fecaca]" />
                </div>
              </div>
              <div className="mb-[14px]">
                <div className="mb-[5px] flex justify-between">
                  <span className="text-[12px] text-[#9ca3af]">Plasma-Tarif</span>
                  <span className="text-[12px] font-semibold text-marine">1.518 €</span>
                </div>
                <div className="h-2 overflow-hidden rounded-[99px] bg-[#f1f1f5]">
                  <div
                    className="h-full w-[96%] rounded-[99px]"
                    style={{ background: "linear-gradient(90deg,#4B0082,#7B61FF)" }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-[10px] rounded-[13px] bg-[rgba(22,163,74,.07)] px-[13px] py-[11px]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M7 7l10 10M17 7v10H7" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90 12 12)" />
                </svg>
                <div>
                  <div className="text-[11px] text-[#9ca3af]">Ihre Ersparnis</div>
                  <div className="text-[14px] font-bold text-[#16a34a]">Ø 62 € / Jahr</div>
                </div>
              </div>
            </div>

            {/* Kachel D — Was TonyM Kunden bekommen */}
            <div className="rounded-[22px] border border-[#eef] bg-white p-6 lg:col-start-2 lg:row-start-2">
              <div className="mb-4 text-[15px] font-bold text-marine">Was TonyM Kunden bekommen</div>
              <div className="flex flex-col gap-[14px]">
                {[
                  {
                    title: "Bevorzugte Bearbeitung",
                    desc: "Ihre Anfrage wird vorgezogen behandelt.",
                    icon: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="#7B61FF" strokeWidth="2" strokeLinejoin="round" />,
                  },
                  {
                    title: "Exklusive Anbieter",
                    desc: "Tarife, die nicht auf Vergleichsportalen stehen.",
                    icon: <path d="M12 3l7 4v5c0 4-3 7-7 9-4-2-7-5-7-9V7l7-4z" stroke="#7B61FF" strokeWidth="2" strokeLinejoin="round" />,
                  },
                  {
                    title: "Direkter Draht",
                    desc: "Ein fester Ansprechpartner über Ihren Makler.",
                    icon: <path d="M4 4h16v12H7l-3 3V4z" stroke="#7B61FF" strokeWidth="2" strokeLinejoin="round" />,
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-[11px]">
                    <span className="inline-flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[9px] bg-[rgba(123,97,255,.1)]">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        {item.icon}
                      </svg>
                    </span>
                    <div>
                      <div className="text-[13px] font-semibold text-marine">{item.title}</div>
                      <div className="text-[12px] leading-[1.4] text-[#6b7280]">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Vergleichs-Streifen ── */}
        <div className="bg-white px-5 py-[50px] sm:px-10">
          <div className="mb-[30px] text-center">
            <div className="mb-[10px] text-[12px] font-semibold tracking-[.08em] text-[#7B61FF]">
              AUFWAND IM VERGLEICH
            </div>
            <h2 className="m-0 text-[24px] font-extrabold tracking-[-0.02em] text-marine sm:text-[30px]">
              Selbst kümmern — oder uns machen lassen.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Selbst */}
            <div className="rounded-[20px] border border-[#eee] bg-[#fafafa] p-6">
              <div className="mb-4 text-[15px] font-bold text-[#9ca3af]">Selbst</div>
              <div className="flex flex-col gap-3">
                {[
                  "Tarife recherchieren & vergleichen",
                  "Fristen und Kündigung selbst managen",
                  "Nur öffentlich gelistete Tarife",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-[11px] text-[14px] leading-[1.4] text-[#6b7280]">
                    <span className="text-[#cbd5e1]">✕</span>
                    {t}
                  </div>
                ))}
              </div>
            </div>
            {/* Plasma übernimmt */}
            <div
              className="rounded-[20px] border-[1.5px] border-[#e7e3ff] p-6 shadow-[0_12px_30px_rgba(123,97,255,.10)]"
              style={{ background: "linear-gradient(160deg,#faf9ff,#fff)" }}
            >
              <div className="mb-4 flex items-center gap-[9px]">
                <Image
                  src="/tonym/plasma-logo.png"
                  alt="Plasma"
                  width={40}
                  height={20}
                  className="h-5 w-auto object-contain"
                />
                <span className="text-[15px] font-bold text-marine">übernimmt</span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  "Eine Datei hochladen — fertig",
                  "Kündigung & Wechsel komplett durch uns",
                  "Exklusive Anbieter abseits der Portale",
                  "Jährlicher Tarif-Check — wir behalten Ihre Daten im Blick und erneuern bei Bedarf",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-[11px] text-[14px] font-medium leading-[1.4] text-[#374151]">
                    <span className="mt-px inline-flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[6px] bg-[rgba(123,97,255,.13)]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12.5l4.5 4.5L19 6.5" stroke="#7B61FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Formular ── */}
        <div id="formC" className="bg-surface px-5 py-[50px] sm:px-10">
          <div className="mx-auto max-w-[560px]">
            <div className="mb-[22px] text-center">
              <h2 className="mb-2 text-[24px] font-extrabold tracking-[-0.02em] text-marine sm:text-[28px]">
                Jetzt Ihre Konditionen sichern
              </h2>
              <p className="m-0 text-[15px] text-[#6b7280]">
                Kostenlos &amp; unverbindlich · Angebot in 48 Stunden
              </p>
            </div>
            <TonyMForm />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex flex-col items-start justify-between gap-4 bg-[#0A0B1E] px-5 py-[30px] sm:flex-row sm:items-center sm:px-10">
          <div className="flex items-center gap-4">
            <Image
              src="/tonym/plasma-logo.png"
              alt="Plasma Energie"
              width={51}
              height={26}
              className="h-[26px] w-auto object-contain brightness-0 invert"
            />
            <span className="text-white/25">|</span>
            <span className="text-[12px] text-white/50">
              Zugang vermittelt durch tonyM Versicherungsmakler
            </span>
          </div>
          <div className="text-[12px] text-white/40">Impressum · Datenschutz · AGB</div>
        </div>
      </div>
    </div>
  );
}
