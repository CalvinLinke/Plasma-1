import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Startseite", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
      {all.map((c, i) => {
        const last = i === all.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {c.href && !last ? (
              <Link href={c.href} className="hover:text-violet-brand transition-colors">
                {c.label}
              </Link>
            ) : (
              <span className={last ? "text-marine font-medium" : ""}>{c.label}</span>
            )}
            {!last && <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
          </span>
        );
      })}
    </nav>
  );
}
