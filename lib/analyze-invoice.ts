import { parseInvoiceText, type InvoiceAnalysis } from "@/lib/invoice-parse";

type InvoiceFile = {
  filename: string;
  contentType: string;
  bytes: Buffer;
};

function isPdf(file: InvoiceFile): boolean {
  return (
    file.contentType.includes("pdf") ||
    file.filename.toLowerCase().endsWith(".pdf") ||
    file.bytes.subarray(0, 4).toString() === "%PDF"
  );
}

function isImage(file: InvoiceFile): boolean {
  const lower = file.filename.toLowerCase();
  return (
    file.contentType.startsWith("image/") ||
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".png") ||
    lower.endsWith(".webp")
  );
}

async function extractPdfText(bytes: Buffer): Promise<string> {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(bytes));
  const { text } = await extractText(pdf, { mergePages: true });
  return text.trim();
}

export async function analyzeInvoice(file: InvoiceFile): Promise<InvoiceAnalysis> {
  try {
    if (isPdf(file)) {
      const text = await extractPdfText(file.bytes);
      if (text.length < 80) {
        return {
          status: "partial",
          notizen: ["PDF enthält wenig Text — vermutlich Scan, OCR online nicht verfügbar."],
          rawTextPreview: text,
        };
      }
      return parseInvoiceText(text);
    }

    if (isImage(file)) {
      return {
        status: "image_no_ocr",
        notizen: [
          "Foto-Rechnung — automatische Texterkennung online noch nicht verfügbar.",
          "PDF-Rechnungen werden vollständig ausgelesen.",
        ],
      };
    }

    return {
      status: "failed",
      notizen: [`Dateityp nicht unterstützt: ${file.contentType || file.filename}`],
    };
  } catch (error) {
    return {
      status: "failed",
      notizen: [error instanceof Error ? error.message : "Analyse fehlgeschlagen"],
    };
  }
}
