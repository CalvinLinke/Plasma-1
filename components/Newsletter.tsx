"use client";

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #4B0082 0%, #1A1B4B 60%, #7B61FF 100%)" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,240,255,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
          <Mail className="w-6 h-6 text-white" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">
          Bleiben Sie informiert.
        </h2>
        <p className="text-white/60 mb-8 text-sm leading-relaxed">
          Energiepreise ändern sich laufend. Wer die Entwicklungen kennt, kann rechtzeitig reagieren — und spart mehr.
        </p>

        {submitted ? (
          <div className="glass rounded-2xl px-8 py-6 border border-white/20">
            <p className="text-white font-semibold">Danke! Sie sind jetzt dabei.</p>
            <p className="text-white/60 text-sm mt-1">Wir melden uns, wenn es etwas Wichtiges gibt.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ihre E-Mail-Adresse"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:bg-white/15 focus:border-cyan-brand/50 transition-all duration-300 outline-none"
              required
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-violet-brand text-white text-sm font-semibold transition-all duration-300 hover:scale-[1.03] hover:shadow-violet-glow flex items-center gap-2 shrink-0"
            >
              Anmelden
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-white/30 text-xs mt-4">Kein Spam. Jederzeit abmeldbar.</p>
      </div>
    </section>
  );
}
