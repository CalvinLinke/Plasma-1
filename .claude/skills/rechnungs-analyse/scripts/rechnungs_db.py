#!/usr/bin/env python3
"""SQLite-Datenbank fuer analysierte Energierechnungen (Plasma Energie Solution).

Befehle:
  init                         Datenbank/Tabelle anlegen (idempotent)
  upsert --json FILE|-         Datensatz einfuegen/aktualisieren (JSON-Objekt oder -Liste)
  list                         Kurzuebersicht aller Datensaetze
  export [--out FILE]          Alle Datensaetze als JSON exportieren
  sql "SELECT ..."             Lesende Ad-hoc-Abfrage

Eindeutigkeit: quelle_datei (Pfad der abgelegten Originaldatei relativ zu rechnungen/).
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import sqlite3
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[4]
DEFAULT_DB = PROJECT_ROOT / "rechnungen" / "datenbank" / "rechnungen.db"

FELDER = [
    ("quelle_datei", "TEXT NOT NULL UNIQUE"),   # z. B. dokumente/2026-08-12 Rechnung Vattenfall Strom Mustermann.pdf
    ("analyse_datei", "TEXT"),                  # zugehoerige .md-Analyse
    ("dokumenttyp", "TEXT"),                    # rechnung | abschlagsplan | vertragsbestaetigung | mahnung | sonstiges
    ("energieart", "TEXT"),                     # strom | gas | strom+gas
    ("kundensegment", "TEXT"),                  # privat | gewerbe | hausverwaltung
    ("kunde_name", "TEXT"),
    ("kunde_strasse", "TEXT"),
    ("kunde_plz", "TEXT"),
    ("kunde_ort", "TEXT"),
    ("lieferstelle", "TEXT"),                   # Lieferadresse, falls abweichend
    ("anbieter", "TEXT"),
    ("tarif", "TEXT"),
    ("kundennummer", "TEXT"),
    ("vertragskonto", "TEXT"),
    ("zaehlernummer", "TEXT"),
    ("marktlokation", "TEXT"),                  # MaLo-ID
    ("rechnungsnummer", "TEXT"),
    ("rechnungsdatum", "TEXT"),                 # YYYY-MM-DD
    ("zeitraum_von", "TEXT"),                   # YYYY-MM-DD
    ("zeitraum_bis", "TEXT"),                   # YYYY-MM-DD
    ("verbrauch_kwh", "REAL"),
    ("arbeitspreis_ct_kwh", "REAL"),            # brutto
    ("grundpreis_eur_jahr", "REAL"),            # brutto
    ("gesamtbetrag_eur", "REAL"),               # Rechnungsbetrag brutto
    ("abschlag_eur_monat", "REAL"),
    ("vertragsende", "TEXT"),                   # YYYY-MM-DD, falls erkennbar
    ("kuendigungsfrist", "TEXT"),
    ("notizen", "TEXT"),
    ("importiert_am", "TEXT"),
]

FELD_NAMEN = [name for name, _ in FELDER]


def connect(db_path: Path) -> sqlite3.Connection:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(db_path)
    con.row_factory = sqlite3.Row
    return con


def init_db(con: sqlite3.Connection) -> None:
    cols = ",\n  ".join(f"{name} {decl}" for name, decl in FELDER)
    con.execute(
        f"CREATE TABLE IF NOT EXISTS rechnungen (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  {cols}\n)"
    )
    con.commit()


def upsert(con: sqlite3.Connection, record: dict) -> str:
    unknown = sorted(set(record) - set(FELD_NAMEN))
    if unknown:
        raise SystemExit(f"Unbekannte Felder: {', '.join(unknown)}\nErlaubt: {', '.join(FELD_NAMEN)}")
    if not record.get("quelle_datei"):
        raise SystemExit("Pflichtfeld fehlt: quelle_datei")
    record.setdefault("importiert_am", dt.date.today().isoformat())
    names = [n for n in FELD_NAMEN if n in record]
    placeholders = ", ".join("?" for _ in names)
    updates = ", ".join(f"{n}=excluded.{n}" for n in names if n != "quelle_datei")
    con.execute(
        f"INSERT INTO rechnungen ({', '.join(names)}) VALUES ({placeholders}) "
        f"ON CONFLICT(quelle_datei) DO UPDATE SET {updates}",
        [record[n] for n in names],
    )
    con.commit()
    return record["quelle_datei"]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--db", type=Path, default=DEFAULT_DB, help=f"Pfad zur SQLite-Datei (Default: {DEFAULT_DB})")
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("init")
    p_upsert = sub.add_parser("upsert")
    p_upsert.add_argument("--json", required=True, help="JSON-Datei oder '-' fuer stdin; Objekt oder Liste von Objekten")
    sub.add_parser("list")
    p_export = sub.add_parser("export")
    p_export.add_argument("--out", type=Path, help="Zieldatei (Default: neben der DB als rechnungen.json)")
    p_sql = sub.add_parser("sql")
    p_sql.add_argument("query")
    args = parser.parse_args()

    con = connect(args.db)
    init_db(con)

    if args.cmd == "init":
        print(f"OK: {args.db}")
    elif args.cmd == "upsert":
        raw = sys.stdin.read() if args.json == "-" else Path(args.json).read_text(encoding="utf-8")
        data = json.loads(raw)
        records = data if isinstance(data, list) else [data]
        for rec in records:
            key = upsert(con, rec)
            print(f"upsert: {key}")
    elif args.cmd == "list":
        rows = con.execute(
            "SELECT id, rechnungsdatum, energieart, kunde_name, anbieter, verbrauch_kwh, gesamtbetrag_eur, quelle_datei "
            "FROM rechnungen ORDER BY rechnungsdatum DESC, id DESC"
        ).fetchall()
        for r in rows:
            print(" | ".join("" if r[k] is None else str(r[k]) for k in r.keys()))
        print(f"({len(rows)} Datensaetze)")
    elif args.cmd == "export":
        rows = [dict(r) for r in con.execute("SELECT * FROM rechnungen ORDER BY id").fetchall()]
        out = args.out or args.db.with_name("rechnungen.json")
        out.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"exportiert: {len(rows)} Datensaetze -> {out}")
    elif args.cmd == "sql":
        q = args.query.strip()
        if not q.lower().startswith("select"):
            raise SystemExit("Nur SELECT-Abfragen erlaubt.")
        for r in con.execute(q).fetchall():
            print(dict(r))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
