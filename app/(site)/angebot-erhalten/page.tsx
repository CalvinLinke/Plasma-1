import AngebotForm from "@/components/AngebotForm";

export default function AngebotErhalten() {
  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-brand mb-3">
            Schritt 1 von 1
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-marine mb-4">
            Sie laden Ihre Rechnung hoch –{" "}
            <span className="text-gradient">wir erledigen den Rest.</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Kostenlos. Unverbindlich. In unter 2 Minuten ausgefüllt.
          </p>
        </div>

        <AngebotForm />
      </div>
    </div>
  );
}
