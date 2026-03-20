import { ReactNode } from "react";

import { cn } from "@/lib/cn";

type CardTone = "surface" | "soft" | "accent";

type CardProps = {
  children: ReactNode;
  className?: string;
  tone?: CardTone;
};

const toneClassMap: Record<CardTone, string> = {
  surface: "hr-card--surface",
  soft: "hr-card--soft",
  accent: "hr-card--accent",
};

export function Card({ children, className, tone = "surface" }: CardProps) {
  return <article className={cn("hr-card", toneClassMap[tone], className)}>{children}</article>;
}
