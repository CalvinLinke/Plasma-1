import { Noto_Sans, Noto_Sans_Arabic } from "next/font/google";
import { htmlLang, type Sprache } from "@/lib/prototyp-texte";

const noto = Noto_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  display: "swap",
});

const notoArabisch = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500"],
  display: "swap",
});

export default function PrototypRahmen({
  sprache,
  children,
}: {
  sprache: Sprache;
  children: React.ReactNode;
}) {
  const arabisch = sprache === "ar";
  return (
    <div lang={htmlLang(sprache)} dir={arabisch ? "rtl" : "ltr"} className={arabisch ? notoArabisch.className : noto.className}>
      {children}
    </div>
  );
}
