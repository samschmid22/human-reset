import { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type QuizOverviewCardProps = {
  action?: ReactNode;
  className?: string;
  completedCount: number;
  inProgressCount: number;
  maturitySummary: string;
  overallPercent: number;
  totalCount: number;
};

const R = 54;
const STROKE = 14;
const SIZE = 160;
const CX = SIZE / 2;
const CY = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function QuizOverviewCard({
  action,
  className,
  completedCount,
  inProgressCount,
  maturitySummary,
  overallPercent,
  totalCount,
}: QuizOverviewCardProps) {
  const safe = totalCount > 0 ? totalCount : 1;
  const completedLen = (completedCount / safe) * CIRCUMFERENCE;
  const inProgressLen = (inProgressCount / safe) * CIRCUMFERENCE;

  return (
    <Card className={cn("hr-quiz-overview-card-new", className)} tone="soft">
      <p className="hr-overline">Quiz Intake</p>
      <h2 className="hr-feature-title">Calibrate your reset plan</h2>
      <p className="hr-copy">{maturitySummary}</p>

      <div className="hr-donut-wrap">
        <svg aria-hidden="true" className="hr-donut-svg" viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <g transform={`rotate(-90 ${CX} ${CY})`}>
            {/* Track */}
            <circle
              cx={CX}
              cy={CY}
              fill="none"
              r={R}
              stroke="rgba(26,61,26,0.13)"
              strokeWidth={STROKE}
            />
            {/* In progress — drawn first, behind completed */}
            {inProgressLen > 0 && (
              <circle
                cx={CX}
                cy={CY}
                fill="none"
                r={R}
                stroke="#b5e19b"
                strokeDasharray={`${inProgressLen} ${CIRCUMFERENCE}`}
                strokeDashoffset={-completedLen}
                strokeLinecap="butt"
                strokeWidth={STROKE}
              />
            )}
            {/* Completed — on top */}
            {completedLen > 0 && (
              <circle
                cx={CX}
                cy={CY}
                fill="none"
                r={R}
                stroke="#228C22"
                strokeDasharray={`${completedLen} ${CIRCUMFERENCE}`}
                strokeDashoffset={0}
                strokeLinecap="butt"
                strokeWidth={STROKE}
              />
            )}
          </g>

          {/* Center percent */}
          <text
            dominantBaseline="middle"
            fill="#1a3d1a"
            fontFamily="Avenir Next, Avenir, sans-serif"
            fontSize="24"
            fontWeight="700"
            textAnchor="middle"
            x={CX}
            y={CY - 5}
          >
            {overallPercent}%
          </text>
          <text
            dominantBaseline="middle"
            fill="#3d6b3d"
            fontFamily="Avenir Next, Avenir, sans-serif"
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="0.07em"
            textAnchor="middle"
            x={CX}
            y={CY + 13}
          >
            CALIBRATED
          </text>
        </svg>
      </div>

      {action ? <div className="hr-shared-top-action">{action}</div> : null}
    </Card>
  );
}
