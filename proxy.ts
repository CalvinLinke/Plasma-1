import { NextResponse, type NextRequest } from "next/server";
import { PROTOTYP_COOKIE, PROTOTYP_PASSWORT, sichereWeiterleitung, tokenStimmt } from "@/lib/prototyp-gate";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/prototyp/zugang" || pathname.startsWith("/prototyp/zugang/")) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(PROTOTYP_COOKIE)?.value;
  if (cookie && (await tokenStimmt(cookie, PROTOTYP_PASSWORT))) {
    return NextResponse.next();
  }

  const next = sichereWeiterleitung(`${pathname}${request.nextUrl.search}`);
  const ziel = new URL("/prototyp/zugang", request.url);
  ziel.searchParams.set("next", next);
  return NextResponse.redirect(ziel);
}

export const config = {
  matcher: ["/prototyp/:path*"],
};
