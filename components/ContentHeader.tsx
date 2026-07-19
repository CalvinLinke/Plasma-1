import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";

// Header für generische Ratgeber-Artikel (Plasma-Look, kein Serif).
export default function ContentHeader({
  title,
  kategorie,
  readingTime,
  keywords,
  dateModified,
  breadcrumbs,
}: {
  title: string;
  kategorie: string;
  readingTime: number;
  keywords?: string;
  dateModified?: string;
  breadcrumbs: Crumb[];
}) {
  const pills = (keywords || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 6);

  return (
    <header className="relative overflow-hidden bg-surface border-b border-gray-100">
      <div
        className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(123,97,255,0.25), transparent 70%)" }}
      />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 md:pt-32 md:pb-16">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-5 flex items-center gap-2 text-sm">
          <span className="font-semibold uppercase tracking-widest text-violet-brand">{kategorie}</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-500">{readingTime} Min. Lesezeit</span>
        </div>
        <h1 className="mt-3 text-3xl md:text-[2.6rem] font-bold tracking-tight text-marine leading-[1.15]">
          {title}
        </h1>
        {pills.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {pills.map((p) => (
              <span
                key={p}
                className="rounded-full bg-violet-brand/10 px-3 py-1 text-xs font-medium text-violet-brand"
              >
                {p}
              </span>
            ))}
          </div>
        )}
        {dateModified && (
          <p className="mt-4 text-xs text-gray-400">Zuletzt aktualisiert am {formatDate(dateModified)}</p>
        )}
      </div>
    </header>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}
