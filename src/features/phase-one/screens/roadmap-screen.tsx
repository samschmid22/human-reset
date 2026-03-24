import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScreenContainer } from "@/components/ui/layout";
import { getActionStatusView } from "@/features/actions/storage";
import { ActionState } from "@/features/actions/types";
import { getRoadmapPhaseCount } from "@/features/findings/engine";
import {
  FindingsRoadmapResult,
  ROADMAP_PHASE_LABELS,
  RoadmapPhaseId,
} from "@/features/findings/types";

type RoadmapScreenProps = {
  actionState: ActionState;
  onActionDoneToday: (actionId: string) => void;
  onActionDonePermanent: (actionId: string) => void;
  onActionReset: (actionId: string) => void;
  onActionSkip: (actionId: string) => void;
  onActionSnooze: (actionId: string) => void;
  onGoToHome: () => void;
  report: FindingsRoadmapResult;
};

type PhaseProgress = {
  completed: number;
  count: number;
  pending: number;
  phase: RoadmapPhaseId;
};

type PhaseState = "complete" | "current" | "locked";

// ---------------------------------------------------------------------------
// 10-stop visual map (5 engine phases × 2 visual nodes each)
// viewBox 0 0 360 1200 — intentionally scrollable
// ---------------------------------------------------------------------------
const SVG_W = 360;
const SVG_H = 1200;
const ROAD_STROKE = 36;

// Road path: 9 bezier segments connecting 10 nodes
const ROAD_D =
  "M 270 80 C 270 148 80 148 80 210" +
  " C 80 272 270 272 270 335" +
  " C 270 398 80 398 80 460" +
  " C 80 522 270 522 270 585" +
  " C 270 648 80 648 80 710" +
  " C 80 772 270 772 270 835" +
  " C 270 898 80 898 80 960" +
  " C 80 1022 270 1022 270 1085" +
  " C 270 1148 185 1148 185 1160";

// Approx cumulative path lengths at each of the 10 nodes (~250px per segment except last ~110px)
const NODE_CUM_LEN = [0, 252, 504, 756, 1008, 1260, 1512, 1764, 2016, 2126];
const ROAD_TOTAL = 2126;

// Node positions [x, y]
const NODE_POS: [number, number][] = [
  [270, 80],
  [80, 210],
  [270, 335],
  [80, 460],
  [270, 585],
  [80, 710],
  [270, 835],
  [80, 960],
  [270, 1085],
  [185, 1160],
];

// Label anchor side
const LABEL_ANCHOR: ("end" | "start")[] = [
  "end", "start", "end", "start", "end",
  "start", "end", "start", "end", "start",
];
const LABEL_X_OFFSET = 36;

// Two-line labels for the 10 visual stops
const NODE_LABEL_LINES: [string, string][] = [
  ["Stop Biggest", "Exposures"],
  ["Clear", "the Air"],
  ["Clean", "Your Water"],
  ["Detox Your", "Kitchen"],
  ["Reset Your", "Laundry"],
  ["Purify", "Personal Care"],
  ["Clean Your", "Cleaning"],
  ["Upgrade", "Your Sleep"],
  ["Mind +", "Stress Reset"],
  ["Maintain", "Your Reset"],
];

// Map 10 visual nodes → 5 engine phase indices (2 nodes per phase)
const NODE_TO_PHASE_INDEX = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];

// Full labels for the tap-detail card (use the existing ROADMAP_PHASE_LABELS)
const NODE_DISPLAY_LABELS = NODE_LABEL_LINES.map(([l1, l2]) => `${l1} ${l2}`.trim());

function getNodeState(
  nodeIndex: number,
  currentPhaseIndex: number,
  phaseProgress: PhaseProgress[],
): PhaseState {
  const phaseIdx = NODE_TO_PHASE_INDEX[nodeIndex];
  if (
    phaseIdx < currentPhaseIndex &&
    phaseProgress[phaseIdx] &&
    phaseProgress[phaseIdx].completed > 0 &&
    phaseProgress[phaseIdx].pending === 0
  ) return "complete";
  if (phaseIdx === currentPhaseIndex) {
    // First node of current phase = current, second = locked (sub-phase ahead)
    const isFirstOfPhase = nodeIndex % 2 === 0;
    return isFirstOfPhase ? "current" : "locked";
  }
  return "locked";
}

// Alias so the rest of the component still compiles
function getPhaseState(index: number, currentPhaseIndex: number, phaseProgress: PhaseProgress[]): PhaseState {
  return getNodeState(index, currentPhaseIndex, phaseProgress);
}

export function RoadmapScreen({
  actionState,
  onGoToHome,
  report,
}: RoadmapScreenProps) {
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number | null>(null);

  const phaseProgress = useMemo<PhaseProgress[]>(() => {
    return getRoadmapPhaseCount(report.roadmapByPhase).map((entry) => {
      const items = report.roadmapByPhase[entry.phase];
      const summary = items.reduce(
        (acc, item) => {
          if (!report.completedQuizIds.has(item.quizId)) {
            acc.pending += 1;
            return acc;
          }
          const status = getActionStatusView(actionState, item.id).status;
          if (status === "done_today" || status === "done_permanent") acc.done += 1;
          else acc.pending += 1;
          return acc;
        },
        { pending: 0, done: 0 },
      );
      return {
        phase: entry.phase,
        count: entry.count,
        completed: summary.done,
        pending: summary.pending,
      };
    });
  }, [actionState, report.completedQuizIds, report.roadmapByPhase]);

  const currentPhaseIndex = useMemo(() => {
    const idx = phaseProgress.findIndex((e) => e.pending > 0);
    if (idx >= 0) return idx;
    const withItems = phaseProgress.findIndex((e) => e.count > 0);
    return withItems >= 0 ? withItems : 0;
  }, [phaseProgress]);

  const totalActions = phaseProgress.reduce((s, e) => s + e.count, 0);
  const totalDone = phaseProgress.reduce((s, e) => s + e.completed, 0);
  const overallPercent = totalActions > 0 ? Math.round((totalDone / totalActions) * 100) : 0;
  const currentPhaseLabel = ROADMAP_PHASE_LABELS[phaseProgress[currentPhaseIndex]?.phase] ?? "—";

  // Road fill: 0 until the user has actually completed tasks.
  // segStart is the road position at the START of the current phase, but only
  // counts if prior phases were genuinely completed (not just empty). To avoid
  // a non-zero road when early phases have 0 actions, we gate traveledLen on
  // totalDone > 0.
  const currentPhase = phaseProgress[currentPhaseIndex];
  const phaseCompletion = currentPhase && currentPhase.count > 0
    ? currentPhase.completed / currentPhase.count
    : 0;
  const segStart = NODE_CUM_LEN[currentPhaseIndex * 2] ?? 0;
  const nextPhaseNodeIdx = (currentPhaseIndex + 1) * 2;
  const segEnd = nextPhaseNodeIdx < NODE_CUM_LEN.length
    ? (NODE_CUM_LEN[nextPhaseNodeIdx] ?? ROAD_TOTAL)
    : ROAD_TOTAL;
  // If no tasks are done yet the road must show 0% regardless of which phase is
  // current (prevents empty early phases from inflating segStart).
  const traveledLen = totalDone === 0 ? 0 : segStart + (segEnd - segStart) * phaseCompletion;

  // Pin position: follows the road fill when tasks are done; otherwise sits at
  // the first node of the current phase so the pulsing dot shows where you start.
  const pinTraveledLen = totalDone === 0
    ? (NODE_CUM_LEN[currentPhaseIndex * 2] ?? 0)
    : traveledLen;
  const pinNodeIndex = NODE_CUM_LEN.reduce(
    (best, cum, i) => (cum <= pinTraveledLen ? i : best),
    0,
  );

  console.log('ROADMAP STATE', {
    completedQuizIds: Array.from(report.completedQuizIds),
    actionState: Object.entries(actionState.actions).map(([id, s]) => ({ id, status: s.status })),
    roadmapByPhase: Object.entries(report.roadmapByPhase).map(([name, items], i) => ({
      index: i,
      name,
      actionCount: (items as { id: string }[]).length,
      actionIds: (items as { id: string }[]).map((a) => a.id),
    })),
    phaseProgress: phaseProgress.map((p, i) => ({
      index: i,
      done: p.completed,
      pending: p.pending,
    })),
    currentPhaseIndex,
    totalDone,
    totalActions,
  });


  function togglePhase(index: number): void {
    setSelectedPhaseIndex((prev) => (prev === index ? null : index));
  }

  const selIdx = selectedPhaseIndex;
  // selPhase uses the engine phase for the selected node
  const selPhase = selIdx !== null ? phaseProgress[NODE_TO_PHASE_INDEX[selIdx]] ?? null : null;
  const selState = selIdx !== null ? getNodeState(selIdx, currentPhaseIndex, phaseProgress) : null;
  const selLabel = selIdx !== null ? NODE_DISPLAY_LABELS[selIdx] : null;

  return (
    <ScreenContainer className="hr-roadmap-screen">

      {/* Hero stats card — 2×2 grid */}
      <Card className="hr-roadmap-stats-card hr-shared-top-card" tone="soft">
        <div className="hr-roadmap-stats-head">
          <p className="hr-overline">Your Journey</p>
          <h2 className="hr-feature-title">Reset Roadmap</h2>
        </div>
        <div className="hr-roadmap-stats-grid">
          <div className="hr-roadmap-stat-cell">
            <span className="hr-kpi-label">Current phase</span>
            <strong className="hr-roadmap-stat-value">{currentPhaseLabel}</strong>
          </div>
          <div className="hr-roadmap-stat-cell">
            <span className="hr-kpi-label">Overall progress</span>
            <strong className="hr-roadmap-stat-value">{overallPercent}%</strong>
          </div>
          <div className="hr-roadmap-stat-cell">
            <span className="hr-kpi-label">Actions done</span>
            <strong className="hr-roadmap-stat-value">{totalDone}</strong>
          </div>
          <div className="hr-roadmap-stat-cell">
            <span className="hr-kpi-label">Total actions</span>
            <strong className="hr-roadmap-stat-value">{totalActions}</strong>
          </div>
        </div>
      </Card>

      {/* Snake road map */}
      <div className="hr-roadmap-map-wrap">
        <svg
          aria-label="Reset journey map"
          className="hr-roadmap-map-svg"
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect fill="#1a3d1a" height={SVG_H} rx="20" width={SVG_W} x="0" y="0" />

          {/* Road shadow */}
          <path
            d={ROAD_D}
            fill="none"
            stroke="#0f2410"
            strokeLinecap="round"
            strokeWidth={ROAD_STROKE + 8}
          />

          {/* Road base — ahead color */}
          <path
            d={ROAD_D}
            fill="none"
            stroke="#2d5a2d"
            strokeLinecap="round"
            strokeWidth={ROAD_STROKE}
          />

          {/* Road traveled — brighter green */}
          {traveledLen > 0 ? (
            <path
              d={ROAD_D}
              fill="none"
              stroke="#4a8c4a"
              strokeDasharray={`${traveledLen} ${ROAD_TOTAL - traveledLen + 10}`}
              strokeLinecap="round"
              strokeWidth={ROAD_STROKE}
            />
          ) : null}

          {/* Center lane dashes */}
          <path
            d={ROAD_D}
            fill="none"
            stroke="#b5e19b"
            strokeDasharray="10 18"
            strokeLinecap="round"
            strokeWidth="2.5"
          />

          {/* 10 visual nodes */}
          {NODE_POS.map(([cx, cy], i) => {
            const state = getNodeState(i, currentPhaseIndex, phaseProgress);
            const isComplete = state === "complete";
            const isLocked = state === "locked";
            const isPin = i === pinNodeIndex;
            const outerR = isLocked && !isPin ? 18 : 24;
            const innerR = isLocked && !isPin ? 10 : 16;
            const dotFill = isComplete
              ? "#b5e19b"
              : isPin
              ? "#228C22"
              : "rgba(255,255,255,0.12)";
            const outerFill = isComplete
              ? "rgba(181,225,155,0.18)"
              : isPin
              ? "rgba(34,140,34,0.22)"
              : "rgba(255,255,255,0.06)";
            const outerStroke = isComplete
              ? "#b5e19b"
              : isPin
              ? "#228C22"
              : "rgba(255,255,255,0.22)";
            const textFill = isLocked && !isPin
              ? "rgba(255,255,255,0.38)"
              : isComplete
              ? "#b5e19b"
              : "#ffffff";
            const anchor = LABEL_ANCHOR[i];
            const lx = cx + (anchor === "end" ? -LABEL_X_OFFSET : LABEL_X_OFFSET);
            const [l1, l2] = NODE_LABEL_LINES[i];
            const fontSize = isLocked && !isPin ? "10" : "11.5";

            return (
              <g key={i} onClick={() => togglePhase(i)} style={{ cursor: "pointer" }}>
                {/* Animated pulse ring — follows pin */}
                {isPin ? (
                  <circle
                    className="hr-roadmap-node-ring-pulse"
                    cx={cx}
                    cy={cy}
                    fill="none"
                    r={outerR + 8}
                    stroke="#228C22"
                    strokeWidth="2"
                  />
                ) : null}

                {/* Outer ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  fill={outerFill}
                  r={outerR}
                  stroke={outerStroke}
                  strokeWidth="2"
                />

                {/* Inner fill */}
                <circle cx={cx} cy={cy} fill={dotFill} r={innerR} />

                {/* Checkmark for completed nodes */}
                {isComplete ? (
                  <path
                    d={`M ${cx - 7} ${cy + 1} l 5 5 l 9 -9`}
                    fill="none"
                    stroke="#1a3d1a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                  />
                ) : null}

                {/* White center dot — follows pin */}
                {isPin ? <circle cx={cx} cy={cy} fill="#ffffff" r="5" /> : null}

                {/* Step number for locked nodes without pin */}
                {isLocked && !isPin ? (
                  <text
                    dominantBaseline="middle"
                    fill="rgba(255,255,255,0.5)"
                    fontFamily="Avenir Next, Avenir, sans-serif"
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                    x={cx}
                    y={cy}
                  >
                    {i + 1}
                  </text>
                ) : null}

                {/* Bouncing "you are here" pin — follows line */}
                {isPin ? (
                  <g className="hr-roadmap-pin" transform={`translate(${cx}, ${cy - outerR - 18})`}>
                    <path d="M 0 -13 C -9 -13 -9 -1 0 9 C 9 -1 9 -13 0 -13 Z" fill="#228C22" />
                    <circle cx="0" cy="-5" fill="#ffffff" r="3.5" />
                  </g>
                ) : null}

                {/* Phase label line 1 */}
                <text
                  dominantBaseline="middle"
                  fill={textFill}
                  fontFamily="Avenir Next, Avenir, sans-serif"
                  fontSize={fontSize}
                  fontWeight={isPin ? "700" : "500"}
                  textAnchor={anchor}
                  x={lx}
                  y={l2 ? cy - 7 : cy}
                >
                  {l1}
                </text>

                {/* Phase label line 2 */}
                {l2 ? (
                  <text
                    dominantBaseline="middle"
                    fill={textFill}
                    fontFamily="Avenir Next, Avenir, sans-serif"
                    fontSize={fontSize}
                    fontWeight="400"
                    textAnchor={anchor}
                    x={lx}
                    y={cy + 9}
                  >
                    {l2}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tap-to-expand phase detail card */}
      {selPhase !== null && selState !== null && selLabel !== null ? (
        <Card className="hr-roadmap-phase-detail" tone="soft">
          <div className="hr-roadmap-phase-detail-head">
            <div>
              <p className="hr-overline">
                {selState === "complete"
                  ? "Completed"
                  : selState === "current"
                  ? "Current phase"
                  : "Coming up"}
              </p>
              <h3 className="hr-item-title">{selLabel}</h3>
              {selPhase.count > 0 ? (
                <p className="hr-roadmap-phase-detail-meta">
                  {selPhase.completed} of {selPhase.count} actions complete
                </p>
              ) : (
                <p className="hr-roadmap-phase-detail-meta">No actions in this phase yet.</p>
              )}
            </div>
            {selState === "current" ? (
              <Button onClick={onGoToHome} size="sm" variant="primary">
                Go to Home →
              </Button>
            ) : selState === "complete" ? (
              <span className="hr-roadmap-complete-badge">Completed ✓</span>
            ) : (
              <p className="hr-roadmap-locked-note">Complete earlier phases to unlock.</p>
            )}
          </div>
        </Card>
      ) : null}
    </ScreenContainer>
  );
}
