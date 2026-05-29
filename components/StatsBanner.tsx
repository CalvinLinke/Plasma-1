"use client";

import { useEffect, useRef, useState } from "react";
import { Zap, Users, TrendingDown, Clock } from "lucide-react";

const stats = [
  { value: 748, suffix: "", label: "Anschlüsse mit nachgewiesener Ersparnis", icon: Zap },
  { value: 62, suffix: " €", label: "Durchschnittliche Ersparnis pro Jahr", icon: TrendingDown },
  { value: 300, suffix: "+", label: "Zufriedene Kunden", icon: Users },
  { value: 48, suffix: " Std.", label: "Bis zum individuellen Angebot", icon: Clock },
];

function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, start]);

  return count;
}

function StatItem({ stat, animate }: { stat: typeof stats[0]; animate: boolean }) {
  const count = useCountUp(stat.value, 1500, animate);
  const Icon = stat.icon;

  return (
    <div
      className="flex flex-col items-center text-center px-6 py-8 group cursor-default transition-all duration-300 hover:bg-surface rounded-2xl"
    >
      <div className="w-12 h-12 rounded-xl bg-violet-brand/10 flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110">
        <Icon
          className="w-6 h-6 transition-colors duration-300 group-hover:text-violet-brand"
          style={{ color: "#7B61FF" }}
        />
      </div>
      <p
        className="text-4xl font-bold tracking-tight transition-colors duration-300 group-hover:text-violet-brand"
        style={{ color: "#1A1B4B" }}
      >
        {count}
        {stat.suffix}
      </p>
      <p className="text-sm text-gray-500 mt-2 max-w-[140px] leading-snug">{stat.label}</p>
    </div>
  );
}

export default function StatsBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
          {stats.map((stat, i) => (
            <StatItem key={i} stat={stat} animate={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
