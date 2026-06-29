import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HelpPopup from "@/components/HelpPopup";

// Layout für die reguläre Website: globale Navigation, Footer und Hilfe-Popup.
// Standalone-Seiten (z. B. /tonym Co-Branding) liegen außerhalb dieser Gruppe
// und erhalten dieses Chrome bewusst nicht.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
      <HelpPopup />
    </>
  );
}
