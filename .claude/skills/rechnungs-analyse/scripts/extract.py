#!/usr/bin/env python3
"""Scan the Rechnungen intake folder (--input-dir) and extract readable content into .content.md files.

Portiert aus der Memory-Alpha-Engine (obsidian-importer). Defaults zeigen auf
rechnungen/_input im Plasma-Projekt."""

from __future__ import annotations

import argparse
import concurrent.futures
import datetime as dt
import fcntl
import functools
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path


# Projekt-Wurzel (dieses Skript liegt in .claude/skills/rechnungs-analyse/scripts/).
PROJECT_ROOT = Path(__file__).resolve().parents[4]
DEFAULT_VAULT_ROOT = PROJECT_ROOT / "rechnungen"
DEFAULT_INPUT_DIR = DEFAULT_VAULT_ROOT / "_input"
# Overridden in main() via --input-dir / --vault-root.
INPUT_DIR = DEFAULT_INPUT_DIR
VAULT_ROOT = DEFAULT_VAULT_ROOT
LOCK_PATH = PROJECT_ROOT / ".claude" / ".rechnungs-import.lock"
PROJECT_VENV_DIR = PROJECT_ROOT / ".claude" / "venvs" / "rechnungs-analyse"
SKIP_NAMES = {".DS_Store"}
MAX_CONTENT_CHARS = 120_000
DEFAULT_OCR_LANG = "deu+eng"
DEFAULT_OCR_DPI = 200
MIN_DIRECT_PDF_CHARS = 200
MIN_MARKITDOWN_CHARS = 200
OCR_WAIT_INTERVAL_SECONDS = 5
WORD_XML_PARTS = (
    "word/document.xml",
    "word/header1.xml",
    "word/header2.xml",
    "word/header3.xml",
    "word/footer1.xml",
    "word/footer2.xml",
    "word/footer3.xml",
    "word/footnotes.xml",
    "word/endnotes.xml",
    "word/comments.xml",
)
SPREADSHEET_NS = {
    "main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "rel": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "pkgrel": "http://schemas.openxmlformats.org/package/2006/relationships",
}
BUILTIN_DATE_FORMAT_IDS = {
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    45,
    46,
    47,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
}
DATE_FORMAT_RE = re.compile(r"(^|[^\\])([ymdhHsS])")
MARKITDOWN_SUFFIXES = {
    ".csv",
    ".doc",
    ".docx",
    ".html",
    ".htm",
    ".json",
    ".md",
    ".odp",
    ".ods",
    ".odt",
    ".pdf",
    ".ppt",
    ".pptx",
    ".rtf",
    ".txt",
    ".xls",
    ".xlsm",
    ".xlsx",
    ".xltm",
    ".xltx",
    ".xml",
}


def is_sidecar(path: Path) -> bool:
    name = path.name.lower()
    return name.endswith(".content.md") or path.suffix.lower() == ".md"


def iter_source_files() -> list[Path]:
    if not INPUT_DIR.exists():
        return []
    files: list[Path] = []
    for path in INPUT_DIR.rglob("*"):
        if not path.is_file():
            continue
        if path.name in SKIP_NAMES or is_sidecar(path):
            continue
        files.append(path)
    return sorted(files)


def input_relative_path(text: str) -> Path:
    path = Path(text)
    if path.is_absolute():
        try:
            return path.resolve().relative_to(INPUT_DIR.resolve())
        except ValueError as exc:
            raise argparse.ArgumentTypeError(f"{text} is not inside {INPUT_DIR}") from exc
    if path.parts and path.parts[0] == INPUT_DIR.name:
        return Path(*path.parts[1:])
    return path


def filter_source_files(files: list[Path], requested_paths: list[Path], limit: int | None) -> list[Path]:
    if requested_paths:
        requested_resolved = [(INPUT_DIR / path).resolve() for path in requested_paths]
        matched = []
        for source in files:
            source_resolved = source.resolve()
            if any(source_resolved == requested or requested in source_resolved.parents for requested in requested_resolved):
                matched.append(source)
        files = matched
    if limit is not None:
        files = files[:limit]
    return files


def safe_relative(path: Path, base: Path) -> Path:
    resolved = path.resolve()
    base_resolved = base.resolve()
    try:
        return resolved.relative_to(base_resolved)
    except ValueError:
        return Path(os.path.relpath(resolved, base_resolved))


def content_sidecar_for(source: Path) -> Path:
    same_stem_sources = [
        path
        for path in source.parent.iterdir()
        if path.is_file()
        and path != source
        and path.name not in SKIP_NAMES
        and not is_sidecar(path)
        and path.stem == source.stem
    ]
    if same_stem_sources:
        return source.with_name(f"{source.name}.content.md")
    return source.with_name(f"{source.stem}.content.md")


def clean_text(text: str) -> str:
    text = text.replace("\x00", "")
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{4,}", "\n\n\n", text)
    return text.strip()


def enough_markitdown_text(text: str, *, min_chars: int = MIN_MARKITDOWN_CHARS) -> bool:
    return len(clean_text(text)) >= min_chars


def better_markitdown_text(markitdown_text: str, existing_text: str, *, min_chars: int = MIN_MARKITDOWN_CHARS) -> bool:
    markitdown_text = clean_text(markitdown_text)
    existing_text = clean_text(existing_text)
    if not enough_markitdown_text(markitdown_text, min_chars=min_chars):
        return False
    if not existing_text:
        return True
    # Be conservative: only replace a built-in result when MarkItDown is
    # substantially richer, so a formatting change cannot silently degrade imports.
    return len(markitdown_text) >= max(len(existing_text) * 1.25, len(existing_text) + min_chars)


def command_exists(name: str) -> bool:
    return shutil.which(name) is not None


def acquire_import_lock() -> object | None:
    lock_file = LOCK_PATH.open("w", encoding="utf-8")
    try:
        fcntl.flock(lock_file, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        lock_file.close()
        return None
    lock_file.write(f"{os.getpid()}\n")
    lock_file.flush()
    return lock_file


def format_elapsed(seconds: float) -> str:
    total_seconds = int(seconds)
    minutes, seconds = divmod(total_seconds, 60)
    hours, minutes = divmod(minutes, 60)
    if hours:
        return f"{hours:d}:{minutes:02d}:{seconds:02d}"
    return f"{minutes:02d}:{seconds:02d}"


def run_with_waiting_timer(
    command: list[str],
    *,
    timeout: int,
    waiting_message: str | None = None,
) -> subprocess.CompletedProcess[str]:
    if waiting_message is None:
        return subprocess.run(
            command,
            check=False,
            capture_output=True,
            text=True,
            timeout=timeout,
        )

    started = time.monotonic()
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(
            subprocess.run,
            command,
            check=False,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        while True:
            try:
                return future.result(timeout=OCR_WAIT_INTERVAL_SECONDS)
            except concurrent.futures.TimeoutError:
                elapsed = format_elapsed(time.monotonic() - started)
                print(f"{waiting_message} ({elapsed})", flush=True)


@functools.lru_cache(maxsize=1)
def available_tesseract_languages() -> set[str]:
    if not command_exists("tesseract"):
        return set()
    try:
        result = subprocess.run(
            ["tesseract", "--list-langs"],
            check=False,
            capture_output=True,
            text=True,
            timeout=30,
        )
    except Exception:
        return set()
    if result.returncode != 0:
        return set()
    lines = [line.strip() for line in result.stdout.splitlines()]
    return {line for line in lines if line and not line.lower().startswith("list of available")}


def usable_ocr_lang(requested: str) -> tuple[str, str]:
    installed = available_tesseract_languages()
    if not installed:
        return requested, "tesseract-missing"
    requested_parts = [part for part in requested.split("+") if part]
    usable = [part for part in requested_parts if part in installed]
    missing = [part for part in requested_parts if part not in installed]
    if usable and not missing:
        return "+".join(usable), "ok"
    if usable:
        return "+".join(usable), f"missing-languages:{'+'.join(missing)}"
    return requested, f"missing-languages:{'+'.join(missing) or requested}"


def read_text_file(path: Path) -> str:
    for encoding in ("utf-8", "utf-16", "latin-1"):
        try:
            return path.read_text(encoding=encoding)
        except UnicodeError:
            continue
    return ""


def extract_markitdown_text(path: Path) -> tuple[str, str]:
    if path.suffix.lower() not in MARKITDOWN_SUFFIXES:
        return "", "markitdown-unsupported"
    try:
        from markitdown import MarkItDown  # type: ignore
    except Exception:
        site_packages = sorted(PROJECT_VENV_DIR.glob("lib/python*/site-packages"))
        for site_package in site_packages:
            site_package_text = str(site_package)
            if site_package_text not in sys.path:
                sys.path.insert(0, site_package_text)
        try:
            from markitdown import MarkItDown  # type: ignore
        except Exception:
            return "", "markitdown-unavailable"

    try:
        result = MarkItDown().convert(str(path))
    except Exception:
        return "", "markitdown-error"

    text = getattr(result, "text_content", None)
    if text is None:
        text = getattr(result, "markdown", None)
    if text is None:
        text = str(result) if result is not None else ""
    text = clean_text(text)
    if not text:
        return "", "markitdown-empty"
    return text, "markitdown"


def extract_pdf_text(path: Path) -> str:
    try:
        import pypdf  # type: ignore
    except Exception:
        pypdf = None

    if pypdf is not None:
        try:
            reader = pypdf.PdfReader(str(path))
            pages = []
            for page in reader.pages:
                pages.append(page.extract_text() or "")
            text = clean_text("\n\n".join(pages))
            if text:
                return text
        except Exception:
            pass

    try:
        result = subprocess.run(
            ["pdftotext", str(path), "-"],
            check=False,
            capture_output=True,
            text=True,
            timeout=120,
        )
        if result.returncode == 0:
            return clean_text(result.stdout)
    except Exception:
        pass

    return ""


def ocr_image(path: Path, *, lang: str, psm: int, waiting_message: str | None = None) -> str:
    ocr_lang, lang_status = usable_ocr_lang(lang)
    if lang_status == "tesseract-missing":
        return ""
    try:
        result = run_with_waiting_timer(
            ["tesseract", str(path), "stdout", "-l", ocr_lang, "--psm", str(psm)],
            timeout=120,
            waiting_message=waiting_message,
        )
        if result.returncode == 0:
            return clean_text(result.stdout)
    except Exception:
        pass
    return ""


def extract_image_text(path: Path, *, lang: str, psm: int) -> str:
    source_rel = safe_relative(path, PROJECT_ROOT)
    return ocr_image(path, lang=lang, psm=psm, waiting_message=f"Waiting for OCR of {source_rel}")


def pdf_page_sort_key(path: Path) -> tuple[int, str]:
    match = re.search(r"-(\d+)\.png$", path.name)
    if match:
        return int(match.group(1)), path.name
    return 0, path.name


def ocr_pdf(path: Path, *, lang: str, psm: int, dpi: int) -> str:
    if not command_exists("pdftoppm"):
        return ""
    with tempfile.TemporaryDirectory(prefix="obsidian-import-ocr-") as tmp:
        output_prefix = Path(tmp) / "page"
        try:
            result = subprocess.run(
                ["pdftoppm", "-r", str(dpi), "-png", str(path), str(output_prefix)],
                check=False,
                capture_output=True,
                text=True,
                timeout=300,
            )
        except Exception:
            return ""
        if result.returncode != 0:
            return ""

        pages = sorted(Path(tmp).glob("page-*.png"), key=pdf_page_sort_key)
        page_count = len(pages)
        if page_count == 0:
            return ""

        source_rel = safe_relative(path, PROJECT_ROOT)
        page_texts = []
        for index, page in enumerate(pages, start=1):
            text = ocr_image(
                page,
                lang=lang,
                psm=psm,
                waiting_message=f"Waiting for OCR of {source_rel} page {index} of {page_count}",
            )
            if text:
                page_texts.append(f"## Page {index}\n\n{text}")
        return clean_text("\n\n".join(page_texts))


def extract_office_text(path: Path) -> str:
    try:
        result = subprocess.run(
            ["textutil", "-convert", "txt", "-stdout", str(path)],
            check=False,
            capture_output=True,
            text=True,
            timeout=120,
        )
        if result.returncode == 0:
            return clean_text(result.stdout)
    except Exception:
        pass
    return ""


def extract_docx_text(path: Path) -> str:
    try:
        with zipfile.ZipFile(path) as docx:
            parts = []
            for name in WORD_XML_PARTS:
                if name not in docx.namelist():
                    continue
                xml = docx.read(name)
                root = ET.fromstring(xml)
                text = extract_word_xml_text(root)
                if text:
                    parts.append(text)
            return clean_text("\n\n".join(parts))
    except Exception:
        return ""


def extract_word_xml_text(root: ET.Element) -> str:
    paragraphs = []
    for paragraph_elem in root.iter():
        if paragraph_elem.tag.rsplit("}", 1)[-1] != "p":
            continue
        current = []
        for elem in paragraph_elem.iter():
            tag = elem.tag.rsplit("}", 1)[-1]
            if tag == "t" and elem.text:
                current.append(elem.text)
            elif tag == "tab":
                current.append("\t")
            elif tag in {"br", "cr"}:
                current.append("\n")
        paragraph = "".join(current).strip()
        if paragraph:
            paragraphs.append(paragraph)
    return clean_text("\n\n".join(paragraphs))


def zip_read_xml(package: zipfile.ZipFile, name: str) -> ET.Element | None:
    try:
        return ET.fromstring(package.read(name))
    except Exception:
        return None


def normalize_zip_path(base_dir: str, target: str) -> str:
    if target.startswith("/"):
        return target.lstrip("/")
    parts = []
    for part in (base_dir + "/" + target).split("/"):
        if part in {"", "."}:
            continue
        if part == "..":
            if parts:
                parts.pop()
            continue
        parts.append(part)
    return "/".join(parts)


def extract_shared_strings(package: zipfile.ZipFile) -> list[str]:
    root = zip_read_xml(package, "xl/sharedStrings.xml")
    if root is None:
        return []
    strings = []
    for item in root.findall("main:si", SPREADSHEET_NS):
        pieces = [elem.text or "" for elem in item.iter() if elem.tag.rsplit("}", 1)[-1] == "t"]
        strings.append("".join(pieces))
    return strings


def spreadsheet_date_format_ids(package: zipfile.ZipFile) -> set[int]:
    root = zip_read_xml(package, "xl/styles.xml")
    if root is None:
        return set(BUILTIN_DATE_FORMAT_IDS)

    custom_formats: dict[int, str] = {}
    for fmt in root.findall("main:numFmts/main:numFmt", SPREADSHEET_NS):
        fmt_id = fmt.attrib.get("numFmtId")
        code = fmt.attrib.get("formatCode", "")
        if fmt_id and fmt_id.isdigit():
            custom_formats[int(fmt_id)] = code

    date_style_ids = set()
    xfs = root.findall("main:cellXfs/main:xf", SPREADSHEET_NS)
    for style_id, xf in enumerate(xfs):
        fmt_id = xf.attrib.get("numFmtId")
        if not fmt_id or not fmt_id.isdigit():
            continue
        num_fmt_id = int(fmt_id)
        format_code = custom_formats.get(num_fmt_id, "")
        if num_fmt_id in BUILTIN_DATE_FORMAT_IDS or DATE_FORMAT_RE.search(format_code):
            date_style_ids.add(style_id)
    return date_style_ids


def workbook_sheets(package: zipfile.ZipFile) -> list[tuple[str, str]]:
    workbook = zip_read_xml(package, "xl/workbook.xml")
    rels = zip_read_xml(package, "xl/_rels/workbook.xml.rels")
    if workbook is None or rels is None:
        return []

    relationships = {}
    for rel in rels.findall("pkgrel:Relationship", SPREADSHEET_NS):
        rel_id = rel.attrib.get("Id")
        target = rel.attrib.get("Target")
        if rel_id and target:
            relationships[rel_id] = normalize_zip_path("xl", target)

    sheets = []
    for sheet in workbook.findall("main:sheets/main:sheet", SPREADSHEET_NS):
        rel_id = sheet.attrib.get(f"{{{SPREADSHEET_NS['rel']}}}id")
        name = sheet.attrib.get("name", "Sheet")
        path = relationships.get(rel_id or "")
        if path:
            sheets.append((name, path))
    return sheets


def column_index(cell_ref: str) -> int:
    letters = re.match(r"[A-Z]+", cell_ref.upper())
    if not letters:
        return 1
    index = 0
    for letter in letters.group(0):
        index = index * 26 + (ord(letter) - ord("A") + 1)
    return index


def excel_date(serial_text: str) -> str | None:
    try:
        serial = float(serial_text)
    except ValueError:
        return None
    whole_days = int(serial)
    fraction = serial - whole_days
    if whole_days >= 60:
        whole_days -= 1
    value = dt.datetime(1899, 12, 31) + dt.timedelta(days=whole_days, seconds=round(fraction * 86400))
    if value.time() == dt.time():
        return value.date().isoformat()
    return value.isoformat(sep=" ", timespec="seconds")


def extract_cell_text(cell: ET.Element, shared_strings: list[str], date_style_ids: set[int]) -> str:
    cell_type = cell.attrib.get("t")
    style_id_text = cell.attrib.get("s")
    style_id = int(style_id_text) if style_id_text and style_id_text.isdigit() else None

    if cell_type == "inlineStr":
        pieces = [elem.text or "" for elem in cell.iter() if elem.tag.rsplit("}", 1)[-1] == "t"]
        return "".join(pieces)

    value_elem = cell.find("main:v", SPREADSHEET_NS)
    value = value_elem.text if value_elem is not None and value_elem.text is not None else ""
    if not value:
        formula = cell.find("main:f", SPREADSHEET_NS)
        return f"={formula.text}" if formula is not None and formula.text else ""

    if cell_type == "s":
        try:
            return shared_strings[int(value)]
        except Exception:
            return value
    if cell_type == "b":
        return "TRUE" if value == "1" else "FALSE"
    if cell_type == "str":
        return value
    if style_id is not None and style_id in date_style_ids:
        date_value = excel_date(value)
        if date_value:
            return date_value
    return value


def markdown_escape_cell(value: str) -> str:
    return value.replace("\\", "\\\\").replace("|", "\\|").replace("\n", "<br>")


def sheet_to_markdown(
    package: zipfile.ZipFile,
    path: str,
    *,
    sheet_name: str,
    shared_strings: list[str],
    date_style_ids: set[int],
) -> str:
    root = zip_read_xml(package, path)
    if root is None:
        return ""

    rows = []
    max_col = 0
    for row in root.findall("main:sheetData/main:row", SPREADSHEET_NS):
        values: dict[int, str] = {}
        for cell in row.findall("main:c", SPREADSHEET_NS):
            ref = cell.attrib.get("r", "")
            col = column_index(ref)
            text = clean_text(extract_cell_text(cell, shared_strings, date_style_ids))
            if text:
                values[col] = text
                max_col = max(max_col, col)
        if values:
            rows.append(values)

    if not rows or max_col == 0:
        return f"## Sheet: {sheet_name}\n\n[Empty sheet]"

    table_rows = []
    for row in rows:
        table_rows.append([markdown_escape_cell(row.get(col, "")) for col in range(1, max_col + 1)])

    header = [f"Column {col}" for col in range(1, max_col + 1)]
    markdown = [
        f"## Sheet: {sheet_name}",
        "",
        "| " + " | ".join(header) + " |",
        "| " + " | ".join("---" for _ in header) + " |",
    ]
    markdown.extend("| " + " | ".join(row) + " |" for row in table_rows)
    return "\n".join(markdown)


def extract_xlsx_text(path: Path) -> str:
    try:
        with zipfile.ZipFile(path) as workbook:
            shared_strings = extract_shared_strings(workbook)
            date_style_ids = spreadsheet_date_format_ids(workbook)
            sheets = workbook_sheets(workbook)
            parts = [
                sheet_to_markdown(
                    workbook,
                    sheet_path,
                    sheet_name=sheet_name,
                    shared_strings=shared_strings,
                    date_style_ids=date_style_ids,
                )
                for sheet_name, sheet_path in sheets
            ]
            return clean_text("\n\n".join(part for part in parts if part))
    except Exception:
        return ""


def extract_text(
    path: Path,
    *,
    ocr_lang: str,
    ocr_psm: int,
    ocr_dpi: int,
    force_ocr: bool,
    allow_ocr: bool,
    markitdown_mode: str,
) -> tuple[str, str]:
    suffix = path.suffix.lower()
    prefer_markitdown = markitdown_mode == "prefer"
    allow_markitdown = markitdown_mode != "off"

    if prefer_markitdown and allow_markitdown and suffix not in {".png", ".jpg", ".jpeg", ".tif", ".tiff", ".webp", ".heic"}:
        markitdown_text, markitdown_status = extract_markitdown_text(path)
        if enough_markitdown_text(markitdown_text):
            return markitdown_text, markitdown_status

    if suffix in {".txt", ".md", ".csv", ".json", ".xml", ".html", ".htm"}:
        return clean_text(read_text_file(path)), "direct"
    if suffix == ".pdf":
        text = ""
        if not force_ocr:
            text = extract_pdf_text(path)
            if len(text) >= MIN_DIRECT_PDF_CHARS:
                return text, "pdf-text"
            if allow_markitdown:
                markitdown_text, markitdown_status = extract_markitdown_text(path)
                if better_markitdown_text(markitdown_text, text):
                    return markitdown_text, f"{markitdown_status}-pdf"
        if not allow_ocr:
            if text:
                return text, "pdf-text-short-ocr-skipped"
            return "", "pdf-needs-ocr"
        ocr_text = ocr_pdf(path, lang=ocr_lang, psm=ocr_psm, dpi=ocr_dpi)
        if ocr_text:
            return ocr_text, f"pdf-ocr:{ocr_lang}:psm{ocr_psm}:dpi{ocr_dpi}"
        if allow_markitdown:
            markitdown_text, markitdown_status = extract_markitdown_text(path)
            if better_markitdown_text(markitdown_text, text):
                return markitdown_text, f"{markitdown_status}-pdf-ocr-fallback"
        if not force_ocr and text:
            return text, "pdf-text-short-ocr-failed"
        if not command_exists("pdftoppm"):
            return "", "pdf-needs-pdftoppm"
        if not command_exists("tesseract"):
            return "", "pdf-needs-tesseract"
        return "", "pdf-ocr-empty"
    if suffix in {".png", ".jpg", ".jpeg", ".tif", ".tiff", ".webp", ".heic"}:
        if not allow_ocr:
            return "", "image-needs-ocr"
        text = extract_image_text(path, lang=ocr_lang, psm=ocr_psm)
        if text:
            return text, f"image-ocr:{ocr_lang}:psm{ocr_psm}"
        if not command_exists("tesseract"):
            return "", "image-needs-tesseract"
        return "", "image-ocr-empty"
    if suffix in {".docx", ".docm", ".dotx", ".dotm"}:
        text = extract_docx_text(path)
        if text:
            return text, "word-docx-xml"
        if allow_markitdown:
            markitdown_text, markitdown_status = extract_markitdown_text(path)
            if enough_markitdown_text(markitdown_text):
                return markitdown_text, f"{markitdown_status}-word"
        text = extract_office_text(path)
        if text:
            return text, "word-textutil"
        return "", "word-docx-unread"
    if suffix in {".xlsx", ".xlsm", ".xltx", ".xltm"}:
        text = extract_xlsx_text(path)
        if text:
            return text, "spreadsheet-xlsx-xml"
        if allow_markitdown:
            markitdown_text, markitdown_status = extract_markitdown_text(path)
            if enough_markitdown_text(markitdown_text):
                return markitdown_text, f"{markitdown_status}-spreadsheet"
        return "", "spreadsheet-xlsx-unread"
    if suffix in {".doc", ".rtf", ".odt", ".pages"}:
        text = extract_office_text(path)
        if text:
            return text, "office-text"
        if allow_markitdown:
            markitdown_text, markitdown_status = extract_markitdown_text(path)
            if enough_markitdown_text(markitdown_text):
                return markitdown_text, f"{markitdown_status}-office"
        return "", "office-unread"
    if allow_markitdown:
        markitdown_text, markitdown_status = extract_markitdown_text(path)
        if enough_markitdown_text(markitdown_text):
            return markitdown_text, markitdown_status
    return "", "unsupported"


def write_content_sidecar(source: Path, text: str) -> None:
    if not text:
        return
    limited = text[:MAX_CONTENT_CHARS]
    if len(text) > MAX_CONTENT_CHARS:
        limited += "\n\n[Content truncated during import. Re-run extraction manually if full content is needed.]\n"
    content_sidecar_for(source).write_text(limited + "\n", encoding="utf-8")


def process_file(
    source: Path,
    *,
    dry_run: bool,
    overwrite: bool,
    ocr_lang: str,
    ocr_psm: int,
    ocr_dpi: int,
    force_ocr: bool,
    allow_ocr: bool,
    markitdown_mode: str,
) -> str:
    source_rel = safe_relative(source, PROJECT_ROOT)
    content_path = content_sidecar_for(source)
    content_rel = safe_relative(content_path, PROJECT_ROOT)

    if content_path.exists() and not overwrite:
        return f"SKIP {source_rel}: {content_rel} already exists"

    print(f"Extracting {source_rel}...", flush=True)
    text, extraction_status = extract_text(
        source,
        ocr_lang=ocr_lang,
        ocr_psm=ocr_psm,
        ocr_dpi=ocr_dpi,
        force_ocr=force_ocr,
        allow_ocr=allow_ocr,
        markitdown_mode=markitdown_mode,
    )

    if dry_run:
        return (
            f"DRY {source_rel}: {extraction_status}, {len(text)} chars"
            + (f", would write {content_rel}" if text else "")
        )

    if not text:
        return f"BLOCKED {source_rel}: {extraction_status}, no .content.md written"

    write_content_sidecar(source, text)
    return f"WRITE {content_rel}: {extraction_status}, {len(text)} chars"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="show extraction results without writing content files")
    parser.add_argument("--overwrite", action="store_true", help="overwrite existing .content.md files")
    parser.add_argument("--ocr-lang", default=DEFAULT_OCR_LANG, help="Tesseract languages, for example deu+eng")
    parser.add_argument("--ocr-psm", type=int, default=1, help="Tesseract page segmentation mode")
    parser.add_argument("--ocr-dpi", type=int, default=DEFAULT_OCR_DPI, help="DPI used when rasterizing PDFs for OCR")
    parser.add_argument("--force-ocr", action="store_true", help="OCR PDFs even when direct text extraction finds text")
    parser.add_argument("--no-ocr", action="store_true", help="skip OCR and only perform direct extraction")
    parser.add_argument(
        "--markitdown",
        choices=("auto", "off", "prefer"),
        default="auto",
        help="use MarkItDown as a conservative fallback by default; off disables it, prefer tries it first",
    )
    parser.add_argument("--no-lock", action="store_true", help="allow overlapping importer runs")
    parser.add_argument(
        "--input-dir",
        type=Path,
        default=DEFAULT_INPUT_DIR,
        help="intake folder to scan for pending files (default: ../Vault/_input next to the engine repo)",
    )
    parser.add_argument(
        "--vault-root",
        type=Path,
        default=DEFAULT_VAULT_ROOT,
        help="root of the target Obsidian vault this intake belongs to (default: ../Vault next to the engine repo)",
    )
    parser.add_argument("--path", action="append", default=[], help="only process one input file or folder, relative to --input-dir; may be repeated")
    parser.add_argument("--limit", type=int, help="only process the first N pending files after filtering")
    args = parser.parse_args()

    global INPUT_DIR, VAULT_ROOT
    INPUT_DIR = args.input_dir.expanduser().resolve()
    VAULT_ROOT = args.vault_root.expanduser().resolve()
    try:
        requested_paths = [input_relative_path(text) for text in args.path]
    except argparse.ArgumentTypeError as exc:
        parser.error(str(exc))

    usable_lang, lang_status = usable_ocr_lang(args.ocr_lang)
    if lang_status != "ok":
        print(f"OCR language warning: requested {args.ocr_lang}, using {usable_lang}; {lang_status}")

    lock_file = None
    if not args.no_lock:
        lock_file = acquire_import_lock()
        if lock_file is None:
            print(f"Another importer run is active; refusing to overlap. Use --no-lock to override.")
            return 2

    files = filter_source_files(iter_source_files(), requested_paths, args.limit)
    if not files:
        print(f"No pending input files found in {INPUT_DIR}.")
        return 0

    file_count = len(files)
    print(
        f"Found {file_count} pending input file{'s' if file_count != 1 else ''} in {INPUT_DIR} (target vault: {VAULT_ROOT}).",
        flush=True,
    )
    for index, source in enumerate(files, start=1):
        if file_count > 1:
            print(f"[{index} of {file_count}]", flush=True)
        print(
            process_file(
                source,
                dry_run=args.dry_run,
                overwrite=args.overwrite,
                ocr_lang=usable_lang,
                ocr_psm=args.ocr_psm,
                ocr_dpi=args.ocr_dpi,
                force_ocr=args.force_ocr,
                allow_ocr=not args.no_ocr,
                markitdown_mode=args.markitdown,
            )
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
