import { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type SharedTopMetric = {
  label: string;
  note?: string;
  value: string | number;
};

type SharedTopCardProps = {
  action?: ReactNode;
  className?: string;
  metrics: SharedTopMetric[];
  overline: string;
  summary: string;
  title: string;
};

export function SharedTopCard({
  action,
  className,
  metrics,
  overline,
  summary,
  title,
}: SharedTopCardProps) {
  return (
    <Card className={cn("hr-shared-top-card", className)} tone="soft">
      <div className="hr-shared-top-head">
        <div className="hr-shared-top-main">
          <p className="hr-overline">{overline}</p>
          <h2 className="hr-feature-title">{title}</h2>
          <p className="hr-copy">{summary}</p>
        </div>
        {action ? <div className="hr-shared-top-action">{action}</div> : null}
      </div>

      <div className="hr-shared-top-metric-grid">
        {metrics.map((metric) => (
          <div className="hr-shared-top-metric" key={metric.label}>
            <span className="hr-kpi-label">{metric.label}</span>
            <strong className="hr-shared-top-metric-value">{metric.value}</strong>
            {metric.note ? <span className="hr-shared-top-metric-note">{metric.note}</span> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
