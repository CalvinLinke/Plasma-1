import { ImageResponse } from "next/og";

// Standard-OG-Bild (1200×630) im Plasma-Look. Parameter: ?title=…&sub=…
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "Strom & Gas persönlich optimiert").slice(0, 120);
  const sub = (searchParams.get("sub") || "Energieverträge unabhängig vermitteln lassen").slice(0, 140);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #4B0082 0%, #1A1B4B 70%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(123,97,255,0.55) 0%, rgba(0,240,255,0.0) 70%)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #7B61FF, #00F0FF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0A0B1E",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            P
          </div>
          <div style={{ color: "#fff", fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
            Plasma Energie Solution
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ color: "#fff", fontSize: 66, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1.5, maxWidth: 940 }}>
            {title}
          </div>
          <div style={{ color: "#C7C9F0", fontSize: 30, fontWeight: 400, maxWidth: 900 }}>{sub}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: "#00F0FF", fontSize: 26, fontWeight: 600 }}>plasma-energie.de</div>
          <div style={{ color: "#9CA3C4", fontSize: 24 }}>Privat & Gewerbe · deutschlandweit</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
