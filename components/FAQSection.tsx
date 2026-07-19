import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/lib/types";

// FAQ-Akkordeon (natives <details>, kein JS). FAQPage-Schema separat via SchemaOrg.
export default function FAQSection({
  faqs,
  title = "Häufige Fragen",
}: {
  faqs: FAQ[];
  title?: string;
}) {
  if (!faqs?.length) return null;
  return (
    <section className="scroll-mt-28">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-marine mb-6">{title}</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group rounded-2xl border border-gray-100 bg-white shadow-ambient overflow-hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-semibold text-marine list-none [&::-webkit-details-marker]:hidden">
              <span>{faq.frage}</span>
              <ChevronDown className="w-5 h-5 shrink-0 text-violet-brand transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5 pt-0 text-gray-700 leading-relaxed">{faq.antwort}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
