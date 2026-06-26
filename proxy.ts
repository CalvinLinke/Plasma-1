import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPartner } from "@/lib/partners";

// Auffangnetz für die Provisionszuordnung (Next 16: "proxy" statt "middleware"):
// Beim ersten Besuch von /p/<slug> wird – bei gültigem Partner – ein Cookie
// gesetzt. Bricht der Kunde ab und kommt später über /angebot-erhalten zurück,
// liest die API den Cookie und ordnet die Einsendung weiterhin dem Partner zu.
export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const slug = request.nextUrl.pathname.split("/")[2]; // "/p/<slug>" -> <slug>
  if (getPartner(slug)) {
    response.cookies.set("plasma_partner", slug, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 60, // 60 Tage
    });
  }

  return response;
}

export const config = {
  matcher: ["/p/:slug*"],
};
