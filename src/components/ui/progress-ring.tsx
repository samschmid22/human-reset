type ProgressRingProps = {
  /** 0–100 */
  percent: number;
  /** Center label — e.g. "3/10" */
  label: string;
  /** Below center label — e.g. "categories" */
  sublabel: string;
  size?: number;
  strokeWidth?: number;
};

export function ProgressRing({
  percent,
  label,
  sublabel,
  size = 96,
  strokeWidth = 9,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = Math.min(100, Math.max(0, percent));
  const offset = circumference - (filled / 100) * circumference;
  const center = size / 2;

  return (
    <div className="hr-progress-ring" style={{ height: size, width: size }}>
      <svg
        aria-label={`${filled}% complete`}
        height={size}
        role="img"
        viewBox={`0 0 ${size} ${size}`}
        width={size}
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke="rgba(0,0,0,0.10)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          className="hr-progress-ring-arc"
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke="#228C22"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="hr-progress-ring-inner">
        <span className="hr-progress-ring-label">{label}</span>
        <span className="hr-progress-ring-sublabel">{sublabel}</span>
      </div>
    </div>
  );
}
