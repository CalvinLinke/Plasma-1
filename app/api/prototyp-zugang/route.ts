import { NextResponse } from "next/server";
import {
  PROTOTYP_COOKIE,
  PROTOTYP_PASSWORT,
  passwortStimmt,
  prototypToken,
  sichereWeiterleitung,
} from "@/lib/prototyp-gate";

export async function POST(request: Request) {
  const form = await request.formData();
  const eingabe = String(form.get("passwort") ?? "");
  const next = sichereWeiterleitung(String(form.get("next") ?? ""));
  const ursprung = new URL(request.url);

  if (!(await passwortStimmt(eingabe, PROTOTYP_PASSWORT))) {
    const ziel = new URL("/prototyp/zugang", ursprung);
    ziel.searchParams.set("next", next);
    ziel.searchParams.set("fehler", "1");
    return NextResponse.redirect(ziel, 303);
  }

  const antwort = NextResponse.redirect(new URL(next, ursprung), 303);
  antwort.cookies.set(PROTOTYP_COOKIE, await prototypToken(PROTOTYP_PASSWORT), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/prototyp",
    maxAge: 60 * 60 * 24 * 30,
  });
  return antwort;
}
