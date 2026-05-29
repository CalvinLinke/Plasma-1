"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CTAButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
  type?: "button" | "submit";
}

export default function CTAButton({
  href,
  onClick,
  variant = "primary",
  children,
  className = "",
  showArrow = false,
  type = "button",
}: CTAButtonProps) {
  const base =
    variant === "primary"
      ? "btn-primary inline-flex items-center gap-2"
      : "btn-ghost inline-flex items-center gap-2";

  if (href) {
    return (
      <Link href={href} className={`${base} ${className}`}>
        {children}
        {showArrow && <ArrowRight className="w-4 h-4" />}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`${base} ${className}`}>
      {children}
      {showArrow && <ArrowRight className="w-4 h-4" />}
    </button>
  );
}
