import { ReactNode } from "react";

import { cn } from "@/lib/cn";

type PillTone = "neutral" | "success" | "accent";

type PillProps = {
  children: ReactNode;
  className?: string;
  tone?: PillTone;
};

const toneClassMap: Record<PillTone, string> = {
  neutral: "hr-pill--neutral",
  success: "hr-pill--success",
  accent: "hr-pill--accent",
};

export function Pill({ children, className, tone = "neutral" }: PillProps) {
  return <span className={cn("hr-pill", toneClassMap[tone], className)}>{children}</span>;
}
