import { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  action?: ReactNode;
  className?: string;
  subtitle?: string;
  title: string;
};

export function SectionHeader({ action, className, subtitle, title }: SectionHeaderProps) {
  return (
    <header className={cn("hr-section-header", className)}>
      <div>
        <h2 className="hr-section-title">{title}</h2>
        {subtitle ? <p className="hr-section-subtitle">{subtitle}</p> : null}
      </div>
      {action ? <div className="hr-section-action">{action}</div> : null}
    </header>
  );
}
