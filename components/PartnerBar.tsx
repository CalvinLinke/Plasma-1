export default function PartnerBar() {
  const partners = ["E.ON", "Vattenfall", "RWE", "EnBW", "Eon Next", "Stadtwerke"];

  return (
    <section className="bg-surface border-y border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Partner der führenden Energieversorger
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <span key={partner} className="partner-logo">
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
